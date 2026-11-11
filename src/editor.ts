import { Prec } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from '@codemirror/view';
import { CanvasAdapter } from './native';
import { mentionToken, mentions, nodeTitle, NodeData, triggerAt } from './graph';

interface EditorHost {adapter:CanvasAdapter; syncEditor(dom:HTMLElement,text:string):void; report(error:unknown):void; enabled():boolean}
class MentionChip extends WidgetType {
  constructor(readonly id:string,readonly label:string,readonly missing:boolean,readonly activate:()=>void){super();}
  eq(other:MentionChip):boolean{return this.id===other.id&&this.label===other.label&&this.missing===other.missing;}
  toDOM(view:EditorView):HTMLElement {
    const chip=view.dom.ownerDocument.createElement('button');chip.type='button';
    chip.className='loom-mention'+(this.missing?' is-missing':'');chip.textContent='@'+this.label;
    chip.title=this.missing?'Referenced node is missing':'Jump to '+this.label;
    chip.onclick=e=>{e.preventDefault();e.stopPropagation();this.activate();};return chip;
  }
  ignoreEvent():boolean{return true;}
}
export function mentionExtension(host:EditorHost) {
  return Prec.highest(ViewPlugin.fromClass(class {
    decorations:DecorationSet=Decoration.none;
    private popup:HTMLDivElement|null=null;private items:NodeData[]=[];private selected=0;
    private trigger:ReturnType<typeof triggerAt>=null;private dismissedAt=-1;
    private destroyed=false;
    constructor(readonly view:EditorView) {
      view.dom.addEventListener('keydown',this.keydown,true);
      view.dom.addEventListener('focusout',this.blur);
      this.decorate();
    }
    update(update:ViewUpdate):void {
      if(!host.enabled())return;
      if(update.docChanged) {
        this.dismissedAt=-1;
        const text=this.view.state.doc.toString();
        // Native Canvas updates its card after the editor transaction. Defer graph mutation.
        queueMicrotask(()=>{try{host.syncEditor(this.view.dom,text);}catch(e){host.report(e);}});
      }
      if(update.docChanged || update.selectionSet || update.viewportChanged)this.decorate();
      // CodeMirror forbids layout reads during an update. Menu positioning reads
      // cursor geometry, so run it only after the transaction has finished.
      if(update.docChanged || update.selectionSet)queueMicrotask(()=>{if(!this.destroyed)this.suggest();});
      else if(update.viewportChanged && this.popup)queueMicrotask(()=>{if(!this.destroyed&&this.popup)this.render();});
    }
    private decorate():void {
      const located=host.adapter.locate(this.view.dom);
      if(!host.enabled()||!located){this.decorations=Decoration.none;return;}
      const nodes=new Map(host.adapter.snapshot(located.handle).nodes.map(n=>[n.id,n]));
      const selection=this.view.state.selection;
      const ranges=mentions(this.view.state.doc.toString()).flatMap(m=>{
        // Reveal editable Markdown while the cursor or selection overlaps a token.
        if(selection.ranges.some(r=>r.from<=m.to&&r.to>=m.from))return [];
        const source=nodes.get(m.id);
        return [Decoration.replace({widget:new MentionChip(m.id,source?nodeTitle(source):m.label,!source,()=>{
          try{host.adapter.focus(located.handle,m.id);}catch(e){host.report(e);}
        })}).range(m.from,m.to)];
      });
      this.decorations=Decoration.set(ranges,true);
    }
    private suggest():void {
      if(!this.view.hasFocus||!host.enabled()){this.close();return;}
      const located=host.adapter.locate(this.view.dom);
      if(!located || located.handle.canvas.readonly){this.close();return;}
      const t=triggerAt(this.view.state.doc.toString(),this.view.state.selection.main.head);
      if(!t || t.to===this.dismissedAt){this.close();return;}
      this.trigger=t;const query=t.query.toLocaleLowerCase();
      this.items=host.adapter.snapshot(located.handle).nodes.filter(n=>n.id!==located.node.id && n.type!=='group' && (nodeTitle(n)+' '+n.id).toLocaleLowerCase().includes(query)).slice(0,30);
      this.selected=0;this.render();
    }
    private render():void {
      if(!this.trigger)return;
      this.popup?.remove();
      // Place the menu above the canvas, outside the card's editor iframe and clipping bounds.
      const located=host.adapter.locate(this.view.dom);
      const doc=located?.node.nodeEl.ownerDocument ?? this.view.dom.ownerDocument;
      const popup=this.popup=doc.createElement('div');popup.className='loom-suggest';popup.role='listbox';popup.setAttribute('aria-label','Canvas nodes');
      const caption=doc.createElement('div');caption.className='loom-suggest-caption';caption.textContent='REFERENCE A NODE';popup.append(caption);
      if(!this.items.length){const empty=doc.createElement('div');empty.className='loom-suggest-empty';empty.textContent='No matching nodes';popup.append(empty);}
      this.items.forEach((node,index)=>{
        const row=doc.createElement('div');row.className='loom-suggest-item'+(index===this.selected?' is-selected':'');row.role='option';row.setAttribute('aria-selected',String(index===this.selected));
        const title=doc.createElement('div');title.className='loom-suggest-title';title.textContent=nodeTitle(node);
        const detail=doc.createElement('div');detail.className='loom-suggest-detail';detail.textContent=`${node.type} · ${node.id.slice(0,8)}`;
        row.append(title,detail);row.onpointerdown=e=>{e.preventDefault();e.stopPropagation();this.choose(node);};popup.append(row);
      });
      const help=doc.createElement('div');help.className='loom-suggest-help';help.textContent='↑ ↓ navigate · Enter insert · Esc close';popup.append(help);
      doc.body.append(popup);
      let coords=this.view.coordsAtPos(this.trigger.to);
      let sourceDoc=this.view.dom.ownerDocument;
      while(coords && sourceDoc!==doc) {
        const frame=sourceDoc.defaultView?.frameElement as HTMLElement|null;
        if(!frame)break;
        const rect=frame.getBoundingClientRect();
        const sx=frame.clientWidth?rect.width/frame.clientWidth:1;
        const sy=frame.clientHeight?rect.height/frame.clientHeight:1;
        coords={left:rect.left+coords.left*sx,right:rect.left+coords.right*sx,top:rect.top+coords.top*sy,bottom:rect.top+coords.bottom*sy};
        sourceDoc=frame.ownerDocument;
      }
      if(coords){const win=doc.defaultView!;popup.style.left=Math.max(8,Math.min(coords.left,win.innerWidth-popup.offsetWidth-8))+'px';popup.style.top=Math.max(8,coords.bottom+8+popup.offsetHeight>win.innerHeight?coords.top-popup.offsetHeight-8:coords.bottom+8)+'px';}
    }
    private choose(node:NodeData):void {
      const t=this.trigger;if(!t)return;
      const token=mentionToken(node)+' ';
      this.close();this.view.dispatch({changes:{from:t.from,to:t.to,insert:token},selection:{anchor:t.from+token.length},userEvent:'input.complete'});
      this.view.focus();
    }
    private keydown=(event:KeyboardEvent):void=>{
      if(!this.popup || event.isComposing)return;
      if(!['ArrowDown','ArrowUp','Enter','Tab','Escape'].includes(event.key))return;
      event.preventDefault();event.stopImmediatePropagation();
      if(event.key==='Escape'){this.dismissedAt=this.view.state.selection.main.head;this.close();return;}
      if(event.key==='Enter'||event.key==='Tab'){const node=this.items[this.selected];if(node)this.choose(node);return;}
      if(this.items.length){this.selected=(this.selected+(event.key==='ArrowDown'?1:-1)+this.items.length)%this.items.length;this.render();this.popup?.querySelector('.is-selected')?.scrollIntoView({block:'nearest'});}
    };
    private blur=():void=>{this.close();};
    private close():void{this.popup?.remove();this.popup=null;this.trigger=null;}
    destroy():void {this.destroyed=true;this.close();this.view.dom.removeEventListener('keydown',this.keydown,true);this.view.dom.removeEventListener('focusout',this.blur);}
  },{decorations:v=>v.decorations}));
}
