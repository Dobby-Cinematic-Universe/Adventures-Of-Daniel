import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';
import {MAX_AUDIO_ELEMENTS} from '../dist/audio.js';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
function make(room='room26'){const g=new Engine(data,null,null,{seed:12345});g.audioEnabled=false;g.loadRoom(room,false);return g;}
const settle=async()=>{for(let n=0;n<6;n++)await Promise.resolve();};
function media(t,{ogg=true,play}={}){
 const original=globalThis.Audio,created=[];
 globalThis.Audio=class extends EventTarget{
  constructor(src=''){super();this.src=src;this.paused=true;this.ended=false;this.currentTime=0;this.error=null;this.plays=0;this.pauses=0;this.loads=0;created.push(this);}
  canPlayType(type){return type.includes('ogg')&&!ogg?'':'probably';}
  play(){this.plays++;this.ended=false;if(play)return play(this);this.paused=false;return Promise.resolve();}
  pause(){this.pauses++;this.paused=true;}
  load(){this.loads++;this.error=null;this.currentTime=0;}
  end(){this.ended=true;this.paused=true;this.dispatchEvent(new Event('ended'));}
 };
 t.after(()=>{if(original===undefined)delete globalThis.Audio;else globalThis.Audio=original;});return created;
}
test('loop requests share one playback and do not restart its position',async t=>{
 const created=media(t),g=make();g.audioEnabled=true;g.resumeAudio();await settle();const a=created[0],handle=[...g.soundsPlaying.keys()][0];a.currentTime=17;
 for(let n=0;n<20;n++)assert.equal(g.audioPlay(g.assets.nightsounds,true,7),handle);
 assert.equal(created.length,1);assert.equal(a.plays,1);assert.equal(a.currentTime,17);assert.equal(g.soundsPlaying.size,1);
});
test('pending loops are reserved even when the browser still reports paused',async t=>{
 const pending=[];const created=media(t,{play:a=>new Promise(resolve=>pending.push(()=>{a.paused=false;resolve();}))}),g=make();g.audioEnabled=true;g.resumeAudio();
 const handle=g.audioPlay(g.assets.nightsounds,true);assert.equal(created.length,1);assert.equal(created[0].plays,1);assert.ok(g.soundsPlaying.has(handle));pending[0]();await settle();assert.equal(created[0].paused,false);
});
test('pause and mute preserve the loop position, with no sound effects while paused or disabled',async t=>{
 const created=media(t),g=make();g.audioEnabled=true;g.resumeAudio();await settle();const a=created[0];a.currentTime=12;
 g.paused=true;g.suspendAudio();assert.equal(a.paused,true);assert.equal(g.audioPlay(g.assets.gunshot,false,5),0);assert.equal(created.length,1);
 g.paused=false;g.resumeAudio();await settle();assert.equal(a.paused,false);assert.equal(a.currentTime,12);assert.equal(created.length,1);
 g.audioEnabled=false;g.suspendAudio();assert.equal(g.audioPlay(g.assets.gunshot,false),0);assert.equal(a.currentTime,12);
 g.audioEnabled=true;g.resumeAudio();await settle();assert.equal(a.currentTime,12);assert.equal(g.soundsPlaying.size,1);
});
test('ambience returns once after cached rooms and world restoration, including combat levels',async t=>{
 const created=media(t),g=make('room1');g.audioEnabled=true;g.resumeAudio();await settle();const a=created.find(a=>a.loop),snapshot=g.captureWorld();a.currentTime=10;
 g.loadRoom('rMenu');assert.equal(a.paused,true);assert.equal(a.currentTime,0);g.loadRoom('room1');await settle();assert.equal(a.paused,false);assert.equal(g.audioPool.get(g.assets.nightsounds).length,1);
 g.applyWorld(snapshot);await settle();assert.equal(a.paused,false);assert.equal(g.audioPool.get(g.assets.nightsounds).length,1);assert.equal(g.errors.length,0);
});
test('ended effects release handles, and recycled channels invalidate earlier handles',async t=>{
 media(t);const g=make();g.audioEnabled=true;const handles=[];
 for(let n=0;n<4;n++)handles.push(g.audioPlay(g.assets.gunshot,false,5));await settle();
 assert.equal(g.soundsPlaying.has(handles[0]),false);assert.equal(g.soundsPlaying.size,3);
 for(const a of g.audioPool.get(g.assets.gunshot))a.end();assert.equal(g.soundsPlaying.size,0);
});
test('audio allocation is capped globally and respects active sound priorities',async t=>{
 const created=media(t),g=make();g.audioEnabled=true;const ids=data.sounds.map((s,i)=>i).filter(i=>i!==g.assets.nightsounds);
 for(const id of ids)for(let n=0;n<3;n++)g.audioPlay(id,false,10);await settle();
 assert.equal(created.length,MAX_AUDIO_ELEMENTS);assert.equal(g.soundsPlaying.size,MAX_AUDIO_ELEMENTS);assert.equal(g.audioPlay(ids[0],false,1),0);
 assert.ok(g.audioPlay(ids[0],false,11)>0);assert.equal(created.length,MAX_AUDIO_ELEMENTS);
 for(const a of created)a.end();g.audioPlay(ids.at(-1),false,1);assert.equal(created.length,MAX_AUDIO_ELEMENTS);
});
test('different completed effects reuse an idle media element while the ambient loop remains reserved',async t=>{
 const created=media(t),g=make();g.audioEnabled=true;g.resumeAudio();await settle();const ambient=created[0];ambient.currentTime=19;
 for(let id=0;id<data.sounds.length;id++){
  if(id===g.assets.nightsounds)continue;
  const handle=g.audioPlay(id,false,5);await settle();const effect=g.soundsPlaying.get(handle);assert.ok(effect);assert.notEqual(effect,ambient);effect.end();
 }
 assert.equal(created.length,2);assert.equal(ambient.paused,false);assert.equal(ambient.currentTime,19);assert.equal(g.soundsPlaying.size,1);
});
test('late playback completion cannot restart audio after stop or mute',async t=>{
 const pending=[];const created=media(t,{play:a=>new Promise(resolve=>pending.push(()=>{a.paused=false;resolve();}))}),g=make();g.audioEnabled=true;
 g.audioPlay(g.assets.gunshot,false);g.audioStop();pending[0]();await settle();assert.equal(created[0].paused,true);assert.equal(g.soundsPlaying.size,0);
 g.resumeAudio();g.audioEnabled=false;g.suspendAudio();pending[1]();await settle();assert.ok(created.every(a=>a.paused));assert.equal(g.soundsPlaying.size,0);
});
test('an obsolete play rejection does not cancel a reused channel',async t=>{
 const pending=[];media(t,{play:a=>new Promise((resolve,reject)=>pending.push({resolve:()=>{a.paused=false;resolve();},reject}))});const g=make();g.audioEnabled=true;const handles=[];
 for(let n=0;n<4;n++)handles.push(g.audioPlay(g.assets.gunshot,false));pending[0].reject(new Error('Interrupted'));await settle();
 assert.ok(g.soundsPlaying.has(handles[3]));assert.equal(g.soundsPlaying.has(handles[0]),false);assert.equal(g.soundsPlaying.size,3);
 for(const p of pending.slice(1))p.resolve();await settle();assert.equal(g.soundsPlaying.size,3);
});
test('blocked ambience waits for a user retry and preserves its suspended position',async t=>{
 let blocked=false;const created=media(t,{play:a=>{if(blocked)return Promise.reject(new Error('Autoplay blocked'));a.paused=false;return Promise.resolve();}}),g=make();g.audioEnabled=true;g.resumeAudio();await settle();const a=created[0];a.currentTime=15;
 g.paused=true;g.suspendAudio();g.paused=false;blocked=true;g.resumeAudio();await settle();const attempts=a.plays;
 for(let n=0;n<120;n++)g.step();assert.equal(a.plays,attempts);assert.equal(a.paused,true);
 blocked=false;g.resumeAudio();await settle();assert.equal(a.currentTime,15);assert.equal(a.paused,false);
});
test('synchronous play exceptions and legacy undefined play results do not break the engine',async t=>{
 let fail=true;media(t,{play:a=>{if(fail)throw new Error('Unavailable');a.paused=false;}});const g=make();g.audioEnabled=true;
 assert.equal(g.audioPlay(g.assets.gunshot,false),0);assert.equal(g.soundsPlaying.size,0);fail=false;assert.ok(g.audioPlay(g.assets.gunshot,false)>0);await settle();assert.equal(g.errors.length,0);
});
test('unsupported Ogg browsers select the MP3 fallback on demand',async t=>{
 const created=media(t,{ogg:false}),g=make();g.audioEnabled=true;g.audioPlay(g.assets.gunshot,false);await settle();assert.equal(created.length,1);assert.equal(created[0].src,'assets/'+data.sounds[g.assets.gunshot].fallback);assert.equal(created[0].preload,'none');
});
test('a rejected Ogg decoder switches to the fallback on the next request',async t=>{
 const created=media(t,{play:a=>a.src.endsWith('.ogg')?Promise.reject(Object.assign(new Error('Unsupported'),{name:'NotSupportedError'})):(a.paused=false,Promise.resolve())}),g=make();g.audioEnabled=true;
 g.audioPlay(g.assets.gunshot,false);await settle();g.audioPlay(g.assets.gunshot,false);await settle();assert.equal(created.length,1);assert.ok(created[0].src.endsWith('.mp3'));assert.equal(created[0].paused,false);
});
test('healing through the paused cheat menu does not leak revival audio',async t=>{
 const created=media(t),g=make();g.audioEnabled=true;g.resumeAudio();await settle();g.paused=true;g.suspendAudio();const p=g.first(g.assets.Object1);g.global.php=1;g.runEvent(p,4,g.assets.eEbullet,g.create(g.assets.eEbullet,p.x,p.y,'bullets'));
 const plays=created.reduce((n,a)=>n+a.plays,0);g.applyCheat('heal');await settle();assert.equal(g.paused,true);assert.ok(created.every(a=>a.paused));assert.equal(created.reduce((n,a)=>n+a.plays,0),plays);
 g.paused=false;g.resumeAudio();await settle();assert.equal(created.filter(a=>a.loop&&!a.paused).length,1);
});
test('dead scenes stay silent on resume and ambience returns after a normal revival',async t=>{
 const created=media(t),g=make();g.audioEnabled=true;g.resumeAudio();await settle();const p=g.first(g.assets.Object1);g.global.php=1;g.runEvent(p,4,g.assets.eEbullet,g.create(g.assets.eEbullet,p.x,p.y,'bullets'));
 for(let n=0;n<180;n++)g.step();g.resumeAudio();await settle();assert.equal(created.filter(a=>a.loop&&!a.paused).length,0);
 g.input.pressed.add(32);g.step();await settle();assert.equal(g.first(g.assets.oPDead),undefined);assert.equal(created.filter(a=>a.loop&&!a.paused).length,1);
});
test('menu music errors wait for a user retry and late completion cannot play after deactivation',async t=>{
 const pending=[];media(t,{play:a=>new Promise(resolve=>pending.push(()=>{a.paused=false;resolve();}))});const g=make('rMenu');g.audioEnabled=true;g.faceEgg.setEnabled(true);const music=g.faceEgg.music;
 g.faceEgg.setEnabled(false);pending[0]();await settle();assert.equal(music.paused,true);
 g.faceEgg.setEnabled(true);pending[1]();await settle();music.error={code:2};music.dispatchEvent(new Event('error'));const attempts=music.plays;
 for(let n=0;n<100;n++)g.step();assert.equal(music.plays,attempts);assert.equal(g.faceEgg.musicBlocked,true);
 g.resumeAudio();assert.equal(music.loads,1);pending[2]();await settle();assert.equal(music.paused,false);assert.equal(g.faceEgg.musicBlocked,false);
});
