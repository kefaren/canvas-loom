import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process';
import { accessSync, constants, mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join, delimiter, isAbsolute } from 'node:path';
import { createInterface } from 'node:readline';
import { setTimeout as scheduleKill } from 'node:timers';

export interface CodexOptions { executable:string; model:string; timeoutMs:number;stateDirectory?:string;profileDirectory?:string }
export interface CodexAccount {type:string;label:string}
export function safeDiagnostic(text:string):string {
  return text.replace(/Bearer\s+[^\s]+/gi,'Bearer [redacted]').replace(/\b(?:sk-|sess-)[A-Za-z0-9_-]+/g,'[redacted]').replace(/((?:access_token|refresh_token|id_token|client_secret)["\s:=]+)[^\s",}]+/gi,'$1[redacted]').replace(/https?:\/\/\S+/g,'[URL]').trim().slice(-1200);
}
interface RpcMessage { id?:number|string; method?:string;params?:any;result?:any;error?:{message:string;code?:number} }
interface Pending {resolve:(v:any)=>void;reject:(e:Error)=>void;timer:ReturnType<typeof setTimeout>}
export function findCodex(configured=''):string {
  const names=process.platform==='win32'?['codex.exe']:['codex'];
  const paths=configured ? [configured] : [
    ...((process.env.PATH??'').split(delimiter).flatMap(dir=>names.map(n=>join(dir,n)))),
    ...['/opt/homebrew/bin','/usr/local/bin',join(homedir(),'.local/bin'),join(homedir(),'.npm-global/bin'),'/Applications/Codex.app/Contents/Resources'].flatMap(dir=>names.map(n=>join(dir,n)))
  ];
  for(const path of paths) {
    if(!isAbsolute(path)) continue;
    try { accessSync(path,process.platform==='win32'?constants.F_OK:constants.X_OK); return path; } catch {}
  }
  throw new Error('Codex executable not found. Install Codex CLI, run “codex login”, then enter the absolute executable path in Canvas Loom settings. On macOS, “which codex” in Terminal shows it.');
}

/** One private stdio subprocess per operation. Credentials stay with Codex. */
export class CodexClient {
  private process?:ChildProcessWithoutNullStreams;
  private pending=new Map<number,Pending>();private id=0;
  private listeners=new Set<(m:RpcMessage)=>void>();
  private failures=new Set<(e:Error)=>void>();
  private workspace='';private stopped=false;
  private diagnostics='';
  constructor(readonly options:CodexOptions) {}
  private send(message:RpcMessage):void {
    if(!this.process || this.stopped) throw new Error('Codex connection is closed.');
    this.process.stdin.write(JSON.stringify(message)+'\n',error=>{if(error)this.fail(new Error(`Codex input closed: ${error.message}`));});
  }
  private fail(error:Error):void {
    for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(error);} this.pending.clear();
    for(const listener of this.failures) listener(error);
  }
  async open():Promise<void> {
    const executable=findCodex(this.options.executable);
    this.workspace=mkdtempSync(join(tmpdir(),'canvas-loom-'));
    // Never pass an API-key override from Obsidian's environment: this integration requires a ChatGPT login.
    const env={...process.env};delete env.OPENAI_API_KEY;delete env.CODEX_API_KEY;
    if(this.options.profileDirectory){mkdirSync(this.options.profileDirectory,{recursive:true});env.CODEX_HOME=this.options.profileDirectory;}
    if(this.options.stateDirectory){mkdirSync(this.options.stateDirectory,{recursive:true});env.CODEX_SQLITE_HOME=this.options.stateDirectory;}
    this.process=spawn(executable,['app-server'],{cwd:this.workspace,env,shell:false,windowsHide:true});
    this.process.on('error',e=>this.fail(new Error(`Could not launch Codex: ${e.message}`)));
    this.process.on('close',code=>{if(!this.stopped)this.fail(new Error(`Codex could not start (${code??'signal'}).${this.diagnostics?' '+safeDiagnostic(this.diagnostics):' Open Canvas Loom settings and click Set up Codex.'}`));});
    this.process.stdin.on('error',e=>this.fail(new Error(`Codex input closed: ${e.message}`)));
    // Keep only bounded, redacted startup diagnostics in memory for a useful settings error.
    this.process.stderr.on('data',data=>{this.diagnostics=(this.diagnostics+String(data)).slice(-4000);});
    const lines=createInterface({input:this.process.stdout});
    lines.on('line',line=>{
      let m:RpcMessage;try{m=JSON.parse(line);}catch{return;}
      if(typeof m.id==='number' && !m.method) {
        const p=this.pending.get(m.id);if(!p)return;clearTimeout(p.timer);this.pending.delete(m.id);
        if(m.error)p.reject(new Error(m.error.message));else p.resolve(m.result);
      } else if(m.method && m.id!==undefined) {
        // This text-generation client does not implement interactive agent tools or approvals.
        this.send({id:m.id,error:{code:-32601,message:'Canvas Loom does not grant tool execution or interactive approvals.'}});
      } else for(const listener of this.listeners) listener(m);
    });
    await this.rpc('initialize',{clientInfo:{name:'canvas_loom',title:'Canvas Loom',version:'0.2.0'}});
    this.send({method:'initialized',params:{}});
  }
  rpc(method:string,params:unknown={}):Promise<any> {
    return new Promise((resolve,reject)=>{
      const id=++this.id;
      const timer=setTimeout(()=>{this.pending.delete(id);reject(new Error(`Codex did not answer ${method}. Check its login or update Codex CLI.`));},30000);
      this.pending.set(id,{resolve,reject,timer});
      try{this.send({id,method,params});}catch(e){clearTimeout(timer);this.pending.delete(id);reject(e);}
    });
  }
  async accountInfo(refreshToken=false):Promise<CodexAccount|null> {
    const result=await this.rpc('account/read',{refreshToken});
    if(!result.account)return null;
    return {type:result.account.type,label:[result.account.email,result.account.planType].filter(Boolean).join(' · ')||'Signed in with ChatGPT'};
  }
  async account(refreshToken=false):Promise<string> {
    const info=await this.accountInfo(refreshToken);
    if(info?.type!=='chatgpt')throw new Error('A ChatGPT account login is required. Open Canvas Loom settings and click Set up Codex to sign in. API-key accounts are not used by this plugin.');
    return info.label;
  }
  async login(openBrowser:(url:string)=>Promise<void>,signal:AbortSignal,timeoutMs=300000):Promise<string> {
    if(signal.aborted)throw new Error('Codex sign-in cancelled.');
    return new Promise<string>((resolveLogin,reject)=>{
      let loginId:string|undefined;let completed=false;
      const finish=(error?:Error,label?:string)=>{
        if(completed)return;completed=true;clearTimeout(timer);this.listeners.delete(listener);this.failures.delete(fail);signal.removeEventListener('abort',abort);
        if(error)reject(error);else resolveLogin(label!);
      };
      const listener=(m:RpcMessage)=>{
        if(m.method!=='account/login/completed'||m.params?.loginId!==loginId)return;
        if(!m.params.success){finish(new Error(safeDiagnostic(m.params.error||'Sign-in was not completed. Click Retry.')));return;}
        void this.account(true).then(label=>finish(undefined,label),e=>finish(e));
      };
      const fail=(error:Error)=>finish(error);
      const abort=()=>{
        if(loginId)void this.rpc('account/login/cancel',{loginId}).catch(()=>{});
        finish(new Error('Codex sign-in cancelled.'));
      };
      const timer=setTimeout(()=>{
        if(loginId)void this.rpc('account/login/cancel',{loginId}).catch(()=>{});
        finish(new Error('Sign-in timed out. Click Retry to sign in again.'));
      },timeoutMs);
      this.listeners.add(listener);this.failures.add(fail);signal.addEventListener('abort',abort,{once:true});
      void this.rpc('account/login/start',{type:'chatgpt'}).then(async result=>{
        if(completed)return;
        loginId=result.loginId;
        if(!loginId||typeof result.authUrl!=='string')throw new Error('Codex did not return a sign-in page. Click Retry.');
        const url=new URL(result.authUrl);
        if(url.protocol!=='https:'||!['auth.openai.com','chatgpt.com','auth0.openai.com'].includes(url.hostname))throw new Error('Codex returned an unexpected sign-in address.');
        await openBrowser(result.authUrl);
      }).catch(e=>finish(e));
    });
  }
  async checkReady():Promise<string> {
    const label=await this.account(true);
    const models=await this.rpc('model/list',{limit:100});
    if(!Array.isArray(models.data)||!models.data.length)throw new Error('Codex signed in, but no models are available for this account. Check your ChatGPT account access and try again.');
    await this.createTextThread();return label;
  }
  private async createTextThread():Promise<string> {
    const configResult=await this.rpc('config/read',{includeLayers:false});
    const serverNames=Object.keys(configResult.config?.mcp_servers??{});
    const config:Record<string,unknown>={
      'features.shell_tool':false,'features.unified_exec':false,'features.apps':false,
      'web_search':'disabled',
      ...Object.fromEntries(serverNames.map(name=>[`mcp_servers.${/^[A-Za-z0-9_-]+$/.test(name)?name:JSON.stringify(name)}.enabled`,false]))
    };
    const thread=await this.rpc('thread/start',{
      cwd:this.workspace,approvalPolicy:'never',sandbox:'read-only',ephemeral:true,
      ...(this.options.model?{model:this.options.model}:{}),config,
      developerInstructions:'You are a writing and reasoning assistant inside Obsidian Canvas. Respond only using the supplied prompt and connected context. Do not use tools, inspect the filesystem, fetch URLs, or modify files. Output the requested content directly as Markdown.'
    });
    // Refuse a runtime that cannot preserve this integration's read-only policy.
    if(thread.approvalPolicy!=='never' || thread.sandbox?.type!=='readOnly') throw new Error('Codex did not accept the requested read-only session policy. No prompt was sent.');
    return thread.thread.id;
  }
  async generate(prompt:string,onText:(text:string)=>void,signal?:AbortSignal):Promise<string> {
    if(signal?.aborted) throw new Error('Generation cancelled.');
    await this.account();
    const threadId=await this.createTextThread();
    return new Promise<string>((resolve,reject)=>{
      let done=false;const items=new Map<string,string>();let latest='';
      const finish=(error?:Error)=>{
        if(done)return;done=true;clearTimeout(timer);this.listeners.delete(listener);this.failures.delete(fail);signal?.removeEventListener('abort',abort);
        if(error)reject(error);else if(!latest.trim())reject(new Error('Codex returned an empty response.'));else resolve(latest);
      };
      const update=()=>{latest=[...items.values()].join('\n\n');onText(latest);};
      const listener=(m:RpcMessage)=>{
        if(m.params?.threadId!==threadId)return;
        const p=m.params;
        if(m.method==='item/agentMessage/delta'){items.set(p.itemId,(items.get(p.itemId)??'')+p.delta);update();}
        if(m.method==='item/completed' && p.item?.type==='agentMessage'){items.set(p.item.id,p.item.text??'');update();}
        if(m.method==='turn/completed') {
          if(p.turn.status==='completed')finish();else finish(new Error(p.turn.error?.message??`Codex turn ${p.turn.status}.`));
        }
        if(m.method==='error' && !p.willRetry)finish(new Error(p.error?.message??'Codex generation failed.'));
      };
      const fail=(e:Error)=>finish(e);
      const abort=()=>{finish(new Error('Generation cancelled.'));this.close();};
      const timer=setTimeout(()=>{finish(new Error('Generation timed out. You can raise the timeout in settings.'));this.close();},this.options.timeoutMs);
      this.listeners.add(listener);this.failures.add(fail);signal?.addEventListener('abort',abort,{once:true});
      if(signal?.aborted){abort();return;}
      void this.rpc('turn/start',{threadId,input:[{type:'text',text:prompt}],sandboxPolicy:{type:'readOnly',networkAccess:false},approvalPolicy:'never'}).catch(e=>finish(e));
    });
  }
  close():void {
    if(this.stopped)return;this.stopped=true;
    this.fail(new Error('Codex connection closed.'));
    const p=this.process;
    if(p){p.stdin.end();p.kill('SIGTERM');const timer=scheduleKill(()=>{if(p.exitCode===null)p.kill('SIGKILL');},1000);timer.unref();}
    if(this.workspace){try{rmSync(this.workspace,{recursive:true,force:true});}catch{}}
  }
}
