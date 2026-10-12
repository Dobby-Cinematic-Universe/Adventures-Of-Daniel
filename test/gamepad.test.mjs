import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';
import {BindingProfile,InputRouter,gameContext} from '../dist/bindings.js';
import {GamepadInput,readGamepadMode,stickVector} from '../dist/gamepad.js';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const step=(g,n=1)=>{for(let i=0;i<n;i++)g.step();};
function make(room='room26'){
 const g=new Engine(data,null,null,{seed:12345});g.audioEnabled=false;g.loadRoom(room,false);step(g,40);
 const profile=new BindingProfile(),router=new InputRouter(profile,()=>g.input,()=>gameContext(g));
 const pad=new GamepadInput({router,getGame:()=>g});pad.tick(1);return {g,profile,router,pad};
}
const vector=(x,y=0)=>({x,y,radius:30});
test('stick coordinates normalize diagonals, respect the center, and reject nonfinite input',()=>{
 const rect={left:20,top:40,width:100,height:100};assert.deepEqual(stickVector(rect,70,90),{x:0,y:0,radius:32});
 const v=stickVector(rect,500,500);assert.ok(Math.abs(Math.hypot(v.x,v.y)-1)<1e-9);
 assert.equal(stickVector(rect,NaN,0).x,0);
});
test('gamepad preferences default safely when absent, malformed, or unavailable',()=>{
 for(const value of [null,'garbage','{}'])assert.equal(readGamepadMode({getItem:()=>value}),'auto');
 for(const value of ['auto','show','hide'])assert.equal(readGamepadMode({getItem:()=>value}),value);
 assert.equal(readGamepadMode({getItem(){throw Error('Unavailable');}}),'auto');
});
test('movement uses a dead zone and works independently of keyboard rebinding',()=>{
 const {g,profile,pad}=make(),p=g.first(g.assets.Object1),x=p.x;profile.bind('right',0,'KeyX');profile.bind('right',1,'');
 assert.equal(pad.startStick('move',1,vector(.1)),true);step(g,3);assert.equal(p.x,x);
 pad.moveStick('move',1,vector(1));step(g,5);assert.equal(p.x,x+20);
 pad.moveStick('move',1,vector(-1));step(g,5);assert.equal(p.x,x);pad.release(1);assert.equal(g.input.keys.size,0);
});
test('two fingers can move and jump together without releasing keyboard or each other',()=>{
 const {g,router,pad}=make();router.down('KeyD');pad.startStick('move',1,vector(1));assert.equal(pad.pressButton('jump',2),true);
 assert.ok(g.input.keys.has(68));assert.ok(g.input.pressed.has(32));g.step();assert.equal(g.first(g.assets.Object1).jumps,1);
 pad.release(2);assert.ok(g.input.keys.has(68));assert.equal(g.input.keys.has(32),false);
 pad.release(1);assert.ok(g.input.keys.has(68));router.up('KeyD');assert.equal(g.input.keys.size,0);
});
test('aim stays relative to the player as the camera follows, and either firing finger keeps firing',()=>{
 const {g,pad}=make('room1');pad.startStick('move',1,vector(1));pad.startStick('aim',2,vector(0,-1));pad.pressButton('fire',3);
 for(let n=0;n<10;n++){pad.updateAim();g.step();}
 const p=g.first(g.assets.Object1);pad.updateAim();assert.ok(Math.abs(g.camera.x+g.input.mx*g.camera.w-p.x)<1e-9);assert.ok(Math.abs(g.camera.y+g.input.my*g.camera.h-(p.y-678))<1e-9);
 assert.ok(g.first(g.assets.oBullet));pad.release(2);assert.ok(g.input.buttons.has(1));pad.release(3);assert.equal(g.input.buttons.has(1),false);assert.ok(g.input.keys.has(68));pad.clear();
});
test('held fire consumes grenades and a weapon button switches once while held',()=>{
 const {g,pad}=make();g.applyCheat('weapons');g.applyCheat('grenades');
 pad.pressButton('weapon',1);g.step();assert.ok(g.first(g.assets.oGun59));step(g,10);assert.ok(g.first(g.assets.oGun59));pad.release(1);
 const before=g.global.bullets;pad.startStick('aim',2,vector(1,-.3));step(g,10);pad.release(2);
 assert.ok(g.global.bullets<before);assert.ok(g.first(g.assets.oBulletBomb));assert.equal(g.errors.length,0);
});
test('menu stick repeats selections while Select activates the original new game route',()=>{
 const {g,pad}=make('rMenu');step(g,100);const menu=g.first(g.assets.oMenu),start=menu.menu_cursor;
 pad.startStick('move',1,vector(0,-1));g.step();assert.notEqual(menu.menu_cursor,start);pad.tick(100);pad.tick(499);g.step();const once=menu.menu_cursor;
 pad.tick(500);g.step();assert.notEqual(menu.menu_cursor,once);pad.release(1);menu.menu_cursor=2;
 pad.pressButton('interact',2);g.step();pad.release(2);step(g,180);assert.equal(g.room.info.Name,'introroom2');assert.equal(g.errors.length,0);
});
test('Next advances the story and ending, with other gameplay controls disabled',()=>{
 const {g,pad}=make('rMenu');step(g,100);pad.pressButton('interact',1);g.step();pad.release(1);step(g,180);pad.tick(1000);
 assert.equal(g.room.info.Name,'introroom2');assert.equal(pad.canButton('fire'),false);assert.equal(pad.canButton('jump'),false);
 pad.pulse('interact');g.step();pad.afterStep();step(g,150);assert.equal(g.room.info.Name,'room26');assert.equal(g.input.keys.size,0);
 g.loadRoom('rEnding');pad.tick(1000);assert.equal(pad.canButton('interact'),true);pad.pressButton('interact',1);assert.ok(g.input.pressed.has(65535));pad.clear();
});
test('pausing, changing rooms, losing control, and pointer cancellation release virtual inputs',()=>{
 const {g,pad,router}=make('room1');router.down('KeyD');pad.startStick('move',1,vector(-1));pad.pressButton('slowmo',2);
 pad.clear();assert.ok(g.input.keys.has(68));assert.equal(g.input.buttons.size,0);router.up('KeyD');
 pad.startStick('move',3,vector(1));g.paused=true;pad.tick(2);assert.equal(g.input.keys.size,0);assert.equal(pad.sticks.move,null);
 g.paused=false;pad.startStick('move',4,vector(1));g.global.hascontrol=0;pad.tick(3);assert.equal(g.input.keys.size,0);
 g.global.hascontrol=1;pad.startStick('move',5,vector(1));g.loadRoom('rMenu');pad.tick(4);assert.equal(g.input.keys.size,0);assert.equal(pad.sticks.move,null);
});
test('death disables movement and fire while Revive waits for landing',()=>{
 const {g,pad}=make('room1'),p=g.first(g.assets.Object1);g.global.php=1;g.runEvent(p,4,g.assets.eEbullet,g.create(g.assets.eEbullet,p.x,p.y,'bullets'));pad.tick(2);
 assert.equal(pad.canStick('move'),false);assert.equal(pad.canButton('fire'),false);assert.equal(pad.canButton('jump'),false);
 step(g,180);assert.equal(pad.canButton('jump'),true);pad.pulse('jump');g.step();pad.afterStep();assert.equal(g.first(g.assets.oPDead),undefined);assert.equal(g.global.hascontrol,1);assert.equal(g.errors.length,0);
});
test('direct canvas aiming releases only virtual fire and retains movement and physical fire',()=>{
 const {g,pad,router}=make('room1');pad.startStick('move',1,vector(1));pad.startStick('aim',2,vector(-1));router.mouse(1,'mouse:1');
 pad.canvasAim();assert.equal(pad.relativeAim,false);assert.equal(pad.sticks.aim,null);assert.ok(g.input.keys.has(68));assert.ok(g.input.buttons.has(1));router.up('mouse:1');assert.equal(g.input.buttons.size,0);pad.clear();
});
test('accessible button clicks remain pressed for exactly one simulation step',()=>{
 const {g,pad}=make();pad.pulse('jump');assert.ok(g.input.pressed.has(32));pad.tick(100);g.step();pad.afterStep();
 assert.equal(g.first(g.assets.Object1).jumps,1);assert.equal(g.input.keys.size,0);step(g,4);assert.equal(g.first(g.assets.Object1).jumps,1);
});
