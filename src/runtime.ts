import {createHash} from 'node:crypto';
import {createReadStream,createWriteStream,existsSync,readFileSync} from 'node:fs';
import {access,chmod,mkdir,mkdtemp,open,readFile,rename,rm,stat,writeFile} from 'node:fs/promises';
import {homedir} from 'node:os';
import {basename,isAbsolute,join,relative,sep} from 'node:path';
import {get as httpsGet} from 'node:https';
import {IncomingMessage} from 'node:http';
import {Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {spawn} from 'node:child_process';
import {HttpsProxyAgent} from 'https-proxy-agent';
import * as tar from 'tar';
import release from './runtime-release.json';

export interface RuntimeAsset {url:string;sha256:string;size:number}
export interface RuntimeInstall {version:string;target:string;directory:string;executable:string}
export interface InstallProgress {phase:'downloading'|'verifying'|'extracting'|'testing'|'installing';message:string;received?:number;total?:number}
export type Downloader=(asset:RuntimeAsset,path:string,progress:(received:number,total:number)=>void,signal:AbortSignal)=>Promise<void>;
export const managedVersion=release.version;
export function runtimeRoot(platform:NodeJS.Platform=process.platform,home=homedir(),env:NodeJS.ProcessEnv=process.env):string {
  if(platform==='darwin')return join(home,'Library','Application Support','Canvas Loom');
  if(platform==='win32')return join(env.LOCALAPPDATA||join(home,'AppData','Local'),'Canvas Loom');
  return join(env.XDG_DATA_HOME||join(home,'.local','share'),'canvas-loom');
}
export function runtimeAsset(platform:NodeJS.Platform=process.platform,arch=process.arch):{target:string;asset:RuntimeAsset} {
  const cpu=arch==='arm64'?'aarch64':arch==='x64'?'x86_64':null;
  const os=platform==='darwin'?'apple-darwin':platform==='linux'?'unknown-linux-musl':platform==='win32'?'pc-windows-msvc':null;
  if(!cpu||!os)throw new Error(`Automatic Codex setup does not support ${platform}/${arch}. You can choose an existing runtime in Advanced settings.`);
  const target=`${cpu}-${os}`;const name=`codex-package-${target}.tar.gz`;
  const asset=(release.assets as Record<string,RuntimeAsset>)[name];if(!asset)throw new Error(`No verified Codex package is available for ${target}.`);
  return {target,asset};
}
function checkCancelled(signal:AbortSignal):void {if(signal.aborted)throw new Error('Codex setup cancelled.');}
function proxyFor(url:URL):HttpsProxyAgent<string>|undefined {
  const bypass=(process.env.NO_PROXY||process.env.no_proxy||'').split(',').map(s=>s.trim()).filter(Boolean);
  if(bypass.some(domain=>domain==='*'||url.hostname===domain||url.hostname.endsWith(domain.startsWith('.')?domain:'.'+domain)))return undefined;
  const proxy=process.env.HTTPS_PROXY||process.env.https_proxy||process.env.ALL_PROXY||process.env.all_proxy;
  return proxy?new HttpsProxyAgent(proxy):undefined;
}
async function responseFor(url:URL,signal:AbortSignal,redirects=0):Promise<IncomingMessage> {
  checkCancelled(signal);
  if(url.protocol!=='https:'||url.username||url.password)throw new Error('Codex download requires a secure HTTPS URL.');
  return new Promise((resolveResponse,reject)=>{
    const request=httpsGet(url,{agent:proxyFor(url),headers:{'User-Agent':'Canvas-Loom/0.2.0','Accept':'application/octet-stream'},signal},response=>{
      if([301,302,303,307,308].includes(response.statusCode??0)) {
        const location=response.headers.location;response.resume();
        if(!location||redirects>=8){reject(new Error('Too many redirects while downloading Codex.'));return;}
        responseFor(new URL(location,url),signal,redirects+1).then(resolveResponse,reject);return;
      }
      if(response.statusCode!==200){response.resume();reject(new Error(`Codex download returned HTTP ${response.statusCode}. Check your connection and click Retry.`));return;}
      resolveResponse(response);
    });
    request.setTimeout(60000,()=>request.destroy(new Error('Codex download stalled. Check your connection and click Retry.')));
    request.on('error',reject);
  });
}
export const downloadPackage:Downloader=async(asset,path,progress,signal)=>{
  const response=await responseFor(new URL(asset.url),signal);
  let received=0;let lastProgress=0;
  const meter=new Transform({transform(chunk,_encoding,callback){
    received+=chunk.length;
    if(received>asset.size){callback(new Error('Codex download exceeded its expected size.'));return;}
    if(Date.now()-lastProgress>150){progress(received,asset.size);lastProgress=Date.now();}
    callback(null,chunk);
  }});
  await pipeline(response,meter,createWriteStream(path,{flags:'wx'}),{signal});
  if(received!==asset.size)throw new Error('The Codex download was incomplete. Click Retry to download it again.');
  progress(received,asset.size);
};
export async function verifyPackage(path:string,asset:RuntimeAsset,signal:AbortSignal):Promise<void> {
  const info=await stat(path);if(info.size!==asset.size)throw new Error('The Codex download is incomplete. Please retry.');
  const hash=createHash('sha256');for await(const chunk of createReadStream(path)){checkCancelled(signal);hash.update(chunk);}
  if(hash.digest('hex')!==asset.sha256)throw new Error('The Codex package failed its integrity check. It was not installed. Please retry.');
}
export async function extractPackage(archive:string,directory:string,signal:AbortSignal):Promise<void> {
  let bytes=0,files=0;let issue:Error|undefined;
  await tar.t({file:archive,strict:true,onReadEntry:entry=>{
    const path=entry.path;
    if(isAbsolute(path)||path.split(/[\\/]/).some(p=>p==='..'))issue=new Error('The runtime package contains an unsafe path.');
    if(!['File','Directory','OldFile'].includes(entry.type))issue=new Error(`Unsupported runtime archive entry: ${entry.type}.`);
    files++;bytes+=entry.size??0;
    if(files>10000||bytes>3_000_000_000)issue=new Error('The runtime package exceeds the extraction limit.');
    entry.resume();
  }});
  checkCancelled(signal);if(issue)throw issue;
  await tar.x({file:archive,cwd:directory,strict:true,preservePaths:false,filter:()=>!signal.aborted});
  checkCancelled(signal);
}
export async function verifyExecutable(path:string,version:string,signal:AbortSignal):Promise<void> {
  checkCancelled(signal);
  await new Promise<void>((resolveVersion,reject)=>{
    const child=spawn(path,['--version'],{shell:false,windowsHide:true,signal});
    let output='';const timer=setTimeout(()=>{child.kill();reject(new Error('The downloaded Codex runtime did not start.'));},20000);
    child.stdout.on('data',data=>{output=(output+String(data)).slice(-1000);});child.stderr.on('data',()=>{});
    child.on('error',e=>{clearTimeout(timer);reject(new Error(`The Codex runtime could not start: ${e.message}`));});
    child.on('close',code=>{
      clearTimeout(timer);
      if(code!==0||!output.includes(`codex-cli ${version}`)){reject(new Error('The downloaded Codex runtime could not be verified on this computer. An OS update may be required.'));return;}
      resolveVersion();
    });
  });
}
async function installationLock(path:string){
  for(let attempt=0;attempt<2;attempt++){
    try{
      const handle=await open(path,'wx');
      try{await handle.writeFile(JSON.stringify({pid:process.pid,at:Date.now()}));return handle;}
      catch(error){await handle.close();await rm(path,{force:true});throw error;}
    }catch(error){
      if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error;
      let stale=false;
      try{
        const previous=JSON.parse(await readFile(path,'utf8'));
        if(Number.isSafeInteger(previous.pid)&&previous.pid>0){try{process.kill(previous.pid,0);}catch(e){stale=(e as NodeJS.ErrnoException).code==='ESRCH';}}
        else stale=Date.now()-(await stat(path)).mtimeMs>300000;
      }catch{try{stale=Date.now()-(await stat(path)).mtimeMs>300000;}catch{}}
      if(stale){await rm(path,{force:true});continue;}
      throw new Error('Codex setup is already running in another window. Wait for it to finish, or restart Obsidian and retry.');
    }
  }
  throw new Error('Could not start Codex setup. Restart Obsidian and try again.');
}
export class RuntimeManager {
  constructor(readonly root=runtimeRoot(),readonly download:Downloader=downloadPackage,readonly executableCheck=verifyExecutable,readonly packageFor=runtimeAsset){}
  get stateDirectory():string{return join(this.root,'state');}
  get profileDirectory():string|undefined{
    try{return JSON.parse(readFileSync(join(this.root,'connection.json'),'utf8')).profile==='managed'?join(this.root,'profile'):undefined;}catch{return undefined;}
  }
  async useManagedProfile():Promise<string>{
    const directory=join(this.root,'profile');await mkdir(directory,{recursive:true});
    await writeFile(join(this.root,'connection.json'),JSON.stringify({profile:'managed'}));return directory;
  }
  current():RuntimeInstall|null {
    try {
      const value=JSON.parse(readFileSync(join(this.root,'runtime.json'),'utf8')) as RuntimeInstall;
      const rel=relative(this.root,value.directory);
      if(!rel||rel.startsWith('..')||isAbsolute(rel)||!value.executable.startsWith(value.directory+sep)||!existsSync(value.executable))return null;
      return value;
    }catch{return null;}
  }
  async install(progress:(p:InstallProgress)=>void,signal:AbortSignal,platform:NodeJS.Platform=process.platform,arch=process.arch):Promise<RuntimeInstall> {
    const {target,asset}=this.packageFor(platform,arch);checkCancelled(signal);await mkdir(this.root,{recursive:true});
    const lockPath=join(this.root,'install.lock');const lock=await installationLock(lockPath);
    let stage:string|undefined;let candidate:string|undefined;let committed=false;
    try {
      stage=await mkdtemp(join(this.root,'.install-'));
      const archive=join(stage,'package.tar.gz');
      progress({phase:'downloading',message:'Downloading Codex…',received:0,total:asset.size});
      await this.download(asset,archive,(received,total)=>progress({phase:'downloading',message:'Downloading Codex…',received,total}),signal);
      progress({phase:'verifying',message:'Checking download integrity…'});await verifyPackage(archive,asset,signal);
      const unpack=join(stage,'runtime');await mkdir(unpack);
      progress({phase:'extracting',message:'Installing Codex and its dependencies…'});await extractPackage(archive,unpack,signal);
      const name=platform==='win32'?'codex.exe':'codex';const executable=join(unpack,'bin',name);
      await access(executable);if(platform!=='win32')await chmod(executable,0o755);
      progress({phase:'testing',message:'Testing the installed runtime…'});await this.executableCheck(executable,release.version,signal);checkCancelled(signal);
      const directory=join(this.root,`runtime-${release.version}-${target}-${basename(stage).slice(-6)}`);
      candidate=directory;
      await rename(unpack,directory);
      const installed:RuntimeInstall={version:release.version,target,directory,executable:join(directory,'bin',name)};
      const temporaryManifest=join(this.root,`runtime-${basename(stage)}.json`);
      await writeFile(temporaryManifest,JSON.stringify(installed,null,2));checkCancelled(signal);
      progress({phase:'installing',message:'Finishing setup…'});
      checkCancelled(signal);await mkdir(this.stateDirectory,{recursive:true});checkCancelled(signal);
      await rename(temporaryManifest,join(this.root,'runtime.json'));committed=true;
      return installed;
    }finally{
      if(stage){await rm(stage,{recursive:true,force:true});await rm(join(this.root,`runtime-${basename(stage)}.json`),{force:true});}
      if(candidate&&!committed)await rm(candidate,{recursive:true,force:true});
      await lock.close();await rm(lockPath,{force:true});
    }
  }
}
