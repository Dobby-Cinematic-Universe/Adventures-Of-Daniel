import {CODE, SCRIPTS} from './code.js';

const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const rad=d=>d*Math.PI/180;
const lx=(n,d)=>n*Math.cos(rad(d)), ly=(n,d)=>-n*Math.sin(rad(d));
const direction=(x,y,a,b)=>(Math.atan2(y-b,a-x)*180/Math.PI+360)%360;
const color=n=>`rgb(${n&255},${(n>>>8)&255},${(n>>>16)&255})`;
export const formatGameNumber=value=>Number.isFinite(value)?String(Number(value.toFixed(2))):String(value);
const arrays=new Set(['alarm','spawn','remaining','endtext','menu','weapons']);
const constants={vk_left:37,vk_right:39,vk_up:38,vk_down:40,vk_enter:13,vk_space:32,vk_escape:27,vk_anykey:1,vk_nokey:0,mb_left:1,mb_right:2,mb_middle:3,fa_left:0,fa_center:1,fa_right:2,fa_top:0,fa_middle:1,fa_bottom:2,c_white:0xffffff,c_black:0,c_red:255,c_lime:65280,c_green:32768,c_yellow:65535,c_gray:8421504,c_silver:12632256,c_aqua:16776960,c_blue:16711680,gamespeed_fps:0,noone:-4,all:-3,self:-1,other:-2};

class Context {
 constructor(game,self,other=null,args=[],locals={},event=null,budget={n:0}) {Object.assign(this,{game,self,other,args,locals,event,budget});}
 tick(){if(++this.budget.n>12000)throw new Error('Loop exceeded 12,000 iterations');}
 get(k){
  if(own(this.locals,k))return this.locals[k];
  const g=this.game,s=this.self;
  if(k==='global')return g.global;
  if(k==='other')return this.other || s;
  if(k==='self')return s;
  if(k==='argument')return this.args;
  if(k==='argument_count')return this.args.length;
  if(/^argument\d+$/.test(k))return this.args[Number(k.slice(8))]??0;
  if(k==='room')return g.roomIndex;
  if(k==='room_width')return g.room.info.Width;
  if(k==='room_height')return g.room.info.Height;
  if(k==='room_speed')return g.fps;
  if(k==='mouse_x')return g.camera.x+g.input.mx*g.camera.w;
  if(k==='mouse_y')return g.camera.y+g.input.my*g.camera.h;
  if(k==='view_camera')return [0];
  if(k.startsWith('bbox_'))return g.bounds(s)[k.slice(5)];
  if(k==='sprite_width')return g.sprites[s.sprite_index]?.info.Width||0;
  if(k==='sprite_height')return g.sprites[s.sprite_index]?.info.Height||0;
  if(k==='image_number')return g.sprites[s.sprite_index]?.textures.length||1;
  if(own(s,k))return s[k];
  if(own(constants,k))return constants[k];
  if(own(g.assets,k))return g.assets[k];
  if(arrays.has(k))return s[k]=[];
  return 0;
 }
 set(k,v){
  if(own(this.locals,k)){this.locals[k]=v;return v;}
  if(/^argument\d+$/.test(k)){this.args[Number(k.slice(8))]=v;return v;}
  if(k==='speed'){this.self.hspeed=lx(v,this.self.direction);this.self.vspeed=ly(v,this.self.direction);}
  if(k==='direction'&&this.self.speed){this.self.hspeed=lx(this.self.speed,v);this.self.vspeed=ly(this.self.speed,v);}
  this.self[k]=v;return v;
 }
 declare(k,v){this.locals[k]=v;return v;}
 member(o,k){
  if(typeof o==='number'||typeof o==='boolean')o=this.game.resolve(o)[0];
  if(!o)return 0;
  if(k.startsWith('bbox_')&&o.object_index!==undefined)return this.game.bounds(o)[k.slice(5)];
  return o[k]??0;
 }
 put(o,k,v){
  if(typeof o==='number'||typeof o==='boolean'){
   for(const i of this.game.resolve(o))new Context(this.game,i).set(k,v);
  }else if(o)o[k]=v;
  return v;
 }
 index(o,k){return o?.[k]??0;}
 ensureArray(k){let a=this.get(k);if(!Array.isArray(a)){a=[];this.set(k,a);}return a;}
 ensureIndex(a,k){if(!Array.isArray(a[k]))a[k]=[];return a[k];}
 putIndex(a,k,v){a[k]=v;return v;}
 targets(v){return this.game.resolve(v,this.self,this.other);}
 withSelf(s){return new Context(this.game,s,this.self,this.args,this.locals,this.event,this.budget);}
 call(name,args){
  this.tick();
  const fn=this.game.builtins[name];
  if(fn)return fn(this,...args);
  if(SCRIPTS[name]){
   const e=new Context(this.game,this.self,this.other,args,{},this.event,this.budget);
   const result=SCRIPTS[name](e);
   if(name==='savegame')this.game.saveCheckpoint();
   return result??0;
  }
  throw new Error('Missing GameMaker function: '+name);
 }
}

export class Renderer {
 constructor(game,canvas){this.g=game;this.canvas=canvas;this.ctx=canvas?.getContext('2d');this.images=[];this.tintCache=new Map();this.reset();}
 reset(){this.col=0xffffff;this.alpha=1;this.font=0;this.halign=0;this.valign=0;this.white=false;}
 async load(){if(typeof Image==='undefined')return;for(let i=0;i<7;i++){const im=new Image();await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src=`assets/texture${i}.png`;});this.images.push(im);}}
 sprite(si,frame,x,y,sx=1,sy=1,angle=0,blend=0xffffff,alpha=1){
  const s=this.g.sprites[si];if(!s?.textures.length||!this.ctx||!Number.isFinite(x+y+sx+sy))return;
  const info=s.info,t=s.textures[((Math.floor(frame)%s.textures.length)+s.textures.length)%s.textures.length];
  if(!t)return;
  const im=this.images[Number(t.TexturePage.split(' ').pop())];if(!im)return;
  const c=this.ctx;c.save();c.translate(x,y);c.rotate(-rad(angle));c.scale(sx,sy);c.globalAlpha=Math.max(0,Math.min(1,alpha*this.alpha));
  c.drawImage(im,t.SourceX,t.SourceY,t.SourceWidth,t.SourceHeight,t.TargetX-info.OriginX,t.TargetY-info.OriginY,t.TargetWidth,t.TargetHeight);
  if(this.white){const key=`s${si}:${Math.floor(frame)%s.textures.length}`;let mask=this.tintCache.get(key);if(!mask){mask=document.createElement('canvas');mask.width=t.SourceWidth;mask.height=t.SourceHeight;const mc=mask.getContext('2d');mc.drawImage(im,t.SourceX,t.SourceY,t.SourceWidth,t.SourceHeight,0,0,t.SourceWidth,t.SourceHeight);mc.globalCompositeOperation='source-in';mc.fillStyle='white';mc.fillRect(0,0,mask.width,mask.height);this.cache(key,mask);}c.drawImage(mask,t.TargetX-info.OriginX,t.TargetY-info.OriginY,t.TargetWidth,t.TargetHeight);}
  c.restore();
 }
 cache(k,v){if(this.tintCache.size>=24)this.tintCache.delete(this.tintCache.keys().next().value);this.tintCache.set(k,v);}
 fontInfo(){return this.g.fonts[this.font]||this.g.fonts[0];}
 lines(text){return String(text??'').replace(/#/g,'\n').split('\n');}
 measure(text){const f=this.fontInfo(),ls=this.lines(text);return {width:Math.max(0,...ls.map(l=>[...l].reduce((w,ch)=>w+(f.glyphMap.get(ch.codePointAt(0))?.Shift||f.info.EmSize*.55),0))),height:ls.length*f.lineHeight};}
 text(x,y,text){
  const c=this.ctx;if(!c)return;const f=this.fontInfo(),ls=this.lines(text),h=ls.length*f.lineHeight;
  const t=f.texture,key=`f${this.font}:${this.col}`;let im=this.tintCache.get(key);
  if(!im){const source=this.images[Number(t.TexturePage.split(' ').pop())];if(!source)return;im=document.createElement('canvas');im.width=t.SourceWidth;im.height=t.SourceHeight;const ic=im.getContext('2d');ic.drawImage(source,t.SourceX,t.SourceY,t.SourceWidth,t.SourceHeight,0,0,im.width,im.height);ic.globalCompositeOperation='source-in';ic.fillStyle=color(this.col);ic.fillRect(0,0,im.width,im.height);this.cache(key,im);}
  c.save();c.globalAlpha=Math.min(1,Math.max(0,this.alpha));y-=h*(this.valign/2);
  for(const line of ls){let xx=x-this.measure(line).width*(this.halign/2);for(const ch of line){const glyph=f.glyphMap.get(ch.codePointAt(0));if(glyph){if(glyph.SourceWidth&&glyph.SourceHeight)c.drawImage(im,glyph.SourceX,glyph.SourceY,glyph.SourceWidth,glyph.SourceHeight,xx+glyph.Offset,y,glyph.SourceWidth,glyph.SourceHeight);xx+=glyph.Shift;}else xx+=f.info.EmSize*.55;}y+=f.lineHeight;}
  c.restore();
 }
 rectangle(x1,y1,x2,y2,outline=false,round=false){const c=this.ctx;if(!c)return;c.save();c.globalAlpha=Math.min(1,Math.max(0,this.alpha));c.fillStyle=c.strokeStyle=color(this.col);c.beginPath();const x=Math.min(x1,x2),y=Math.min(y1,y2),w=Math.abs(x2-x1),h=Math.abs(y2-y1);if(round&&c.roundRect)c.roundRect(x,y,w,h,Math.min(10,w/2,h/2));else c.rect(x,y,w,h);outline?c.stroke():c.fill();c.restore();}
 inView(si,x,y,sx=1,sy=1){const s=this.g.sprites[si];if(!s)return false;const i=s.info,cam=this.g.camera;let left=x-i.OriginX*sx,top=y-i.OriginY*sy,right=left+i.Width*sx,bottom=top+i.Height*sy;if(left>right)[left,right]=[right,left];if(top>bottom)[top,bottom]=[bottom,top];return right>=cam.x-150&&left<=cam.x+cam.w+150&&bottom>=cam.y-150&&top<=cam.y+cam.h+150;}
 self(s){this.sprite(s.sprite_index,s.image_index,s.x,s.y,s.image_xscale,s.image_yscale,s.image_angle,s.image_blend,s.image_alpha);}
 background(l){
  const d=l.data,i=l.info,c=this.ctx,cam=this.g.camera;if(!c||!i.IsVisible||!d.Visible)return;
  if(!d.Sprite){c.save();c.fillStyle=color(d.Color);c.globalAlpha=((d.Color>>>24)&255)/255;c.fillRect(cam.x,cam.y,cam.w,cam.h);c.restore();return;}
  const si=this.g.assets[d.Sprite],s=this.g.sprites[si];if(!s)return;
  const w=s.info.Width,h=s.info.Height;
  let x=i.XOffset,y=i.YOffset,frame=(d.FirstFrame||0)+(this.g.frame*(d.AnimationSpeed||0)/(d.AnimationSpeedType?1:60));
  if(d.Stretch){this.sprite(si,frame,x+s.info.OriginX,y+s.info.OriginY,this.g.room.info.Width/w,this.g.room.info.Height/h);return;}
  const xs=d.TiledHorizontally?Math.floor((cam.x-x)/w):0,xe=d.TiledHorizontally?Math.ceil((cam.x+cam.w-x)/w):0;
  const ys=d.TiledVertically?Math.floor((cam.y-y)/h):0,ye=d.TiledVertically?Math.ceil((cam.y+cam.h-y)/h):0;
  for(let a=xs;a<=xe;a++)for(let b=ys;b<=ye;b++)this.sprite(si,frame,x+a*w,y+b*h,1,1,0,d.Color);
 }
 draw(){
  const c=this.ctx;if(!c)return;this.reset();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,this.canvas.width,this.canvas.height);c.fillStyle='#101318';c.fillRect(0,0,this.canvas.width,this.canvas.height);
  const cam=this.g.camera;c.setTransform(this.canvas.width/cam.w,0,0,this.canvas.height/cam.h,-cam.x*this.canvas.width/cam.w,-cam.y*this.canvas.height/cam.h);c.imageSmoothingEnabled=false;
  const commands=[];
  for(const l of this.g.layers){if(l.info.LayerType===1)commands.push({depth:l.info.LayerDepth,run:()=>this.background(l)});if(l.info.IsVisible)for(const a of l.sprites||[]){const si=this.g.assets[a.Sprite];if(this.inView(si,a.X+l.info.XOffset,a.Y+l.info.YOffset,a.ScaleX,a.ScaleY))commands.push({depth:l.info.LayerDepth,run:()=>{const sp=this.g.sprites[si].info;const rate=a.AnimationSpeedType?a.AnimationSpeed:sp.GMS2PlaybackSpeed*(a.AnimationSpeed||1)/60;this.sprite(si,(a.FrameIndex||0)+this.g.frame*rate,a.X+l.info.XOffset,a.Y+l.info.YOffset,a.ScaleX,a.ScaleY,a.Rotation,a.Color);}});}}
  for(const s of this.g.instances){if(s.dead||!s.visible||!this.g.layerVisible(s.layer))continue;const ev=this.g.eventFor(s.object_index,8,0);if(ev||this.inView(s.sprite_index,s.x,s.y,s.image_xscale,s.image_yscale))commands.push({depth:s.depth,run:()=>{this.reset();if(ev)this.g.runEvent(s,8,0);else this.self(s);}});}
  commands.sort((a,b)=>b.depth-a.depth);for(const cmd of commands)cmd.run();
  c.setTransform(this.canvas.width/this.g.gui.w,0,0,this.canvas.height/this.g.gui.h,0,0);
  for(const s of [...this.g.instances].filter(s=>!s.dead&&s.visible&&this.g.layerVisible(s.layer)).sort((a,b)=>b.depth-a.depth)){this.reset();this.g.runEvent(s,8,64);}
  c.setTransform(1,0,0,1,0,0);
 }
}

export class Engine {
 constructor(data,canvas=null,storage=null){
  this.data=data;this.assets={};this.sprites=data.sprites;this.fonts=data.fonts;
  for(const collection of ['sprites','objects','rooms'])data[collection].forEach((o,i)=>this.assets[o.info.Name]=i);
  data.fonts.forEach((f,i)=>{this.assets[f.info.Name]=i;f.glyphMap=new Map(f.glyphs.map(g=>[g.Character,g]));f.lineHeight=Math.max(...f.glyphs.filter(g=>g.Character<127).map(g=>g.SourceHeight));});
  data.sounds.forEach((s,i)=>this.assets[s.Name]=i);this.assets.shWhite=1;this.assets.shBlend=0;
  this.objects=data.objects.map(o=>({...o,events:new Map(o.events.flatMap(t=>t.events.map(e=>[`${t.type}:${e.subtype}`,e.code])))}));
  this.eventCache=new Map();this.nullInstance={};this.global=new Proxy({}, {get:(o,k)=>o[k]??0});this.instances=[];this.byId=new Map();this.nextId=200000;this.roomIndex=0;this.fps=60;this.frame=0;this.camera={x:0,y:0,w:1366,h:768};this.gui={w:1024,h:768};
  this.input={keys:new Set(),pressed:new Set(),released:new Set(),buttons:new Set(),bpressed:new Set(),breleased:new Set(),mx:0.5,my:0.5};
  this.errors=[];this.errorSet=new Set();this.paused=false;this.audioEnabled=true;this.audioPool=new Map();this.soundsPlaying=new Map();this.nextSound=1;
  this.storage=storage||(typeof localStorage!=='undefined'?localStorage:null);this.memoryFiles=new Map();this.ini=null;this.renderer=new Renderer(this,canvas);this.builtins=this.makeBuiltins();this.pendingRoom=null;
 }
 match(s,target){let n=s.object_index;while(n!==undefined&&n>=0){if(n===Number(target))return true;const p=this.objects[n]?.info.ParentId;n=p?this.assets[p]:-1;}return false;}
 resolve(target,self=null,other=null){
  if(target&&typeof target==='object')return target.dead?[]:[target];
  if(target===-1)return self?[self]:[];if(target===-2)return other?[other]:[];if(target===-3)return this.instances.filter(i=>!i.dead);
  if(Number(target)>=100000){const s=this.byId.get(Number(target));return s&&!s.dead?[s]:[];}
  if(Number(target)>=0&&Number(target)<this.objects.length)return this.instances.filter(i=>!i.dead&&this.match(i,target));return [];
 }
 eventFor(obj,type,sub){const key=`${obj}:${type}:${sub}`;if(this.eventCache.has(key))return this.eventCache.get(key);let index=obj,result=null;while(index>=0){const o=this.objects[index];const names=o?.events.get(`${type}:${sub}`);if(names){result={owner:index,names};break;}index=o?.info.ParentId?this.assets[o.info.ParentId]:-1;}this.eventCache.set(key,result);return result;}
 runEvent(s,type,sub,other=null,start=s.object_index){if(this.pendingRoom!==null&&![1,7,12].includes(type))return;if(s.dead&&type!==1&&type!==12)return;const ev=this.eventFor(start,type,sub);if(!ev)return;for(const name of ev.names)this.runCode(name,s,other,[],{type,sub,owner:ev.owner});}
 runCode(name,s,other=null,args=[],event=null){const code=CODE[name];if(!code)return;try{return code(new Context(this,s,other,args,{},event));}catch(error){const key=name+': '+error.message;if(!this.errorSet.has(key)){this.errorSet.add(key);this.errors.push({code:name,error:error.message,room:this.room?.info.Name,frame:this.frame});if(this.errors.length<=60)console.error(key);}return 0;}}
 create(obj,x,y,layer=null,id=null,initial={},run=true){
  const o=this.objects[obj];if(!o)throw new Error('Unknown object '+obj);if(run&&o.info.Name==='oDanielText6'){const existing=this.instances.find(s=>!s.dead&&s.object_index===obj);if(existing)return existing;}const l=this.getLayer(layer);
  const s={id:id??this.nextId++,object_index:obj,x,y,xstart:x,ystart:y,xprevious:x,yprevious:y,sprite_index:o.info.Sprite?this.assets[o.info.Sprite]:-1,mask_index:o.info.TextureMaskId?this.assets[o.info.TextureMaskId]:-1,visible:o.info.Visible,persistent:o.info.Persistent,depth:l?.info.LayerDepth??o.info.Depth,layer:l?.info.LayerId??-1,image_index:0,image_speed:1,image_xscale:1,image_yscale:1,image_angle:0,image_alpha:1,image_blend:0xffffff,speed:0,direction:0,hspeed:0,vspeed:0,gravity:0,gravity_direction:270,friction:0,alarm:Array(12).fill(-1),...initial};
  this.instances.push(s);this.byId.set(s.id,s);
  if(run){this.runEvent(s,14,0);this.runEvent(s,0,0);}return s;
 }
 destroy(target,self){for(const s of this.resolve(target===undefined?self:target,self)){if(s.dead)continue;this.runEvent(s,1,0);s.dead=true;this.runEvent(s,12,0);}}
 change(s,obj,perform){if(perform)this.runEvent(s,1,0);const o=this.objects[obj];if(!o)return;s.object_index=obj;s.sprite_index=o.info.Sprite?this.assets[o.info.Sprite]:-1;s.mask_index=o.info.TextureMaskId?this.assets[o.info.TextureMaskId]:-1;s.image_index=0;s.image_speed=1;s.visible=o.info.Visible;s.persistent=o.info.Persistent;if(perform)this.runEvent(s,0,0);}
 getLayer(name){const exact=this.layers?.find(l=>typeof name==='string'?l.info.LayerName===name:l.info.LayerId===name);return exact||(typeof name==='string'?this.layers?.find(l=>l.info.LayerName.toLowerCase()===name.toLowerCase()):undefined);}
 layerVisible(id){return this.getLayer(id)?.info.IsVisible!==false;}
 repairWeaponOwnership(){
  for(const [flag,weapon,pickup] of [['weapon1','oGun','oGunPickup'],['weapon2','oGun59','ogrenadepickup']]){
   const provided=this.resolve(this.assets[weapon]).length>0;
   const collected=this.room.instances.some(i=>i.ObjectDefinition===pickup)&&!this.resolve(this.assets[pickup]).length;
   if(provided||collected)this.global[flag]=true;
  }
 }
 resetPetrolShift(){
  const names=['oCustoemrs','oCustoemrs2','oCustoemrs3','oCustomerArea','oCustomerArea2','oCustomerArea3','playerwallcustomer','oNepalguysound'];
  for(const name of [...names,'oCrate','oCrate2','oCrate3','oNepalguytext','oDanielText7'])this.destroy(this.assets[name]);
  const layerIds=new Map(this.layers.flatMap(l=>(l.instances||[]).map(id=>[id,l.info.LayerId])));
  for(const i of this.room.instances.filter(i=>names.includes(i.ObjectDefinition))){
   const s=this.create(this.assets[i.ObjectDefinition],i.X,i.Y,layerIds.get(i.InstanceID),null,{image_xscale:i.ScaleX,image_yscale:i.ScaleY,image_angle:i.Rotation,image_index:i.ImageIndex,image_speed:i.ImageSpeed,image_blend:i.Color&0xffffff,image_alpha:(i.Color>>>24)/255},false);
   this.runEvent(s,14,0);if(i.PreCreateCode)this.runCode(i.PreCreateCode,s);this.runEvent(s,0,0);if(i.CreationCode)this.runCode(i.CreationCode,s);
  }
  this.global.quest3=0;this.global.petrolpaid=false;this.global.hasslept=false;
 }
 repairPetrolMessages(){
  let found=false;
  this.instances=this.instances.filter(s=>{if(s.dead)return false;if(s.object_index!==this.assets.oNepalguytext)return true;if(found)return false;found=true;return true;});
  if(found&&!['oCustoemrs','oCustoemrs2','oCustoemrs3'].some(n=>this.resolve(this.assets[n]).length)){this.global.quest3=1;this.global.petrolpaid=true;}
  this.byId=new Map(this.instances.map(s=>[s.id,s]));
 }
 updateFireEligibility(){
  const x=this.camera.x+this.input.mx*this.camera.w,y=this.camera.y+this.input.my*this.camera.h;
  this.global.dontshoot=true;
  this.fireBlockers??=new Set(['oBedSleep','oJobSign','oMum','oPetrolstationDoor','oSign'].map(n=>this.assets[n]));
  for(const s of this.instances){if(s.dead||!this.fireBlockers.has(s.object_index)||!s.visible||!this.layerVisible(s.layer))continue;const b=this.bounds(s);if(x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom){this.global.dontshoot=false;return;}}
 }
 loadRoom(index,keep=true){
  if(typeof index==='string')index=this.assets[index];if(!this.data.rooms[index])throw new Error('Unknown room '+index);this.pendingRoom=null;
  for(const s of this.instances)this.runEvent(s,7,5);
  this.instances=keep?this.instances.filter(s=>!s.dead&&s.persistent):[];this.byId=new Map(this.instances.map(s=>[s.id,s]));this.roomIndex=index;this.room=this.data.rooms[index];this.layers=structuredClone(this.room.layers);this.camera={x:0,y:0,w:1366,h:768};this.frame=0;this.audioStop();
  const view=this.room.views.find(v=>v.Enabled);if(view)this.camera={x:view.ViewX,y:view.ViewY,w:view.ViewWidth,h:view.ViewHeight};
  const layerIds=new Map(this.layers.flatMap(l=>(l.instances||[]).map(id=>[id,l.info.LayerId])));const placed=[];
  for(const i of this.room.instances){const obj=this.assets[i.ObjectDefinition];if(this.objects[obj].info.Persistent&&this.instances.some(s=>s.object_index===obj))continue;const s=this.create(obj,i.X,i.Y,layerIds.get(i.InstanceID),i.InstanceID,{image_xscale:i.ScaleX,image_yscale:i.ScaleY,image_angle:i.Rotation,image_index:i.ImageIndex,image_speed:i.ImageSpeed,image_blend:i.Color&0xffffff,image_alpha:(i.Color>>>24)/255},false);placed.push([s,i]);}
  for(const [s,i] of placed){this.runEvent(s,14,0);if(i.PreCreateCode)this.runCode(i.PreCreateCode,s);this.runEvent(s,0,0);if(i.CreationCode)this.runCode(i.CreationCode,s);}
  if(this.room.info.CreationCodeId)this.runCode(this.room.info.CreationCodeId,this.instances[0]||{});
  for(const s of this.instances)this.runEvent(s,7,4);
  this.repairWeaponOwnership();this.buildGrid();this.pendingRoom=null;this.onRoomChange?.(this.room.info.Name);
 }
 bounds(s,x=s.x,y=s.y){
  const spr=this.sprites[s.mask_index>=0?s.mask_index:s.sprite_index];if(!spr)return {left:x,right:x,top:y,bottom:y,valid:false};
  const i=spr.info;let left=(i.MarginLeft-i.OriginX)*s.image_xscale,right=(i.MarginRight+1-i.OriginX)*s.image_xscale,top=(i.MarginTop-i.OriginY)*s.image_yscale,bottom=(i.MarginBottom+1-i.OriginY)*s.image_yscale;
  if(s.image_angle&&s.mask_index<0){const points=[[left,top],[right,top],[right,bottom],[left,bottom]].map(([a,b])=>[a*Math.cos(rad(s.image_angle))+b*Math.sin(rad(s.image_angle)),-a*Math.sin(rad(s.image_angle))+b*Math.cos(rad(s.image_angle))]);left=Math.min(...points.map(p=>p[0]));right=Math.max(...points.map(p=>p[0]));top=Math.min(...points.map(p=>p[1]));bottom=Math.max(...points.map(p=>p[1]));}
  return {left:x+Math.min(left,right),right:x+Math.max(left,right),top:y+Math.min(top,bottom),bottom:y+Math.max(top,bottom),valid:true,instance:s,x,y};
 }
 overlaps(a,b){return a.valid&&b.valid&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}
 spriteMask(b){const s=b.instance;return s?this.sprites[s.mask_index>=0?s.mask_index:s.sprite_index]:null;}
 maskContains(b,x,y){
  const s=b.instance,sp=this.spriteMask(b);if(!s||!sp)return true;
  const i=sp.info,dx=x-b.x,dy=y-b.y,angle=rad(s.image_angle);
  const px=(dx*Math.cos(angle)-dy*Math.sin(angle))/s.image_xscale+i.OriginX;
  const py=(dx*Math.sin(angle)+dy*Math.cos(angle))/s.image_yscale+i.OriginY;
  if(i.SepMasks===2)return px>=i.MarginLeft&&px<i.MarginRight+1&&py>=i.MarginTop&&py<i.MarginBottom+1;
  if(i.SepMasks!==1||!sp.masks)return x>=b.left&&x<b.right&&y>=b.top&&y<b.bottom;
  if(px<0||py<0||px>=i.Width||py>=i.Height)return false;
  if(!sp.maskBytes)sp.maskBytes=sp.masks.map(m=>typeof atob==='function'?Uint8Array.from(atob(m),c=>c.charCodeAt(0)):Uint8Array.from(Buffer.from(m,'base64')));
  const mask=sp.maskBytes[Math.floor(s.image_index)%sp.maskBytes.length],ix=Math.floor(px),iy=Math.floor(py);
  return !!(mask[iy*Math.ceil(i.Width/8)+(ix>>3)]&(128>>(ix&7)));
 }
 collides(a,b){
  if(!this.overlaps(a,b))return false;
  const sa=this.spriteMask(a),sb=this.spriteMask(b);
  const special=sa?.info.SepMasks===1||sb?.info.SepMasks===1||(sa?.info.SepMasks===2&&a.instance.image_angle)||(sb?.info.SepMasks===2&&b.instance.image_angle);
  if(!special)return true;
  const left=Math.max(a.left,b.left),right=Math.min(a.right,b.right),top=Math.max(a.top,b.top),bottom=Math.min(a.bottom,b.bottom);
  const dx=Math.min(1,right-left),dy=Math.min(1,bottom-top);
  for(let y=top+dy/2;y<bottom;y+=dy)for(let x=left+dx/2;x<right;x+=dx)if(this.maskContains(a,x,y)&&this.maskContains(b,x,y))return true;
  return false;
 }
 buildGrid(){this.grid=new Map();this.dynamic=[];for(const s of this.instances){if(s.dead)continue;const hasStep=[0,1,2].some(sub=>this.eventFor(s.object_index,3,sub)?.names.some(n=>CODE[n]&&CODE[n].toString().length>22));if(hasStep){this.dynamic.push(s);continue;}const b=this.bounds(s);if(!b.valid)continue;for(let x=Math.floor(b.left/256);x<=Math.floor(b.right/256);x++)for(let y=Math.floor(b.top/256);y<=Math.floor(b.bottom/256);y++){const key=`${x}:${y}`;if(!this.grid.has(key))this.grid.set(key,[]);this.grid.get(key).push(s);}}this.gridCount=this.instances.length;}
 query(b,target,self){if(this.gridCount!==this.instances.length)this.buildGrid();const candidates=new Set(this.dynamic);for(let x=Math.floor(b.left/256);x<=Math.floor(b.right/256);x++)for(let y=Math.floor(b.top/256);y<=Math.floor(b.bottom/256);y++)for(const s of this.grid.get(`${x}:${y}`)||[])candidates.add(s);return [...candidates].filter(s=>!s.dead&&s!==self&&(target===-3||target===s.id||this.match(s,target))&&this.collides(b,this.bounds(s)));}
 place(s,x,y,target){return this.query(this.bounds(s,x,y),target,s)[0]||null;}
 step(){
  if(this.paused||!this.room)return;this.frame++;this.updateFireEligibility();const before=[...this.instances];
  for(const s of before){if(s.dead)continue;s.xprevious=s.x;s.yprevious=s.y;this.runEvent(s,3,1);}
  for(const s of before){if(s.dead)continue;for(let i=0;i<12;i++)if(s.alarm[i]>0){if(--s.alarm[i]===0){s.alarm[i]=-1;this.runEvent(s,2,i);}}}
  for(const s of before){if(s.dead)continue;for(const k of this.input.pressed)this.runEvent(s,9,k);for(const k of this.input.released)this.runEvent(s,10,k);for(const k of this.input.keys)this.runEvent(s,5,k);if(this.input.pressed.size)this.runEvent(s,9,1);this.runMouse(s);this.runEvent(s,3,0);if(s.hspeed||s.vspeed){s.x+=s.hspeed;s.y+=s.vspeed;}if(s.gravity){s.hspeed+=lx(s.gravity,s.gravity_direction);s.vspeed+=ly(s.gravity,s.gravity_direction);}}
  this.buildGrid();
  for(const s of before){if(s.dead)continue;for(let o=s.object_index;o>=0;){for(const [key] of this.objects[o].events){if(!key.startsWith('4:'))continue;const sub=Number(key.slice(2));for(const t of this.query(this.bounds(s),sub,s)){this.runEvent(s,4,sub,t);if(s.dead)break;}}const p=this.objects[o].info.ParentId;o=p?this.assets[p]:-1;}}
  for(const s of before){if(s.dead)continue;this.runEvent(s,3,2);const spr=this.sprites[s.sprite_index];if(spr){const rate=spr.info.GMS2PlaybackSpeedType?spr.info.GMS2PlaybackSpeed:spr.info.GMS2PlaybackSpeed/this.fps;const frames=spr.textures.length;s.image_index+=s.image_speed*rate;if(frames&&s.image_index>=frames){s.image_index%=frames;this.runEvent(s,7,7);}if(s.image_index<0&&frames)s.image_index=(s.image_index%frames+frames)%frames;}}
  for(const l of this.layers){l.info.XOffset+=l.info.HSpeed;l.info.YOffset+=l.info.VSpeed;}
  this.instances=this.instances.filter(s=>!s.dead);this.byId=new Map(this.instances.map(s=>[s.id,s]));
  this.input.pressed.clear();this.input.released.clear();this.input.bpressed.clear();this.input.breleased.clear();
  if(this.pendingRoom!==null)this.loadRoom(this.pendingRoom);
 }
 runMouse(s){const b=this.bounds(s),x=this.camera.x+this.input.mx*this.camera.w,y=this.camera.y+this.input.my*this.camera.h,inside=x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom;for(const n of this.input.bpressed){this.runEvent(s,6,49+n);if(inside)this.runEvent(s,6,3+n);}for(const n of this.input.buttons)if(inside)this.runEvent(s,6,n-1);for(const n of this.input.breleased)if(inside)this.runEvent(s,6,6+n);}
 readFile(name){try{return this.storage?.getItem('himr:file:'+name)??this.memoryFiles.get(name)??null;}catch{return this.memoryFiles.get(name)??null;}}
 writeFile(name,text){this.memoryFiles.set(name,text);try{this.storage?.setItem('himr:file:'+name,text);}catch{}}
 saveCheckpoint(){const p=this.resolve(this.assets.Object1)[0];if(!p)return false;const state={version:2,room:this.roomIndex,x:p.x,y:p.y,global:{...this.global},instances:this.instances.filter(i=>!i.dead),layers:this.layers.map(l=>l.info),frame:this.frame,time:Date.now()};this.writeFile('checkpoint',JSON.stringify(state));this.writeFile('User.sav',JSON.stringify({Save1:{gscore:this.global.kills,gammo:this.global.ammo,ggrenades:this.global.bullets,gphp:this.global.php,gslowmo:this.global.slowmo,gstocks:this.global.stocks,gtapes:this.global.tapes,gallowance:this.global.takenallowance}}));this.onSave?.();return true;}
 restoreCheckpoint(){const text=this.readFile('checkpoint');if(!text)return false;try{const s=JSON.parse(text);this.loadRoom(s.room,false);Object.assign(this.global,s.global);if(s.version===2&&Array.isArray(s.instances)){this.instances=s.instances;this.byId=new Map(this.instances.map(i=>[i.id,i]));this.nextId=this.instances.reduce((max,i)=>Math.max(max,i.id+1),200000);this.frame=s.frame||0;for(const info of s.layers||[]){const l=this.getLayer(info.LayerId);if(l)Object.assign(l.info,info);}}const p=this.resolve(this.assets.Object1)[0];if(p){p.x=s.x;p.y=s.y;p.vsp=0;}this.repairWeaponOwnership();this.repairPetrolMessages();this.buildGrid();return true;}catch{return false;}}
 audioPlay(id,loop){if(!this.audioEnabled||typeof Audio==='undefined')return 0;const spec=this.data.sounds[id];if(!spec)return 0;let pool=this.audioPool.get(id);if(!pool){pool=[];this.audioPool.set(id,pool);}let a=pool.find(a=>a.paused||a.ended);if(!a&&pool.length<3){a=new Audio('assets/'+spec.path);a.preload='none';pool.push(a);}if(!a){if(loop)return 0;a=pool[0];a.pause();}a.loop=!!loop;a.volume=(spec.Volume??1)*.55;a.currentTime=0;a.play().catch(()=>{});const handle=this.nextSound++;this.soundsPlaying.set(handle,a);if(this.soundsPlaying.size>100)this.soundsPlaying.delete(this.soundsPlaying.keys().next().value);return handle;}
 audioStop(){for(const pool of this.audioPool.values())for(const a of pool)a.pause();this.soundsPlaying.clear();}
 makeBuiltins(){
  const g=this,r=this.renderer;
  const f={
   sign:(_,n)=>Math.sign(n),abs:(_,n)=>Math.abs(n),sin:(_,n)=>Math.sin(n),floor:(_,n)=>Math.floor(n),min:(_, ...a)=>Math.min(...a.filter(n=>!Number.isNaN(n))),max:(_, ...a)=>Math.max(...a.filter(n=>!Number.isNaN(n))),clamp:(_,n,a,b)=>Math.max(a,Math.min(b,n)),random_range:(_,a,b)=>a+Math.random()*(b-a),choose:(_, ...a)=>a[Math.floor(Math.random()*a.length)],lengthdir_x:(_,n,d)=>lx(n,d),lengthdir_y:(_,n,d)=>ly(n,d),point_direction:(_,x,y,a,b)=>direction(x,y,a,b),point_distance:(_,x,y,a,b)=>Math.hypot(x-a,y-b),point_in_circle:(_,x,y,a,b,r)=>Math.hypot(x-a,y-b)<=r,
   keyboard_check:(_,k)=>k===1?g.input.keys.size>0:g.input.keys.has(k),keyboard_check_pressed:(_,k)=>k===1?g.input.pressed.size>0:g.input.pressed.has(k),mouse_check_button:(_,n)=>g.input.buttons.has(n),mouse_check_button_pressed:(_,n)=>g.input.bpressed.has(n),ord:(_,s)=>String(s).toUpperCase().charCodeAt(0),device_mouse_y_to_gui:()=>g.input.my*g.gui.h,
   instance_exists:(e,o)=>g.resolve(o,e.self,e.other).length>0,instance_create_layer:(e,x,y,l,o)=>g.create(o,x,y,l).id,instance_destroy:(e,o)=>g.destroy(o,e.self),instnce_destroy:(e,o)=>g.destroy(o,e.self),instance_change:(e,o,v)=>g.change(e.self,o,v),place_meeting:(e,x,y,o)=>!!g.place(e.self,x,y,o),instance_place:(e,x,y,o)=>g.place(e.self,x,y,o)?.id??-4,petrol_shift_start:()=>g.resetPetrolShift(),
   collision_line:(e,x1,y1,x2,y2,o,precise,notme)=>{const b={left:Math.min(x1,x2),right:Math.max(x1,x2)+1,top:Math.min(y1,y2),bottom:Math.max(y1,y2)+1,valid:true};for(const s of g.query(b,o,notme?e.self:null)){const a=g.bounds(s);let lo=0,hi=1;for(const [p,q] of [[-(x2-x1),x1-a.left],[x2-x1,a.right-x1],[-(y2-y1),y1-a.top],[y2-y1,a.bottom-y1]]){if(p===0&&q<0){lo=2;break;}if(p<0)lo=Math.max(lo,q/p);else if(p>0)hi=Math.min(hi,q/p);}if(lo<=hi){if(!precise)return s.id;const count=Math.max(1,Math.ceil(Math.hypot(x2-x1,y2-y1)*(hi-lo)*2));for(let k=0;k<=count;k++){const t=lo+(hi-lo)*k/count;if(g.maskContains(a,x1+(x2-x1)*t,y1+(y2-y1)*t))return s.id;}}}return -4;},
   event_inherited:(e)=>{if(!e.event)return;const p=g.objects[e.event.owner]?.info.ParentId;if(p)g.runEvent(e.self,e.event.type,e.event.sub,e.other,g.assets[p]);},alarm_set:(e,n,v)=>e.self.alarm[n]=v,
   layer_set_visible:(_,l,v)=>{const layer=g.getLayer(l);if(layer)layer.info.IsVisible=!!v;},layer_exists:(_,l)=>!!g.getLayer(l),layer_x:(_,l,v)=>{const layer=g.getLayer(l);if(layer)layer.info.XOffset=v;},layer_add_instance:(_,l,id)=>{const s=g.resolve(id)[0],layer=g.getLayer(l);if(s&&layer){s.layer=layer.info.LayerId;s.depth=layer.info.LayerDepth;}},
   room_goto:(_,i)=>g.pendingRoom=i,room_goto_next:()=>{const order=g.data.roomOrder;g.pendingRoom=g.assets[order[(order.indexOf(g.room.info.Name)+1)%order.length]];},game_restart:()=>{g.global=new Proxy({}, {get:(o,k)=>o[k]??0});g.instances=[];g.pendingRoom=g.assets[g.data.roomOrder[0]];},game_end:()=>{g.paused=true;g.onExit?.();},game_set_speed:(_,fps)=>g.fps=fps,
   camera_get_view_width:()=>g.camera.w,camera_get_view_height:()=>g.camera.h,camera_get_view_x:()=>g.camera.x,camera_get_view_y:()=>g.camera.y,camera_set_view_pos:(_,id,x,y)=>{if(Number.isFinite(x+y)){g.camera.x=x;g.camera.y=y;}},display_set_gui_size:(_,w,h)=>g.gui={w,h},display_get_gui_width:()=>g.gui.w,display_get_gui_height:()=>g.gui.h,font_get_size:(_,i)=>g.fonts[i]?.info.EmSize||24,
   draw_set_colour:(_,c)=>r.col=c,draw_set_color:(_,c)=>r.col=c,draw_set_alpha:(_,a)=>r.alpha=a,draw_set_font:(_,f)=>r.font=f,draw_set_halign:(_,v)=>r.halign=v,draw_set_valign:(_,v)=>r.valign=v,draw_self:(e)=>r.self(e.self),draw_sprite:(_,s,n,x,y)=>r.sprite(s,n,x,y),draw_text:(_,x,y,t)=>r.text(x,y,t),draw_text_transformed:(_,x,y,t,sx,sy,a)=>{const c=r.ctx;if(!c)return;c.save();c.translate(x,y);c.rotate(-rad(a));c.scale(sx,sy);r.text(0,0,t);c.restore();},draw_rectangle:(_,a,b,c,d,o)=>r.rectangle(a,b,c,d,o),draw_roundrect_ext:(_,a,b,c,d,rx,ry,o)=>r.rectangle(a,b,c,d,o,true),shader_set:()=>r.white=true,shader_reset:()=>r.white=false,
   string:(_,v)=>typeof v==='number'?formatGameNumber(v):String(v),string_length:(_,v)=>String(v).length,string_copy:(_,v,start,n)=>String(v).substr(Math.max(0,start-1),n),string_height:(_,v)=>r.measure(v).height,string_width:(_,v)=>r.measure(v).width,string_insert:(_,s,t,n)=>String(t).slice(0,Math.max(0,n-1))+s+String(t).slice(Math.max(0,n-1)),array_length_1d:(_,a)=>a.length||0,
   ds_list_create:()=>[],ds_list_add:(_,a,...v)=>a.push(...v),ds_list_size:(_,a)=>a.length||0,ds_list_find_value:(_,a,i)=>a[i]??0,ds_list_destroy:(_,a)=>{a.length=0;},ds_map_find_value:(_,a,k)=>a?.[k]??0,get_timer:()=>g.frame*1000000/60,
   audio_play_sound:(_,id,priority,loop)=>g.audioPlay(id,loop),audio_stop_all:()=>g.audioStop(),file_exists:(_,n)=>g.readFile(n)!==null,file_delete:(_,n)=>{g.memoryFiles.delete(n);try{g.storage?.removeItem('himr:file:'+n);}catch{}},ini_open:(_,n)=>{g.ini={name:n,data:JSON.parse(g.readFile(n)||'{}')};},ini_read_real:(_,section,k,d)=>g.ini?.data[section]?.[k]??d,ini_write_real:(_,section,k,v)=>{g.ini.data[section]??={};g.ini.data[section][k]=v;},ini_close:()=>{if(g.ini)g.writeFile(g.ini.name,JSON.stringify(g.ini.data));g.ini=null;},
   file_text_open_write:(_,n)=>({name:n,values:[],index:0}),file_text_write_real:(_,file,v)=>file.values.push(v),file_text_open_read:(_,n)=>({name:n,values:JSON.parse(g.readFile(n)||'[]'),index:0,read:true}),file_text_read_real:(_,f)=>f.values[f.index++]??0,file_text_close:(_,f)=>{if(!f.read)g.writeFile(f.name,JSON.stringify(f.values));}
  };
  return f;
 }
}
