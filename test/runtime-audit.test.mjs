import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine,gmlBoolean} from '../dist/engine.js';
import {FACE_LAYOUTS} from '../dist/easter-egg.js';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const make=(room='room26')=>{const g=new Engine(data,null,null,{seed:12345});g.audioEnabled=false;g.loadRoom(room,false);return g;};
const obj=(g,name)=>g.first(g.assets[name]);
const step=(g,n=1)=>{for(let i=0;i<n;i++)g.step();};

test('primary fire still works when only the launcher is owned, without granting a gun or duplicate controllers',()=>{
 const g=make();step(g,40);const p=obj(g,'Object1');g.runEvent(p,4,g.assets.ogrenadepickup,obj(g,'ogrenadepickup'));g.input.mx=.8;g.input.my=.1;
 assert.equal(gmlBoolean(g.global.weapon1),false);
 const grenades=g.global.bullets;
 for(let i=0;i<2;i++){g.input.buttons.add(1);g.input.bpressed.add(1);g.step();g.input.buttons.clear();step(g,5);assert.ok(obj(g,'oGun59'));assert.equal(obj(g,'oGun'),undefined);}
 assert.equal(g.global.bullets,grenades-2);assert.equal(g.resolve(g.assets.oGun59).length,1);assert.equal(g.errors.length,0);
});
test('projectiles leaving the original map are removed from instances and indexes',()=>{
 const g=make('room1');const before=g.instances.length;
 for(const name of ['oBullet','oBulletBomb','eEbullet']){const s=g.create(g.assets[name],g.room.info.Width+500,200,'bullets');s.spd=0;}
 g.step();for(const name of ['oBullet','oBulletBomb','eEbullet'])assert.equal(g.resolve(g.assets[name]).length,0);
 assert.ok(g.instances.length<before+10);assert.equal(g.errors.length,0);
});
test('static collision indexes reflect creation, destruction, and GML object changes',()=>{
 const g=make('room1'),wall=g.create(g.assets.wall,6000,10,'floor'),probe=g.create(g.assets.oBullet,6008,18,'bullets');probe.spd=0;
 assert.equal(g.place(probe,probe.x,probe.y,g.assets.wall).id,wall.id);g.destroy(wall);assert.equal(g.place(probe,probe.x,probe.y,g.assets.wall),null);
 const door=g.create(g.assets.oDoor,7000,100,'floor');g.change(door,g.assets.oDoorOpen,true);assert.equal(g.resolve(g.assets.oDoor).some(s=>s.id===door.id),false);assert.equal(obj(g,'oDoorOpen').id,door.id);assert.equal(g.byId.get(door.id),door);
});
test('reused collision bounds still follow position, scale, rotation, masks, and hypothetical probes',()=>{
 const g=make('room1'),wall=g.create(g.assets.wall,6000,100,'floor'),first=g.bounds(wall);
 wall.x+=100;wall.y+=60;const moved=g.bounds(wall);assert.equal(moved.left-first.left,100);assert.equal(moved.top-first.top,60);
 wall.image_xscale=2;const scaled=g.bounds(wall);assert.equal(scaled.right-scaled.left,2*(first.right-first.left));
 wall.image_angle=90;const rotated=g.bounds(wall);assert.ok(Math.abs((rotated.bottom-rotated.top)-(scaled.right-scaled.left))<1e-9);
 wall.mask_index=obj(g,'Object1').mask_index;const masked=g.bounds(wall);assert.notEqual(masked.bottom-masked.top,rotated.bottom-rotated.top);
 const probe=g.bounds(wall,wall.x+500,wall.y+500);assert.equal(probe.left-masked.left,500);assert.deepEqual(g.bounds(wall),masked);
});
test('explicit collision masks rotate and negative animation frames keep valid precise masks',()=>{
 const g=make('room1'),enemy=obj(g,'oEnemy'),a=g.bounds(enemy);enemy.image_angle=90;const b=g.bounds(enemy);
 assert.ok(Math.abs((b.right-b.left)-(a.bottom-a.top))<1e-6);assert.ok(Math.abs((b.bottom-b.top)-(a.right-a.left))<1e-6);
 const home=make(),car=obj(home,'oCar');car.image_index=-.5;const bounds=home.bounds(car);assert.doesNotThrow(()=>home.maskContains(bounds,(bounds.left+bounds.right)/2,(bounds.top+bounds.bottom)/2));
});
test('income indicators are bounded and do not reset earnings in the current room',()=>{
 const g=make();g.global.killsthisroom=12.34;
 for(let n=0;n<30;n++){g.create(g.assets.oBulletsLeftGreen,0,0,'floor');g.global.killsgreen+=2;}
 assert.equal(g.resolve(g.assets.oBulletsLeftGreen).length,1);assert.equal(g.global.killsthisroom,12.34);assert.equal(g.global.killsgreen,60);
 g.global.greentimer=-6;g.runEvent(obj(g,'oBulletsLeftGreen'),8,64);assert.equal(obj(g,'oBulletsLeftGreen'),undefined);
});
test('malformed original statistics are tolerated and empty or fractional inventories load safely',()=>{
 const g=make();g.global.kills=420;g.writeFile('User.sav','{broken');g.input.pressed.add(76);g.step();assert.equal(g.global.kills,420);assert.equal(g.errors.length,0);
 g.writeFile('User.sav',JSON.stringify({Save1:{gscore:'bad',gammo:-2,ggrenades:1.9,gphp:0,gtapes:2.9}}));g.input.pressed.add(76);g.step();assert.equal(g.global.kills,420);assert.equal(g.global.ammo,0);assert.equal(g.global.bullets,1);assert.equal(g.global.tapes,2);assert.equal(g.global.php,1);assert.equal(g.errors.length,0);
});
test('cheats prevent damage and preserve zero ammunition while firing both weapons',()=>{
 const g=make('room1');step(g,30);g.setCheat('invincible',true);const p=obj(g,'Object1'),health=g.global.php,money=g.global.kills;
 const shot=g.create(g.assets.eEbullet,p.x,p.y,'bullets');g.runEvent(p,4,g.assets.eEbullet,shot);assert.equal(g.global.php,health);assert.equal(g.global.kills,money);assert.equal(obj(g,'oPDead'),undefined);
 g.applyCheat('weapons');g.setCheat('infiniteAmmo',true);g.global.ammo=0;g.global.bullets=0;g.input.mx=.8;g.input.my=.1;g.input.buttons.add(1);g.input.bpressed.add(1);step(g,6);assert.ok(obj(g,'oBullet'));assert.equal(g.global.ammo,0);
 g.input.buttons.clear();g.input.pressed.add(70);g.input.keys.add(70);step(g,6);g.input.keys.clear();assert.ok(obj(g,'oBulletBomb'));assert.equal(g.global.bullets,0);assert.ok(obj(g,'oGun59'));
 g.input.buttons.clear();g.global.slowmo=0;g.setCheat('infiniteSlowmo',true);g.input.buttons.add(2);g.step();assert.equal(g.fps,30);assert.equal(g.global.slowmo,0);g.input.buttons.clear();g.step();assert.equal(g.fps,60);
 g.applyCheat('ammo');g.applyCheat('grenades');g.applyCheat('money');g.applyCheat('slowmo');assert.equal(g.global.ammo,1000);assert.equal(g.global.bullets,50);assert.equal(g.global.kills,money+1000);assert.equal(g.global.slowmo,100);assert.equal(g.errors.length,0);
});
test('one enemy bullet costs one heart and sustained enemy contact retains the original per-frame damage',()=>{
 const g=make();step(g,40);const p=obj(g,'Object1');p.grv=0;p.vsp=0;g.global.php=8;
 const shot=g.create(g.assets.eEbullet,p.x,p.y,'bullets');shot.spd=0;g.step();assert.equal(g.global.php,7);assert.equal(shot.dead,true);g.step();assert.equal(g.global.php,7);
 for(const name of ['oEnemy','oEnemyBig']){
  const enemy=g.create(g.assets[name],p.x,p.y,'player');enemy.grv=0;enemy.hsp=0;enemy.vsp=0;
  g.global.php=8;step(g,3);assert.equal(g.global.php,5);g.destroy(enemy);
 }
 assert.equal(g.errors.length,0);
});
test('extreme launch falls and upward impulses cannot tunnel through a thin platform',()=>{
 for(const velocity of [1000,-1000]){
  const g=make(),p=obj(g,'Object1'),wall=g.create(g.assets.wall,30000,1000,'floor');p.x=30020;p.grv=0;p.image_xscale=1;p.image_angle=0;
  const w=g.bounds(wall),offset=g.bounds(p);p.y=velocity>0?w.top-400-(offset.bottom-p.y):w.bottom+400-(offset.top-p.y);p.vsp=velocity;
  g.runEvent(p,3,0);assert.equal(p.vsp,0);assert.equal(g.place(p,p.x,p.y,g.assets.wall),null);
  const b=g.bounds(p);assert.equal(velocity>0?b.bottom:b.top,velocity>0?w.top:w.bottom);assert.equal(g.errors.length,0);
 }
});
test('a living player who falls below all terrain dies once and keeps quest and inventory progress',()=>{
 for(const room of ['room26','room1','room3','petrolstationroom']){
  const g=make(room);g.setCheat('invincible',true);step(g,60);g.global.kills=725;g.global.stocks=120;g.global.acceptedquest=true;g.applyCheat('weapons');
  const p=obj(g,'Object1'),stats=[g.global.ammo,g.global.stocks,g.global.acceptedquest];
  let recovered=0;g.onFallRecovery=()=>recovered++;p.x=-200;p.y=6000;p.vsp=400;g.step();
  const body=obj(g,'oPDead');assert.ok(body);assert.equal(body.x,-200);assert.equal(body.y,6000);assert.equal(body.done,1);assert.equal(body.vsp,0);
  assert.deepEqual([g.global.ammo,g.global.stocks,g.global.acceptedquest],stats);assert.equal(g.global.php,0);assert.equal(g.global.kills,525);assert.equal(g.room.info.Name,room);assert.equal(obj(g,'oGun'),undefined);
  step(g,10);assert.equal(recovered,1);assert.equal(g.errors.length,0);
 }
 const g=make('room1');step(g,40);const p=obj(g,'Object1');p.x=3600;p.y=800;p.vsp=10;let recovered=0;g.onFallRecovery=()=>recovered++;
 step(g,80);assert.equal(recovered,1);assert.equal(obj(g,'oPDead').done,1);assert.equal(g.cheats.invincible,false);assert.equal(g.errors.length,0);
});
test('a fallen death body becomes revivable once with the original death penalty',()=>{
 for(const room of ['room26','room1','room3','petrolstationroom']){
  const g=make(room);g.setCheat('invincible',true);step(g,60);g.applyCheat('weapons');g.global.kills=700;g.setCheat('invincible',false);const p=obj(g,'Object1');
  g.global.php=1;g.runEvent(p,4,g.assets.eEbullet,g.create(g.assets.eEbullet,p.x,p.y,'bullets'));const body=obj(g,'oPDead');assert.ok(body);const money=g.global.kills;
  body.x=-400;body.y=6000;body.vsp=400;let recovered=0;g.onFallRecovery=()=>recovered++;g.step();
  assert.equal(body.done,1);assert.equal(body.vsp,0);assert.equal(g.global.php,0);assert.equal(g.global.hascontrol,0);assert.equal(g.global.kills,money);
  step(g,5);assert.equal(recovered,1);assert.ok(g.resolve(g.assets.oDanielText6).length<=1);g.input.pressed.add(32);g.step();
  assert.equal(obj(g,'oPDead'),undefined);assert.equal(g.global.hascontrol,1);assert.equal(g.global.php,8);assert.equal(g.global.kills,money);assert.equal(g.resolve(g.assets.oGun).length,1);assert.equal(g.errors.length,0);
 }
});
test('void death accepts old saves without a safe point and resumes mid-fall saves deterministically',()=>{
 const g=make('room1');step(g,40);const p=obj(g,'Object1');p.x=3600;p.y=900;p.vsp=10;const snapshot=g.captureWorld();
 const restored=new Engine(data,null,null,{seed:12345});restored.audioEnabled=false;restored.applyWorld(snapshot);step(g,90);step(restored,90);
 const a=g.captureWorld(),b=restored.captureWorld();delete a.savedAt;delete b.savedAt;assert.deepEqual(a,b);
 const legacy=structuredClone(snapshot),old=legacy.rooms.room1.instances.find(s=>s.object_index===g.assets.Object1);delete old.fallSafeX;delete old.fallSafeY;old.x=-500;old.y=6000;old.vsp=200;
 restored.applyWorld(legacy);restored.step();const body=obj(restored,'oPDead');assert.equal(body.x,-500);assert.equal(body.y,6000);assert.equal(body.done,1);assert.equal(body.vsp,0);restored.input.pressed.add(32);restored.step();assert.equal(obj(restored,'oPDead'),undefined);assert.equal(obj(restored,'Object1').x,96);assert.equal(restored.errors.length,0);
});
test('the fall guard leaves high launches, below-height terrain, sleep, and room transitions intact',()=>{
 const g=make();step(g,40);const p=obj(g,'Object1');let recovered=0;g.onFallRecovery=()=>recovered++;
 p.x=7200;p.y=-6000;p.vsp=-100;g.step();assert.ok(p.y<-6000);assert.equal(recovered,0);
 p.x=20150;p.y=4000;p.vsp=10;step(g,100);assert.ok(p.y>g.room.info.Height);assert.ok(g.place(p,p.x,p.y+1,g.assets.wall));assert.equal(recovered,0);
 g.global.hascontrol=0;p.x=-300;p.y=6000;p.vsp=10;g.guardMapFall();assert.equal(p.y,6000);assert.equal(recovered,0);
 g.global.hascontrol=1;g.pendingRoom=g.assets.room1;g.guardMapFall();assert.equal(p.y,6000);assert.equal(recovered,0);g.step();assert.equal(g.room.info.Name,'room1');assert.equal(recovered,0);assert.equal(g.errors.length,0);
});
test('an embedded player recovers from adjoining stair tiles and can walk again',()=>{
 const g=make(),p=obj(g,'Object1');p.x=11100;p.y=2140;p.vsp=0;
 assert.ok(g.place(p,p.x,p.y,g.assets.wall));for(let n=0;n<16&&g.place(p,p.x,p.y,g.assets.wall);n++)g.step();assert.equal(g.place(p,p.x,p.y,g.assets.wall),null);assert.equal(g.global.hascontrol,true);
 const x=p.x;g.input.keys.add(65);step(g,5);assert.ok(p.x<x);assert.equal(g.errors.length,0);
});
test('opening a world dialog during a launch stops the camera from leaving its choices',()=>{
 const g=make();step(g,40);const p=obj(g,'Object1'),sign=obj(g,'oJobSign');p.x=sign.x-50;p.y=sign.y;p.vsp=0;step(g,2);p.vsp=-20;click(g,'oJobSign');
 assert.ok(obj(g,'ojobmenu'));assert.equal(g.global.hascontrol,0);p.vsp=-300;const position=[p.x,p.y];step(g,60);assert.deepEqual([p.x,p.y],position);
 const back=obj(g,'ojobbutton2'),b=g.bounds(back);assert.ok(b.right>g.camera.x&&b.left<g.camera.x+g.camera.w&&b.bottom>g.camera.y&&b.top<g.camera.y+g.camera.h);
 click(g,'ojobbutton2');assert.equal(g.global.hascontrol,1);assert.equal(obj(g,'ojobmenu'),undefined);assert.equal(g.errors.length,0);
});
test('native direction uses velocity and friction stops a pushed ladder',()=>{
 const g=make('room1'),ladder=g.create(g.assets.oLadder,9000,20,'floor');ladder.gravity=0;g.runEvent(ladder,4,g.assets.Object1,obj(g,'Object1'));
 assert.ok(Math.abs(Math.hypot(ladder.hspeed,ladder.vspeed)-20)<1e-9);assert.notEqual(ladder.vspeed,0);
 step(g,10);assert.ok(Math.hypot(ladder.hspeed,ladder.vspeed)<1e-9);assert.equal(g.errors.length,0);
});
function click(g,name){const s=obj(g,name),b=g.bounds(s);g.input.mx=((b.left+b.right)/2-g.camera.x)/g.camera.w;g.input.my=((b.top+b.bottom)/2-g.camera.y)/g.camera.h;g.input.bpressed.add(1);g.input.buttons.add(1);g.step();g.input.buttons.clear();}
test('shop prices match charges and successful purchases do not report insufficient funds',()=>{
 const g=make();step(g,50);obj(g,'Object1').x=7280;step(g,2);click(g,'oSign');click(g,'oButtonAmazon');
 g.global.kills=50;const grenades=g.global.bullets;click(g,'oButton1');assert.equal(g.global.kills,0);assert.equal(g.global.bullets,grenades+1);assert.equal(obj(g,'oDanielText2'),undefined);
 g.global.kills=99;const ammo=g.global.ammo;click(g,'oButton2');assert.equal(g.global.kills,99);assert.equal(g.global.ammo,ammo);g.destroy(g.assets.oDanielText2);
 g.global.kills=100;click(g,'oButton2');assert.equal(g.global.kills,0);assert.equal(g.global.ammo,ammo+100);assert.equal(obj(g,'oDanielText2'),undefined);
 g.global.kills=3000;click(g,'oButton3');assert.equal(g.global.quest2,1);assert.equal(g.global.kills,0);g.global.kills=3000;click(g,'oButton3');assert.equal(g.global.kills,3000);assert.equal(g.errors.length,0);
});
test('repeated fire over a long session keeps projectile counts bounded',()=>{
 const g=make('room1');g.setCheat('invincible',true);g.setCheat('infiniteAmmo',true);g.input.mx=.95;g.input.my=0;g.input.buttons.add(1);
 let max=0;for(let n=0;n<1500;n++){g.step();max=Math.max(max,g.resolve(g.assets.oBullet).length);}
 assert.ok(max<100);assert.ok(g.instances.length<800);assert.equal(g.errors.length,0);
});
test('returning to the original menu resets an archived off-screen selection',()=>{
 const g=make();step(g,40);g.loadRoom('rMenu');step(g,100);const old=obj(g,'oMenu');old.menu_x=1300;old.menu_committed=-1;old.menu_control=false;const archived=g.captureRoom(false);g.loadRoom('room26');
 // Also exercise snapshots created by older versions which archived presentation rooms.
 g.roomStates.set('rMenu',archived);
 g.loadRoom('rMenu');step(g,100);const menu=obj(g,'oMenu');assert.equal(menu.menu_control,true);assert.equal(menu.menu_cursor,2);assert.ok(menu.menu_x<g.gui.w);assert.equal(g.errors.length,0);
});
test('Quit pauses in the browser and Resume leaves the original menu usable',()=>{
 const g=make('rMenu');step(g,100);obj(g,'oMenu').menu_cursor=0;g.input.pressed.add(13);step(g,160);assert.equal(g.paused,true);assert.equal(obj(g,'oMenu').menu_control,true);assert.ok(obj(g,'oMenu').menu_x<g.gui.w);
 g.paused=false;g.input.pressed.add(40);g.step();assert.equal(obj(g,'oMenu').menu_cursor,2);assert.equal(g.errors.length,0);
});
test('E opens a nearby breakable door once and preserves unrelated closed doors',()=>{
 const g=make('room1');step(g,30);const p=obj(g,'Object1'),door=g.create(g.assets.oDoor2,p.x+40,p.y,'floor'),unrelated=g.create(g.assets.oDoor,p.x+2000,p.y,'floor');
 g.input.keys.add(69);g.input.pressed.add(69);g.step();assert.equal(g.byId.has(door.id),false);assert.equal(g.byId.has(unrelated.id),true);assert.equal(g.resolve(g.assets.oDoorOpen).length,1);step(g,20);assert.equal(g.resolve(g.assets.oDoorOpen).length,1);assert.equal(g.errors.length,0);
});
test('arena waves advance after their enemies die and release the exit doors',()=>{
 const g=make();step(g,30);g.setCheat('invincible',true);const spawner=obj(g,'oSpawner');assert.ok(spawner);const p=obj(g,'Object1');g.runEvent(spawner,4,g.assets.Object1,p);assert.equal(spawner.triggered,true);
 const existing=new Set(g.instances.map(s=>s.id));let count=0;
 for(let frame=0;frame<1800&&!spawner.dead;frame++){
  g.step();for(const enemy of [...g.resolve(g.assets.oEnemy),...g.resolve(g.assets.oEnemyBig)])if(!existing.has(enemy.id)){enemy.hp=0;count++;}
 }
 assert.ok(spawner.dead);assert.ok(count>0);for(const door of g.resolve(g.assets.oDoor))assert.equal(door.closed,false);assert.equal(g.errors.length,0);
});
test('menu renders star, rain, and grass scenery without the misplaced stretched character',()=>{
 const g=make('rMenu');step(g,100);const rendered=[];
 g.renderer.ctx=new Proxy({}, {get:()=>()=>{}});g.renderer.canvas={width:1366,height:768};g.renderer.sprite=(si,frame,x,y,sx=1,sy=1)=>rendered.push({si,sx,sy});g.renderer.text=()=>{};g.renderer.draw();
 assert.equal(rendered.some(s=>s.si===g.assets.chihiro),false);
 for(const name of ['mountains','raining','movinggras','grassMud'])assert.ok(rendered.some(s=>s.si===g.assets[name]),name+' scenery remains');
 assert.equal(rendered.filter(s=>s.si===g.assets.runningSprite73).length,4);assert.equal(obj(g,'oMenu').menu_control,true);assert.equal(g.errors.length,0);
});
function moonPoint(g){const moon=g.faceEgg.moonFrame();return [(moon.x-g.camera.x)/g.camera.w,(moon.y-g.camera.y)/g.camera.h];}
test('one moon click reveals the secret without selecting a menu item, with circular and room guards',()=>{
 const g=make('rMenu');step(g,100);g.faceEgg.moonImage={};assert.equal(g.faceEgg.moonFrame(),null);g.frame+=540;const point=moonPoint(g);
 assert.deepEqual(g.faceEgg.menuClick(...point),{handled:true,triggered:true});g.step();assert.equal(obj(g,'oMenu').menu_control,true);
 const moon=g.faceEgg.moonFrame(),current=moonPoint(g);assert.equal(g.faceEgg.menuClick(current[0]+(moon.r+1)/g.camera.w,current[1]).handled,false);
 g.paused=true;assert.equal(g.faceEgg.menuClick(...point).handled,false);g.paused=false;
 g.loadRoom('room26');assert.equal(g.faceEgg.menuClick(...point).handled,false);g.loadRoom('rMenu');assert.equal(g.faceEgg.moonFrame(),null);assert.equal(g.errors.length,0);
});
test('secret face persists across new adventures and reloads while leaving full world state and collisions unchanged',async()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},g=new Engine(data,null,storage,{seed:12345});g.loadRoom('room26',false);step(g,40);
 const before=g.captureWorld(),bounds=g.bounds(obj(g,'Object1'));g.renderer.canvas={style:{imageRendering:'pixelated'}};let loads=0;g.faceEgg.load=async()=>{loads++;g.faceEgg.image={};};
 const results=await Promise.all([g.faceEgg.toggle(),g.faceEgg.toggle()]);assert.deepEqual(results,[true,null]);assert.equal(loads,1);
 const after=g.captureWorld();delete before.savedAt;delete after.savedAt;assert.deepEqual(after,before);assert.deepEqual(g.bounds(obj(g,'Object1')),bounds);assert.equal(g.renderer.canvas.style.imageRendering,'auto');
 g.beginNewAdventure();assert.equal(g.faceEgg.enabled,true);const restored=new Engine(data,null,storage);assert.equal(restored.faceEgg.enabled,true);
 await g.faceEgg.toggle();assert.equal(g.faceEgg.enabled,false);assert.equal(new Engine(data,null,storage).faceEgg.enabled,false);assert.equal(g.renderer.canvas.style.imageRendering,'pixelated');
 g.storage={setItem(){throw new Error('Full');}};await g.faceEgg.toggle();assert.equal(g.faceEgg.enabled,true);assert.equal(g.faceEgg.saved,false);
});
test('renderer replaces Daniel and all four menu faces without changing other characters',()=>{
 const g=make();g.faceEgg.enabled=true;g.faceEgg.image={};const replaced=[];g.faceEgg.draw=(ctx,face)=>replaced.push(face);
 g.renderer.ctx=new Proxy({}, {get:(o,k)=>o[k]??(()=>{})});g.renderer.images=Array.from({length:7},()=>({}));g.renderer.canvas={width:1366,height:768};g.renderer.text=()=>{};
 const p=obj(g,'Object1');g.renderer.self(p);assert.equal(replaced.length,1);g.renderer.self({...p,object_index:g.assets.oMum});assert.equal(replaced.length,1);
 g.loadRoom('rMenu');step(g,100);replaced.length=0;g.renderer.draw();assert.equal(replaced.length,4);
 for(const [name,frames] of Object.entries(FACE_LAYOUTS)){assert.equal(frames.length,g.sprites[g.assets[name]].textures.length);for(let n=0;n<frames.length;n++)assert.ok(g.faceEgg.layout(name,n));assert.ok(g.faceEgg.layout(name,-1));}
 assert.equal(g.errors.length,0);
});
test('realistic heads use smooth photographic sampling and preserve the canvas drawing state',()=>{
 const g=make();g.faceEgg.enabled=true;g.faceEgg.image={};const calls=[],states=[];
 const ctx={imageSmoothingEnabled:false,imageSmoothingQuality:'low',save(){states.push([this.imageSmoothingEnabled,this.imageSmoothingQuality]);},restore(){[this.imageSmoothingEnabled,this.imageSmoothingQuality]=states.pop();},translate(){},rotate(){},drawImage(...args){calls.push({smooth:this.imageSmoothingEnabled,quality:this.imageSmoothingQuality,args});}};
 for(const layout of [...FACE_LAYOUTS.danielJump,...FACE_LAYOUTS.playerDead])g.faceEgg.draw(ctx,layout,64,64);
 assert.equal(calls.length,4);for(const call of calls){assert.equal(call.smooth,true);assert.equal(call.quality,'high');assert.deepEqual(call.args.slice(1,5),[173,12,931,1257]);}
 assert.equal(ctx.imageSmoothingEnabled,false);assert.equal(ctx.imageSmoothingQuality,'low');
});
test('companion-spawned miniature characters share the face mode at their original size and facing',()=>{
 const g=make();step(g,40);const p=obj(g,'Object1'),girl=obj(g,'oGirl16364');
 p.x=girl.x-67;p.y=girl.y;p.vsp=0;g.input.pressed.add(81);g.step();
 const baby=obj(g,'oDanielbaby');assert.ok(baby);assert.ok(baby.size>=.3&&baby.size<=.7);
 const calls=[],scales=[];
 g.renderer.ctx=new Proxy({scale:(x,y)=>scales.push([x,y])},{get:(o,k)=>o[k]??(()=>{})});g.renderer.images=Array.from({length:7},()=>({}));
 g.faceEgg.image={};g.faceEgg.draw=(ctx,face)=>calls.push(face);
 for(const enabled of [false,true,false]){
  g.faceEgg.enabled=enabled;calls.length=0;
  for(const name of ['daniel','runningSprite','danielJump'])for(const facing of [-1,1]){
   baby.sprite_index=g.assets[name];baby.image_index=0;baby.image_xscale=facing*baby.size;baby.image_yscale=baby.size;
   const bounds=g.bounds(baby);g.renderer.self(baby);assert.deepEqual(g.bounds(baby),bounds);assert.deepEqual(scales.at(-1),[facing*baby.size,baby.size]);
  }
  assert.equal(calls.length,enabled?6:0);
  if(enabled)for(const face of calls)assert.equal(face.y+face.h/2,face.cut[1]+face.cut[3]+4);
 }
 g.faceEgg.enabled=true;g.renderer.self(girl);assert.equal(calls.length,0);assert.equal(g.errors.length,0);
});
test('the moon stays within the menu while faces are active and clicking it deactivates before its next visit',async()=>{
 const g=make('rMenu');g.faceEgg.moonImage={};g.faceEgg.load=async()=>{g.faceEgg.image={};};g.faceEgg.moonFrame();g.frame=540;
 assert.equal(g.faceEgg.menuClick(...moonPoint(g)).triggered,true);await g.faceEgg.toggle();const pinned=g.faceEgg.moonFrame();
 for(const frame of [900,4000,40000]){g.frame=frame;assert.deepEqual(g.faceEgg.moonFrame(),pinned);assert.ok(pinned.x-pinned.r>g.camera.x&&pinned.x+pinned.r<g.camera.x+g.camera.w);}
 assert.equal(g.faceEgg.menuClick(...moonPoint(g)).triggered,true);await g.faceEgg.toggle();assert.equal(g.faceEgg.enabled,false);assert.equal(g.faceEgg.moonFrame().pinned,false);
 g.frame+=180;assert.equal(g.faceEgg.moonFrame(),null);g.frame=g.faceEgg.flightStart+360;assert.equal(g.faceEgg.moonFrame().pinned,false);assert.equal(g.faceEgg.menuClick(...moonPoint(g)).triggered,true);
});
test('standing, running, jumping, and miniature necks overlap the original collar instead of floating above it',()=>{
 for(const [name,frames] of Object.entries(FACE_LAYOUTS))if(name!=='playerDead')for(const face of frames)assert.equal(face.y+face.h/2,face.cut[1]+face.cut[3]+4,name+' neck reaches into the collar');
});

function mockAudio(t,play){
 const original=globalThis.Audio,created=[];
 globalThis.Audio=class {
  constructor(src){this.src=src;this.paused=true;this.currentTime=0;this.plays=0;this.pauses=0;created.push(this);}
  play(){this.plays++;this.paused=false;return play?play(this):Promise.resolve();}
  pause(){this.pauses++;this.paused=true;}
 };
 t.after(()=>{if(original===undefined)delete globalThis.Audio;else globalThis.Audio=original;});return created;
}
const settleAudio=async()=>{await Promise.resolve();await Promise.resolve();await Promise.resolve();};
test('the supplied menu clip loads once only for active faces, respects pause and mute, and stops on deactivation or leaving',async t=>{
 const created=mockAudio(t),g=make();g.faceEgg.setEnabled(true);g.audioEnabled=true;g.faceEgg.syncAudio();assert.equal(created.length,0);
 g.audioEnabled=false;g.loadRoom('rMenu');step(g,200);assert.equal(created.length,0);
 g.audioEnabled=true;g.faceEgg.syncAudio(true);await settleAudio();const music=g.faceEgg.music;
 assert.equal(music.src,'assets/easter-egg-menu.mp3');assert.equal(music.loop,true);assert.equal(music.preload,'none');assert.equal(music.paused,false);
 step(g,600);assert.equal(music.plays,1);music.currentTime=12;
 g.paused=true;g.audioStop();g.faceEgg.syncAudio();assert.equal(music.paused,true);assert.equal(music.currentTime,12);
 g.paused=false;g.faceEgg.syncAudio(true);await settleAudio();assert.equal(music.paused,false);assert.equal(music.currentTime,12);
 g.audioEnabled=false;g.audioStop();step(g,3);assert.equal(music.paused,true);assert.equal(music.currentTime,12);
 g.audioEnabled=true;g.faceEgg.syncAudio(true);await settleAudio();assert.equal(music.paused,false);
 g.loadRoom('room26');assert.equal(music.paused,true);assert.equal(music.currentTime,0);step(g,3);assert.equal(music.paused,true);
 g.loadRoom('rMenu');g.step();await settleAudio();assert.equal(g.faceEgg.music,music);assert.equal(music.paused,false);music.currentTime=5;
 g.faceEgg.setEnabled(false);assert.equal(music.paused,true);assert.equal(music.currentTime,0);step(g,3);assert.equal(music.paused,true);
 assert.equal(created.filter(a=>a.src==='assets/easter-egg-menu.mp3').length,1);assert.equal(g.errors.length,0);
});
test('blocked menu playback waits for a user retry instead of creating a play request every frame',async t=>{
 let rejected=false;mockAudio(t,a=>{if(!rejected){rejected=true;a.paused=true;return Promise.reject(new Error('Autoplay blocked'));}return Promise.resolve();});
 const g=make('rMenu');g.faceEgg.setEnabled(true);g.audioEnabled=true;g.step();await settleAudio();const music=g.faceEgg.music;
 assert.equal(g.faceEgg.musicBlocked,true);step(g,600);assert.equal(music.plays,1);
 g.faceEgg.syncAudio(true);await settleAudio();assert.equal(music.plays,2);assert.equal(music.paused,false);assert.equal(g.faceEgg.musicBlocked,false);assert.equal(g.errors.length,0);
});
test('rapid pause and resume ignores an obsolete play rejection and muting cancels pending playback',async t=>{
 const pending=[];mockAudio(t,()=>new Promise((resolve,reject)=>pending.push({resolve,reject})));
 const g=make('rMenu');g.faceEgg.setEnabled(true);g.audioEnabled=true;g.faceEgg.syncAudio(true);const music=g.faceEgg.music;
 g.paused=true;g.audioStop();g.paused=false;g.faceEgg.syncAudio(true);assert.equal(music.plays,2);
 pending[0].reject(new Error('Playback interrupted'));await settleAudio();assert.equal(g.faceEgg.musicBlocked,false);assert.equal(music.paused,false);
 g.audioEnabled=false;g.audioStop();pending[1].resolve();await settleAudio();step(g,30);assert.equal(music.paused,true);assert.equal(music.plays,2);
 g.audioEnabled=true;g.faceEgg.syncAudio(true);pending[2].resolve();await settleAudio();assert.equal(music.paused,false);assert.equal(music.plays,3);assert.equal(g.errors.length,0);
});
test('GameMaker numeric boolean conversion treats noone, negatives, and numbers up to one half as false',()=>{
 for(const value of [false,0,-4,-1,.1,.5])assert.equal(gmlBoolean(value),false);
 for(const value of [true,.500001,1,100000])assert.equal(gmlBoolean(value),true);
});
test('enemy guns fire through a clear line of sight and stop firing when a wall blocks the line',()=>{
 const g=make('room1'),p=obj(g,'Object1');p.x=6000;p.y=-5000;
 const enemy=g.create(g.assets.oEnemy,p.x+300,p.y,'floor'),gun=g.create(g.assets.oEgun,enemy.x,enemy.y,'Gun');gun.owner=enemy.id;gun.countdown=1;
 g.runEvent(gun,3,1);assert.equal(g.resolve(g.assets.eEbullet).length,1);
 const barrier=g.create(g.assets.wall,p.x+150,p.y+5,'floor');gun.countdown=1;g.runEvent(gun,3,1);assert.equal(g.resolve(g.assets.eEbullet).length,1);
 g.destroy(barrier);gun.countdown=1;g.runEvent(gun,3,1);assert.equal(g.resolve(g.assets.eEbullet).length,2);assert.equal(g.errors.length,0);
});
test('indexed firing guards still suppress shots over visible interactions and release hidden or removed targets',()=>{
 const g=make(),bed=obj(g,'oBedSleep'),b=g.bounds(bed);g.input.mx=((b.left+b.right)/2-g.camera.x)/g.camera.w;g.input.my=((b.top+b.bottom)/2-g.camera.y)/g.camera.h;
 g.updateFireEligibility();assert.equal(g.global.dontshoot,false);
 bed.visible=false;g.updateFireEligibility();assert.equal(g.global.dontshoot,true);
 bed.visible=true;g.getLayer(bed.layer).info.IsVisible=false;g.updateFireEligibility();assert.equal(g.global.dontshoot,true);
 g.getLayer(bed.layer).info.IsVisible=true;g.destroy(bed);g.updateFireEligibility();assert.equal(g.global.dontshoot,true);
});
