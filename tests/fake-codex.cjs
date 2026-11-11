// A protocol fixture, never packaged as the generation backend.
const fs=require('node:fs');
const log=process.env.LOOM_TEST_LOG;
const send=m=>process.stdout.write(JSON.stringify(m)+'\n');
const marker=process.env.LOOM_TEST_AUTH_MARKER;
let loggedIn=!process.env.LOOM_TEST_SIGNED_OUT||!!(marker&&fs.existsSync(marker));
require('node:readline').createInterface({input:process.stdin}).on('line',line=>{
 const m=JSON.parse(line);if(log)fs.appendFileSync(log,JSON.stringify(m)+'\n');
 if(m.method==='initialize')send({id:m.id,result:{userAgent:'fixture'}});
 if(m.method==='account/read')send({id:m.id,result:{account:loggedIn?{type:process.env.LOOM_TEST_API_KEY?'apiKey':'chatgpt',email:'test@example.invalid',planType:'plus'}:null}});
 if(m.method==='model/list')send({id:m.id,result:{data:[{id:'test-model'}]}});
 if(m.method==='account/login/start'){
  send({id:m.id,result:{type:'chatgpt',loginId:'login-fixture',authUrl:'https://auth.openai.com/authorize?state=fixture'}});
  if(!process.env.LOOM_TEST_LOGIN_HANG)setTimeout(()=>{loggedIn=true;if(marker)fs.writeFileSync(marker,'fixture signed in');send({method:'account/login/completed',params:{loginId:'login-fixture',success:true,error:null}});},50);
 }
 if(m.method==='account/login/cancel')send({id:m.id,result:{status:'canceled'}});
 if(m.method==='config/read')send({id:m.id,result:{config:{mcp_servers:{example:{enabled:true}}}}});
 if(m.method==='thread/start')send({id:m.id,result:{thread:{id:'thread-test'},sandbox:{type:'readOnly'},approvalPolicy:'never'}});
 if(m.method==='turn/start'){
  send({id:m.id,result:{turn:{id:'turn-test'}}});
  if(process.env.LOOM_TEST_HANG)return;
  setTimeout(()=>{
   send({method:'item/agentMessage/delta',params:{threadId:'thread-test',itemId:'message-1',turnId:'turn-test',delta:'A real '}});
   send({method:'item/agentMessage/delta',params:{threadId:'thread-test',itemId:'message-1',turnId:'turn-test',delta:'response.'}});
   send({method:'item/completed',params:{threadId:'thread-test',item:{type:'agentMessage',id:'message-1',text:'A real response.'}}});
   send({method:'turn/completed',params:{threadId:'thread-test',turn:{id:'turn-test',status:'completed'}}});
  },20);
 }
});
