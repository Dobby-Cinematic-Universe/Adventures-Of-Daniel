import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';
import {BindingProfile,keyLabel} from '../dist/bindings.js';
import {gameplayHint} from '../dist/gameplay-hints.js';

const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const make=(room='room26')=>{const game=new Engine(data,null,null,{seed:12345});game.audioEnabled=false;game.loadRoom(room,false);return game;};
const obj=(g,name)=>g.first(g.assets[name]);
const step=(g,n=1)=>{for(let i=0;i<n;i++)g.step();};
const keys=new BindingProfile();
const hint=(g,options={})=>gameplayHint(g,{key:id=>keys.first(id)?keyLabel(keys.first(id)):null,...options});
const approach=(g,s,d=60)=>{const p=obj(g,'Object1');p.x=s.x-d;p.y=s.y;p.vsp=0;return p;};
function click(g,s){const b=g.bounds(s);g.input.mx=((b.left+b.right)/2-g.camera.x)/g.camera.w;g.input.my=((b.top+b.bottom)/2-g.camera.y)/g.camera.h;g.input.bpressed.add(1);g.input.buttons.add(1);g.step();g.input.buttons.clear();}

test('nearby doors replace gun guidance and update immediately after opening and closing',()=>{
 const g=make();step(g,60);g.applyCheat('weapons');const door=obj(g,'oDoor');approach(g,door);
 assert.equal(hint(g),'Press E to open the door.');assert.match(hint(g,{touch:true}),/^Tap Use to open the door\./);
 g.input.pressed.add(69);g.step();assert.equal(obj(g,'oDoor'),undefined);assert.ok(obj(g,'oDoorOpen'));
 assert.equal(hint(g),'Press Q to close the door.');assert.match(hint(g,{touch:true}),/^Tap Close to close the door\./);
 g.input.pressed.add(81);g.step();assert.ok(obj(g,'oDoor'));assert.equal(obj(g,'oDoorOpen'),undefined);assert.equal(hint(g),'Press E to open the door.');assert.equal(g.errors.length,0);
});

test('door hints use recovered radii, rebinding, missing keys, and the nearest actionable door',()=>{
 const g=make();step(g,40);const p=obj(g,'Object1'),door=obj(g,'oDoor');p.y=door.y;p.x=door.x-80;assert.equal(hint(g),'Press E to open the door.');p.x=door.x-80.001;assert.doesNotMatch(hint(g),/to open the door/);
 p.x=door.x-60;const profile=new BindingProfile();assert.equal(profile.bind('interact',0,'KeyV').ok,true);assert.equal(hint(g,{key:id=>profile.first(id)?keyLabel(profile.first(id)):null}),'Press V to open the door.');profile.bind('interact',0,'');assert.match(hint(g,{key:()=>null}),/^Bind Open \/ interact in Controls/);
 const farther=g.create(g.assets.oDoorOpen,p.x+100,p.y,'floor');assert.equal(hint(g),'Press E to open the door.');farther.x=p.x+20;assert.equal(hint(g),'Press Q to close the door.');g.destroy(farther);
 g.destroy(door);const other=g.create(g.assets.oDoor2,p.x+100,p.y,'floor');other.closed=true;assert.equal(hint(g),'Press E to open the door.');other.x+=.001;assert.doesNotMatch(hint(g),/to open the door/);assert.equal(g.errors.length,0);
});

test('hidden, destroyed, and unrelated door objects never leave stale door prompts',()=>{
 const g=make();step(g,40);const door=obj(g,'oDoor');approach(g,door);door.visible=false;assert.doesNotMatch(hint(g),/to open the door/);door.visible=true;g.getLayer(door.layer).info.IsVisible=false;assert.doesNotMatch(hint(g),/to open the door/);g.getLayer(door.layer).info.IsVisible=true;
 assert.match(hint(g),/to open the door/);g.destroy(door);assert.doesNotMatch(hint(g),/to open the door/);
 const p=obj(g,'Object1');g.create(g.assets.oDoorBarrier,p.x,p.y,'floor');g.create(g.assets.oLeveldoor,p.x,p.y,'floor');assert.doesNotMatch(hint(g),/to open the door/);g.destroy(p);assert.equal(hint(g),'Choose an option to continue.');assert.equal(g.errors.length,0);
});

test('crates, beds, jobs, companion, and computer use actionable ranges instead of weapon fallback',()=>{
 const g=make();step(g,60);g.applyCheat('weapons');const p=obj(g,'Object1'),ground=p.y,bed=obj(g,'oBedSleep');approach(g,bed);assert.equal(hint(g),'Click the bed to sleep and restore hearts.');p.x=bed.x-100.001;assert.doesNotMatch(hint(g),/the bed to sleep/);
 const sign=obj(g,'oSign');approach(g,sign);p.y=ground;step(g,2);assert.equal(hint(g),'Click the computer to open it.');click(g,sign);assert.match(hint(g),/power button closes/);click(g,obj(g,'oButtonOff'));
 const job=obj(g,'oJobSign');approach(g,job);g.destroy(g.assets.oQuestMarker2);assert.match(hint(g),/Sleep before/);g.create(g.assets.oQuestMarker2,job.x,job.y,'quests');assert.equal(hint(g),'Click the job sign to choose a shift.');
 const girl=obj(g,'oGirl16364');approach(g,girl);assert.match(hint(g),/^Hold E while moving to guide her\. Q kisses\./);p.x=girl.x+60;assert.doesNotMatch(hint(g),/Q kisses/);
 const crate=g.create(g.assets.oCrate,p.x+20,p.y,'stuff');assert.equal(hint(g),'Press E to collect the crate.');g.destroy(crate);assert.match(hint(g),/guide her/);assert.equal(g.errors.length,0);
});

test('station entry and exit hints follow active and completed shift states',()=>{
 const g=make();step(g,40);const door=obj(g,'oPetrolstationDoor');approach(g,door);assert.equal(hint(g),'Accept a shift at the job sign before entering.');g.create(g.assets.oQuestObjectives3,0,0,'quests');assert.equal(hint(g),'Click the petrol station door to enter your shift.');
 const exit=obj(g,'oPetrolstationDoor153');approach(g,exit);assert.equal(hint(g),'Serve all three customers before leaving.');g.global.quest3=1;assert.equal(hint(g,{touch:true}),'Shift complete — tap the exit door to go home.');
 obj(g,'Object1').x=18500;g.global.quest3=0;assert.match(hint(g,{touch:true}),/^Use collects crates/);g.destroy(g.assets.oQuestObjectives3);assert.doesNotMatch(hint(g),/finish your shift|Serve all three/);assert.equal(g.errors.length,0);
});

test('mobile armed grenades explain the next single tap independently from original desktop F',()=>{
 const g=make('room1');step(g,40);g.applyCheat('weapons');assert.match(hint(g),/Left click fires the gun · F fires grenades/);
 assert.match(hint(g,{touch:true,weaponMode:'gun'}),/Tap Grenade, then tap a target for one throw/);assert.match(hint(g,{touch:true,weaponMode:'grenade'}),/^Grenade ready — tap a target to throw once, then the gun returns/);assert.match(hint(g,{touch:true,weaponMode:'grenade'}),/Tap Cancel to disarm/);
 const p=obj(g,'Object1');g.create(g.assets.oDoor,p.x+50,p.y,'floor');assert.match(hint(g,{touch:true,weaponMode:'grenade'}),/^Grenade ready/);assert.match(hint(g,{touch:true,weaponMode:'gun'}),/^Tap Use to open the door/);assert.equal(g.errors.length,0);
});

test('death, sleep, and dialogs retain priority over nearby interactions and weapons',()=>{
 const g=make();step(g,40);approach(g,obj(g,'oDoor'));g.applyCheat('weapons');g.global.clickedbed=true;assert.match(hint(g),/^Sleeping/);g.global.clickedbed=false;g.global.hascontrol=0;assert.equal(hint(g,{touch:true}),'Tap an option to continue.');g.create(g.assets.oshopping2,0,0,'computerbackgrounds');g.create(g.assets.oButtonOff,0,0,'buttons');assert.match(hint(g),/power button closes/);
 const p=obj(g,'Object1'),body=g.create(g.assets.oPDead,p.x,p.y,'bullets');assert.equal(hint(g,{touch:true}),'Wait for Daniel to land, then tap Revive.');body.done=1;body.vsp=0;assert.equal(hint(g,{touch:true}),'Defeated — tap Revive to return.');assert.match(hint(g),/press SPACE or click Revive/);assert.equal(hint(g,{key:()=>null}),'Defeated — click Revive to return.');assert.equal(g.errors.length,0);
});

test('menu, moon, story, and ending hints retain context-specific controls',()=>{
 const g=make('rMenu');assert.equal(hint(g,{touch:true}),'Choose with the left stick, then tap Select.');g.faceEgg.moonFrame=()=>({x:g.camera.x+100,r:20});g.faceEgg.moonImage={};assert.match(hint(g),/Click the moon to reveal a familiar face/);g.faceEgg.enabled=true;assert.match(hint(g,{touch:true}),/Tap the moon to restore the original faces/);
 g.loadRoom('introroom2',false);assert.equal(hint(g),'Press F to continue the story.');assert.equal(hint(g,{touch:true}),'Tap Next to continue the story.');assert.equal(hint(g,{key:()=>null}),'Set a story key in Controls to continue.');
 g.loadRoom('rEnding',false);assert.equal(hint(g,{touch:true}),'Tap Next to advance the ending text.');assert.equal(hint(g),'Press any key to advance the ending text.');assert.equal(g.errors.length,0);
});
