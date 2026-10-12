import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {AlarmIndex} from '../dist/alarms.js';
import {Engine} from '../dist/engine.js';
import {cloneState,encodeWorld} from '../dist/world-state.js';

function brute(before,fire){for(const s of before){if(s.dead)continue;for(let i=0;i<12;i++)if(s.alarm[i]>0){if(--s.alarm[i]===0){s.alarm[i]=-1;fire(s,i);}}}}
function model(optimized){
 const world={list:[],events:[],handlers:new Map(),frame:0,index:optimized?new AlarmIndex():null};
 world.add=(alarm=Array(12).fill(-1))=>{const s={id:world.list.length,alarm,dead:false};world.list.push(s);world.index?.register(s);return s;};
 world.fire=(s,i)=>{if(s.dead)return;world.events.push([world.frame,s.id,i]);world.handlers.get(`${s.id}:${i}`)?.(world,s,i);};
 world.tick=begin=>{const before=[...world.list];world.frame++;begin?.(world);if(world.index)world.index.step(before,world.fire);else brute(before,world.fire);};
 world.shape=()=>({events:world.events,list:world.list.map(s=>({id:s.id,dead:s.dead,alarm:Array.from(s.alarm)}))});
 return world;
}
function parity(setup,frames,begin){
 const original=model(false),indexed=model(true);setup(original);setup(indexed);
 for(let n=0;n<frames;n++){original.tick(begin);indexed.tick(begin);assert.deepEqual(indexed.shape(),original.shape(),`frame ${n+1}`);}
 return indexed;
}
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const make=(room='room26')=>{const g=new Engine(data,null,null,{seed:12345});g.audioEnabled=false;g.loadRoom(room,false);return g;};
const shape=g=>{const world=g.captureWorld();delete world.savedAt;return createHash('sha256').update(JSON.stringify(world)).digest('hex');};

test('indexed alarms preserve original countdown, coercion, and ascending slot order',()=>{
 const result=parity(w=>{w.add([-1,0,1,2,10,.5,true,'2',NaN,Infinity,undefined,3]);w.add([1,...Array(11).fill(-1)]);},12);
 assert.deepEqual(result.events.filter(e=>e[0]===1).map(e=>[e[1],e[2]]),[[0,2],[0,6],[1,0]]);
 assert.equal(result.list[0].alarm[5],-.5);assert.equal(result.list[0].alarm[9],Infinity);
});
test('events may start later slots immediately, restart their own slot for next frame, and cancel pending slots',()=>{
 const result=parity(w=>{
  const s=w.add([1,-1,-1,-1,1,...Array(7).fill(-1)]);
  w.handlers.set('0:0',(w,s)=>{s.alarm[0]=2;s.alarm[1]=1;s.alarm[4]=-1;});
  w.handlers.set('0:1',(w,s)=>{s.alarm[0]=1;s.alarm[2]=1;});
 },4);
 assert.deepEqual(result.events.slice(0,3).map(e=>e.slice(1)),[[0,0],[0,1],[0,2]]);
 assert.ok(result.events.some(e=>e[0]===2&&e[2]===0));assert.ok(!result.events.some(e=>e[2]===4));
});
test('cross-instance writes preserve frame snapshot order rather than active-set insertion order',()=>{
 const result=parity(w=>{
  w.add();w.add([1,...Array(11).fill(-1)]);w.add();
  w.handlers.set('1:0',w=>{w.list[0].alarm[0]=1;w.list[2].alarm[0]=1;});
 },2);
 assert.deepEqual(result.events,[[1,1,0],[1,2,0],[2,0,0]]);
});
test('whole-array replacements inside an alarm event are observed before later slots and instances',()=>{
 parity(w=>{
  w.add([1,...Array(11).fill(-1)]);w.add();
  w.handlers.set('0:0',(w,s)=>{s.alarm=Array(12).fill(-1);s.alarm[0]=1;s.alarm[7]=1;w.list[1].alarm=[1,...Array(11).fill(-1)];});
 },3);
});
test('begin-step direct assignments, array operations, deletion, and descriptors update activity',()=>{
 parity(w=>{w.add();w.add();},5,w=>{
  if(w.frame===1){w.list[0].alarm[11]=1;w.list[1].alarm=Array(12).fill(2);}
  if(w.frame===2){w.list[1].alarm.fill(-1);Object.defineProperty(w.list[0].alarm,'3',{value:1,writable:true,enumerable:true,configurable:true});}
  if(w.frame===3){w.list[0].alarm[4]=1;delete w.list[0].alarm[4];w.list[1].alarm.splice(0,2,1,1);}
  if(w.frame===4){w.list[1].alarm.length=0;w.list[1].alarm[9]=1;}
 });
});
test('shared alarm arrays retain shared countdown semantics',()=>{
 parity(w=>{const first=w.add([2,...Array(11).fill(-1)]);w.add(first.alarm);},3);
});
test('raw aliases supplied before registration remain effective after wrapping and across events',()=>{
 const result=parity(w=>{
  w.raw=Array(12).fill(-1);w.add(w.raw);
  w.handlers.set('0:1',w=>{w.raw[6]=1;w.raw[10]=-1;});
 },4,w=>{
  if(w.frame===2){w.raw[1]=1;w.raw[10]=1;}
  if(w.frame===3){w.raw[0]=1;}
 });
 assert.deepEqual(result.events,[[2,0,1],[2,0,6],[3,0,0]]);
});
test('raw aliases to whole-array replacements remain effective on later frames',()=>{
 const result=parity(w=>{
  w.add();w.raw=Array(12).fill(-1);w.list[0].alarm=w.raw;
  w.handlers.set('0:4',w=>{w.raw[7]=1;});
 },4,w=>{
  if(w.frame===2)w.raw[4]=1;
  if(w.frame===3){w.raw.length=0;w.raw[9]=1;}
 });
 assert.deepEqual(result.events,[[2,0,4],[2,0,7],[3,0,9]]);
});
test('new alarm owners are deferred to the next frame and destroyed owners keep original dispatch behavior',()=>{
 const result=parity(w=>{
  w.add([1,1,...Array(10).fill(-1)]);w.add([1,...Array(11).fill(-1)]);
  w.handlers.set('0:0',(w,s)=>{s.dead=true;w.list[1].dead=true;w.add([1,...Array(11).fill(-1)]);});
 },2);
 assert.deepEqual(result.events,[[1,0,0],[2,2,0]]);assert.equal(result.list[0].alarm[1],-1);assert.equal(result.list[1].alarm[0],1);
});
test('re-registration and snapshots retain plain alarm arrays with no private simulation fields',()=>{
 const index=new AlarmIndex(),s={id:1,alarm:[3,...Array(11).fill(-1)]};index.register(s);const first=s.alarm;index.register(s);
 assert.equal(s.alarm,first);assert.equal(Array.isArray(s.alarm),true);assert.deepEqual(Object.keys(s),['id','alarm']);
 assert.deepEqual(cloneState(s),{id:1,alarm:[3,...Array(11).fill(-1)]});
 s.alarm=[1,...Array(11).fill(-1)];index.register(s);const fired=[];index.step([s],(s,n)=>fired.push(n));assert.deepEqual(fired,[0]);
});
test('GML array-index assignments, builtin alarm_set, and object changes register timers',()=>{
 const g=make(),p=g.first(g.assets.Object1);assert.equal(p.alarm[0],29);
 g.global.stocks=50;const controller=g.create(g.assets.oButton1Stock,0,0,'floor',null,{},false);controller.alarm.fill(-1);g.runCode('gml_Object_oButton1Stock_Create_0',controller);assert.equal(controller.alarm[1],30);
 g.global.stocks=50;g.builtins.alarm_set({self:controller},1,1);const old=g.global.stocks;g.alarms.step([controller],(s,n)=>g.runEvent(s,2,n));
 assert.notEqual(g.global.stocks,old);assert.equal(controller.alarm[1],10);
 const door=g.first(g.assets.oDoor);door.alarm[11]=2;g.change(door,g.assets.oDoorOpen,true);g.alarms.step([door],(s,n)=>g.runEvent(s,2,n));assert.equal(door.alarm[11],1);assert.equal(g.errors.length,0);
});
test('Engine create accepts aliased alarm arrays without promoting them to the owned-array fast path',()=>{
 const g=make(),raw=Array(12).fill(-1),s=g.create(g.assets.wall,0,0,'floor',null,{alarm:raw},false),fired=[];
 g.alarms.step([s],(s,n)=>fired.push(n));raw[8]=1;g.alarms.step([s],(s,n)=>fired.push(n));assert.deepEqual(fired,[8]);
 g.change(s,g.assets.oDoorOpen,false);raw[3]=1;g.alarms.step([s],(s,n)=>fired.push(n));assert.deepEqual(fired,[8,3]);
});
test('indexed timers and brute-force timers produce identical playable worlds after save and reload',()=>{
 for(const room of ['room26','room1','room3','petrolstationroom']){
  const indexed=make(room),reference=make(room);reference.alarms.step=brute;indexed.setCheat('invincible',true);reference.setCheat('invincible',true);
  for(let n=0;n<65;n++){indexed.step();reference.step();}assert.deepEqual(shape(indexed),shape(reference),room);
  const source=encodeWorld(indexed.captureWorld(),data).text,copy=make();copy.applyWorld(source);
  for(let n=0;n<35;n++){indexed.step();copy.step();}assert.deepEqual(shape(copy),shape(indexed),`${room} reload`);
 }
});
test('legacy instance snapshots rebuild timer activity without changing their stored arrays',()=>{
 const source=make(),p=source.first(source.assets.Object1);for(let n=0;n<20;n++)source.step();p.alarm[6]=9;
 const room=source.captureRoom(),legacy={version:2,room:source.roomIndex,x:p.x,y:p.y,global:cloneState({...source.global}),instances:room.instances,frame:room.frame,layers:room.layers};
 const restored=make();restored.applyWorld(restored.convertLegacyCheckpoint(JSON.stringify(legacy)));const loaded=restored.first(restored.assets.Object1);
 assert.deepEqual(Array.from(loaded.alarm),Array.from(p.alarm));restored.step();assert.equal(loaded.alarm[6],8);assert.equal(restored.errors.length,0);
});
