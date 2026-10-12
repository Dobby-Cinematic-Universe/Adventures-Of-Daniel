import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine} from '../dist/engine.js';
import {BindingProfile,InputRouter,gameContext} from '../dist/bindings.js';
import {GamepadInput} from '../dist/gamepad.js';

const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
function make(){
 const g=new Engine(data,null,null,{seed:3467});g.audioEnabled=false;g.loadRoom('room26',false);
 for(let n=0;n<40;n++)g.step();g.applyCheat('weapons');g.global.ammo=9999;g.global.bullets=9999;g.setCheat('invincible',true);return g;
}
function aimAt(g,x,y){g.input.mx=(x-g.camera.x)/g.camera.w;g.input.my=(y-g.camera.y)/g.camera.h;}
const vector=(x,y=0)=>({x,y,radius:30});

test('fractional recoil and a rotated floor contact cannot walk Daniel to a distant obstacle',()=>{
 const g=make(),p=g.first(g.assets.Object1);
 Object.assign(p,{x:6530.040426273517,y:2475.5588226130326,hsp:-4,vsp:0,gunkickx:1.4017316023934523,gunkicky:-.35599532759198754,image_xscale:1,image_yscale:1,image_angle:-.77808344,mask_index:g.assets.daniel,sprite_index:g.assets.runningSprite});
 const requested=-4+p.gunkickx,before=[p.x,p.y];
 // The rotated mask touches less than one pixel of grass. Its endpoint and unit probes disagree.
 assert.equal(g.place(p,p.x,p.y,g.assets.wall),null);
 assert.ok(g.place(p,p.x+requested,p.y,g.assets.wall));
 assert.equal(g.place(p,p.x-1,p.y,g.assets.wall),null);
 assert.equal(g.place(p,p.x-2,p.y,g.assets.wall),null);
 g.input.keys.add(65);aimAt(g,p.x-650,p.y+250);g.runEvent(p,3,0);
 assert.ok(Math.abs(p.x-before[0])<=Math.abs(requested)+1,'a contact search must remain within the requested movement');
 assert.ok(Math.abs(p.y-before[1])<=1);assert.equal(p.hsp,-requested,'the original horizontal bounce remains');
 assert.equal(g.errors.length,0);
});

for(const start of [[6300,2475.543084],[8000,2090],[9000,2150]])for(const source of ['keyboard and mouse','virtual gamepad']){
 test(`moving and alternating aim below the house stays local from ${start[0]} with ${source}`,()=>{
  const g=make(),p=g.first(g.assets.Object1);Object.assign(p,{x:start[0],y:start[1],hsp:0,vsp:0});
  const router=new InputRouter(new BindingProfile(),()=>g.input,()=>gameContext(g));
  const pad=source==='virtual gamepad'?new GamepadInput({router,getGame:()=>g}):null;
  if(pad){pad.tick(1);assert.equal(pad.startStick('move',1,vector(1)),true);}
  for(let n=0;n<800;n++){
   const move=n%160<80?1:-1,dx=n%2?650:-650,dy=n%7<3?250:-150;
   if(pad){
    pad.moveStick('move',1,vector(move));pad.release(2);
    assert.equal(pad.startStick('aim',2,vector(dx/700,dy/700)),true);
    if(n%59===0)pad.pulse('jump');pad.tick(n*16+2);pad.updateAim();
   }else{
    g.input.keys.clear();g.input.keys.add(move>0?68:65);if(n%59===0)g.input.pressed.add(32);
    aimAt(g,p.x+dx,p.y+dy);g.queuePointerPress();g.input.bpressed.add(1);
   }
   const before=[p.x,p.y];g.step();pad?.afterStep();
   assert.ok(Math.hypot(p.x-before[0],p.y-before[1])<=32,`frame ${n}: movement jumped from ${before} to ${p.x},${p.y}`);
  }
  pad?.clear();assert.equal(g.errors.length,0);assert.equal(g.first(g.assets.oPDead),undefined);
 });
}
