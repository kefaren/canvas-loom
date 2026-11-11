import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { randomBytes } from 'node:crypto';
import { CanvasAdapter, CanvasHandle, NativeNode } from './native';
import { CodexClient } from './codex';
import { RuntimeManager } from './runtime';
import { CodexSetup } from './setup';
import { CompiledPrompt, compilePrompt, Graph, NodeData, nodeTitle } from './graph';
import { mentionExtension } from './editor';

interface Settings {executable:string;useCustomExecutable:boolean;model:string;timeoutSeconds:number;maxChars:number;showButtons:boolean}
const defaults:Settings={executable:'',useCustomExecutable:false,model:'',timeoutSeconds:180,maxChars:120000,showButtons:true};
const uid=()=>randomBytes(8).toString('hex');
interface Job {controller:AbortController;client:CodexClient;outputId?:string;label:string}
export default class CanvasLoom extends Plugin {
  settings:Settings={...defaults};adapter!:CanvasAdapter;private alive=false;
  runtime=new RuntimeManager();setup!:CodexSetup;
  private jobs=new Map<string,Job>();private syncing=false;private errorAt=0;
  private editorText=new Map<string,{text:string;at:number}>();
  private fileCache=new Map<string,{mtime:number;text:string}>();
  private buttons=new Set<HTMLElement>();private status!:HTMLElement;
  async onload():Promise<void> {
    this.settings={...defaults,...await this.loadData()};this.adapter=new CanvasAdapter(this.app);this.alive=true;
    this.setup=new CodexSetup(this.runtime,()=>this.options(),async url=>{await require('electron').shell.openExternal(url);});
    this.status=this.addStatusBarItem();this.status.textContent='Canvas Loom';
    this.registerEditorExtension(mentionExtension({adapter:this.adapter,syncEditor:(dom,text)=>this.syncEditor(dom,text),report:e=>this.report(e),enabled:()=>this.alive}));
    this.registerMarkdownPostProcessor((el)=>{
      for(const link of el.querySelectorAll<HTMLAnchorElement>('a[href^="canvas-node:"],a[data-href^="canvas-node:"]')) {
        const target=(link.getAttribute('href')??link.getAttribute('data-href')??'').slice('canvas-node:'.length);
        if(!/^[A-Za-z0-9_-]+$/.test(target))continue;
        link.classList.add('loom-mention');link.textContent='@'+link.textContent;
        link.onclick=e=>{e.preventDefault();e.stopPropagation();const located=this.adapter.locate(link);if(located)try{this.adapter.focus(located.handle,target);}catch(error){this.report(error);}};
      }
    });
    this.addSettingTab(new LoomSettings(this.app,this));
    this.addCommand({id:'run-node',name:'Run selected node with Codex',checkCallback:checking=>this.selectedAction(checking,(h,n)=>void this.run(h,n.id))});
    this.addCommand({id:'preview-context',name:'Preview selected node context',checkCallback:checking=>this.selectedAction(checking,(h,n)=>void this.preview(h,n.id))});
    this.addCommand({id:'cancel-generations',name:'Cancel active generations',callback:()=>this.cancelAll()});
    this.addCommand({id:'check-codex',name:'Check Codex connection',callback:()=>void this.checkConnection()});
    this.addCommand({id:'create-example',name:'Create example canvas',callback:()=>void this.createExample()});
    this.registerInterval(window.setInterval(()=>void this.tick(),600));
    this.app.workspace.onLayoutReady(()=>void this.tick());
  }
  onunload():void {
    this.alive=false;this.setup.dispose();this.cancelAll();for(const button of this.buttons)button.remove();this.buttons.clear();
    this.app.workspace.containerEl.querySelectorAll('.loom-mention').forEach(el=>{
      if(el.tagName==='A'){el.classList.remove('loom-mention');(el as HTMLAnchorElement).onclick=null;}
    });
  }
  report(error:unknown):void {
    if(Date.now()-this.errorAt<1500)return;this.errorAt=Date.now();
    new Notice(error instanceof Error?error.message:String(error),9000);
  }
  private selectedAction(checking:boolean,action:(h:CanvasHandle,n:NativeNode)=>void):boolean {
    const h=this.adapter.active();if(!h || h.canvas.selection.size!==1)return false;
    const n=[...h.canvas.selection][0];if(!h.canvas.nodes.has(n.id))return false;
    if(!checking)action(h,n as NativeNode);return true;
  }
  syncEditor(dom:HTMLElement,text:string):void {
    if(!this.alive)return;
    const found=this.adapter.locate(dom);if(!found)return;
    this.editorText.set(`${found.handle.file.path}:${found.node.id}`,{text,at:Date.now()});
    // Text-card serialization is normally delayed by the embedded editor. Keep
    // the native card in step before adding its edge, so history/saves include both.
    if(found.node.getData().type==='text' && found.node.getData().text!==text)this.adapter.setText(found.handle,found.node.id,text);
    this.adapter.sync(found.handle,new Map([[found.node.id,text]]));
  }
  private options(){return {executable:this.settings.useCustomExecutable?this.settings.executable:this.runtime.current()?.executable??'',model:this.settings.model,timeoutMs:this.settings.timeoutSeconds*1000,stateDirectory:this.runtime.stateDirectory,profileDirectory:this.settings.useCustomExecutable?undefined:this.runtime.profileDirectory};}
  private async graph(handle:CanvasHandle):Promise<Graph> {
    const graph=this.adapter.snapshot(handle);
    for(const node of graph.nodes) {
      const live=this.editorText.get(`${handle.file.path}:${node.id}`);
      // Very recent transactions take precedence over Canvas's debounced node serialization.
      if(live && Date.now()-live.at<1500){node.text=live.text;continue;}
      if(node.type==='file' && node.file && /\.(md|txt)$/i.test(node.file)) {
        const child=handle.canvas.nodes.get(node.id)?.child;
        if((child?.editMode || child?.dirty) && typeof node.text==='string')continue;
        const file=this.app.vault.getAbstractFileByPath(node.file);
        if(!(file instanceof TFile))continue;
        const cache=this.fileCache.get(file.path);
        if(cache?.mtime===file.stat.mtime)node.text=cache.text;
        else {const text=await this.app.vault.cachedRead(file);this.fileCache.set(file.path,{mtime:file.stat.mtime,text});node.text=text;}
      }
    }
    return graph;
  }
  private async tick():Promise<void> {
    if(!this.alive || this.syncing)return;this.syncing=true;
    try {
      for(const button of this.buttons)if(!button.isConnected){this.buttons.delete(button);}
      for(const handle of this.adapter.all()) {
        if(!this.alive)break;
        const graph=await this.graph(handle);
        if(!this.alive)break;
        this.adapter.sync(handle,new Map(graph.nodes.filter(n=>typeof n.text==='string').map(n=>[n.id,n.text!])));
        for(const node of handle.canvas.nodes.values()) {
          if(!node.nodeEl.isConnected)continue;
          const data=node.getData();if(data.type!=='text')continue;
          let controls=node.nodeEl.querySelector<HTMLElement>(':scope > .loom-controls');
          if(!this.settings.showButtons || handle.canvas.readonly){controls?.remove();continue;}
          if(!controls) {
            controls=node.nodeEl.ownerDocument.createElement('div');controls.className='loom-controls';
            const preview=controls.createEl('button',{text:'Context',attr:{'aria-label':'Preview connected context'}});
            preview.onclick=e=>{e.stopPropagation();void this.preview(handle,node.id);};
            const run=controls.createEl('button',{text:'Run',cls:'loom-run',attr:{'aria-label':'Run this node with Codex'}});
            run.onclick=e=>{e.stopPropagation();const job=this.jobs.get(this.jobKey(handle,node.id));if(job)job.controller.abort();else void this.run(handle,node.id);};
            controls.onpointerdown=e=>{e.stopPropagation();};
            node.nodeEl.append(controls);this.buttons.add(controls);
          }
          const run=controls.querySelector<HTMLButtonElement>('.loom-run')!;
          const running=this.jobs.has(this.jobKey(handle,node.id));run.textContent=running?'Stop':'Run';run.classList.toggle('is-running',running);
        }
      }
      this.status.textContent=this.jobs.size?`Canvas Loom · ${this.jobs.size} running`:'Canvas Loom';
    }catch(e){this.report(e);}finally{this.syncing=false;}
  }
  private jobKey(h:CanvasHandle,id:string):string{return `${h.file.path}:${id}`;}
  private async compile(h:CanvasHandle,id:string):Promise<CompiledPrompt> {
    const graph=await this.graph(h);
    // Snapshot every supported text source before traversal: a request uses one consistent set of contents.
    return compilePrompt(graph,id,n=>this.adapter.readNode(n),this.settings.maxChars);
  }
  async preview(h:CanvasHandle,id:string):Promise<void> {
    try{const compiled=await this.compile(h,id);if(this.alive)new ContextModal(this.app,compiled,()=>void this.run(h,id)).open();}catch(e){this.report(e);}
  }
  async checkConnection():Promise<void> {
    await this.setup.refresh();
    if(this.alive)new Notice(this.setup.state.phase==='ready'?`Codex connected: ${this.setup.state.account}`:this.setup.state.message,10000);
  }
  async run(h:CanvasHandle,id:string):Promise<void> {
    if(!this.settings.useCustomExecutable && !this.runtime.current()){
      const settings=(this.app as unknown as {setting?:{open():void;openTabById(id:string):void}}).setting;
      settings?.open();settings?.openTabById(this.manifest.id);new Notice('Click Set up Codex to enable generation.');return;
    }
    const key=this.jobKey(h,id);if(this.jobs.has(key))return;
    const client=new CodexClient(this.options());const controller=new AbortController();
    controller.signal.addEventListener('abort',()=>client.close(),{once:true});
    const job:Job={client,controller,label:id};this.jobs.set(key,job);
    let streamed='';let timer:ReturnType<typeof setTimeout>|undefined;
    const flush=()=>{
      timer=undefined;if(!job.outputId || !this.alive)return;
      try {
        const live=h.canvas.nodes.get(job.outputId);
        if(!live){controller.abort();return;}
        // Do not overwrite a response the user is currently editing.
        if(live.isEditing){controller.abort();return;}
        this.adapter.setText(h,job.outputId,streamed||'_Waiting for Codex…_');
      }catch(e){controller.abort();this.report(e);}
    };
    try {
      this.adapter.assertWritable(h);
      const compiled=await this.compile(h,id);
      if(!this.alive||controller.signal.aborted)return;
      await client.open();await client.account();
      if(!this.alive||controller.signal.aborted)return;
      const source=h.canvas.nodes.get(id)?.getData();if(!source)throw new Error('The prompt card was deleted.');
      const graph=h.canvas.getData();const width=Math.max(340,source.width);let y=source.y;
      const x=source.x+source.width+100;
      while(graph.nodes.some(n=>n.x<x+width && n.x+n.width>x && n.y<y+300 && n.y+n.height>y))y+=340;
      job.outputId=uid();
      const outputNode=this.adapter.append(h,{id:job.outputId,type:'text',text:'_Waiting for Codex…_',x,y,width,height:300,color:'6'},[
        {id:uid(),fromNode:id,toNode:job.outputId,fromSide:'right',toSide:'left',toEnd:'arrow',label:'response'}
      ]);
      if(h.canvas.selection.size===1 && h.canvas.selection.has(h.canvas.nodes.get(id)!)){
        h.canvas.selectOnly(outputNode);h.canvas.zoomToSelection();
      }
      const output=await client.generate(compiled.text,text=>{streamed=text;if(!timer)timer=setTimeout(flush,120);},controller.signal);
      if(timer){clearTimeout(timer);timer=undefined;}
      if(this.alive && h.canvas.nodes.has(job.outputId) && !h.canvas.nodes.get(job.outputId)!.isEditing)this.adapter.setText(h,job.outputId,output,true);
    }catch(e){
      if(timer){clearTimeout(timer);timer=undefined;}
      const message=e instanceof Error?e.message:String(e);
      if(this.alive && job.outputId && h.canvas.nodes.has(job.outputId) && !h.canvas.nodes.get(job.outputId)!.isEditing){
        const current=h.canvas.nodes.get(job.outputId)!.getData();
        // Keep streamed content, but do not silently replace a card changed by the user.
        if(!streamed || current.text===streamed)this.adapter.setText(h,job.outputId,(streamed?streamed+'\n\n':'')+`> ${controller.signal.aborted?'Stopped': 'Generation failed'}: ${message}`,true);
      }
      if(this.alive)this.report(e);
    }finally{if(timer)clearTimeout(timer);client.close();this.jobs.delete(key);}
  }
  private cancelAll():void {for(const job of this.jobs.values()){job.controller.abort();job.client.close();}}
  async saveSettings():Promise<void>{await this.saveData(this.settings);}
  private async createExample():Promise<void> {
    const graph:Graph={nodes:[
      {id:'artist',type:'text',text:'# Artist identity\nA self-produced songwriter from Southwest Louisiana. Observant, dry humor, concrete details. Avoid slogans and generic filler.',x:0,y:0,width:350,height:240},
      {id:'purpose',type:'text',text:'# Song purpose\nA narrator returns to a childhood street and notices what survived a hurricane. Show mixed feelings through one specific encounter.',x:0,y:320,width:350,height:240},
      {id:'prompt',type:'text',text:'# Draft a song concept\nUsing [Artist identity](canvas-node:artist) and [Song purpose](canvas-node:purpose), propose three distinct story premises. Give each a setting, a central encounter, and a reason this artist would sing it.\n\nClick Context to inspect the actual request, then Run.',x:480,y:130,width:410,height:300}
    ],edges:[
      {id:'loom-ref:artist:prompt',fromNode:'artist',toNode:'prompt',fromSide:'right',toSide:'left',toEnd:'arrow',color:'5'},
      {id:'loom-ref:purpose:prompt',fromNode:'purpose',toNode:'prompt',fromSide:'right',toSide:'left',toEnd:'arrow',color:'5'}
    ]};
    try {
      let name='Canvas Loom Example.canvas';let n=1;
      while(this.app.vault.getAbstractFileByPath(name))name=`Canvas Loom Example ${n++}.canvas`;
      const file=await this.app.vault.create(name,JSON.stringify(graph,null,2));await this.app.workspace.getLeaf('tab').openFile(file);
    }catch(e){this.report(e);}
  }
}
class ContextModal extends Modal {
  constructor(app:App,readonly compiled:CompiledPrompt,readonly run:()=>void){super(app);}
  onOpen():void {
    this.modalEl.addClass('loom-context-modal');this.setTitle('Connected context');
    this.contentEl.createEl('p',{text:`${this.compiled.nodes.length} cards · ${this.compiled.chars.toLocaleString()} characters. These are the contents the plugin supplies to Codex.`});
    const list=this.contentEl.createEl('ol');
    for(const node of this.compiled.nodes)list.createEl('li',{text:`${node.name} · ${node.type}${node.id===this.compiled.rootId?' · prompt':''}`});
    const details=this.contentEl.createEl('details');details.createEl('summary',{text:'Inspect complete request'});details.createEl('pre',{text:this.compiled.text});
    new Setting(this.contentEl).addButton(b=>b.setButtonText('Copy request').onClick(async()=>{await navigator.clipboard.writeText(this.compiled.text);new Notice('Request copied.');})).addButton(b=>b.setButtonText('Run with Codex').setCta().onClick(()=>{this.close();this.run();}));
  }
  onClose():void{this.contentEl.empty();}
}
class LoomSettings extends PluginSettingTab {
  private unsubscribe?:()=>void;
  constructor(app:App,readonly plugin:CanvasLoom){super(app,plugin);}
  display():void {
    const {containerEl:el}=this;el.empty();el.createEl('h2',{text:'Canvas Loom'});
    el.createEl('p',{text:'Type @ in a Canvas text card to reference another node, or connect cards with arrows. Set up Codex below to run prompts with your ChatGPT account.'});
    const setupCard=el.createDiv({cls:'loom-setup'});
    const render=()=>{
      const state=this.plugin.setup.state;setupCard.empty();setupCard.setAttribute('data-phase',state.phase);
      const title=setupCard.createDiv({cls:'loom-setup-title'});title.createSpan({text:state.phase==='ready'?'Codex is ready':'Connect Codex'});
      title.createSpan({cls:'loom-setup-badge',text:state.phase==='ready'?'Ready':this.plugin.setup.busy?'Working…':state.phase==='error'?'Needs attention':'Setup'});
      setupCard.createEl('p',{text:state.message,cls:'loom-setup-message',attr:{role:state.phase==='error'?'alert':'status','aria-live':'polite'}});
      if(state.account)setupCard.createEl('p',{text:state.account,cls:'loom-setup-account'});
      if(state.version)setupCard.createDiv({text:`Codex ${state.version}`,cls:'loom-setup-version'});
      if(state.phase==='downloading'&&state.total){
        const bar=setupCard.createEl('progress');bar.max=state.total;bar.value=state.received??0;
        const mb=(n:number)=>(n/1_000_000).toFixed(1);
        setupCard.createDiv({cls:'loom-setup-download',text:`${mb(state.received??0)} / ${mb(state.total)} MB`});
      }
      const actions=setupCard.createDiv({cls:'loom-setup-actions'});
      if(this.plugin.setup.busy){
        const cancel=actions.createEl('button',{text:'Cancel'});cancel.onclick=()=>this.plugin.setup.cancel();
        if(state.authUrl){const signIn=actions.createEl('button',{text:'Open sign-in page'});signIn.onclick=()=>{void require('electron').shell.openExternal(state.authUrl).catch((e:Error)=>this.plugin.report(e));};}
      }else{
        const label=state.phase==='ready'?'Reconnect':state.phase==='sign-in-required'?'Sign in with ChatGPT':state.phase==='error'?'Retry setup':'Set up Codex';
        const primary=actions.createEl('button',{text:label,cls:'mod-cta'});primary.onclick=()=>void this.plugin.setup.start();
        if(this.plugin.runtime.current()&&!this.plugin.settings.useCustomExecutable){const repair=actions.createEl('button',{text:'Repair installation'});repair.onclick=()=>void this.plugin.setup.start(true);}
        if(state.phase==='error'){const copy=actions.createEl('button',{text:'Copy error'});copy.onclick=()=>{require('electron').clipboard.writeText(state.message);new Notice('Error copied.');};}
      }
    };
    this.unsubscribe?.();this.unsubscribe=this.plugin.setup.subscribe(render);
    if(this.plugin.setup.state.phase==='idle'&&this.plugin.runtime.current())void this.plugin.setup.refresh();
    el.createEl('p',{cls:'setting-item-description',text:'Setup downloads Codex and its dependencies automatically. An existing ChatGPT login is reused when available; otherwise, sign-in opens in your browser. No Terminal commands or API key are required.'});
    const advanced=el.createEl('details',{cls:'loom-advanced'});advanced.createEl('summary',{text:'Advanced connection settings'});
    new Setting(advanced).setName('Use my own Codex installation').setDesc('Optional. The managed installation is recommended.').addToggle(t=>t.setValue(this.plugin.settings.useCustomExecutable).onChange(async v=>{this.plugin.settings.useCustomExecutable=v;await this.plugin.saveSettings();}));
    new Setting(advanced).setName('Custom executable').setDesc('Used only when the option above is enabled.').addText(t=>t.setPlaceholder('/absolute/path/to/codex').setValue(this.plugin.settings.executable).onChange(async v=>{this.plugin.settings.executable=v.trim();await this.plugin.saveSettings();}));
    new Setting(el).setName('Model').setDesc('Leave blank to use the model selected by your Codex configuration.').addText(t=>t.setValue(this.plugin.settings.model).onChange(async v=>{this.plugin.settings.model=v.trim();await this.plugin.saveSettings();}));
    new Setting(el).setName('Timeout in seconds').addText(t=>t.setValue(String(this.plugin.settings.timeoutSeconds)).onChange(async v=>{const n=Number(v);if(Number.isFinite(n)&&n>=30&&n<=1800){this.plugin.settings.timeoutSeconds=Math.floor(n);await this.plugin.saveSettings();}}));
    new Setting(el).setName('Maximum request characters').setDesc('Oversized requests fail visibly instead of dropping context.').addText(t=>t.setValue(String(this.plugin.settings.maxChars)).onChange(async v=>{const n=Number(v);if(Number.isFinite(n)&&n>=1000&&n<=1000000){this.plugin.settings.maxChars=Math.floor(n);await this.plugin.saveSettings();}}));
    new Setting(el).setName('Show card controls').setDesc('Show Context and Run buttons on text cards. Commands remain available when hidden.').addToggle(t=>t.setValue(this.plugin.settings.showButtons).onChange(async v=>{this.plugin.settings.showButtons=v;await this.plugin.saveSettings();}));
    el.createEl('p',{text:'Runs send the selected prompt and connected text to OpenAI through Codex and use that account’s allowance. No API key is stored in your vault. Generation is read-only; results are written by this plugin as new Canvas cards. A URL card supplies its URL only. This version does not read images, audio, or PDFs.'});
    el.createEl('p',{text:'Mentions own their reference arrows: delete the inline mention to remove its arrow. Hand-drawn arrows remain independent. Canvas IDs belong to one canvas; copying a mention to another canvas requires choosing its source again.'});
  }
  hide():void{this.unsubscribe?.();this.unsubscribe=undefined;}
}
