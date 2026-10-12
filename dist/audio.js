export const MAX_AUDIO_ELEMENTS=24;
const PER_SOUND_LIMIT=3;

// Reserve pending playback and keep loop suspension separate from an actual stop.
export class GameAudio{
 constructor(game){this.game=game;this.pool=new Map();this.elements=new Set();this.playing=new Map();this.states=new WeakMap();this.loops=new Map();this.nextHandle=1;}
 active(){return this.game.audioEnabled&&!this.game.paused;}
 available(a){const s=this.states.get(a);return !s||!s.loop&&(!s.busy||a.ended||a.paused&&!s.pending);}
 forget(a){const s=this.states.get(a);if(!s)return;this.playing.delete(s.handle);s.busy=false;s.pending=false;s.token=null;}
 allocate(id,priority){
  const pool=this.pool.get(id)||[];this.pool.set(id,pool);let a=pool.find(a=>this.available(a));
  if(!a&&pool.length<PER_SOUND_LIMIT&&this.elements.size<MAX_AUDIO_ELEMENTS){
   a=new Audio();a.preload='none';this.elements.add(a);
   a.addEventListener?.('ended',()=>{if(a.ended)this.forget(a);});
   a.addEventListener?.('error',()=>{if(!a.error)return;const s=this.states.get(a);this.forget(a);a.pause();if(s){s.blocked=true;s.suspended=s.loop;}});
  }
  if(!a){
   const candidates=pool.length>=PER_SOUND_LIMIT?pool:this.elements;
   for(const candidate of candidates){const state=this.states.get(candidate);if(state?.loop)continue;
    if(this.available(candidate)){a=candidate;break;}
    if((state?.priority??0)<=priority&&(!a||state.priority<this.states.get(a).priority))a=candidate;
   }
  }
  if(!a)return null;
  const old=this.states.get(a);this.forget(a);a.pause();
  if(old&&old.id!==id){const previous=this.pool.get(old.id),index=previous?.indexOf(a);if(index>=0)previous.splice(index,1);}
  if(!pool.includes(a))pool.push(a);return a;
 }
 play(id,loop=false,priority=0){
  const spec=this.game.data.sounds[id];if(!spec)return 0;priority=Number.isFinite(priority)?priority:0;
  if(loop)this.loops.set(id,priority);
  if(!this.active()||typeof Audio==='undefined')return 0;
  const existing=loop?(this.pool.get(id)||[]).find(a=>this.states.get(a)?.loop):null;
  const previous=existing&&this.states.get(existing);if(previous?.busy&&(previous.pending||!existing.paused&&!existing.ended))return previous.handle;
  if(previous?.busy){this.forget(existing);previous.suspended=true;}
  const a=existing||this.allocate(id,priority);if(!a)return 0;
  const resume=!!previous?.suspended&&!a.ended,token={},handle=this.nextHandle++;
  const old=this.states.get(a);let path=spec.path;
  if(spec.fallback&&(typeof a.canPlayType==='function'&&!a.canPlayType('audio/ogg; codecs="vorbis"')||old?.id===id&&(old.unsupported||a.error?.code===4)))path=spec.fallback;
  if(old?.path!==path)a.src='assets/'+path;
  else if(a.error){const position=a.currentTime;a.load?.();if(resume)try{a.currentTime=position;}catch{}}
  this.forget(a);
  const state={id,handle,path,loop:!!loop,priority,busy:true,pending:true,suspended:false,blocked:false,token};this.states.set(a,state);this.playing.set(handle,a);
  a.loop=!!loop;a.volume=Math.max(0,Math.min(1,(Number.isFinite(spec.Volume)?spec.Volume:1)*.55));if(!resume)try{a.currentTime=0;}catch{}
  const failed=error=>{if(this.states.get(a)===state&&state.token===token){this.forget(a);state.blocked=true;state.unsupported=error?.name==='NotSupportedError';state.suspended=state.loop;a.pause();}};
  try{
   Promise.resolve(a.play()).then(()=>{
    const current=this.states.get(a);
    if(current===state&&state.token===token)state.pending=false;
    else if(!current||current===state&&!state.busy)a.pause();
   }).catch(failed);
  }catch(error){failed(error);return 0;}
  return handle;
 }
 resume(){if(this.active())for(const [id,priority] of this.loops)this.play(id,true,priority);}
 suspend(){
  for(const a of this.elements){const s=this.states.get(a);this.forget(a);a.pause();if(s){s.suspended=s.loop;s.blocked=false;}}
 }
 stop(){
  for(const a of this.elements){const s=this.states.get(a);this.forget(a);a.pause();if(s){s.loop=false;s.suspended=false;s.blocked=false;}try{a.currentTime=0;}catch{}}
  this.loops.clear();
 }
}
