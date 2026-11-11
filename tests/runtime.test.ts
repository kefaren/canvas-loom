import {test} from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,copyFile,readdir,rm,symlink} from 'node:fs/promises';
import {join} from 'node:path';import {tmpdir} from 'node:os';import {createHash} from 'node:crypto';
import * as tar from 'tar';
import {extractPackage,managedVersion,RuntimeAsset,RuntimeManager,runtimeAsset,runtimeRoot} from '../src/runtime';

async function fixture(){
  const root=await mkdtemp(join(tmpdir(),'loom-runtime-test-'));const content=join(root,'content');await mkdir(join(content,'bin'),{recursive:true});
  await writeFile(join(content,'bin','codex'),`#!${process.execPath}\nconsole.log('codex-cli ${managedVersion}')\n`,{mode:0o755});
  await writeFile(join(content,'bin','codex-code-mode-host'),'helper');await writeFile(join(content,'codex-package.json'),'{}');
  const archive=join(root,'test.tar.gz');await tar.c({gzip:true,file:archive,cwd:content},['bin','codex-package.json']);
  const bytes=await readFile(archive);const asset:RuntimeAsset={url:'https://example.invalid/test.tar.gz',sha256:createHash('sha256').update(bytes).digest('hex'),size:bytes.length};
  const manager=new RuntimeManager(join(root,'managed'),async(_asset,path,progress,signal)=>{if(signal.aborted)throw new Error('cancelled');await copyFile(archive,path);progress(bytes.length,bytes.length);},undefined,()=>({target:'fixture',asset}));
  return {root,content,archive,asset,manager};
}
test('installer verifies, extracts all helpers, tests the executable and activates a managed runtime',async()=>{
 const f=await fixture();const phases:string[]=[];
 try{const installed=await f.manager.install(p=>phases.push(p.phase),new AbortController().signal);
  assert.equal(installed.version,managedVersion);assert.equal(f.manager.current()?.executable,installed.executable);
  assert.equal(await readFile(join(installed.directory,'bin','codex-code-mode-host'),'utf8'),'helper');
  assert.deepEqual([...new Set(phases)],['downloading','verifying','extracting','testing','installing']);
  assert.ok(!(await readdir(f.manager.root)).some(n=>n.startsWith('.install-')||n==='install.lock'));
 }finally{await rm(f.root,{recursive:true,force:true});}
});
test('failed integrity check preserves the last working installation and cleans temporary files',async()=>{
 const f=await fixture();try{
  const old=await f.manager.install(()=>{},new AbortController().signal);f.asset.sha256='0'.repeat(64);
  await assert.rejects(f.manager.install(()=>{},new AbortController().signal),/integrity check/);
  assert.equal(f.manager.current()?.executable,old.executable);
  assert.ok(!(await readdir(f.manager.root)).some(n=>n.startsWith('.install-')||n==='install.lock'));
 }finally{await rm(f.root,{recursive:true,force:true});}
});
test('cancellation preserves an existing runtime and allows a subsequent retry',async()=>{
 const f=await fixture();try{
  const old=await f.manager.install(()=>{},new AbortController().signal);const c=new AbortController();
  await assert.rejects(f.manager.install(p=>{if(p.phase==='verifying')c.abort();},c.signal),/cancelled/);
  assert.equal(f.manager.current()?.executable,old.executable);
  const next=await f.manager.install(()=>{},new AbortController().signal);assert.ok(next.executable);
 }finally{await rm(f.root,{recursive:true,force:true});}
});
test('an active installer lock prevents overlapping installation',async()=>{
 const f=await fixture();try{
  await mkdir(f.manager.root,{recursive:true});await writeFile(join(f.manager.root,'install.lock'),JSON.stringify({pid:process.pid,at:Date.now()}));
  await assert.rejects(f.manager.install(()=>{},new AbortController().signal),/already running/);
 }finally{await rm(f.root,{recursive:true,force:true});}
});
test('cancelling at the activation boundary preserves the selected runtime',async()=>{
 const f=await fixture();try{
  const previous=await f.manager.install(()=>{},new AbortController().signal);const controller=new AbortController();
  await assert.rejects(f.manager.install(p=>{if(p.phase==='installing')controller.abort();},controller.signal),/cancelled/);
  assert.equal(f.manager.current()?.executable,previous.executable);
 }finally{await rm(f.root,{recursive:true,force:true});}
});
test('a crashed installer lock is recovered automatically',async()=>{
 const f=await fixture();try{
  await mkdir(f.manager.root,{recursive:true});await writeFile(join(f.manager.root,'install.lock'),JSON.stringify({pid:2147483647,at:1}));
  assert.ok((await f.manager.install(()=>{},new AbortController().signal)).executable);
 }finally{await rm(f.root,{recursive:true,force:true});}
});
test('unsafe archive links are rejected before extraction',async()=>{
 const f=await fixture();try{
  await symlink('/tmp/outside-loom-runtime',join(f.content,'escape'));
  const archive=join(f.root,'unsafe.tar.gz');await tar.c({gzip:true,file:archive,cwd:f.content},['escape']);
  const target=join(f.root,'extract');await mkdir(target);
  await assert.rejects(extractPackage(archive,target,new AbortController().signal),/Unsupported/);
  assert.deepEqual(await readdir(target),[]);
 }finally{await rm(f.root,{recursive:true,force:true});}
});
test('all supported desktop architectures select pinned HTTPS packages with checksums',()=>{
 for(const platform of ['darwin','linux','win32'] as const)for(const arch of ['arm64','x64'] as const){
  const a=runtimeAsset(platform,arch);assert.equal(new URL(a.asset.url).hostname,'github.com');assert.match(a.asset.sha256,/^[0-9a-f]{64}$/);assert.ok(a.asset.size>0);
 }
 assert.throws(()=>runtimeAsset('linux','ia32'),/does not support/);
 assert.ok(runtimeRoot('darwin','/Users/test',{}).includes('Library/Application Support/Canvas Loom'));
});
test('managed profiles live outside the vault and their selection survives restart',async()=>{
 const f=await fixture();try{
  const profile=await f.manager.useManagedProfile();assert.equal(new RuntimeManager(f.manager.root).profileDirectory,profile);
  assert.equal(await readFile(join(f.manager.root,'connection.json'),'utf8'),'{"profile":"managed"}');
 }finally{await rm(f.root,{recursive:true,force:true});}
});
