import {CodexAccount,CodexClient,CodexOptions,safeDiagnostic} from './codex';
import {InstallProgress,managedVersion,RuntimeManager} from './runtime';

export type SetupPhase='idle'|'checking'|'downloading'|'verifying'|'extracting'|'testing'|'installing'|'sign-in'|'sign-in-required'|'ready'|'cancelled'|'error';
export interface SetupState {phase:SetupPhase;message:string;received?:number;total?:number;account?:string;authUrl?:string;version?:string}
export interface SetupClient {
  open():Promise<void>;accountInfo(refresh?:boolean):Promise<CodexAccount|null>;
  login(open:(url:string)=>Promise<void>,signal:AbortSignal):Promise<string>;
  checkReady():Promise<string>;close():void;
}
export class CodexSetup {
  state:SetupState={phase:'idle',message:'Set up Codex to install everything and connect your ChatGPT account.'};
  private observers=new Set<(state:SetupState)=>void>();private controller?:AbortController;private client?:SetupClient;
  private operation?:Promise<void>;
  constructor(readonly runtime:RuntimeManager,readonly options:()=>CodexOptions,readonly openBrowser:(url:string)=>Promise<void>,readonly factory:(options:CodexOptions)=>SetupClient=options=>new CodexClient(options)){}
  get busy():boolean{return !!this.operation;}
  subscribe(observer:(state:SetupState)=>void):()=>void{this.observers.add(observer);observer(this.state);return ()=>this.observers.delete(observer);}
  private update(state:SetupState):void{this.state=state;for(const observer of this.observers)observer(state);}
  start(repair=false):Promise<void>{return this.execute(true,repair);}
  refresh():Promise<void>{return this.execute(false,false);}
  private execute(allowSetup:boolean,repair:boolean):Promise<void>{
    if(this.operation)return this.operation;
    const controller=this.controller=new AbortController();
    const task=Promise.resolve().then(()=>this.perform(allowSetup,repair,controller.signal));
    this.operation=task.finally(()=>{this.client?.close();this.client=undefined;this.controller=undefined;this.operation=undefined;for(const observer of this.observers)observer(this.state);});
    return this.operation;
  }
  private async perform(allowSetup:boolean,repair:boolean,signal:AbortSignal):Promise<void>{
    try{
      const initial=this.options();const custom=!!initial.executable && initial.executable!==this.runtime.current()?.executable;
      let current=this.runtime.current();
      if(!custom && (!current || repair || current.version!==managedVersion)){
        if(!allowSetup){this.update({phase:'idle',message:'Click Set up Codex. The plugin installs and configures its own runtime.'});return;}
        current=await this.runtime.install((p:InstallProgress)=>{if(!signal.aborted)this.update({...p,version:managedVersion});},signal);
      }
      if(signal.aborted)throw new Error('Codex setup cancelled.');
      const options=this.options();
      const executable=custom?initial.executable:current?.executable;
      if(!executable)throw new Error('Codex installation could not be located. Click Repair installation.');
      this.update({phase:'checking',message:'Checking Codex and your account…',version:current?.version});
      let client:SetupClient;
      const connect=async(profileDirectory?:string)=>{
        this.client?.close();
        client=this.client=this.factory({...options,executable,stateDirectory:this.runtime.stateDirectory,profileDirectory});
        const connected=client;signal.addEventListener('abort',()=>connected.close(),{once:true});
        await connected.open();return connected.accountInfo();
      };
      let account:CodexAccount|null;
      try{account=await connect(options.profileDirectory??this.runtime.profileDirectory);}
      catch(error){
        if(custom||options.profileDirectory||this.runtime.profileDirectory||signal.aborted)throw error;
        this.update({phase:'checking',message:'Configuring a clean Codex profile…',version:current?.version});
        account=await connect(await this.runtime.useManagedProfile());
      }
      // Reuse an existing ChatGPT session, but keep new sign-ins separate from
      // another application's API-key profile or incomplete configuration.
      if(account?.type!=='chatgpt'&&!custom&&!this.runtime.profileDirectory){account=await connect(await this.runtime.useManagedProfile());}
      if(signal.aborted)throw new Error('Codex setup cancelled.');
      if(account?.type!=='chatgpt'){
        if(!allowSetup){this.update({phase:'sign-in-required',message:'Codex is installed. Sign in with ChatGPT to enable generation.',version:current?.version});return;}
        this.update({phase:'sign-in',message:'Opening ChatGPT sign-in…',version:current?.version});
        await client!.login(async url=>{
          if(signal.aborted)return;
          this.update({phase:'sign-in',message:'Finish signing in in your browser. This panel will update automatically.',authUrl:url,version:current?.version});
          await this.openBrowser(url);
        },signal);
      }
      if(signal.aborted)throw new Error('Codex setup cancelled.');
      this.update({phase:'checking',message:'Verifying model access and starting a test session…',version:current?.version});
      const label=await client!.checkReady();
      if(signal.aborted)throw new Error('Codex setup cancelled.');
      this.update({phase:'ready',message:'Codex is ready. You can run Canvas prompts.',account:label,version:current?.version});
    }catch(error){
      if(signal.aborted)this.update({phase:'cancelled',message:'Setup cancelled. Click Set up Codex to continue.'});
      else this.update({phase:'error',message:safeDiagnostic(error instanceof Error?error.message:String(error))||'Setup failed. Click Retry setup.'});
    }
  }
  cancel():void{this.controller?.abort();this.client?.close();}
  dispose():void{this.cancel();this.observers.clear();}
}
