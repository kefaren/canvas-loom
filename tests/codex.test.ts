import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,chmodSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join,resolve} from 'node:path';
import {CodexClient,findCodex,safeDiagnostic} from '../src/codex';

function fixture(){
 const dir=mkdtempSync(join(tmpdir(),'loom-test-'));const executable=join(dir,'codex');
 // Create an executable fixture without depending on the shell or PATH during tests.
 writeFileSync(executable,`#!${process.execPath}\nrequire(${JSON.stringify(resolve('tests/fake-codex.cjs'))});\n`);chmodSync(executable,0o700);
 return {dir,executable,log:join(dir,'rpc.jsonl')};
}
test('real subprocess framing streams events and sends the compiled prompt to Codex',async()=>{
 const f=fixture();process.env.LOOM_TEST_LOG=f.log;
 const client=new CodexClient({executable:f.executable,model:'',timeoutMs:1000});
 try{
  await client.open();const chunks:string[]=[];
  assert.equal(await client.generate('Actual connected source content',t=>chunks.push(t)),'A real response.');
  assert.ok(chunks.includes('A real '));
  const rpc=readFileSync(f.log,'utf8').trim().split('\n').map(l=>JSON.parse(l));
  const thread=rpc.find(m=>m.method==='thread/start');assert.equal(thread.params.sandbox,'read-only');
  assert.equal(thread.params.config['mcp_servers.example.enabled'],false);
  assert.equal(thread.params.config['features.shell_tool'],false);
  assert.equal(rpc.find(m=>m.method==='turn/start').params.input[0].text,'Actual connected source content');
 }finally{client.close();delete process.env.LOOM_TEST_LOG;rmSync(f.dir,{recursive:true,force:true});}
});
test('API-key accounts are refused before starting a generation',async()=>{
 const f=fixture();process.env.LOOM_TEST_API_KEY='1';const c=new CodexClient({executable:f.executable,model:'',timeoutMs:1000});
 try{await c.open();await assert.rejects(c.generate('hello',()=>{}),/ChatGPT account/);}finally{c.close();delete process.env.LOOM_TEST_API_KEY;rmSync(f.dir,{recursive:true,force:true});}
});
test('cancellation rejects a waiting turn and closes its subprocess',async()=>{
 const f=fixture();process.env.LOOM_TEST_HANG='1';const c=new CodexClient({executable:f.executable,model:'',timeoutMs:1000});
 try{await c.open();const controller=new AbortController();const result=c.generate('hello',()=>{},controller.signal);setTimeout(()=>controller.abort(),100);await assert.rejects(result,/cancelled/);}finally{c.close();delete process.env.LOOM_TEST_HANG;rmSync(f.dir,{recursive:true,force:true});}
});
test('a stalled generation has a bounded timeout',async()=>{
 const f=fixture();process.env.LOOM_TEST_HANG='1';const c=new CodexClient({executable:f.executable,model:'',timeoutMs:50});
 try{await c.open();await assert.rejects(c.generate('hello',()=>{}),/timed out/);}finally{c.close();delete process.env.LOOM_TEST_HANG;rmSync(f.dir,{recursive:true,force:true});}
});
test('missing or relative executable paths fail with setup guidance',()=>{
 assert.throws(()=>findCodex('/not/a/real/codex'),/executable not found/);assert.throws(()=>findCodex('codex'),/absolute/);
});
test('browser sign-in opens the returned OAuth URL and verifies the resulting account',async()=>{
 const f=fixture();process.env.LOOM_TEST_SIGNED_OUT='1';const c=new CodexClient({executable:f.executable,model:'',timeoutMs:1000});
 try{await c.open();assert.equal(await c.accountInfo(),null);let url='';const account=await c.login(async value=>{url=value;},new AbortController().signal);assert.match(url,/^https:\/\/auth.openai.com\//);assert.match(account,/test@example/);assert.match(await c.checkReady(),/test@example/);}finally{c.close();delete process.env.LOOM_TEST_SIGNED_OUT;rmSync(f.dir,{recursive:true,force:true});}
});
test('browser sign-in cancellation and timeout release pending operations',async()=>{
 const f=fixture();process.env.LOOM_TEST_SIGNED_OUT='1';process.env.LOOM_TEST_LOGIN_HANG='1';const c=new CodexClient({executable:f.executable,model:'',timeoutMs:1000});
 try{
  await c.open();const signal=new AbortController();const waiting=c.login(async()=>{signal.abort();},signal.signal);await assert.rejects(waiting,/cancelled/);
  await assert.rejects(c.login(async()=>{},new AbortController().signal,30),/timed out/);
 }finally{c.close();delete process.env.LOOM_TEST_SIGNED_OUT;delete process.env.LOOM_TEST_LOGIN_HANG;rmSync(f.dir,{recursive:true,force:true});}
});
test('diagnostics redact credentials and auth URLs before displaying an error',()=>{
 const output=safeDiagnostic('Error Bearer sensitive-secret sk-testkey access_token=abc123 https://auth.openai.com/?token=private');
 assert.ok(!output.includes('sensitive-secret'));assert.ok(!output.includes('sk-testkey'));assert.ok(!output.includes('abc123'));assert.ok(!output.includes('private'));
});
