import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {BindingProfile,InputRouter,CONTROL_STORAGE_KEY,gameContext} from '../dist/bindings.js';
import {Engine} from '../dist/engine.js';
const input=()=>({keys:new Set(),pressed:new Set(),released:new Set(),buttons:new Set(),bpressed:new Set(),breleased:new Set()});
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
const fixture=()=>{const profile=new BindingProfile(memory()),i=input();let context='game';const router=new InputRouter(profile,()=>i,()=>context);return {profile,i,router,context:c=>context=c};};

test('custom movement replaces the old key and preserves held input until every source is released',()=>{
 const f=fixture();assert.ok(f.profile.bind('right',0,'KeyJ').ok);assert.equal(f.router.down('KeyD').handled,false);
 f.router.down('KeyJ');f.router.down('ArrowRight');assert.ok(f.i.keys.has(68));assert.ok(f.i.pressed.has(68));
 f.i.pressed.clear();f.router.up('KeyJ');assert.ok(f.i.keys.has(68));assert.equal(f.i.released.has(68),false);
 f.router.down('ArrowRight');assert.equal(f.i.pressed.has(68),false);f.router.up('ArrowRight');assert.ok(f.i.released.has(68));assert.equal(f.i.keys.size,0);
});
test('bindings are persisted, can be cleared and reset, and reject conflicting gameplay controls',()=>{
 const storage=memory(),a=new BindingProfile(storage);assert.ok(a.bind('right',0,'KeyJ').ok);assert.ok(storage.getItem(CONTROL_STORAGE_KEY));
 const b=new BindingProfile(storage);assert.equal(b.first('right'),'KeyJ');assert.equal(b.bind('jump',0,'KeyJ').ok,false);assert.equal(b.first('jump'),'Space');
 assert.ok(b.bind('right',0,'').ok);assert.equal(b.first('right'),'ArrowRight');b.reset();assert.equal(new BindingProfile(storage).first('right'),'KeyD');
 assert.equal(b.bind('jump',0,'Tab').ok,false);
});
test('menu navigation shares arrow up with jump without activating jump in menus',()=>{
 const f=fixture();f.router.down('ArrowUp');assert.ok(f.i.keys.has(32));assert.equal(f.i.keys.has(38),false);f.router.clear();f.context('menu');
 f.router.down('ArrowUp');assert.ok(f.i.keys.has(38));assert.equal(f.i.keys.has(32),false);f.router.clear();
 assert.ok(f.profile.bind('menuDown',0,'KeyJ').ok);f.router.down('KeyJ');assert.ok(f.i.keys.has(40));
});
test('pause commands are edge-triggered, rebindable, and do not leak the original Escape event',()=>{
 const f=fixture();assert.ok(f.profile.bind('pause',0,'KeyP').ok);assert.equal(f.router.down('Escape').handled,false);
 assert.deepEqual(f.router.down('KeyP').commands,['pause']);assert.equal(f.i.keys.has(27),false);assert.deepEqual(f.router.down('KeyP').commands,[]);
 f.router.up('KeyP');assert.deepEqual(f.router.down('KeyP').commands,['pause']);
});
test('keyboard fire and slow motion can coexist with pointer holds and release cleanly',()=>{
 const f=fixture();f.profile.bind('fire',0,'KeyZ');f.profile.bind('slowmo',0,'KeyX');f.router.down('KeyZ');assert.ok(f.i.buttons.has(1));
 f.router.mouse(1,'mouse');f.router.up('KeyZ');assert.ok(f.i.buttons.has(1));f.router.up('mouse');assert.equal(f.i.buttons.has(1),false);
 f.router.down('KeyX');assert.ok(f.i.buttons.has(2));f.router.clear();assert.equal(f.i.buttons.size,0);assert.equal(f.router.sources.size,0);
});
test('undocumented health, reset, and close-door controls are routed, while bindings survive game saves',()=>{
 const f=fixture();for(const [physical,virtual] of [['ShiftLeft',16],['KeyR',82],['KeyQ',81],['KeyE',69]]){f.router.down(physical);assert.ok(f.i.keys.has(virtual));f.router.clear();}
 assert.ok(f.profile.bind('heal',0,'KeyH').ok);assert.equal(f.router.down('ShiftLeft').handled,false);f.router.down('KeyH');assert.ok(f.i.pressed.has(16));
});
test('ending lines still accept ordinary unbound keys without triggering inventory shortcuts',()=>{
 const f=fixture();f.context('ending');f.router.down('KeyR');assert.ok(f.i.pressed.has(65535));assert.equal(f.i.pressed.has(82),false);
});
test('invalid or unavailable stored preferences do not break input or allocate unbounded state',()=>{
 const a=new BindingProfile({getItem:()=>'{bad JSON',setItem:()=>{throw Error('full');}});assert.equal(a.first('right'),'KeyD');assert.ok(a.bind('right',0,'KeyJ').ok);assert.equal(a.saved,false);
 const b=new BindingProfile({getItem:()=>JSON.stringify({version:1,bindings:{right:['KeyJ'],jump:['KeyJ']}})});assert.equal(b.first('right'),'KeyJ');assert.equal(b.first('jump'),null);
 const f=fixture();for(let i=0;i<1000;i++)f.router.down('KeyD');assert.equal(f.router.sources.size,1);f.router.clear();assert.equal(f.router.keyOwners.size,0);
});
test('rebound controls drive the recovered movement, health, reset, and door events',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url))),g=new Engine(data),profile=new BindingProfile(memory());g.loadRoom('room1',false);for(let n=0;n<40;n++)g.step();
 const router=new InputRouter(profile,()=>g.input,()=>gameContext(g)),p=g.resolve(g.assets.Object1)[0],x=p.x;
 profile.bind('right',0,'KeyJ');router.down('KeyD');g.step();assert.equal(p.x,x);router.down('KeyJ');for(let n=0;n<10;n++)g.step();router.up('KeyJ');assert.equal(p.x,x+40);
 router.clear();g.loadRoom('room26',false);for(let n=0;n<20;n++)g.step();profile.bind('heal',0,'KeyH');g.global.php=4;router.down('KeyH');g.step();router.up('KeyH');assert.ok(g.global.php>4&&g.global.php<=8);
 profile.bind('reset',0,'KeyT');g.global.kills=500;router.down('KeyR');g.step();assert.equal(g.global.kills,500);router.down('KeyT');g.step();router.up('KeyT');assert.equal(g.global.kills,0);assert.equal(g.global.ammo,0);
 const homePlayer=g.resolve(g.assets.Object1)[0],door=g.resolve(g.assets.oDoor)[0];profile.bind('interact',0,'KeyI');profile.bind('secondary',0,'KeyY');homePlayer.x=door.x-65;homePlayer.y=door.y;router.down('KeyI');g.step();router.up('KeyI');assert.ok(g.resolve(g.assets.oDoorOpen)[0]);const opened=g.resolve(g.assets.oDoorOpen)[0];homePlayer.x=opened.x-60;homePlayer.y=opened.y;router.down('KeyY');g.step();router.up('KeyY');assert.ok(g.resolve(g.assets.oDoor)[0]);assert.equal(g.resolve(g.assets.oDoorOpen).length,0);
 assert.equal(g.errors.length,0);
});
