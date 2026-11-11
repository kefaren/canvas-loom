import { App, TFile, WorkspaceLeaf } from 'obsidian';
import { EdgeData, Graph, NodeData, reconcileMentions, textSection } from './graph';

export interface NativeNode {
  id:string; nodeEl:HTMLElement; isEditing?:boolean;
  child?: {text?:string;dirty?:boolean;editor?: {getValue():string}; editMode?:{editor?:{getValue():string}; cm?:{dom?:HTMLElement;getValue?():string}}};
  getData():NodeData; setData(data:NodeData, addHistory?:boolean):void;
  setText?(text:string):void;
}
export interface NativeEdge {id:string;getData():EdgeData}
export interface NativeCanvas {
  nodes:Map<string,NativeNode>; edges:Map<string,NativeEdge>; selection:Set<NativeNode|NativeEdge>;
  readonly?:boolean;
  getData():Graph;
  importData(data:{nodes:NodeData[];edges:EdgeData[]},clearCanvas?:boolean):void;
  removeEdge(edge:NativeEdge):void;
  requestSave():void|Promise<void>;
  pushHistory(data:Graph):void;
  selectOnly(node:NativeNode):void;
  zoomToSelection():void;
}
export interface CanvasHandle {canvas:NativeCanvas;file:TFile;leaf:WorkspaceLeaf}
export class CanvasAdapter {
  constructor(readonly app:App) {}
  all():CanvasHandle[] {
    return this.app.workspace.getLeavesOfType('canvas').flatMap(leaf=>{
      const view=leaf.view as unknown as {canvas?:NativeCanvas;file?:TFile};
      const c=view.canvas;
      if(!view.file || !c || !(c.nodes instanceof Map) || !(c.edges instanceof Map) || typeof c.getData!=='function') return [];
      return [{canvas:c,file:view.file,leaf}];
    });
  }
  locate(dom:HTMLElement):{handle:CanvasHandle;node:NativeNode}|null {
    const el=dom.closest('.canvas-node');
    for(const handle of this.all()) for(const node of handle.canvas.nodes.values()) {
      const editorDom=node.child?.editMode?.cm?.dom;
      if(node.nodeEl===el || node.nodeEl.contains(dom) || editorDom?.contains(dom)) return {handle,node};
      // Canvas can host Markdown editors in an iframe. DOM ancestry stops at its document.
      for(const frame of node.nodeEl.querySelectorAll('iframe')) {
        if(frame.contentDocument===dom.ownerDocument) return {handle,node};
      }
    }
    return null;
  }
  active():CanvasHandle|null {
    return this.all().find(h=>h.leaf===this.app.workspace.getMostRecentLeaf()) ?? null;
  }
  assertWritable(handle:CanvasHandle):void {
    if(handle.canvas.readonly) throw new Error('This canvas is read-only. Unlock it before changing connections.');
    for(const key of ['importData','removeEdge','requestSave','pushHistory'] as const) {
      if(typeof handle.canvas[key]!=='function') throw new Error(`Canvas compatibility check failed: ${key} is unavailable in this Obsidian version.`);
    }
  }
  snapshot(handle:CanvasHandle):Graph {
    // getData includes custom fields supplied by other Canvas plugins.
    const data=handle.canvas.getData();
    return {...data,nodes:data.nodes.map(n=>{
      const live=handle.canvas.nodes.get(n.id);
      const editor=live?.child?.editor ?? live?.child?.editMode?.editor;
      if(editor && (n.type==='text' || n.type==='file')) return {...n,text:editor.getValue()};
      if(typeof live?.child?.text==='string' && (n.type==='text' || n.type==='file')) return {...n,text:live.child.text};
      return {...n};
    }),edges:data.edges.map(e=>({...e}))};
  }
  async readNode(node:NodeData):Promise<string> {
    if(node.type==='text') return node.text??'';
    if(node.type==='link') return `URL reference (page content has not been fetched): ${node.url??''}`;
    if(node.type!=='file' || !node.file) throw new Error('Only text cards, text files, and URL references are supported as context.');
    if(!/\.(md|txt|json|ya?ml|csv|tsv|xml|html|css|js|ts)$/i.test(node.file)) throw new Error(`“${node.file}” is not a supported text source. Images, audio, and PDFs need text extraction before connecting them.`);
    if(typeof node.text==='string') return textSection(node.text,node.subpath);
    const file=this.app.vault.getAbstractFileByPath(node.file);
    if(!(file instanceof TFile)) throw new Error(`Source file “${node.file}” is missing.`);
    return textSection(await this.app.vault.cachedRead(file),node.subpath);
  }
  sync(handle:CanvasHandle, overrides?:Map<string,string>):void {
    if(handle.canvas.readonly) return;
    const graph=this.snapshot(handle);
    if(overrides) for(const n of graph.nodes) if(overrides.has(n.id)) n.text=overrides.get(n.id);
    for(const n of graph.nodes) if(n.type==='file' && typeof n.text==='string') n.text=textSection(n.text,n.subpath);
    // File contents are used only when that file editor is open. We never rewrite notes.
    const change=reconcileMentions(graph);
    if(!change.add.length && !change.remove.length) return;
    this.assertWritable(handle);
    for(const id of change.remove) {const e=handle.canvas.edges.get(id);if(e) handle.canvas.removeEdge(e);}
    if(change.add.length) handle.canvas.importData({nodes:[],edges:change.add},false);
    handle.canvas.pushHistory(handle.canvas.getData());
    void handle.canvas.requestSave();
  }
  append(handle:CanvasHandle, node:NodeData, edges:EdgeData[]):NativeNode {
    this.assertWritable(handle);
    handle.canvas.importData({nodes:[node],edges},false);
    const live=handle.canvas.nodes.get(node.id);
    if(!live) throw new Error('Obsidian did not create the response card. Canvas internals may have changed.');
    handle.canvas.pushHistory(handle.canvas.getData());
    void handle.canvas.requestSave();
    return live;
  }
  setText(handle:CanvasHandle, id:string, text:string, history=false):boolean {
    const node=handle.canvas.nodes.get(id);if(!node) return false;
    this.assertWritable(handle);
    if(node.setText) node.setText(text); else node.setData({...node.getData(),text});
    if(history) handle.canvas.pushHistory(handle.canvas.getData());
    void handle.canvas.requestSave();return true;
  }
  focus(handle:CanvasHandle,id:string):void {
    const n=handle.canvas.nodes.get(id);if(!n) throw new Error('That referenced node is no longer on this canvas.');
    handle.canvas.selectOnly(n);handle.canvas.zoomToSelection();
  }
}
