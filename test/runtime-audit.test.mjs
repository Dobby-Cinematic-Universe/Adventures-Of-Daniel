import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const make=(room='room26')=>{const g=new Engine(data,null,null,{seed:12345});g.audioEnabled=false;g.loadRoom(room,false);return g;};
const obj=(g,name)=>g.first(g.assets[name]);
const step=(g,n=1)=>{for(let i=0;i<n;i++)g.step();};

test('actual mouse clicks fire consecutive grenades without switching away or creating duplicate guns',()=>{
 const g=make();step(g,40);const p=obj(g,'Object1');g.runEvent(obj(g,'oGunPickup'),4,g.assets.Object1,p);g.runEvent(p,4,g.assets.ogrenadepickup,obj(g,'ogrenadepickup'));g.input.mx=.8;g.input.my=.1;
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
 g.input.buttons.clear();g.input.pressed.add(70);g.step();g.input.buttons.add(1);g.input.bpressed.add(1);step(g,6);assert.ok(obj(g,'oBulletBomb'));assert.equal(g.global.bullets,0);assert.ok(obj(g,'oGun59'));
 g.input.buttons.clear();g.global.slowmo=0;g.setCheat('infiniteSlowmo',true);g.input.buttons.add(2);g.step();assert.equal(g.fps,30);assert.equal(g.global.slowmo,0);g.input.buttons.clear();g.step();assert.equal(g.fps,60);
 g.applyCheat('ammo');g.applyCheat('grenades');g.applyCheat('money');g.applyCheat('slowmo');assert.equal(g.global.ammo,1000);assert.equal(g.global.bullets,50);assert.equal(g.global.kills,money+1000);assert.equal(g.global.slowmo,100);assert.equal(g.errors.length,0);
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
