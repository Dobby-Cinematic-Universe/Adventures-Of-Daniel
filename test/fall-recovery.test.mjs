import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';

const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const make=(room='room26')=>{
 const g=new Engine(data,null,null,{seed:12345});g.audioEnabled=false;g.loadRoom(room,false);
 g.setCheat('invincible',true);for(let i=0;i<60;i++)g.step();g.setCheat('invincible',false);return g;
};
const obj=(g,name)=>g.first(g.assets[name]);
const step=(g,n=1)=>{for(let i=0;i<n;i++)g.step();};
const outside=(g,p,x=-1000,y=-100000)=>Object.assign(p,{x,y,vsp:-1000,hsp:0,gunkickx:0,gunkicky:0});

test('a high rocket launch outside either terrain edge ends in death without a position teleport',()=>{
 for(const x of [-1000,30000]){
  const g=make(),p=obj(g,'Object1');outside(g,p,x,-6000);
  const explosion=g.create(g.assets.oExplosion,p.x,p.y+20,'bullets');g.runEvent(p,4,g.assets.oExplosion,explosion);
  assert.equal(p.vsp,-20);g.step();
  const body=obj(g,'oPDead');assert.ok(body);assert.equal(g.global.php,0);assert.equal(g.global.hascontrol,0);
  assert.equal(body.x,x);assert.equal(body.y,-6000);assert.equal(body.done,1);assert.equal(body.vsp,0);
  assert.equal(g.errors.length,0);
 }
});

test('the original wide platform and high flight above terrain remain playable',()=>{
 const g=make(),p=obj(g,'Object1');p.x=7200;p.y=-6000;p.vsp=-100;g.step();
 assert.ok(p.y<-6000);assert.equal(obj(g,'oPDead'),undefined);
 p.x=20150;p.y=4000;p.vsp=10;step(g,100);
 assert.ok(p.y>g.room.info.Height);assert.ok(g.place(p,p.x,p.y+1,g.assets.wall));
 assert.equal(obj(g,'oPDead'),undefined);assert.equal(g.errors.length,0);
});

test('void death can be revived with invincibility enabled while ordinary damage stays blocked',()=>{
 const g=make('room1'),p=obj(g,'Object1');g.setCheat('invincible',true);
 const hp=g.global.php;g.runEvent(p,4,g.assets.eEbullet,g.create(g.assets.eEbullet,p.x,p.y,'bullets'));
 assert.equal(g.global.php,hp);assert.equal(obj(g,'oPDead'),undefined);
 outside(g,p);g.step();assert.ok(obj(g,'oPDead'));assert.equal(g.global.php,0);assert.equal(g.cheats.invincible,true);
 g.input.pressed.add(32);g.step();assert.equal(obj(g,'oPDead'),undefined);assert.equal(g.global.php,8);
 assert.equal(g.cheats.invincible,true);assert.equal(g.global.hascontrol,1);assert.equal(g.errors.length,0);
});

test('falling below all terrain charges the original death penalty once and preserves other progress',()=>{
 const g=make(),p=obj(g,'Object1');g.applyCheat('weapons');g.reconcileWeapon(g.assets.oGun59);
 Object.assign(g.global,{kills:900,ammo:321,bullets:18,stocks:123.45,tapes:4,acceptedquest:true,slowmo:77});
 p.x=7200;p.y=6000;p.vsp=400;g.step();assert.ok(obj(g,'oPDead'));
 assert.equal(g.global.kills,700);assert.equal(g.global.respawnweapon,g.assets.oGun59);
 const progress=[g.global.ammo,g.global.bullets,g.global.stocks,g.global.tapes,g.global.acceptedquest,g.global.slowmo];
 step(g,20);assert.equal(g.global.kills,700);assert.equal(g.resolve(g.assets.oPDead).length,1);
 assert.deepEqual([g.global.ammo,g.global.bullets,g.global.stocks,g.global.tapes,g.global.acceptedquest,g.global.slowmo],progress);
 assert.equal(g.errors.length,0);
});

test('a corpse in the void is revivable without finding support and returns to the original room spawn',()=>{
 for(const room of ['room26','room1','room3','petrolstationroom']){
  const g=make(room),p=obj(g,'Object1');g.applyCheat('weapons');g.reconcileWeapon(g.assets.oGun59);g.global.kills=900;
  g.global.php=1;g.runEvent(p,4,g.assets.eEbullet,g.create(g.assets.eEbullet,p.x,p.y,'bullets'));
  const body=obj(g,'oPDead');assert.ok(body);Object.assign(body,{x:30000,y:6000,vsp:400,hsp:6,done:0});
  g.guardMapFall();assert.deepEqual([body.x,body.y,body.vsp,body.hsp,body.done],[30000,6000,0,0,1]);
  const bed=obj(g,'oBedSleep'),expected=bed?[bed.x,bed.y-90]:[p.xstart,p.ystart];
  g.input.pressed.add(32);g.step();assert.equal(obj(g,'oPDead'),undefined);assert.equal(g.global.php,8);
  assert.deepEqual([p.x,p.y],expected);assert.equal(g.global.kills,700);assert.ok(obj(g,'oGun59'));
  assert.equal(g.resolve(g.assets.oGun).length+g.resolve(g.assets.oGun59).length,1);assert.equal(g.errors.length,0);
 }
});

test('a saved extreme launch and a saved ready corpse resume deterministically',()=>{
 const g=make('room1'),p=obj(g,'Object1');g.applyCheat('weapons');outside(g,p);const snapshots=[g.captureWorld()];
 g.step();snapshots.push(g.captureWorld());
 for(const snapshot of snapshots){
  const a=new Engine(data,null,null,{seed:12345}),b=new Engine(data,null,null,{seed:12345});a.audioEnabled=b.audioEnabled=false;
  a.applyWorld(snapshot);b.applyWorld(snapshot);step(a,5);step(b,5);a.input.pressed.add(32);b.input.pressed.add(32);step(a,2);step(b,2);
  const wa=a.captureWorld(),wb=b.captureWorld();delete wa.savedAt;delete wb.savedAt;assert.deepEqual(wa,wb);
  assert.equal(obj(a,'oPDead'),undefined);assert.equal(a.errors.length,0);assert.equal(b.errors.length,0);
 }
});

test('the void guard leaves sleeping, world dialogs, and pending room transitions alone',()=>{
 const g=make(),p=obj(g,'Object1');outside(g,p);g.global.hascontrol=0;g.guardMapFall();
 assert.equal(obj(g,'oPDead'),undefined);assert.equal(p.y,-100000);
 g.create(g.assets.ojobmenu,7200,2000,'quests');g.guardMapFall();assert.equal(obj(g,'oPDead'),undefined);
 g.global.hascontrol=1;g.pendingRoom=g.assets.room1;g.guardMapFall();assert.equal(obj(g,'oPDead'),undefined);
 g.step();assert.equal(g.room.info.Name,'room1');assert.equal(obj(g,'oPDead'),undefined);assert.equal(g.errors.length,0);
});

test('waiting to revive keeps the hidden player stationary and the world save valid',()=>{
 const g=make(),p=obj(g,'Object1');g.applyCheat('weapons');g.reconcileWeapon(g.assets.oGun59);g.global.kills=900;
 outside(g,p);g.guardMapFall();const body=obj(g,'oPDead');assert.ok(body);
 const position=[p.x,p.y],corpsePosition=[body.x,body.y];step(g,600);
 assert.deepEqual([p.x,p.y],position);assert.deepEqual([body.x,body.y],corpsePosition);
 assert.ok([p.x,p.y,p.hsp,p.vsp,p.hspeed,p.vspeed,body.x,body.y,body.hsp,body.vsp].every(Number.isFinite));
 assert.equal(body.done,1);assert.equal(body.vsp,0);assert.equal(g.global.php,0);assert.equal(g.global.kills,700);
 const snapshot=g.captureWorld(),restored=new Engine(data,null,null,{seed:12345});restored.audioEnabled=false;
 assert.equal(restored.applyWorld(snapshot),true);assert.deepEqual([obj(restored,'Object1').x,obj(restored,'Object1').y],position);
 restored.input.pressed.add(32);restored.step();assert.equal(obj(restored,'oPDead'),undefined);assert.equal(restored.global.php,8);
 assert.equal(restored.global.kills,700);assert.ok(obj(restored,'oGun59'));
 assert.equal(restored.resolve(restored.assets.oGun).length+restored.resolve(restored.assets.oGun59).length,1);
 assert.equal(g.errors.length,0);assert.equal(restored.errors.length,0);
});
