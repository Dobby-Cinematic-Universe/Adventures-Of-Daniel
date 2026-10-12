import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';
import {encodeWorld,validateWorld,MAX_WORLD_BYTES} from '../dist/world-state.js';
import {BrowserWorldStorage,MemoryWorldStorage,WorldSaveRepository} from '../dist/world-saves.js';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const make=(room='room26',storage=null)=>{const game=new Engine(data,null,storage,{seed:12345});game.audioEnabled=false;game.loadRoom(room,false);return game;};
const obj=(g,name)=>g.first(g.assets[name]);
const step=(g,n=1)=>{for(let i=0;i<n;i++)g.step();};
const shape=g=>{const w=g.captureWorld();delete w.savedAt;return w;};
const storage=()=>({values:new Map(),getItem(key){return this.values.get(key)??null;},setItem(key,value){this.values.set(key,value);},removeItem(key){this.values.delete(key);}});

test('every recovered room can be saved and restored with exact instance, camera, timing, and layer state',()=>{
 for(const room of data.rooms){const g=make(room.info.Name);step(g,12);const {text}=encodeWorld(g.captureWorld(),data);const restored=make();restored.applyWorld(text);assert.deepEqual(shape(restored),shape(g),room.info.Name);assert.equal(restored.errors.length,0);}
});
test('a world save resumes the same deterministic simulation after a reload',()=>{
 const g=make();step(g,40);const source=encodeWorld(g.captureWorld(),data).text,copy=make();copy.applyWorld(source);
 for(let n=0;n<90;n++){
  if(n===0){g.input.keys.add(68);copy.input.keys.add(68);}if(n===30){g.input.keys.clear();copy.input.keys.clear();}
  if(n===50){g.input.pressed.add(32);copy.input.pressed.add(32);}g.step();copy.step();
 }
 assert.deepEqual(shape(copy),shape(g));obj(copy,'Object1').x+=100;assert.notEqual(obj(copy,'Object1').x,obj(g,'Object1').x);
});
test('S and L remain statistics-only, and world slots leave original save files untouched',async()=>{
 const original=storage(),g=make('room26',original),repo=new WorldSaveRepository(data,new MemoryWorldStorage());step(g,20);
 g.global.kills=500;obj(g,'Object1').x=7600;await repo.save(1,'Home',g.captureWorld());const worldText=await repo.export(1),initialRoomFile=g.readFile('Save.sav');
 g.global.kills=700;g.input.pressed.add(83);g.step();const stats=g.readFile('User.sav');assert.equal(JSON.parse(stats).Save1.gscore,700);assert.equal(await repo.export(1),worldText);
 obj(g,'Object1').x=7300;g.global.kills=0;g.input.pressed.add(76);g.step();assert.equal(g.global.kills,700);assert.equal(obj(g,'Object1').x,7300);
 g.applyWorld(await repo.load(1));assert.equal(g.global.kills,500);assert.equal(obj(g,'Object1').x,7600);assert.equal(g.readFile('User.sav'),stats);assert.equal(g.readFile('Save.sav'),initialRoomFile);
});
test('visited rooms preserve collected objects, enemies, doors, and the selected weapon',()=>{
 const g=make();step(g,30);const p=obj(g,'Object1');
 g.runEvent(obj(g,'oGunPickup'),4,g.assets.Object1,p);g.runEvent(p,4,g.assets.ogrenadepickup,obj(g,'ogrenadepickup'));
 const originalGunPickup=obj(g,'oGunPickup');assert.equal(originalGunPickup,undefined);g.global.kills=500;g.global.ammo=37;g.global.bullets=6;p.x=7400;
 const door=obj(g,'oDoor');p.x=door.x-60;p.y=door.y;g.input.pressed.add(69);g.step();assert.ok(obj(g,'oDoorOpen'));
 const homePosition={x:p.x,y:p.y};g.loadRoom('room1');assert.equal(g.global.kills,500);assert.equal(g.global.ammo,37);assert.equal(g.global.bullets,6);assert.ok(obj(g,'oGun59'));assert.equal(obj(g,'oGun'),undefined);
 const enemy=obj(g,'oEnemy');enemy.hp=0;enemy.hitfrom=180;g.runEvent(enemy,3,1);assert.ok(enemy.dead);const corpse=obj(g,'oDead');assert.ok(corpse.hsp<0);assert.ok(obj(g,'oEnemyBloodspatter'));const enemyCount=g.resolve(g.assets.oEnemy).length;
 const save=encodeWorld(g.captureWorld(),data).text,copy=make();copy.applyWorld(save);copy.loadRoom('room26');
 assert.equal(obj(copy,'oGunPickup'),undefined);assert.equal(obj(copy,'ogrenadepickup'),undefined);assert.ok(obj(copy,'oDoorOpen'));assert.equal(obj(copy,'Object1').x,homePosition.x);assert.equal(obj(copy,'Object1').y,homePosition.y);assert.ok(obj(copy,'oGun59'));
 copy.loadRoom('room1');assert.equal(copy.resolve(copy.assets.oEnemy).length,enemyCount);assert.equal(obj(copy,'oDead').id,corpse.id);assert.equal(copy.global.ammo,37);assert.equal(copy.global.bullets,6);assert.equal(copy.errors.length,0);
});
test('three world slots, latest selection, names, export, and import remain independent',async()=>{
 const driver=new MemoryWorldStorage(),repo=new WorldSaveRepository(data,driver),g=make();step(g,2);
 for(let slot=1;slot<=3;slot++){g.global.kills=slot*100;const world=g.captureWorld();world.savedAt=slot;await repo.save(slot,`Adventure ${slot}`,world);}
 assert.equal((await repo.latest()).slot,3);assert.equal((await repo.list()).length,3);
 const imported=await repo.import(2,'Imported',await repo.export(1));assert.equal(imported.name,'Imported');assert.equal((await repo.load(2)).global.kills,100);assert.equal((await repo.load(3)).global.kills,300);
});
test('a failed save or malformed import leaves the previous slot and current world intact',async()=>{
 const driver=new MemoryWorldStorage(),repo=new WorldSaveRepository(data,driver),g=make();await repo.save(1,'Keep me',g.captureWorld());const previous=await repo.export(1),before=shape(g);
 driver.failWrites=true;g.global.kills=900;await assert.rejects(repo.save(1,'Replacement',g.captureWorld()),/full/);assert.equal(await repo.export(1),previous);driver.failWrites=false;
 await assert.rejects(repo.import(1,'Bad','{broken'),/valid JSON/);assert.equal(await repo.export(1),previous);
 g.global.kills=before.global.kills;assert.throws(()=>g.applyWorld('{broken'),/valid JSON/);assert.deepEqual(shape(g),before);
});
test('import validation rejects invalid references, unsafe geometry, oversized files, and duplicate IDs before mutation',()=>{
 const g=make(),saved=g.captureWorld(),before=shape(g);
 const changes=[w=>w.active='missing',w=>w.randomState=0,w=>w.rooms.room26.instances[0].object_index=9999,w=>w.rooms.room26.instances[0].x=Infinity,w=>w.rooms.room26.layers[0].LayerId=999999,w=>w.rooms.room26.instances.push({...w.rooms.room26.instances[0]}),w=>w.global.php=1e10,w=>w.rooms.room26.instances[0].alarm[0]=.5,w=>w.rooms.room26.layers[0].LayerName='fake'];
 for(const change of changes){const broken=structuredClone(saved);change(broken);assert.throws(()=>g.applyWorld(broken));assert.deepEqual(shape(g),before);}
 assert.throws(()=>validateWorld(' '.repeat(MAX_WORLD_BYTES+1),data),/larger/);
 const poisoned=JSON.stringify(saved).replace('"global":{','"global":{"__proto__":{"polluted":true},');assert.throws(()=>g.applyWorld(poisoned),/invalid property/);assert.equal({}.polluted,undefined);
});
test('world loads restore in-progress sleep and alarms without replaying creation or statistics file writes',()=>{
 const files=storage(),g=make('room26',files);step(g,20);const p=obj(g,'Object1'),bed=obj(g,'oBedSleep');p.x=bed.x;p.y=bed.y-90;p.vsp=0;step(g,2);
 const b=g.bounds(bed);g.input.mx=((b.left+b.right)/2-g.camera.x)/g.camera.w;g.input.my=((b.top+b.bottom)/2-g.camera.y)/g.camera.h;g.input.bpressed.add(1);g.step();step(g,210);
 const world=encodeWorld(g.captureWorld(),data).text,copy=make('room26',files),originalFiles=new Map(files.values);copy.applyWorld(world);assert.ok(obj(copy,'oSleepBlck119'));assert.equal(copy.global.clickedbed,true);assert.deepEqual(files.values,originalFiles);
 step(copy,200);assert.equal(copy.global.hascontrol,1);assert.equal(copy.global.clickedbed,false);assert.equal(obj(copy,'oSleepBlck119'),undefined);assert.equal(obj(copy,'oBedSleep').alarm[1],-1);
});
test('worlds restore a defeated player and resume revival with one owned weapon',()=>{
 const g=make('room1');step(g,20);g.global.php=1;const p=obj(g,'Object1'),shot=g.create(g.assets.eEbullet,p.x,p.y,'bullets');g.runEvent(p,4,g.assets.eEbullet,shot);step(g,120);
 const copy=make();copy.applyWorld(encodeWorld(g.captureWorld(),data).text);assert.ok(obj(copy,'oPDead'));assert.equal(copy.global.hascontrol,0);copy.input.pressed.add(32);copy.step();assert.equal(obj(copy,'oPDead'),undefined);assert.equal(copy.global.php,8);assert.equal(copy.resolve(copy.assets.oGun).length+copy.resolve(copy.assets.oGun59).length,1);
});
test('new adventures clear visited-room history and active cheats without deleting world slots or original statistics',()=>{
 const files=storage(),g=make('room26',files);g.global.kills=800;g.setCheat('invincible',true);g.loadRoom('room1');assert.ok(g.roomStates.size);g.writeFile('User.sav','{"Save1":{"gscore":800}}');const statistics=g.readFile('User.sav');
 g.beginNewAdventure();assert.equal(g.roomStates.size,0);assert.equal(g.worldInitialized,false);assert.equal(g.cheats.invincible,false);assert.equal(g.readFile('User.sav'),statistics);
});
test('saving during a pending room change fails without creating a partial world',()=>{const g=make();g.pendingRoom=g.assets.room1;assert.throws(()=>g.captureWorld(),/transition/);});

function click(g,name){const s=obj(g,name);assert.ok(s,name);const b=g.bounds(s);g.input.mx=((b.left+b.right)/2-g.camera.x)/g.camera.w;g.input.my=((b.top+b.bottom)/2-g.camera.y)/g.camera.h;g.input.bpressed.add(1);g.input.buttons.add(1);g.step();g.input.buttons.clear();}
test('an open computer screen resumes with its controls and hidden weapon layer intact',()=>{
 const g=make();step(g,50);obj(g,'Object1').x=7280;step(g,2);g.applyCheat('weapons');click(g,'oSign');click(g,'oButton3rd');
 const copy=make();copy.applyWorld(encodeWorld(g.captureWorld(),data).text);assert.ok(obj(copy,'oshoppingstocks'));assert.equal(copy.global.hascontrol,0);assert.equal(copy.layerVisible(obj(copy,'oGun').layer),false);
 click(copy,'oButtonOff');assert.equal(copy.global.hascontrol,1);assert.equal(copy.layerVisible(obj(copy,'oGun').layer),true);assert.equal(obj(copy,'oshoppingstocks'),undefined);assert.equal(copy.errors.length,0);
});
test('a world saved during a petrol shift restores customers and pays only after completing it',()=>{
 const g=make();step(g,50);const p=obj(g,'Object1');g.global.kills=900;g.applyCheat('weapons');
 const sign=obj(g,'oJobSign');p.x=sign.x-50;p.y=sign.y;step(g,2);click(g,'oJobSign');click(g,'ojobbutton1');const door=obj(g,'oPetrolstationDoor');p.x=door.x-60;p.y=door.y;step(g,2);click(g,'oPetrolstationDoor');step(g,120);
 const copy=make();copy.applyWorld(encodeWorld(g.captureWorld(),data).text);assert.ok(obj(copy,'oQuestObjectives3'));assert.equal(copy.global.quest3,0);assert.equal(copy.global.kills,900);
 for(let t=0;t<1800&&copy.global.quest3!==1;t++){const crate=['oCrate','oCrate2','oCrate3'].map(n=>obj(copy,n)).find(Boolean);if(crate){const player=obj(copy,'Object1');player.x=crate.x-40;player.y=crate.y-30;copy.input.pressed.add(69);}copy.step();}
 assert.equal(copy.global.quest3,1);assert.equal(copy.global.kills,1200);step(copy,200);assert.equal(copy.global.kills,1200);assert.equal(copy.resolve(copy.assets.oNepalguytext).length,1);assert.equal(copy.errors.length,0);
});
test('active cheat toggles and resource gifts round-trip and reset only on a new adventure',()=>{
 const g=make();g.setCheat('invincible',true);g.setCheat('infiniteAmmo',true);g.setCheat('infiniteSlowmo',true);g.applyCheat('money');g.applyCheat('ammo');
 const copy=make();copy.applyWorld(encodeWorld(g.captureWorld(),data).text);assert.deepEqual(copy.cheats,g.cheats);assert.equal(copy.global.kills,g.global.kills);assert.equal(copy.global.ammo,g.global.ammo);
 copy.beginNewAdventure();assert.deepEqual(copy.cheats,{invincible:false,infiniteAmmo:false,infiniteSlowmo:false});
});
test('malformed physics and statistics cannot poison the current world through a save import',()=>{
 const g=make(),saved=g.captureWorld(),before=shape(g);
 const changes=[
  w=>delete w.rooms.room26.instances[0].gravity_direction,
  w=>w.rooms.room26.instances[0].friction='bad',
  w=>w.rooms.room26.instances[0].depth=null,
  w=>w.rooms.room26.instances[0].image_blend='white',
  w=>w.rooms.room26.instances[0].layer=.5,
  w=>w.rooms.room26.instances.find(s=>s.object_index===g.assets.Object1).hsp='bad',
  w=>w.global.kills='bad',w=>w.global.slowmo={},
  w=>w.rooms.room26.locals.customer1spd='bad',
  w=>w.rooms.room26.locals.php=-50,
  w=>w.rooms.room26.locals.hascontrol='bad'
 ];
 for(const change of changes){const broken=structuredClone(saved);change(broken);assert.throws(()=>g.applyWorld(broken));assert.deepEqual(shape(g),before);}
});
test('a synchronous IndexedDB failure aborts queued writes so slot contents and metadata stay together',async()=>{
 const values={worlds:new Map([[1,'original']]),metadata:new Map([[1,{name:'original'}]])};let aborted=0;
 const db={transaction(){const queued=[],tx={cancelled:false,abort(){this.cancelled=true;aborted++;},objectStore(name){return {put(value,key){if(name==='metadata')throw new Error('Could not clone metadata');queued.push(()=>values[name].set(key,value));}};}};queueMicrotask(()=>{if(tx.cancelled)tx.onabort?.();else{for(const write of queued)write();tx.oncomplete?.();}});return tx;}};
 const storage=new BrowserWorldStorage({open(){const request={};queueMicrotask(()=>{request.result=db;request.onsuccess();});return request;}});
 await assert.rejects(storage.write(1,'replacement',{name:'replacement'}),/clone metadata/);await Promise.resolve();
 assert.equal(aborted,1);assert.equal(values.worlds.get(1),'original');assert.deepEqual(values.metadata.get(1),{name:'original'});
});
