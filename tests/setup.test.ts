import {test} from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';import {join} from 'node:path';import {tmpdir} from 'node:os';
import {CodexSetup,SetupClient} from '../src/setup';import {managedVersion,RuntimeManager} from '../src/runtime';import {CodexOptions} from '../src/codex';
async function scenario({installed=false,signedIn=true,checkFailure=false,brokenDefault=false,waiting=false}={}){
 const root=await mkdtemp(join(tmpdir(),'loom-setup-test-'));let present=installed;let logins=0;let installs=0;let opened=0;const clientOptions:CodexOptions[]=[];
 const runtime=new RuntimeManager(root);const record={version:managedVersion,target:'fixture',directory:join(root,'runtime'),executable:join(root,'runtime','bin','codex')};
 runtime.current=()=>present?record:null;
 runtime.install=async progress=>{installs++;progress({phase:'downloading',message:'Downloading…',received:5,total:10});present=true;return record;};
 const setup=new CodexSetup(runtime,()=>({executable:runtime.current()?.executable??'',model:'',timeoutMs:1000,profileDirectory:runtime.profileDirectory}),async()=>{opened++;},options=>{
  clientOptions.push(options);
  let authed=signedIn;
  const client:SetupClient={
   open:async()=>{if(brokenDefault&&!options.profileDirectory)throw new Error('Read-only profile');},
   accountInfo:async()=>authed?{type:'chatgpt',label:'test account'}:null,
   login:async(open,signal)=>{logins++;await open('https://auth.openai.com/authorize?state=fixture');if(waiting)await new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('cancelled')),{once:true}));authed=true;return 'test account';},
   checkReady:async()=>{if(checkFailure)throw new Error('Model access failed');if(!authed)throw new Error('No account');return 'test account';},close:()=>{}
  };return client;
 });
 return {root,runtime,setup,stats:()=>({installs,logins,opened,clientOptions}),clean:async()=>{setup.dispose();await rm(root,{recursive:true,force:true});}};
}
test('one setup action installs a missing runtime and enables an existing ChatGPT login',async()=>{
 const f=await scenario();const phases:string[]=[];f.setup.subscribe(s=>phases.push(s.phase));
 try{await f.setup.start();assert.equal(f.setup.state.phase,'ready');assert.equal(f.stats().installs,1);assert.equal(f.stats().logins,0);assert.ok(phases.includes('downloading'));assert.equal(f.setup.state.account,'test account');}finally{await f.clean();}
});
test('signed-out setup opens the browser, waits for authentication and then verifies readiness',async()=>{
 const f=await scenario({installed:true,signedIn:false});const phases:string[]=[];f.setup.subscribe(s=>phases.push(s.phase));
 try{await f.setup.start();assert.equal(f.setup.state.phase,'ready');assert.equal(f.stats().opened,1);assert.equal(f.stats().logins,1);assert.ok(phases.includes('sign-in'));assert.ok(f.runtime.profileDirectory);}finally{await f.clean();}
});
test('installed is not ready when a session cannot be started',async()=>{
 const f=await scenario({installed:true,checkFailure:true});try{await f.setup.start();assert.equal(f.setup.state.phase,'error');assert.match(f.setup.state.message,/Model access failed/);}finally{await f.clean();}
});
test('opening settings without a runtime does not download anything automatically',async()=>{
 const f=await scenario();try{await f.setup.refresh();assert.equal(f.setup.state.phase,'idle');assert.equal(f.stats().installs,0);assert.equal(f.stats().opened,0);}finally{await f.clean();}
});
test('checking a signed-out installation shows a sign-in action without opening a browser',async()=>{
 const f=await scenario({installed:true,signedIn:false});try{await f.setup.refresh();assert.equal(f.setup.state.phase,'sign-in-required');assert.equal(f.stats().opened,0);}finally{await f.clean();}
});
test('repeated clicks share one setup operation',async()=>{
 const f=await scenario();try{const a=f.setup.start(),b=f.setup.start();assert.equal(a,b);await a;assert.equal(f.stats().installs,1);assert.equal(f.setup.busy,false);}finally{await f.clean();}
});
test('cancelling browser sign-in never enables generation',async()=>{
 const f=await scenario({installed:true,signedIn:false,waiting:true});try{
  const operation=f.setup.start();while(f.setup.state.phase!=='sign-in')await new Promise(r=>setTimeout(r,5));
  f.setup.cancel();await operation;assert.equal(f.setup.state.phase,'cancelled');assert.equal(f.setup.busy,false);
 }finally{await f.clean();}
});
test('a broken shared Codex profile automatically falls back to a managed profile',async()=>{
 const f=await scenario({installed:true,brokenDefault:true,signedIn:false});try{
  await f.setup.start();assert.equal(f.setup.state.phase,'ready');assert.ok(f.runtime.profileDirectory);
  assert.equal(f.stats().clientOptions[0].profileDirectory,undefined);assert.equal(f.stats().clientOptions[1].profileDirectory,f.runtime.profileDirectory);
 }finally{await f.clean();}
});
