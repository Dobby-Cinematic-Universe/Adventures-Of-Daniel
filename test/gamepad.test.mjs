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
test('the movement stick turns Daniel in his walking direction even after aiming the other way',()=>{
 const {g,pad}=make(),p=g.first(g.assets.Object1);p.image_xscale=-1;g.input.mx=0;
 pad.startStick('move',1,vector(1));for(let i=0;i<12;i++){pad.tick(i*16);g.step();assert.equal(p.image_xscale,1);}
 pad.moveStick('move',1,vector(-1));for(let i=0;i<12;i++){pad.tick(200+i*16);g.step();assert.equal(p.image_xscale,-1);}
 pad.release(1);g.applyCheat('weapons');pad.startStick('aim',2,vector(-1));g.step();pad.release(2);pad.startStick('move',3,vector(1));pad.tick(500);g.step();assert.equal(p.image_xscale,1);
});
test('independent aiming and held Fire can face behind a walking player until released',()=>{
 const {g,pad}=make('room1'),p=g.first(g.assets.Object1);pad.startStick('move',1,vector(1));pad.startStick('aim',2,vector(-1));pad.pressButton('fire',3);
 pad.tick(10);g.step();assert.equal(p.image_xscale,-1);assert.ok(p.hsp>0);pad.release(2);pad.tick(20);g.step();assert.equal(p.image_xscale,-1);
 pad.release(3);pad.tick(30);g.step();assert.equal(p.image_xscale,1);pad.clear();
});
test('a direct canvas aim overrides walking facing until a new movement-stick gesture',()=>{
 const {g,pad}=make('room1'),p=g.first(g.assets.Object1);pad.startStick('move',1,vector(1));pad.canvasAim();g.input.mx=0;
 pad.tick(10);g.step();assert.equal(p.image_xscale,-1);assert.equal(pad.relativeAim,false);
 pad.moveStick('move',1,vector(1));pad.tick(20);g.step();assert.equal(p.image_xscale,1);
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
test('the Grenade selector arms without firing, then aim and Fire use the selected weapon',()=>{
 const {g,pad}=make();g.applyCheat('weapons');g.applyCheat('grenades');const before=g.global.bullets,ammo=g.global.ammo;
 pad.pressButton('weapon',1);g.step();pad.release(1);assert.equal(pad.selectedWeapon(),'grenade');assert.ok(g.first(g.assets.oGun));assert.equal(g.global.bullets,before);assert.equal(g.input.keys.has(70),false);
 pad.startStick('aim',2,vector(1,-.3));step(g,10);pad.release(2);assert.ok(g.first(g.assets.oGun59));assert.ok(g.global.bullets<before);assert.equal(g.global.ammo,ammo);assert.ok(g.first(g.assets.oBulletBomb));
 const bombs=g.global.bullets;pad.pressButton('weapon',3);pad.release(3);g.step();assert.equal(pad.selectedWeapon(),'gun');assert.equal(g.global.bullets,bombs);
 pad.pressButton('fire',4);step(g,10);pad.release(4);assert.ok(g.first(g.assets.oGun));assert.ok(g.global.ammo<ammo);assert.equal(g.global.bullets,bombs);assert.equal(g.errors.length,0);
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
test('quick selector taps never shoot and quick Fire taps use the armed mode exactly once',()=>{
 const {g,pad}=make('room1');g.applyCheat('weapons');g.applyCheat('grenades');g.input.mx=.9;g.input.my=.1;
 const ammo=g.global.ammo,bombs=g.global.bullets;pad.pressButton('weapon',1);pad.release(1);g.step();assert.equal(g.global.bullets,bombs);assert.equal(g.global.ammo,ammo);assert.equal(g.input.pressed.has(70),false);
 pad.pressButton('fire',2);pad.release(2);g.step();assert.equal(g.global.ammo,ammo);assert.equal(g.global.bullets,bombs-1);assert.ok(g.first(g.assets.oGun59));
 step(g,4);pad.pulse('weapon');pad.pulse('fire');g.step();pad.afterStep();assert.equal(g.global.ammo,ammo-1);assert.equal(g.global.bullets,bombs-1);assert.ok(g.first(g.assets.oGun));
 step(g,3);assert.equal(g.global.ammo,ammo-1);assert.equal(g.global.bullets,bombs-1);assert.equal(g.errors.length,0);
});
test('grenade aim is applied before the first shot and retains movement from the other thumb',()=>{
 for(const [x,y] of [[1,-1],[-1,1]]){
  const {g,pad}=make('room1');g.applyCheat('weapons');g.applyCheat('grenades');pad.pulse('weapon');pad.startStick('move',1,vector(1));pad.startStick('aim',2,vector(x,y));
  const p=g.first(g.assets.Object1),target={x:g.camera.x+g.input.mx*g.camera.w,y:g.camera.y+g.input.my*g.camera.h};
  const expected=(Math.atan2(-(target.y-p.y-10),target.x-p.x+20)*180/Math.PI+360)%360;g.step();const bomb=g.first(g.assets.oBulletBomb);
  assert.ok(bomb);assert.ok(Math.abs(bomb.direction-expected)<=3);assert.ok(g.input.keys.has(68));assert.ok(g.input.keys.has(70));assert.equal(g.input.buttons.has(1),false);
  pad.release(2);assert.equal(g.input.keys.has(70),false);assert.ok(g.input.keys.has(68));pad.clear();assert.equal(g.errors.length,0);
 }
});
test('changing selection while firing waits for a new firing gesture instead of launching immediately',()=>{
 const {g,pad}=make('room1');g.applyCheat('weapons');g.applyCheat('grenades');pad.startStick('aim',1,vector(1,-1));pad.pressButton('fire',2);g.step();const ammo=g.global.ammo,bombs=g.global.bullets;
 pad.pressButton('weapon',3);pad.release(3);for(let i=0;i<8;i++){pad.tick(i*16);g.step();}assert.equal(g.global.bullets,bombs);assert.equal(g.global.ammo,ammo);assert.equal(g.input.buttons.has(1),false);assert.equal(g.input.keys.has(70),false);
 pad.moveStick('aim',1,vector(-1,-1));g.step();assert.equal(g.global.bullets,bombs);
 pad.moveStick('aim',1,vector(0));pad.moveStick('aim',1,vector(-1,-1));g.step();assert.equal(g.global.bullets,bombs-1);pad.release(1);assert.equal(g.input.keys.has(70),false);
 pad.release(2);pad.pressButton('fire',4);step(g,4);pad.release(4);assert.ok(g.global.bullets<bombs-1);pad.clear();assert.equal(g.errors.length,0);
});
test('grenade firing fingers and physical F retain independent ownership and original keyboard controls',()=>{
 const {g,pad,router}=make('room1');g.applyCheat('weapons');g.applyCheat('grenades');pad.pulse('weapon');router.down('KeyF');pad.startStick('aim',1,vector(0,-1));pad.pressButton('fire',2);g.step();
 pad.release(1);assert.ok(g.input.keys.has(70));pad.release(2);assert.ok(g.input.keys.has(70));router.up('KeyF');assert.equal(g.input.keys.has(70),false);
 pad.clear();assert.equal(pad.selectedWeapon(),'gun');const bombs=g.global.bullets;step(g,4);router.down('KeyF');g.step();router.up('KeyF');assert.equal(g.global.bullets,bombs-1);assert.ok(g.first(g.assets.oGun59));
 step(g,4);router.mouse(1,'mouse:1');g.step();router.up('mouse:1');assert.ok(g.first(g.assets.oGun));assert.equal(g.errors.length,0);
});
test('pause, death, room changes, and explicit cancellation clear armed firing without stuck inputs',()=>{
 const {g,pad}=make('room1');g.applyCheat('weapons');g.applyCheat('grenades');pad.pulse('weapon');pad.startStick('aim',1,vector(0,-1));g.step();g.paused=true;pad.tick(2);assert.equal(pad.selectedWeapon(),'gun');assert.equal(g.input.keys.size,0);
 g.paused=false;pad.pulse('weapon');pad.pressButton('fire',2);g.step();g.global.hascontrol=0;pad.tick(3);assert.equal(pad.selectedWeapon(),'gun');assert.equal(g.input.keys.size,0);assert.equal(pad.buttons.size,0);
 g.global.hascontrol=1;pad.pulse('weapon');pad.startStick('aim',3,vector(0,-1));g.step();pad.canvasAim();assert.equal(g.input.keys.size,0);assert.equal(pad.sticks.aim,null);
 pad.clear();pad.pulse('weapon');pad.pressButton('fire',4);g.step();g.loadRoom('rMenu');pad.tick(4);assert.equal(pad.selectedWeapon(),'gun');assert.equal(g.input.keys.size,0);assert.equal(pad.buttons.size,0);assert.equal(g.errors.length,0);
});
test('the aim stick can fire an acquired grenade launcher before the gun is acquired',()=>{
 const {g,pad}=make('room1');g.global.weapon1=0;g.global.weapon2=1;for(const gun of g.instances.filter(s=>s.object_index===g.assets.oGun))g.destroy(gun);g.create(g.assets.oGun59,0,0,'Gun');g.global.bullets=5;
 assert.equal(pad.selectedWeapon(),'grenade');assert.equal(pad.canButton('weapon'),false);pad.startStick('aim',1,vector(1,-1));g.step();pad.release(1);assert.equal(g.global.bullets,4);assert.equal(g.input.keys.size,0);assert.equal(g.errors.length,0);
});
test('overlapping ground below the house never sends gamepad movement to a distant wall edge',()=>{
 for(const direction of [-1,1]){
  const {g,pad}=make(),p=g.first(g.assets.Object1);p.x=6300;p.y=2740;p.vsp=0;
  assert.ok(g.place(p,p.x,p.y,g.assets.wall));pad.startStick('move',1,vector(direction));
  for(let n=0;n<48;n++){const before=[p.x,p.y];pad.tick(n*16);g.step();assert.ok(Math.hypot(p.x-before[0],p.y-before[1])<=12,'movement and recovery must remain local');}
  assert.ok(Math.abs(p.x-6300)<=192);assert.equal(g.place(p,p.x,p.y,g.assets.wall),null);assert.equal(g.errors.length,0);
 }
});
test('shallow stair recovery takes small steps and then allows the gamepad to walk',()=>{
 const {g,pad}=make(),p=g.first(g.assets.Object1);p.x=11100;p.y=2140;p.vsp=0;
 for(let n=0;n<16&&g.place(p,p.x,p.y,g.assets.wall);n++){const before=[p.x,p.y];g.step();assert.ok(Math.hypot(p.x-before[0],p.y-before[1])<=8);}
 assert.equal(g.place(p,p.x,p.y,g.assets.wall),null);const x=p.x;pad.startStick('move',1,vector(-1));step(g,5);assert.ok(p.x<x);assert.equal(g.errors.length,0);
});
test('saving during recovery resumes the same bounded movement after restoration',()=>{
 const {g}=make(),p=g.first(g.assets.Object1);p.x=6300;p.y=2740;p.vsp=0;step(g,6);const snapshot=g.captureWorld();
 const restored=new Engine(data,null,null,{seed:12345});restored.audioEnabled=false;restored.applyWorld(snapshot);
 g.input.keys.add(65);restored.input.keys.add(65);step(g,50);step(restored,50);
 const a=g.captureWorld(),b=restored.captureWorld();delete a.savedAt;delete b.savedAt;assert.deepEqual(a,b);assert.equal(g.errors.length,0);assert.equal(restored.errors.length,0);
});
