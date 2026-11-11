import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compilePrompt, Graph, incoming, mentionToken, mentions, NodeData, reconcileMentions, textSection, triggerAt} from '../src/graph';
const n=(id:string,text=id):NodeData=>({id,type:'text',text,x:0,y:0,width:300,height:200});
const e=(id:string,fromNode:string,toNode:string)=>({id,fromNode,toNode});
const read=async(n:NodeData)=>n.text??'';

test('mentions retain stable IDs and escaped human labels',()=>{
 const node=n('a','# A [bracket] \\ title');const token=mentionToken(node);
 assert.equal(mentions(token)[0].id,'a');assert.equal(mentions(token)[0].label,'A [bracket] \\ title');
});
test('code examples and escaped tokens are not dependencies',()=>{
 const t='[A](canvas-node:a)\n`[B](canvas-node:b)`\n```md\n[C](canvas-node:c)\n```\n\\[D](canvas-node:d)';
 assert.deepEqual(mentions(t).map(m=>m.id),['a']);
});
test('picker triggers after whitespace, allows multiword queries, avoids emails and code',()=>{
 for(const text of ['@','Use @artist identity'])assert.ok(triggerAt(text,text.length));
 for(const text of ['me@example.com','`@no','```\n@no'])assert.equal(triggerAt(text,text.length),null);
});
test('a mention creates one source-to-prompt edge, even when repeated',()=>{
 const g:Graph={nodes:[n('a'),n('b',mentionToken(n('a'))+' '+mentionToken(n('a')))],edges:[]};
 const plan=reconcileMentions(g);assert.equal(plan.add.length,1);
 assert.equal(plan.add[0].fromNode,'a');assert.equal(plan.add[0].toNode,'b');
 assert.deepEqual(reconcileMentions({...g,edges:plan.add}),{add:[],remove:[]});
});
test('deleting a mention removes only its managed edge',()=>{
 const g:Graph={nodes:[n('a'),n('b')],edges:[e('loom-ref:a:b','a','b'),e('hand','a','b')]};
 assert.deepEqual(reconcileMentions(g),{add:[],remove:['loom-ref:a:b']});
});
test('hand-drawn connection is reused instead of duplicated',()=>{
 const g:Graph={nodes:[n('a'),n('b',mentionToken(n('a')))],edges:[e('hand','a','b')]};
 assert.equal(reconcileMentions(g).add.length,0);
});
test('unresolved or self mentions never create invalid edges',()=>{
 const g:Graph={nodes:[n('a','[self](canvas-node:a) [gone](canvas-node:z)')],edges:[]};
 assert.equal(reconcileMentions(g).add.length,0);
});
test('arrow direction controls context; decorative lines do not',()=>{
 const g:Graph={nodes:[n('a'),n('b'),n('c')],edges:[{...e('1','a','b'),toEnd:'none'},{...e('2','b','c'),fromEnd:'arrow'}]};
 assert.deepEqual(incoming(g,'b'),['c']);assert.deepEqual(incoming(g,'c'),['b']);
});
test('diamond ancestors are included once, before dependents',async()=>{
 const g:Graph={nodes:['a','b','c','d'].map(id=>n(id)),edges:[e('1','a','b'),e('2','a','c'),e('3','b','d'),e('4','c','d')]};
 const c=await compilePrompt(g,'d',read);assert.deepEqual(c.nodes.map(n=>n.id),['a','b','c','d']);
 const json=JSON.parse(c.text.slice(c.text.indexOf('{')));assert.equal(json.prompt.id,'d');assert.equal(json.context.length,3);
});
test('references resolve current source content rather than the stored label',async()=>{
 const g:Graph={nodes:[n('a','Current revised source'),n('b','Use [Old title](canvas-node:a).')],edges:[]};
 const c=await compilePrompt(g,'b',read);assert.ok(c.text.includes('Current revised source'));
 const json=JSON.parse(c.text.slice(c.text.indexOf('{')));assert.ok(!json.prompt.content.includes('Old title'));
});
test('cycles, dangling references and empty prompts block a request',async()=>{
 await assert.rejects(compilePrompt({nodes:[n('a'),n('b')],edges:[e('1','a','b'),e('2','b','a')]},'b',read),/Circular/);
 await assert.rejects(compilePrompt({nodes:[n('a','[gone](canvas-node:no)')],edges:[]},'a',read),/missing/);
 await assert.rejects(compilePrompt({nodes:[n('a',' ')],edges:[]},'a',read),/Write a prompt/);
});
test('oversized requests fail without silently dropping references',async()=>{
 await assert.rejects(compilePrompt({nodes:[n('a','x'.repeat(5000))],edges:[]},'a',read,1000),/limit/);
});
test('file-node mentions participate in dependency traversal',async()=>{
 const g:Graph={nodes:[n('a','Source content'),{...n('file'),type:'file',file:'note.md',text:undefined},n('prompt','Use the note.')],edges:[e('manual','file','prompt')]};
 const c=await compilePrompt(g,'prompt',async node=>node.id==='file'?'See [a](canvas-node:a)':node.text??'');
 assert.deepEqual(c.nodes.map(n=>n.id),['a','file','prompt']);
});
test('heading references send only the requested section',()=>{
 const t='# One\na\n## Child\nb\n# Two\nc';assert.equal(textSection(t,'#One'),'# One\na\n## Child\nb');
 assert.equal(textSection(t,'#Child'),'## Child\nb');assert.throws(()=>textSection(t,'#Missing'),/not found/);
});
test('block references resolve the marked paragraph',()=>{
 assert.equal(textSection('Old paragraph\n\nA marked paragraph. ^hello\n\nAnother paragraph.','#^hello'),'A marked paragraph.');
});
test('heading references accept literal percent signs and encoded spaces',()=>{
 assert.equal(textSection('# 100% complete\nDone.','#100% complete'),'# 100% complete\nDone.');
 assert.equal(textSection('# Two words\nBody.','#Two%20words'),'# Two words\nBody.');
});
