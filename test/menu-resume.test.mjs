import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';
import {encodeWorld} from '../dist/world-state.js';

const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const make=(room='room26',storage=null)=>{const g=new Engine(data,null,storage,{seed:12345});g.audioEnabled=false;g.loadRoom(room,false);g.setCheat('invincible',true);for(let n=0;n<30;n++)g.step();return g;};
const obj=(g,name)=>g.first(g.assets[name]);
const resources=g=>Object.fromEntries(['kills','ammo','bullets','stocks','tapes','php','slowmo','weapon1','weapon2','equippedweapon','takenallowance','hasquest1','quest1','acceptedquest'].map(k=>[k,g.global[k]]));
const shape=g=>{const world=g.captureWorld();delete world.savedAt;return world;};
function select(g,cursor){
 const menu=obj(g,'oMenu');assert.ok(menu);g.input.my=.2;menu.menu_cursor=cursor;g.input.pressed.add(13);g.step();
 for(let n=0;n<200&&g.room.info.Name==='rMenu';n++)g.step();
 assert.notEqual(g.room.info.Name,'rMenu','the selected menu action must complete');assert.equal(g.errors.length,0);
}
function prepare(g){
 g.applyCheat('weapons');g.reconcileWeapon(g.assets.oGun59);
 Object.assign(g.global,{kills:1234.56,ammo:555,bullets:27,stocks:123.45,tapes:8,php:7,slowmo:42,takenallowance:1,hasquest1:1,quest1:1,acceptedquest:true});
 const p=obj(g,'Object1');p.x+=123.5;p.hsp=0;p.vsp=0;
 return {stats:resources(g),player:{id:p.id,x:p.x,y:p.y},weapon:obj(g,'oGun59').id};
}
const statistics=g=>Object.fromEntries(['kills','ammo','bullets','php','slowmo','stocks','tapes','takenallowance'].map(k=>[k,g.global[k]]));
function enterHome(g){
 assert.equal(g.room.info.Name,'introroom2');g.input.keys.add(70);g.step();g.input.keys.clear();
 for(let n=0;n<200&&g.room.info.Name!=='room26';n++)g.step();
 assert.equal(g.room.info.Name,'room26');for(let n=0;n<30;n++)g.step();assert.equal(g.errors.length,0);
}
const storage=(failWrites=false)=>({values:new Map(),getItem(key){return this.values.get(key)??null;},setItem(key,value){if(failWrites)throw new Error('Full');this.values.set(key,value);},removeItem(key){if(failWrites)throw new Error('Unavailable');this.values.delete(key);}});

test('Menu and Continue preserve current resources and position in every gameplay room',()=>{
 for(const room of ['room26','room1','room3','petrolstationroom']){
  const g=make(room),before=prepare(g);g.writeFile('Save.sav',JSON.stringify([g.assets.room26,0]));g.writeFile('User.sav',JSON.stringify({Save1:{gscore:0,gammo:1,ggrenades:0}}));
  const files=[g.readFile('Save.sav'),g.readFile('User.sav')];g.loadRoom('rMenu');assert.deepEqual(resources(g),before.stats);select(g,1);
  assert.equal(g.room.info.Name,room);assert.deepEqual(resources(g),before.stats);assert.deepEqual({id:obj(g,'Object1').id,x:obj(g,'Object1').x,y:obj(g,'Object1').y},before.player);
  assert.equal(obj(g,'oGun59').id,before.weapon);assert.equal(obj(g,'oGun'),undefined);assert.equal(g.cheats.invincible,true);assert.deepEqual([g.readFile('Save.sav'),g.readFile('User.sav')],files);
 }
});

test('Continue returns to the most recently visited room and preserves changed scene objects',()=>{
 const g=make();g.destroy(obj(g,'oGunPickup'));g.loadRoom('room1');const enemy=obj(g,'oEnemy');g.destroy(enemy);g.loadRoom('room26');const before=prepare(g);
 assert.equal(JSON.parse(g.readFile('Save.sav'))[0],g.assets.room1,'the original file still points to a previous room');
 g.loadRoom('rMenu');g.loadRoom('rMenu');select(g,1);assert.equal(g.room.info.Name,'room26');assert.equal(obj(g,'oGunPickup'),undefined);assert.deepEqual(resources(g),before.stats);
 g.loadRoom('room1');assert.equal(g.first(enemy.id),undefined);assert.equal(g.errors.length,0);
});

test('a world saved on the menu resumes its adventure after reload, including older menu saves',()=>{
 const g=make('room1'),before=prepare(g);g.loadRoom('room26');g.loadRoom('room1');g.loadRoom('rMenu');const snapshot=g.captureWorld();assert.equal(snapshot.menuReturnRoom,'room1');
 for(const legacy of [false,true]){
  const world=structuredClone(snapshot);if(legacy)delete world.menuReturnRoom;
  const copy=new Engine(data,null,null,{seed:12345});copy.audioEnabled=false;copy.applyWorld(encodeWorld(world,data).text);assert.equal(copy.readFile('Save.sav'),null);select(copy,1);
  assert.equal(copy.room.info.Name,'room1');assert.deepEqual(resources(copy),before.stats);assert.equal(obj(copy,'Object1').x,before.player.x);assert.equal(obj(copy,'Object1').y,before.player.y);assert.equal(copy.errors.length,0);
 }
});

test('New Game clears menu continuation while a fresh session can still use original saved statistics',()=>{
 const g=make();prepare(g);g.loadRoom('rMenu');select(g,2);assert.equal(g.room.info.Name,'introroom2');assert.equal(g.menuReturnRoom,null);assert.equal(g.roomStates.size,0);assert.equal(g.worldInitialized,false);assert.equal(g.cheats.invincible,false);
 const cold=new Engine(data,null,null,{seed:12345});cold.audioEnabled=false;cold.loadRoom('rMenu',false);cold.writeFile('Save.sav',JSON.stringify([cold.assets.room1,45]));cold.writeFile('User.sav',JSON.stringify({Save1:{gscore:45,gammo:37,ggrenades:6,gphp:5,gslowmo:42,gstocks:12,gtapes:2,gallowance:1}}));
 select(cold,1);assert.equal(cold.room.info.Name,'room1');assert.equal(cold.global.kills,45);assert.equal(cold.global.ammo,37);assert.equal(cold.global.bullets,6);assert.equal(cold.global.php,5);assert.equal(cold.errors.length,0);
});

test('New Game reaches Home with original defaults despite saved statistics in any gameplay room or storage mode',()=>{
 const defaults=statistics(make());
 for(const room of ['room26','room1','room3','petrolstationroom'])for(const files of [null,storage(),storage(true)]){
  const g=make(room,files);prepare(g);g.writeFile('User.sav',JSON.stringify({Save1:{gscore:1234.56,gammo:555,ggrenades:27,gphp:7,gslowmo:42,gstocks:123.45,gtapes:8,gallowance:1}}));const saved=g.readFile('User.sav');
  g.loadRoom('rMenu');select(g,2);enterHome(g);
  assert.deepEqual(statistics(g),defaults,room);assert.equal(g.global.acceptedquest,false);assert.equal(g.global.quest1,0);assert.equal(g.global.quest2,0);assert.equal(g.global.quest3,0);
  assert.equal(g.global.weapon1,0);assert.equal(g.global.weapon2,0);assert.ok(obj(g,'oGunPickup'));assert.ok(obj(g,'ogrenadepickup'));assert.equal(g.cheats.invincible,false);
  assert.equal(g.readFile('User.sav'),saved,'New Game retains the explicitly loadable statistics save');
  g.loadRoom('rMenu');select(g,1);assert.deepEqual(statistics(g),defaults,'Continue resumes the new adventure');
 }
});

test('manual Load can explicitly restore original statistics after starting a new adventure',()=>{
 const g=make();prepare(g);g.input.pressed.add(83);g.step();const before=statistics(g),saved=g.readFile('User.sav');
 g.loadRoom('rMenu');select(g,2);enterHome(g);assert.notEqual(g.global.kills,before.kills);
 g.input.pressed.add(76);g.step();assert.deepEqual(statistics(g),before);assert.equal(g.readFile('User.sav'),saved);assert.equal(g.errors.length,0);
});

test('saving a new adventure during the introduction or at Home does not re-enable stale automatic loading',()=>{
 const files=storage(),g=make('room26',files);prepare(g);g.input.pressed.add(83);g.step();const saved=g.readFile('User.sav'),defaults=statistics(make());
 g.loadRoom('rMenu');select(g,2);const intro=g.captureWorld();
 const copy=new Engine(data,null,files,{seed:12345});copy.audioEnabled=false;copy.applyWorld(encodeWorld(intro,data).text);enterHome(copy);assert.deepEqual(statistics(copy),defaults);
 const home=copy.captureWorld();g.applyWorld(encodeWorld(home,data).text);g.loadRoom('room1');g.loadRoom('room26');assert.deepEqual(statistics(g),defaults);
 assert.equal(g.readFile('User.sav'),saved);assert.equal(g.errors.length,0);
});

test('the original ending restart also starts fresh without loading saved statistics',()=>{
 const g=make();prepare(g);g.input.pressed.add(83);g.step();const saved=g.readFile('User.sav'),defaults=statistics(make());
 g.loadRoom('rEnding');g.builtins.game_restart();g.step();assert.equal(g.room.info.Name,'room26');assert.deepEqual(statistics(g),defaults);
 assert.equal(g.readFile('User.sav'),saved);assert.equal(g.errors.length,0);
});

test('invalid menu return metadata is rejected before mutating a running world',()=>{
 const g=make();prepare(g);g.loadRoom('rMenu');const saved=g.captureWorld(),before=shape(g);
 for(const target of [null,1,'rMenu','missing','room1']){const broken=structuredClone(saved);broken.menuReturnRoom=target;assert.throws(()=>g.applyWorld(broken),/menu return room/);assert.deepEqual(shape(g),before);}
 const gameplay=make().captureWorld();gameplay.menuReturnRoom='room26';assert.throws(()=>g.applyWorld(gameplay),/menu return room/);assert.deepEqual(shape(g),before);
});

test('a stationary pointer over New Game does not undo keyboard selection of Continue',()=>{
 const g=make(),before=prepare(g);g.loadRoom('rMenu');const menu=obj(g,'oMenu');
 g.input.my=(menu.menu_y-menu.menu_itemheight*1.5*2-.1)/g.gui.h;g.step();assert.equal(menu.menu_cursor,2);
 g.input.pressed.add(40);g.step();assert.equal(menu.menu_cursor,1);for(let n=0;n<5;n++)g.step();assert.equal(menu.menu_cursor,1);
 select(g,menu.menu_cursor);assert.equal(g.room.info.Name,'room26');assert.deepEqual(resources(g),before.stats);
});
