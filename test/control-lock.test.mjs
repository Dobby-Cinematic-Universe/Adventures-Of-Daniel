import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';
import {encodeWorld} from '../dist/world-state.js';
import {gameplayHint} from '../dist/gameplay-hints.js';

const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const obj=(g,name)=>g.first(g.assets[name]);
function make(room='room26'){
 const g=new Engine(data,null,null,{seed:12345});g.audioEnabled=false;g.loadRoom(room,false);g.setCheat('invincible',true);
 for(let n=0;n<40;n++)g.step();return g;
}
const stats=g=>['kills','ammo','bullets','php','stocks','tapes'].map(k=>g.global[k]);
const shape=g=>{const w=g.captureWorld();delete w.savedAt;return w;};

test('touching the high Home exit on a cold start completes the transition instead of stranding Daniel on the stair',()=>{
 const g=make(),p=obj(g,'Object1'),before=stats(g);assert.equal(obj(g,'oTransition'),undefined);
 Object.assign(p,{x:10890,y:1560,hsp:0,vsp:0});assert.ok(g.place(p,p.x,p.y,g.assets.oLevelEnd));g.step();
 const transition=obj(g,'oTransition');assert.ok(transition);assert.equal(transition.mode,2);assert.equal(transition.percent,0);assert.equal(g.global.hascontrol,false);
 assert.equal(transition.layer,-1,'the fade uses the original object depth above the HUD');
 for(let n=0;n<120&&g.room.info.Name==='room26';n++)g.step();
 assert.equal(g.room.info.Name,'room1');assert.equal(g.global.hascontrol,true);assert.deepEqual(stats(g),before);assert.equal(g.resolve(g.assets.oTransition).length,1);assert.equal(g.errors.length,0);
});

test('cold starts in either original combat level can complete their room exits',()=>{
 for(const room of ['room1','room3']){
  const g=make(room),exit=obj(g,'oLevelEnd'),p=obj(g,'Object1');assert.ok(exit);assert.equal(obj(g,'oTransition'),undefined);
  const target=data.rooms[exit.target].info.Name;g.runEvent(exit,4,g.assets.Object1,p);assert.ok(obj(g,'oTransition'));assert.equal(g.global.hascontrol,false);
  for(let n=0;n<120&&g.room.info.Name===room;n++)g.step();assert.equal(g.room.info.Name,target);assert.equal(g.resolve(g.assets.oTransition).length,1);assert.equal(g.errors.length,0);
 }
});

test('a previously stranded stair save restores movement and jumping without moving or charging the player for recovery',()=>{
 const g=make(),p=obj(g,'Object1');Object.assign(p,{x:10890,y:2155.4,hsp:0,vsp:0});g.global.hascontrol=false;g.global.kills=740.67;
 assert.equal(gameplayHint(g),'Click an option to continue.');assert.equal(g.place(p,p.x,p.y,g.assets.wall),null);
 const snapshot=encodeWorld(g.captureWorld(),data).text,copy=new Engine(data,null,null,{seed:12345});copy.audioEnabled=false;copy.applyWorld(snapshot);
 for(const game of [g,copy]){
  const player=obj(game,'Object1'),before=[player.x,player.y],resources=stats(game);game.input.keys.add(65);game.input.pressed.add(32);game.step();
  assert.equal(game.global.hascontrol,true);assert.ok(player.x<before[0]);assert.ok(player.y<before[1]);assert.ok(Math.hypot(player.x-before[0],player.y-before[1])<12);
  assert.deepEqual(stats(game),resources);assert.equal(obj(game,'oPDead'),undefined);assert.equal(game.errors.length,0);
 }
 assert.deepEqual(shape(g),shape(copy));
});

test('dialogues, computer menus, sleep, death, and active transitions retain their intended control locks',()=>{
 for(const source of ['oQuestBox','ojobmenu','oButtonOff','oSleepBlck119','oPDead','oTransition']){
  const g=make(),p=obj(g,'Object1');if(source==='oButtonOff')g.create(g.assets.oshopping2,p.x,p.y,p.layer);
  const lock=g.create(g.assets[source],p.x,p.y,p.layer);assert.equal(lock.dead,undefined);
  if(source==='oTransition')Object.assign(lock,{mode:2,percent:0,target:g.assets.room1});
  g.global.hascontrol=false;g.input.keys.add(65);g.input.pressed.add(32);g.step();assert.equal(g.global.hascontrol,false,source);assert.equal(g.errors.length,0);
 }
 const sleeping=make();sleeping.global.hascontrol=false;sleeping.global.clickedbed=true;sleeping.step();assert.equal(sleeping.global.hascontrol,false);
 const paused=make();paused.global.hascontrol=false;paused.paused=true;const before=shape(paused);paused.step();assert.deepEqual(shape(paused),before);
});

test('an existing persistent fade is reused and controls stay locked until the room changes',()=>{
 const g=make('rMenu'),transition=obj(g,'oTransition');assert.ok(transition);g.loadRoom('room26');for(let n=0;n<40;n++)g.step();
 g.runEvent(obj(g,'oLevelEnd'),4,g.assets.Object1,obj(g,'Object1'));g.step();assert.equal(g.global.hascontrol,false);assert.equal(obj(g,'oTransition').id,transition.id);assert.equal(g.resolve(g.assets.oTransition).length,1);
 for(let n=0;n<120&&g.room.info.Name==='room26';n++)g.step();assert.equal(g.room.info.Name,'room1');assert.equal(g.global.hascontrol,true);assert.equal(obj(g,'oTransition').id,transition.id);assert.equal(g.errors.length,0);
});
