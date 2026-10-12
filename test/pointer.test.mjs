import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';

const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const step=(g,n=1)=>{for(let i=0;i<n;i++)g.step();};
function make(room='room26'){
 const g=new Engine(data,null,null,{seed:2});g.audioEnabled=false;g.loadRoom(room,false);step(g,40);return g;
}
function aimAt(g,x,y){g.input.mx=(x-g.camera.x)/g.camera.w;g.input.my=(y-g.camera.y)/g.camera.h;}
function pressAt(g,x,y){aimAt(g,x,y);g.queuePointerPress();g.input.bpressed.add(1);}

test('a tap outside the petrol entrance remains outside during original combat camera shake',()=>{
 const g=make(),p=g.first(g.assets.Object1),door=g.first(g.assets.oPetrolstationDoor);
 p.x=door.x-60;p.y=door.y;p.hsp=0;p.vsp=0;g.global.quest3=0;
 g.create(g.assets.oQuestObjectives3,p.x,p.y,'gobackbutton');
 for(const camera of g.resolve(g.assets.oCamera))Object.assign(camera,{shake_remain:6,shake_magnitude:6,shake_length:60});
 g.step();const bounds=g.bounds(door),before=[p.x,p.y];
 // Seed 2 formerly remapped this one-pixel-outside tap inside the door and jumped 7,069 pixels.
 pressAt(g,bounds.left-1,door.y);g.step();
 assert.ok(Math.hypot(p.x-before[0],p.y-before[1])<=12,'camera shake must not activate an unclicked portal');
 assert.ok(g.resolve(g.assets.oQuestObjectives3).length);
 // The original, deliberate portal interaction remains usable.
 pressAt(g,door.x,door.y);g.step();const counter=g.first(g.assets.wallcustomer);
 assert.equal(p.x,counter.x-60);assert.equal(p.y,counter.y-100);assert.equal(g.errors.length,0);
});

test('recovered gun aiming reads one world pointer throughout a simulation tick',()=>{
 const g=make('room1'),p=g.first(g.assets.Object1),gun=g.first(g.assets.oGun)||g.create(g.assets.oGun,p.x,p.y,'Gun');
 const target={x:p.x+400,y:p.y-160};aimAt(g,target.x,target.y);g.freezePointer();
 g.camera.x+=3000;g.camera.y-=1000;
 g.runCode('gml_Object_oGun_Step_1',gun);
 const expected=(Math.atan2((p.y+10)-target.y,target.x-(p.x-20))*180/Math.PI+360)%360;
 assert.ok(Math.abs(gun.image_angle-expected)<1e-9,'a camera update must not redirect the recovered aiming code');
 assert.deepEqual(g.pointerWorld(),target);g.clearPointer();assert.equal(g.errors.length,0);
});

test('the mouse event hit phase uses the same pressed object after a camera update',()=>{
 const g=make('room1'),p=g.first(g.assets.Object1),events=[];
 pressAt(g,p.x,p.y);g.freezePointer();g.camera.x+=3000;g.camera.y+=1000;
 // Current recovered handlers use Step input. Exercise the runtime Mouse phase independently.
 const metadata=g.objectMeta[p.object_index],previous=metadata.mouse;metadata.mouse=true;
 const runEvent=g.runEvent;g.runEvent=(self,type,sub)=>events.push({self:self.id,type,sub});
 try{g.runMouse(p);}finally{g.runEvent=runEvent;metadata.mouse=previous;g.clearPointer();}
 assert.ok(events.some(event=>event.self===p.id&&event.type===6&&event.sub===4),'local left-press event must reach the clicked object');
 assert.ok(events.some(event=>event.type===6&&event.sub===50),'the global left-press event remains available');
});

test('new synthetic or gamepad aiming replaces a pending canvas sample before the next tick',()=>{
 const g=make('room1');g.input.mx=.2;g.input.my=.3;g.queuePointerPress();g.input.bpressed.add(1);
 g.input.mx=.7;g.input.my=.8;g.camera.x+=120;g.camera.y+=30;
 const expected={x:g.camera.x+.7*g.camera.w,y:g.camera.y+.8*g.camera.h};
 g.freezePointer();assert.deepEqual(g.pointerWorld(),expected);g.clearPointer();
});

test('a queued press is consumed once and does not freeze later held aiming',()=>{
 const g=make('room1');g.input.mx=.4;g.input.my=.6;
 const target={x:g.camera.x+.4*g.camera.w,y:g.camera.y+.6*g.camera.h};
 g.queuePointerPress();g.input.bpressed.add(1);g.camera.x+=200;g.freezePointer();assert.deepEqual(g.pointerWorld(),target);
 g.step();g.camera.x+=300;
 const next={x:g.camera.x+.4*g.camera.w,y:g.camera.y+.6*g.camera.h};
 g.freezePointer();assert.deepEqual(g.pointerWorld(),next);g.clearPointer();
});

test('explicit clearing and room changes discard pointers belonging to the previous view',()=>{
 const g=make();g.input.mx=.4;g.input.my=.6;g.queuePointerPress();g.input.bpressed.add(1);g.freezePointer();g.clearPointer();
 g.camera.x+=200;assert.deepEqual(g.pointerWorld(),{x:g.camera.x+.4*g.camera.w,y:g.camera.y+.6*g.camera.h});
 g.queuePointerPress();g.loadRoom('room1',false);
 const current={x:g.camera.x+.4*g.camera.w,y:g.camera.y+.6*g.camera.h};
 g.freezePointer();assert.deepEqual(g.pointerWorld(),current);g.clearPointer();
});

test('a completed simulation step releases its frozen pointer for the next frame',()=>{
 const g=make('room1');aimAt(g,g.first(g.assets.Object1).x+200,g.first(g.assets.Object1).y-40);g.step();
 g.camera.x+=500;g.camera.y+=200;
 assert.deepEqual(g.pointerWorld(),{x:g.camera.x+g.input.mx*g.camera.w,y:g.camera.y+g.input.my*g.camera.h});
});

test('a one-shot mobile grenade retains the tapped world point without a primary mouse edge',()=>{
 const g=make('room1'),p=g.first(g.assets.Object1),target={x:p.x+300,y:p.y-140};
 aimAt(g,target.x,target.y);g.input.pressed.add(70);g.queuePointerPress();
 g.camera.x+=300;g.camera.y-=200;assert.equal(g.input.bpressed.size,0);
 g.freezePointer();assert.deepEqual(g.pointerWorld(),target);g.clearPointer();
});
