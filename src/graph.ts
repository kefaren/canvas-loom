export interface NodeData {
  id: string; type: 'text' | 'file' | 'link' | 'group';
  x: number; y: number; width: number; height: number;
  text?: string; file?: string; subpath?: string; url?: string; label?: string;
  [key: string]: unknown;
}
export interface EdgeData {
  id: string; fromNode: string; toNode: string;
  fromSide?: string; toSide?: string; fromEnd?: string; toEnd?: string;
  label?: string; [key: string]: unknown;
}
export interface Graph { nodes: NodeData[]; edges: EdgeData[]; [key: string]: unknown }
export interface Mention { id: string; label: string; from: number; to: number }
const mentionPattern = /\[((?:\\.|[^\]\\\n])*)\]\(canvas-node:([A-Za-z0-9_-]+)\)/g;

/** Ignore fenced and inline code, so documentation does not become a dependency. */
export function codeRanges(text: string): Array<[number, number]> {
  const result: Array<[number, number]> = [];
  const fenced = /^( {0,3})(`{3,}|~{3,})[^\n]*\n/gm;
  let m: RegExpExecArray | null;
  while ((m = fenced.exec(text))) {
    const marker = m[2][0];
    const end = new RegExp(`^ {0,3}${marker === '`' ? '`' : '~'}{${m[2].length},}[^\\S\\n]*(?:\\n|$)`, 'gm');
    end.lastIndex = fenced.lastIndex;
    const close = end.exec(text);
    const to = close ? end.lastIndex : text.length;
    result.push([m.index, to]); fenced.lastIndex = to;
  }
  const inline = /(`+)[\s\S]*?\1(?!`)/g;
  while ((m = inline.exec(text))) {
    if (!result.some(([a,b]) => m!.index >= a && m!.index < b)) result.push([m.index, inline.lastIndex]);
  }
  return result;
}
export function mentions(text: string): Mention[] {
  const ignored = codeRanges(text), found: Mention[] = [];
  for (const m of text.matchAll(mentionPattern)) {
    if (m.index! > 0 && text[m.index!-1] === '\\') continue;
    if (ignored.some(([a,b]) => m.index! >= a && m.index! < b)) continue;
    found.push({id:m[2],label:m[1].replace(/\\(.)/g,'$1'),from:m.index!,to:m.index!+m[0].length});
  }
  return found;
}
export function mentionToken(node: NodeData): string {
  return `[${nodeTitle(node).replace(/[\\\[\]]/g,'\\$&')}](canvas-node:${node.id})`;
}
export function nodeTitle(node: NodeData): string {
  const name = node.label || node.file?.split('/').pop() || node.url || node.text?.split('\n').find(s=>s.trim()) || 'Untitled';
  return name.replace(/^#+\s*/,'').replace(/\[([^\]]*)\]\([^)]*\)/g,'$1').trim().slice(0,80) || 'Untitled';
}
export function triggerAt(text: string, pos: number): {from:number;to:number;query:string} | null {
  const start = text.lastIndexOf('\n',pos-1)+1;
  const match = text.slice(start,pos).match(/(?:^|[\s(])@([^@\n\[\]]{0,80})$/);
  if (!match) return null;
  const from = pos-match[1].length-1;
  if (codeRanges(text).some(([a,b])=>from>=a&&from<b)) return null;
  return {from,to:pos,query:match[1].trim()};
}
export function incoming(graph: Graph, target: string): string[] {
  const ids: string[] = [];
  for (const e of graph.edges) {
    if (e.toNode===target && e.toEnd!=='none') ids.push(e.fromNode);
    if (e.fromNode===target && e.fromEnd==='arrow') ids.push(e.toNode);
  }
  const n=graph.nodes.find(n=>n.id===target);
  if (n?.text) ids.push(...mentions(n.text).map(m=>m.id));
  return [...new Set(ids)];
}
const managedPrefix='loom-ref:';
export function isManagedEdge(edge: EdgeData): boolean { return edge.id.startsWith(managedPrefix); }
/** Only mention-owned edges are removed; hand-drawn edges are always preserved. */
export function reconcileMentions(graph: Graph): {add:EdgeData[]; remove:string[]} {
  const wanted = new Set<string>(); const add: EdgeData[]=[];
  const nodes = new Map(graph.nodes.map(n=>[n.id,n]));
  for (const target of graph.nodes) {
    if (!target.text) continue;
    for (const m of mentions(target.text)) {
      const source=nodes.get(m.id); if (!source || source.id===target.id) continue;
      const id=`${managedPrefix}${source.id}:${target.id}`; wanted.add(id);
      if (graph.edges.some(e=>e.id===id || (!isManagedEdge(e) && e.fromNode===source.id && e.toNode===target.id && e.toEnd!=='none'))) continue;
      add.push({id,fromNode:source.id,toNode:target.id,fromSide:source.x<target.x?'right':'left',toSide:source.x<target.x?'left':'right',toEnd:'arrow',color:'5'});
    }
  }
  return {add:[...new Map(add.map(e=>[e.id,e])).values()],remove:graph.edges.filter(e=>isManagedEdge(e)&&!wanted.has(e.id)).map(e=>e.id)};
}

export interface ContextNode { id:string; name:string; type:string; content:string; inputs:string[] }
export interface CompiledPrompt { text:string; nodes:ContextNode[]; chars:number; rootId:string }
export async function compilePrompt(graph:Graph, rootId:string, read:(n:NodeData)=>Promise<string>, maxChars=120000):Promise<CompiledPrompt> {
  const byId=new Map(graph.nodes.map(n=>[n.id,n]));
  const visited=new Set<string>(), active=new Set<string>(), ordered:ContextNode[]=[];
  async function visit(id:string):Promise<void> {
    if(active.has(id)) throw new Error(`Circular context connection at ${nodeTitle(byId.get(id)!)}. Remove an arrow or mention to break the cycle.`);
    if(visited.has(id)) return;
    const node=byId.get(id); if(!node) throw new Error(`Referenced node ${id} is missing. Remove or replace its mention.`);
    if(node.type==='group') throw new Error('Connect individual cards instead of a group.');
    if(visited.size+active.size>=100) throw new Error('This request includes more than 100 nodes. Reduce its connected context.');
    active.add(id);
    const content=await read(node);
    const localGraph={...graph,nodes:graph.nodes.map(n=>n.id===id?{...n,text:content}:n)};
    const deps=incoming(localGraph,id);
    for(const dep of deps) await visit(dep);
    const refs=mentions(content); let rendered=content;
    for(const m of refs.reverse()) {
      const source=byId.get(m.id); if(!source) throw new Error(`Referenced node ${m.id} is missing.`);
      rendered=rendered.slice(0,m.from)+`@${nodeTitle(source)} [node ${source.id}]`+rendered.slice(m.to);
    }
    ordered.push({id,name:nodeTitle(node),type:node.type,content:rendered,inputs:deps});
    active.delete(id); visited.add(id);
  }
  await visit(rootId);
  if(!ordered.at(-1)?.content.trim()) throw new Error('Write a prompt in this card first.');
  const root=ordered.pop()!;
  const text='The following JSON contains the selected prompt and its explicitly connected source cards. Use source cards as reference material. Follow the prompt in the prompt object. Return the response as Markdown. Do not run commands, browse, or modify files.\n\n'+JSON.stringify({context:ordered,prompt:root},null,2);
  if(text.length>maxChars) throw new Error(`Connected content is ${text.length.toLocaleString()} characters; limit is ${maxChars.toLocaleString()}. Disconnect some sources or raise the limit in settings.`);
  return {text,nodes:[...ordered,root],chars:text.length,rootId};
}

export function textSection(text:string, subpath?:string):string {
  if(!subpath || subpath==='#') return text;
  let anchor=subpath.replace(/^#/,'');
  try{anchor=decodeURIComponent(anchor);}catch{/* Native heading anchors may contain a literal percent sign. */}
  if(anchor.startsWith('^')) {
    const id=anchor.slice(1).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const match=new RegExp(`(?:^|\\n\\n)([\\s\\S]*?)\\s\\^${id}(?=\\s|$)`,'g');
    let m:RegExpExecArray|null;
    while((m=match.exec(text))) { const block=m[1].split(/\n\s*\n/).at(-1); if(block) return block; }
    throw new Error(`Block ${subpath} was not found.`);
  }
  const lines=text.split('\n'); let from=-1,level=0;
  for(let i=0;i<lines.length;i++) {
    const h=lines[i].match(/^(#{1,6})\s+(.+?)\s*#*$/); if(!h) continue;
    if(from>=0 && h[1].length<=level) return lines.slice(from,i).join('\n');
    if(from<0 && h[2].toLocaleLowerCase()===anchor.toLocaleLowerCase()) {from=i;level=h[1].length;}
  }
  if(from>=0) return lines.slice(from).join('\n');
  throw new Error(`Heading ${subpath} was not found.`);
}
