import {CODE, SCRIPTS} from './code.js';
import {WORLD_FORMAT,WORLD_VERSION,DEFAULT_CHEATS,ROOM_VARIABLES,cloneState,validateWorld,encodeWorld} from './world-state.js';
import {FaceEasterEgg} from './easter-egg.js';
import {GameAudio} from './audio.js';
import {AlarmIndex} from './alarms.js';

const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const rad=d=>d*Math.PI/180;
const lx=(n,d)=>n*Math.cos(rad(d)), ly=(n,d)=>-n*Math.sin(rad(d));
const direction=(x,y,a,b)=>(Math.atan2(y-b,a-x)*180/Math.PI+360)%360;
const color=n=>`rgb(${n&255},${(n>>>8)&255},${(n>>>16)&255})`;
const parseFile=(text,fallback)=>{try{return text&&text.length<=65536?JSON.parse(text):fallback;}catch{return fallback;}};
export const formatGameNumber=value=>Number.isFinite(value)?String(Number(value.toFixed(2))):String(value);
export const gmlBoolean=value=>typeof value==='number'?value>.5:!!value;
const arrays=new Set(['alarm','spawn','remaining','endtext','menu','weapons']);
const sharedProgress=['kills','ammo','bullets','stocks','tapes','php','slowmo','weapon1','weapon2','equippedweapon','takenallowance','hasquest1','hasquest2','hasquest3','quest1','quest2','quest3','acceptedquest','hasslept'];
const constants={vk_left:37,vk_right:39,vk_up:38,vk_down:40,vk_enter:13,vk_space:32,vk_escape:27,vk_anykey:1,vk_nokey:0,mb_left:1,mb_right:2,mb_middle:3,fa_left:0,fa_center:1,fa_right:2,fa_top:0,fa_middle:1,fa_bottom:2,c_white:0xffffff,c_black:0,c_red:255,c_lime:65280,c_green:32768,c_yellow:65535,c_gray:8421504,c_silver:12632256,c_aqua:16776960,c_blue:16711680,gamespeed_fps:0,noone:-4,all:-3,self:-1,other:-2};

class Context {
 constructor(game,self,other=null,args=[],locals={},event=null,budget={n:0}) {Object.assign(this,{game,self,other,args,locals,event,budget});}
 tick(){if(++this.budget.n>12000)throw new Error('Loop exceeded 12,000 iterations');}
 truthy(value){return gmlBoolean(value);}
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
  if(k==='mouse_x')return g.pointerWorld().x;
  if(k==='mouse_y')return g.pointerWorld().y;
  if(k==='view_camera')return [0];
  if(k.startsWith('bbox_'))return g.bounds(s)[k.slice(5)];
  if(k==='sprite_width')return g.sprites[s.sprite_index]?.info.Width||0;
  if(k==='sprite_height')return g.sprites[s.sprite_index]?.info.Height||0;
  if(k==='image_number')return g.sprites[s.sprite_index]?.textures.length||1;
  if(k==='speed')return Math.hypot(s.hspeed||0,s.vspeed||0);
  if(k==='direction'&&(s.hspeed||s.vspeed))return direction(0,0,s.hspeed,s.vspeed);
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
  if(k==='direction'&&this.get('speed')){const speed=this.get('speed');this.self.hspeed=lx(speed,v);this.self.vspeed=ly(speed,v);}
  this.self[k]=v;
  if(this.self.object_index!==undefined){
   if(['speed','hspeed','vspeed','gravity'].includes(k)&&v)this.game.promoteDynamic(this.self);
   if(['x','y','image_xscale','image_yscale','image_angle','sprite_index','mask_index','image_index'].includes(k)&&!this.game.isDynamic(this.self))this.game.gridDirty=true;
  }
  return v;
 }
 declare(k,v){this.locals[k]=v;return v;}
 member(o,k){
  if(typeof o==='number'||typeof o==='boolean')o=this.game.first(o);
  if(!o)return 0;
  if(k.startsWith('bbox_')&&o.object_index!==undefined)return this.game.bounds(o)[k.slice(5)];
  if(o.object_index!==undefined&&['speed','direction'].includes(k))return new Context(this.game,o).get(k);
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
   if(name==='savegame')this.game.onStatsSave?.(this.game.lastFileWritePersistent);
   return result??0;
  }
  throw new Error('Missing GameMaker function: '+name);
 }
}

export class Renderer {
 constructor(game,canvas){this.g=game;this.canvas=canvas;this.ctx=canvas?.getContext('2d',{alpha:false});this.images=[];this.texturePages=new WeakMap();this.tintCache=new Map();this.cacheSizes=new Map();this.cacheBytes=0;this.cacheLimit=8*1024*1024;this.cacheCount=64;this.commandPool=[];this.commandSlots=[];this.commands=[];this.commandCount=0;this.poolUsed=0;this.guiCommands=[];this.reset();}
 reset(){this.col=0xffffff;this.alpha=1;this.font=0;this.halign=0;this.valign=0;this.white=false;}
 async load(){if(typeof Image==='undefined')return;for(let i=0;i<7;i++){const im=new Image();await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src=`assets/texture${i}.png`;});this.images.push(im);}if(this.g.faceEgg.enabled)try{await this.g.faceEgg.load();}catch{this.g.faceEgg.setEnabled(false);}}
 sprite(si,frame,x,y,sx=1,sy=1,angle=0,blend=0xffffff,alpha=1,secretFace=false){
  const s=this.g.sprites[si];if(!s?.textures.length||!this.ctx||!Number.isFinite(x+y+sx+sy))return;
  const info=s.info,frameIndex=((Math.floor(frame)%s.textures.length)+s.textures.length)%s.textures.length,t=s.textures[frameIndex];
  if(!t)return;
  const im=this.images[this.texturePage(t)];if(!im)return;
  const c=this.ctx;c.save();c.translate(x,y);c.rotate(-rad(angle));c.scale(sx,sy);c.globalAlpha=Math.max(0,Math.min(1,alpha*this.alpha));
  const face=secretFace?this.g.faceEgg.layout(info.Name,frameIndex):null;
  if(face){c.save();c.beginPath();c.rect(t.TargetX-info.OriginX,t.TargetY-info.OriginY,t.TargetWidth,t.TargetHeight);c.rect(face.cut[0]-info.OriginX,face.cut[1]-info.OriginY,face.cut[2],face.cut[3]);c.clip('evenodd');}
  if((blend&0xffffff)!==0xffffff&&!this.white){
   const key=`c${si}:${frameIndex}:${blend&0xffffff}`;let tinted=this.cached(key);
   if(!tinted){tinted=document.createElement('canvas');tinted.width=t.SourceWidth;tinted.height=t.SourceHeight;const mc=tinted.getContext('2d');mc.drawImage(im,t.SourceX,t.SourceY,t.SourceWidth,t.SourceHeight,0,0,tinted.width,tinted.height);const pixels=mc.getImageData(0,0,tinted.width,tinted.height),r=(blend&255)/255,g=((blend>>>8)&255)/255,b=((blend>>>16)&255)/255;for(let n=0;n<pixels.data.length;n+=4){pixels.data[n]*=r;pixels.data[n+1]*=g;pixels.data[n+2]*=b;}mc.putImageData(pixels,0,0);this.cache(key,tinted);}
   c.drawImage(tinted,t.TargetX-info.OriginX,t.TargetY-info.OriginY,t.TargetWidth,t.TargetHeight);
  }else c.drawImage(im,t.SourceX,t.SourceY,t.SourceWidth,t.SourceHeight,t.TargetX-info.OriginX,t.TargetY-info.OriginY,t.TargetWidth,t.TargetHeight);
  if(this.white){const key=`s${si}:${frameIndex}`;let mask=this.cached(key);if(!mask){mask=document.createElement('canvas');mask.width=t.SourceWidth;mask.height=t.SourceHeight;const mc=mask.getContext('2d');mc.drawImage(im,t.SourceX,t.SourceY,t.SourceWidth,t.SourceHeight,0,0,t.SourceWidth,t.SourceHeight);mc.globalCompositeOperation='source-in';mc.fillStyle='white';mc.fillRect(0,0,mask.width,mask.height);this.cache(key,mask);}c.drawImage(mask,t.TargetX-info.OriginX,t.TargetY-info.OriginY,t.TargetWidth,t.TargetHeight);}
  if(face){c.restore();this.g.faceEgg.draw(c,face,info.OriginX,info.OriginY,this.white);}
  c.restore();
 }
 texturePage(t){let page=this.texturePages.get(t);if(page===undefined){page=Number(t.TexturePage.split(' ').pop());this.texturePages.set(t,page);}return page;}
 // Canvas backing stores, rather than entry count alone, bound the tint cache.
 cached(k){const v=this.tintCache.get(k);if(v){this.tintCache.delete(k);this.tintCache.set(k,v);}return v;}
 dropCache(k){const v=this.tintCache.get(k);if(!v)return;this.cacheBytes-=this.cacheSizes.get(k);this.tintCache.delete(k);this.cacheSizes.delete(k);v.width=0;v.height=0;}
 cache(k,v){const bytes=v.width*v.height*4;if(bytes>this.cacheLimit)return;if(this.tintCache.has(k)){if(this.tintCache.get(k)===v){this.cached(k);return;}this.dropCache(k);}while(this.tintCache.size>=this.cacheCount||this.cacheBytes+bytes>this.cacheLimit)this.dropCache(this.tintCache.keys().next().value);this.tintCache.set(k,v);this.cacheSizes.set(k,bytes);this.cacheBytes+=bytes;}
 fontInfo(){return this.g.fonts[this.font]||this.g.fonts[0];}
 lines(text){return String(text??'').replace(/#/g,'\n').split('\n');}
 lineWidth(line,f){let width=0;for(const ch of line)width+=f.glyphMap.get(ch.codePointAt(0))?.Shift||f.info.EmSize*.55;return width;}
 measure(text){const f=this.fontInfo(),ls=this.lines(text);let width=0;for(const line of ls)width=Math.max(width,this.lineWidth(line,f));return {width,height:ls.length*f.lineHeight};}
 text(x,y,text){
  const c=this.ctx;if(!c)return;const f=this.fontInfo(),ls=this.lines(text),h=ls.length*f.lineHeight;
  const t=f.texture,key=`f${this.font}:${this.col}`;let im=this.cached(key);
  if(!im){const source=this.images[this.texturePage(t)];if(!source)return;im=document.createElement('canvas');im.width=t.SourceWidth;im.height=t.SourceHeight;const ic=im.getContext('2d');ic.drawImage(source,t.SourceX,t.SourceY,t.SourceWidth,t.SourceHeight,0,0,im.width,im.height);ic.globalCompositeOperation='source-in';ic.fillStyle=color(this.col);ic.fillRect(0,0,im.width,im.height);this.cache(key,im);}
  c.save();c.globalAlpha=Math.min(1,Math.max(0,this.alpha));y-=h*(this.valign/2);
  for(const line of ls){let xx=x-this.lineWidth(line,f)*(this.halign/2);for(const ch of line){const glyph=f.glyphMap.get(ch.codePointAt(0));if(glyph){if(glyph.SourceWidth&&glyph.SourceHeight)c.drawImage(im,glyph.SourceX,glyph.SourceY,glyph.SourceWidth,glyph.SourceHeight,xx+glyph.Offset,y,glyph.SourceWidth,glyph.SourceHeight);xx+=glyph.Shift;}else xx+=f.info.EmSize*.55;}y+=f.lineHeight;}
  c.restore();
 }
 rectangle(x1,y1,x2,y2,outline=false,round=false){const c=this.ctx;if(!c)return;c.save();c.globalAlpha=Math.min(1,Math.max(0,this.alpha));c.fillStyle=c.strokeStyle=color(this.col);c.beginPath();const x=Math.min(x1,x2),y=Math.min(y1,y2),w=Math.abs(x2-x1),h=Math.abs(y2-y1);if(round&&c.roundRect)c.roundRect(x,y,w,h,Math.min(10,w/2,h/2));else c.rect(x,y,w,h);outline?c.stroke():c.fill();c.restore();}
 inView(si,x,y,sx=1,sy=1,angle=0){const s=this.g.sprites[si];if(!s)return false;const i=s.info,cam=this.g.camera;let left=x-i.OriginX*sx,top=y-i.OriginY*sy,right=left+i.Width*sx,bottom=top+i.Height*sy;if(angle){const cosine=Math.cos(rad(angle)),sine=Math.sin(rad(angle)),a=left-x,b=top-y,d=right-x,e=bottom-y,x1=x+a*cosine+b*sine,x2=x+d*cosine+b*sine,x3=x+d*cosine+e*sine,x4=x+a*cosine+e*sine,y1=y-a*sine+b*cosine,y2=y-d*sine+b*cosine,y3=y-d*sine+e*cosine,y4=y-a*sine+e*cosine;left=Math.min(x1,x2,x3,x4);right=Math.max(x1,x2,x3,x4);top=Math.min(y1,y2,y3,y4);bottom=Math.max(y1,y2,y3,y4);}else{if(left>right){const t=left;left=right;right=t;}if(top>bottom){const t=top;top=bottom;bottom=t;}}return right>=cam.x-150&&left<=cam.x+cam.w+150&&bottom>=cam.y-150&&top<=cam.y+cam.h+150;}
 self(s){this.sprite(s.sprite_index,s.image_index,s.x,s.y,s.image_xscale,s.image_yscale,s.image_angle,s.image_blend,s.image_alpha,s.object_index===this.g.assets.Object1||s.object_index===this.g.assets.oPDead||s.object_index===this.g.assets.oDanielbaby);}
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
 command(index,depth,kind,ref=null,layer=null,si=null,event=null){
  let cmd=this.commandPool[index];if(!cmd){cmd={index};if(index<2048)this.commandPool[index]=cmd;this.commandOrderDirty=true;}
  if(cmd.depth!==depth)this.commandOrderDirty=true;
  cmd.depth=depth;cmd.kind=kind;cmd.ref=ref;cmd.layer=layer;cmd.si=si;cmd.event=event;this.commandSlots[index]=cmd;
 }
 draw(){
  const c=this.ctx;if(!c)return;this.reset();c.setTransform(1,0,0,1,0,0);c.fillStyle='#101318';c.fillRect(0,0,this.canvas.width,this.canvas.height);
  const cam=this.g.camera;c.setTransform(this.canvas.width/cam.w,0,0,this.canvas.height/cam.h,-cam.x*this.canvas.width/cam.w,-cam.y*this.canvas.height/cam.h);c.imageSmoothingEnabled=false;
  let count=0;this.commandOrderDirty=false;
  if(this.g.room.info.Name==='rMenu')this.command(count++,950,0);else this.g.faceEgg.applySampling();
  for(const l of this.g.layers){if(l.info.LayerType===1)this.command(count++,l.info.LayerDepth,1,l);if(l.info.IsVisible)for(const a of l.sprites||[]){const si=this.g.assets[a.Sprite];if(this.inView(si,a.X+l.info.XOffset,a.Y+l.info.YOffset,a.ScaleX,a.ScaleY,a.Rotation))this.command(count++,l.info.LayerDepth,2,a,l,si);}}
  for(const s of this.g.instances){if(s.dead||!s.visible||!this.g.layerVisible(s.layer))continue;const ev=this.g.eventFor(s.object_index,8,0);if(ev||this.inView(s.sprite_index,s.x,s.y,s.image_xscale,s.image_yscale,s.image_angle))this.command(count++,s.depth,3,s,null,null,ev);}
  if(count!==this.commandCount)this.commandOrderDirty=true;
  for(let n=count;n<this.poolUsed;n++){const old=this.commandPool[n];old.ref=old.layer=old.event=null;}this.poolUsed=Math.min(count,2048);
  this.commandSlots.length=count;
  // Reuse only the depth ordering: animation, visibility and draw events still run every frame.
  if(this.commandOrderDirty){this.commands.length=0;for(const cmd of this.commandSlots)this.commands.push(cmd);this.commands.sort((a,b)=>b.depth-a.depth||a.index-b.index);}
  this.commandCount=count;
  for(const cmd of this.commands){
   if(cmd.kind===0)this.g.faceEgg.drawMoon(c);
   else if(cmd.kind===1)this.background(cmd.ref);
   else if(cmd.kind===2){const a=cmd.ref,l=cmd.layer,sp=this.g.sprites[cmd.si].info,rate=a.AnimationSpeedType?a.AnimationSpeed:sp.GMS2PlaybackSpeed*(a.AnimationSpeed||1)/60;this.sprite(cmd.si,(a.FrameIndex||0)+this.g.frame*rate,a.X+l.info.XOffset,a.Y+l.info.YOffset,a.ScaleX,a.ScaleY,a.Rotation,a.Color,1,this.g.room.info.Name==='rMenu'&&a.Sprite==='runningSprite73');}
   else{this.reset();if(cmd.event)this.g.runEvent(cmd.ref,8,0);else this.self(cmd.ref);}
  }
  c.setTransform(this.canvas.width/this.g.gui.w,0,0,this.canvas.height/this.g.gui.h,0,0);
  const gui=this.guiCommands;gui.length=0;for(const s of this.g.instances)if(!s.dead&&s.visible&&this.g.objectMeta[s.object_index].gui&&this.g.layerVisible(s.layer))gui.push(s);gui.sort((a,b)=>b.depth-a.depth);
  for(const s of gui){this.reset();this.g.runEvent(s,8,64);}gui.length=0;
  if(count>2048){this.commands.length=this.commandSlots.length=0;this.commandCount=0;}
  c.setTransform(1,0,0,1,0,0);
 }
}

export class Engine {
 constructor(data,canvas=null,storage=null,options={}){
  this.data=data;this.assets={};this.sprites=data.sprites;this.fonts=data.fonts;
  for(const collection of ['sprites','objects','rooms'])data[collection].forEach((o,i)=>this.assets[o.info.Name]=i);
  data.fonts.forEach((f,i)=>{this.assets[f.info.Name]=i;f.glyphMap=new Map(f.glyphs.map(g=>[g.Character,g]));f.lineHeight=Math.max(...f.glyphs.filter(g=>g.Character<127).map(g=>g.SourceHeight));});
  data.sounds.forEach((s,i)=>this.assets[s.Name]=i);this.assets.shWhite=1;this.assets.shBlend=0;
  this.objects=data.objects.map(o=>({...o,events:new Map(o.events.flatMap(t=>t.events.map(e=>[`${t.type}:${e.subtype}`,e.code])))}));
  this.eventCache=new Map();this.boundsCache=new WeakMap();this.nullInstance={};this.global=new Proxy({}, {get:(o,k)=>o[k]??0});this.instances=[];this.byId=new Map();this.byObject=new Map();this.dynamicByObject=new Map();this.gridDirty=true;this.nextId=200000;this.roomIndex=0;this.fps=60;this.frame=0;this.timeMs=0;this.drawVersion=0;this.camera={x:0,y:0,w:1366,h:768};this.gui={w:1024,h:768};
  this.randomState=(options.seed??Math.floor(Math.random()*4294967296))>>>0||12345;
  this.alarms=new AlarmIndex();
  this.roomStates=new Map();this.worldInitialized=false;this.menuReturnRoom=null;this.cheats={...DEFAULT_CHEATS};
  this.input={keys:new Set(),pressed:new Set(),released:new Set(),buttons:new Set(),bpressed:new Set(),breleased:new Set(),mx:0.5,my:0.5};
  this.errors=[];this.errorSet=new Set();this.paused=false;this.audioEnabled=true;this.audio=new GameAudio(this);this.audioPool=this.audio.pool;this.soundsPlaying=this.audio.playing;
  this.storage=storage;try{this.storage??=typeof localStorage!=='undefined'?localStorage:null;}catch{}this.memoryFiles=new Map();this.ini=null;this.faceEgg=new FaceEasterEgg(this);this.renderer=new Renderer(this,canvas);this.builtins=this.makeBuiltins();this.pendingRoom=null;
  this.objectMeta=this.objects.map((o,index)=>{
   const ancestors=[];for(let n=index;n>=0;){ancestors.push(n);const p=this.objects[n].info.ParentId;n=p?this.assets[p]:-1;}
   const collisions=new Set();for(const n of ancestors)for(const key of this.objects[n].events.keys())if(key.startsWith('4:'))collisions.add(Number(key.slice(2)));
   const active=(type,sub)=>this.eventFor(index,type,sub)?.active;
   const hasType=type=>ancestors.some(n=>[...this.objects[n].events.keys()].some(k=>k.startsWith(type+':')&&active(type,Number(k.split(':')[1]))));
   return {ancestors,dynamic:[0,1,2].some(sub=>active(3,sub)),beginStep:active(3,1),step:active(3,0),endStep:active(3,2),keysPressed:hasType(9),keysReleased:hasType(10),keysHeld:hasType(5),collisions:[...collisions].filter(sub=>active(4,sub)),mouse:hasType(6),animationEnd:active(7,7),gui:active(8,64)};
  });
  this.projectileTypes=new Set(['oBullet','oBulletBomb','eEbullet'].map(n=>this.assets[n]));
 }
 random(){let x=this.randomState;x^=x<<13;x^=x>>>17;x^=x<<5;this.randomState=x>>>0;return this.randomState/4294967296;}
 isDynamic(s){return this.objectMeta[s.object_index].dynamic||s.dynamicMotion===true;}
 promoteDynamic(s){if(this.isDynamic(s))return;s.dynamicMotion=true;for(const type of this.objectMeta[s.object_index].ancestors){let set=this.dynamicByObject.get(type);if(!set)this.dynamicByObject.set(type,set=new Set());set.add(s);}this.gridDirty=true;}
 register(s,ownedAlarm=false){
  this.alarms.register(s,ownedAlarm);
  this.byId.set(s.id,s);
  const meta=this.objectMeta[s.object_index];
  for(const type of meta.ancestors){let set=this.byObject.get(type);if(!set)this.byObject.set(type,set=new Set());set.add(s);if(this.isDynamic(s)){let dynamic=this.dynamicByObject.get(type);if(!dynamic)this.dynamicByObject.set(type,dynamic=new Set());dynamic.add(s);}}
  if(!this.isDynamic(s))this.gridDirty=true;
 }
 unregister(s){for(const type of this.objectMeta[s.object_index].ancestors){this.byObject.get(type)?.delete(s);this.dynamicByObject.get(type)?.delete(s);}this.byId.delete(s.id);if(!this.isDynamic(s))this.gridDirty=true;}
 rebuildIndexes(){this.byId.clear();this.byObject.clear();this.dynamicByObject.clear();for(const s of this.instances)if(!s.dead)this.register(s);this.gridDirty=true;}
 first(target,self=null,other=null){
  if(target&&typeof target==='object')return target.dead?undefined:target;
  if(target===-1)return self;if(target===-2)return other;if(target===-3)return this.instances.find(s=>!s.dead);
  const n=Number(target);return n>=100000?this.byId.get(n):this.byObject.get(n)?.values().next().value;
 }
 match(s,target){let n=s.object_index;while(n!==undefined&&n>=0){if(n===Number(target))return true;const p=this.objects[n]?.info.ParentId;n=p?this.assets[p]:-1;}return false;}
 resolve(target,self=null,other=null){
  if(target&&typeof target==='object')return target.dead?[]:[target];
  if(target===-1)return self?[self]:[];if(target===-2)return other?[other]:[];if(target===-3)return this.instances.filter(i=>!i.dead);
  if(Number(target)>=100000){const s=this.byId.get(Number(target));return s&&!s.dead?[s]:[];}
  if(Number(target)>=0&&Number(target)<this.objects.length)return [...(this.byObject.get(Number(target))||[])];return [];
 }
 eventFor(obj,type,sub){const key=`${obj}:${type}:${sub}`;if(this.eventCache.has(key))return this.eventCache.get(key);let index=obj,result=null;while(index>=0){const o=this.objects[index];const names=o?.events.get(`${type}:${sub}`);if(names){result={owner:index,names,active:names.some(n=>CODE[n]?.toString().length>22)};break;}index=o?.info.ParentId?this.assets[o.info.ParentId]:-1;}this.eventCache.set(key,result);return result;}
 runEvent(s,type,sub,other=null,start=s.object_index){if(this.pendingRoom!==null&&![1,7,12].includes(type))return;if(s.dead&&type!==1&&type!==12)return;const ev=this.eventFor(start,type,sub);if(!ev?.active)return;for(const name of ev.names)this.runCode(name,s,other,[],{type,sub,owner:ev.owner});}
 runCode(name,s,other=null,args=[],event=null){const code=CODE[name];if(!code)return;try{return code(new Context(this,s,other,args,{},event));}catch(error){const key=name+': '+error.message;if(!this.errorSet.has(key)){this.errorSet.add(key);this.errors.push({code:name,error:error.message,room:this.room?.info.Name,frame:this.frame});if(this.errors.length<=60)console.error(key);}return 0;}}
 create(obj,x,y,layer=null,id=null,initial={},run=true){
  const o=this.objects[obj];if(!o)throw new Error('Unknown object '+obj);if(run&&['oDanielText6','oBulletsLeftGreen','oBulletsLeftRed'].includes(o.info.Name)){const existing=this.instances.find(s=>!s.dead&&s.object_index===obj);if(existing)return existing;}const l=this.getLayer(layer);
  const s={id:id??this.nextId++,object_index:obj,x,y,xstart:x,ystart:y,xprevious:x,yprevious:y,sprite_index:o.info.Sprite?this.assets[o.info.Sprite]:-1,mask_index:o.info.TextureMaskId?this.assets[o.info.TextureMaskId]:-1,visible:o.info.Visible,persistent:o.info.Persistent,depth:l?.info.LayerDepth??o.info.Depth,layer:l?.info.LayerId??-1,image_index:0,image_speed:1,image_xscale:1,image_yscale:1,image_angle:0,image_alpha:1,image_blend:0xffffff,speed:0,direction:0,hspeed:0,vspeed:0,gravity:0,gravity_direction:270,friction:0,alarm:Array(12).fill(-1),...initial};
  this.instances.push(s);this.register(s,!own(initial,'alarm'));this.drawVersion++;
  if(run){this.runEvent(s,14,0);this.runEvent(s,0,0);}return s;
 }
 destroy(target,self){for(const s of this.resolve(target===undefined?self:target,self)){if(s.dead||s.destroying)continue;s.destroying=true;this.runEvent(s,1,0);s.dead=true;this.unregister(s);this.needsSweep=true;this.runEvent(s,12,0);this.drawVersion++;}}
 change(s,obj,perform){const o=this.objects[obj];if(!o||s.dead)return;if(perform)this.runEvent(s,1,0);this.unregister(s);s.object_index=obj;s.sprite_index=o.info.Sprite?this.assets[o.info.Sprite]:-1;s.mask_index=o.info.TextureMaskId?this.assets[o.info.TextureMaskId]:-1;s.image_index=0;s.image_speed=1;s.visible=o.info.Visible;s.persistent=o.info.Persistent;this.register(s);if(perform)this.runEvent(s,0,0);this.drawVersion++;}
 getLayer(name){const exact=this.layers?.find(l=>typeof name==='string'?l.info.LayerName===name:l.info.LayerId===name);return exact||(typeof name==='string'?this.layers?.find(l=>l.info.LayerName.toLowerCase()===name.toLowerCase()):undefined);}
 layerVisible(id){return this.getLayer(id)?.info.IsVisible!==false;}
 repairWeaponOwnership(){
  for(const [flag,weapon,pickup] of [['weapon1','oGun','oGunPickup'],['weapon2','oGun59','ogrenadepickup']]){
   const provided=this.resolve(this.assets[weapon]).length>0;
   const collected=this.room.instances.some(i=>i.ObjectDefinition===pickup)&&!this.resolve(this.assets[pickup]).length;
   if(provided||collected)this.global[flag]=true;
  }
 }
 reconcileWeapon(preferred){
  if(!this.first(this.assets.Object1)||this.first(this.assets.oPDead))return;
  const controllers=this.instances.filter(s=>!s.dead&&[this.assets.oGun,this.assets.oGun59].includes(s.object_index));
  if(!controllers.length&&this.first(this.assets.oQuestObjectives3)&&this.first(this.assets.Object1).x>18000)return;
  let type=[this.assets.oGun,this.assets.oGun59].includes(preferred)?preferred:controllers[0]?.object_index;
  if(type===this.assets.oGun&&!this.global.weapon1)type=undefined;if(type===this.assets.oGun59&&!this.global.weapon2)type=undefined;
  type??=this.global.weapon1?this.assets.oGun:this.global.weapon2?this.assets.oGun59:undefined;
  if(type===undefined)return;
  const keep=controllers[0];for(const s of controllers.slice(1))this.destroy(s);
  if(keep){if(keep.object_index!==type)this.change(keep,type,true);}else{const p=this.first(this.assets.Object1);this.create(type,p.x,p.y,'Gun');}
  this.global.equippedweapon=type;
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
  this.rebuildIndexes();
 }
 captureRoom(includePersistent=true){
  const locals=Object.fromEntries(ROOM_VARIABLES.filter(k=>own(this.global,k)).map(k=>[k,this.global[k]]));
  if(!includePersistent&&this.first(this.assets.oTransition)?.mode&&this.first(this.assets.Object1)&&!this.first(this.assets.oPDead)&&!this.global.clickedbed)locals.hascontrol=true;
  return cloneState({room:this.room.info.Name,frame:this.frame,fps:this.fps,camera:{...this.camera},gui:{...this.gui},layers:this.layers.map(l=>l.info),instances:this.instances.filter(s=>!s.dead&&(includePersistent||!s.persistent)),locals});
 }
 captureWorld(){
  if(!this.room||this.pendingRoom!==null)throw new Error('Wait for the room transition to finish before saving.');
  const rooms=Object.fromEntries(this.roomStates);rooms[this.room.info.Name]=this.captureRoom();
  const menuReturn=this.room.info.Name==='rMenu'&&this.menuReturnRoom&&own(rooms,this.menuReturnRoom)?{menuReturnRoom:this.menuReturnRoom}:{};
  return {format:WORLD_FORMAT,version:WORLD_VERSION,game:'himr-1.6',savedAt:Date.now(),active:this.room.info.Name,global:cloneState({...this.global}),rooms,nextId:this.nextId,randomState:this.randomState,timeMs:this.timeMs,cheats:{...this.cheats},...menuReturn};
 }
 installRoom(state,persistent=[]){
  this.clearPointer();
  this.roomIndex=this.assets[state.room];this.room=this.data.rooms[this.roomIndex];this.layers=structuredClone(this.room.layers);
  for(const info of state.layers)Object.assign(this.getLayerFrom(info.LayerId,this.layers).info,info);
  const restored=cloneState(state.instances);for(const s of restored)this.alarms.register(s,true);
  this.instances=[...restored,...persistent];this.camera={...state.camera};this.gui={...state.gui};this.frame=state.frame;this.fps=state.fps;
  Object.assign(this.global,state.locals);this.rebuildIndexes();this.pendingRoom=null;this.needsSweep=false;this.audioStop();this.resumeAudio();this.drawVersion++;
 }
 getLayerFrom(id,layers){return layers.find(l=>l.info.LayerId===id);}
 applyWorld(source){
  const world=validateWorld(source,this.data);
  this.global=new Proxy(world.global,{get:(o,k)=>o[k]??0});this.cheats={...world.cheats};this.nextId=world.nextId;this.randomState=world.randomState;this.timeMs=world.timeMs;
  this.roomStates=new Map(Object.entries(world.rooms).filter(([name])=>name!==world.active));this.installRoom(world.rooms[world.active]);this.worldInitialized=Object.prototype.hasOwnProperty.call(world.global,'ammo');
  this.menuReturnRoom=world.menuReturnRoom??(world.active==='rMenu'?[...this.roomStates].reverse().find(([,state])=>state.instances.some(s=>s.object_index===this.assets.Object1))?.[0]:null)??null;
  for(const set of ['keys','pressed','released','buttons','bpressed','breleased'])this.input[set].clear();this.input.mx=.5;this.input.my=.5;
  this.errors=[];this.errorSet.clear();this.onRoomChange?.(this.room.info.Name);return true;
 }
 beginNewAdventure(){
  this.clearPointer();this.roomStates.clear();this.worldInitialized=false;this.menuReturnRoom=null;
  // Keep explicit statistics saves available without automatically applying them to this new world.
  this.global=new Proxy({skipstatsautoload:true}, {get:(o,k)=>o[k]??0});this.cheats={...DEFAULT_CHEATS};this.timeMs=0;
 }
 adventureResumeRoom(){return this.room?.info.Name==='rMenu'&&this.worldInitialized&&this.roomStates.has(this.menuReturnRoom)?this.assets[this.menuReturnRoom]:-1;}
 setCheat(name,enabled){if(!own(DEFAULT_CHEATS,name))throw new Error('Unknown cheat.');this.cheats[name]=!!enabled;this.drawVersion++;}
 applyCheat(action){
  const player=this.first(this.assets.Object1);if(!player)throw new Error('Enter the world to use this cheat.');
  if(action==='heal'){
   const dead=this.first(this.assets.oPDead);
   if(dead){dead.done=1;dead.vsp=0;const wasPaused=this.paused,enabled=this.audioEnabled;this.paused=false;this.audioEnabled=enabled&&!wasPaused;this.input.pressed.add(32);try{this.step();}finally{this.paused=wasPaused;this.audioEnabled=enabled;this.input.pressed.clear();}}
   this.global.php=8;
  }else if(action==='money')this.global.kills+=1000;
  else if(action==='ammo')this.global.ammo+=1000;
  else if(action==='grenades')this.global.bullets+=50;
  else if(action==='slowmo')this.global.slowmo=100;
  else if(action==='weapons'){
   this.global.weapon1=true;this.global.weapon2=true;
   if(!this.first(this.assets.oGun)&&!this.first(this.assets.oGun59)&&!this.first(this.assets.oPDead))this.create(this.assets.oGun,player.x,player.y,'Gun');
  }else throw new Error('Unknown cheat action.');
  this.drawVersion++;
 }
 pointerWorld(){return this.stepPointer||{x:this.camera.x+this.input.mx*this.camera.w,y:this.camera.y+this.input.my*this.camera.h};}
 queuePointerPress(){const {mx,my}=this.input;this.pendingPointer={mx,my,...this.pointerWorld()};}
 freezePointer(){
  const sample=this.pendingPointer;this.pendingPointer=null;
  // Camera scripts run during Step. A click must still hit the point that was displayed.
  this.stepPointer=sample&&(this.input.bpressed.size||this.input.pressed.has(70))&&sample.mx===this.input.mx&&sample.my===this.input.my?{x:sample.x,y:sample.y}:this.pointerWorld();
 }
 clearPointer(){this.stepPointer=null;this.pendingPointer=null;}
 updateFireEligibility(){
  const {x,y}=this.pointerWorld();
  this.global.dontshoot=true;
  this.fireBlockers??=new Set(['oBedSleep','oJobSign','oMum','oPetrolstationDoor','oSign'].map(n=>this.assets[n]));
  for(const type of this.fireBlockers)for(const s of this.byObject.get(type)||[]){if(s.dead||s.object_index!==type||!s.visible||!this.layerVisible(s.layer))continue;const b=this.bounds(s);if(x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom){this.global.dontshoot=false;return;}}
 }
 loadRoom(index,keep=true){
  this.clearPointer();
  if(typeof index==='string')index=this.assets[index];if(!this.data.rooms[index])throw new Error('Unknown room '+index);this.pendingRoom=null;
  for(const s of this.instances)this.runEvent(s,7,5);
  const progress=keep&&this.worldInitialized?Object.fromEntries(sharedProgress.filter(k=>own(this.global,k)).map(k=>[k,this.global[k]])):null;
  if(index===this.assets.rMenu){if(keep&&this.worldInitialized&&this.room&&this.room.info.Name!=='rMenu')this.menuReturnRoom=this.room.info.Name;else if(!keep)this.menuReturnRoom=null;}
  if(keep&&this.worldInitialized&&this.room&&this.roomIndex!==index&&this.room.info.Name!=='rMenu')this.roomStates.set(this.room.info.Name,this.captureRoom(false));
  const cached=keep&&this.data.rooms[index].info.Name!=='rMenu'?this.roomStates.get(this.data.rooms[index].info.Name):null;
  if(cached){const persistent=this.instances.filter(s=>!s.dead&&s.persistent);this.installRoom(cached,persistent);this.roomStates.delete(cached.room);this.repairWeaponOwnership();this.reconcileWeapon(progress?.equippedweapon);this.onRoomChange?.(this.room.info.Name);return;}
  this.instances=keep?this.instances.filter(s=>!s.dead&&s.persistent):[];this.rebuildIndexes();this.roomIndex=index;this.room=this.data.rooms[index];this.layers=structuredClone(this.room.layers);this.camera={x:0,y:0,w:1366,h:768};this.frame=0;this.audioStop();this.drawVersion++;
  const view=this.room.views.find(v=>v.Enabled);if(view)this.camera={x:view.ViewX,y:view.ViewY,w:view.ViewWidth,h:view.ViewHeight};
  const layerIds=new Map(this.layers.flatMap(l=>(l.instances||[]).map(id=>[id,l.info.LayerId])));const placed=[];
  for(const i of this.room.instances){const obj=this.assets[i.ObjectDefinition];if(this.objects[obj].info.Persistent&&this.instances.some(s=>s.object_index===obj))continue;const s=this.create(obj,i.X,i.Y,layerIds.get(i.InstanceID),i.InstanceID,{image_xscale:i.ScaleX,image_yscale:i.ScaleY,image_angle:i.Rotation,image_index:i.ImageIndex,image_speed:i.ImageSpeed,image_blend:i.Color&0xffffff,image_alpha:(i.Color>>>24)/255},false);placed.push([s,i]);}
  for(const [s,i] of placed){this.runEvent(s,14,0);if(i.PreCreateCode)this.runCode(i.PreCreateCode,s);this.runEvent(s,0,0);if(i.CreationCode)this.runCode(i.CreationCode,s);}
  if(this.room.info.CreationCodeId)this.runCode(this.room.info.CreationCodeId,this.instances[0]||{});
  for(const s of this.instances)this.runEvent(s,7,4);
  if(progress){Object.assign(this.global,progress);this.reconcileWeapon(progress.equippedweapon);}
  if(this.first(this.assets.Object1))this.worldInitialized=true;
  this.repairWeaponOwnership();this.buildGrid();this.pendingRoom=null;this.resumeAudio();this.onRoomChange?.(this.room.info.Name);
 }
 bounds(s,x=s.x,y=s.y){
  const spr=this.sprites[s.mask_index>=0?s.mask_index:s.sprite_index];if(!spr)return {left:x,right:x,top:y,bottom:y,valid:false};
  const current=x===s.x&&y===s.y,cached=current&&this.boundsCache.get(s);
  if(cached&&cached.sprite===spr&&cached.sx===s.image_xscale&&cached.sy===s.image_yscale&&cached.angle===s.image_angle&&cached.bounds.x===x&&cached.bounds.y===y)return cached.bounds;
  const i=spr.info;let left=(i.MarginLeft-i.OriginX)*s.image_xscale,right=(i.MarginRight+1-i.OriginX)*s.image_xscale,top=(i.MarginTop-i.OriginY)*s.image_yscale,bottom=(i.MarginBottom+1-i.OriginY)*s.image_yscale;
  if(s.image_angle){const points=[[left,top],[right,top],[right,bottom],[left,bottom]].map(([a,b])=>[a*Math.cos(rad(s.image_angle))+b*Math.sin(rad(s.image_angle)),-a*Math.sin(rad(s.image_angle))+b*Math.cos(rad(s.image_angle))]);left=Math.min(...points.map(p=>p[0]));right=Math.max(...points.map(p=>p[0]));top=Math.min(...points.map(p=>p[1]));bottom=Math.max(...points.map(p=>p[1]));}
  const bounds={left:x+Math.min(left,right),right:x+Math.max(left,right),top:y+Math.min(top,bottom),bottom:y+Math.max(top,bottom),valid:true,instance:s,x,y};
  if(current)this.boundsCache.set(s,{sprite:spr,sx:s.image_xscale,sy:s.image_yscale,angle:s.image_angle,bounds});return bounds;
 }
 overlaps(a,b){return a.valid&&b.valid&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}
 spriteMask(b){const s=b.instance;return s?this.sprites[s.mask_index>=0?s.mask_index:s.sprite_index]:null;}
 maskContains(b,x,y){
  const s=b.instance,sp=this.spriteMask(b);if(!s||!sp)return true;
  const i=sp.info,dx=x-b.x,dy=y-b.y,angle=rad(s.image_angle);
  const px=(dx*Math.cos(angle)-dy*Math.sin(angle))/s.image_xscale+i.OriginX;
  const py=(dx*Math.sin(angle)+dy*Math.cos(angle))/s.image_yscale+i.OriginY;
  if(i.SepMasks===2)return px>=i.MarginLeft&&px<i.MarginRight+1&&py>=i.MarginTop&&py<i.MarginBottom+1;
  if(i.SepMasks!==1||!sp.masks)return px>=i.MarginLeft&&px<i.MarginRight+1&&py>=i.MarginTop&&py<i.MarginBottom+1;
  if(px<0||py<0||px>=i.Width||py>=i.Height)return false;
  if(!sp.maskBytes)sp.maskBytes=sp.masks.map(m=>typeof atob==='function'?Uint8Array.from(atob(m),c=>c.charCodeAt(0)):Uint8Array.from(Buffer.from(m,'base64')));
  const frame=((Math.floor(s.image_index)%sp.maskBytes.length)+sp.maskBytes.length)%sp.maskBytes.length,mask=sp.maskBytes[frame],ix=Math.floor(px),iy=Math.floor(py);
  return !!(mask[iy*Math.ceil(i.Width/8)+(ix>>3)]&(128>>(ix&7)));
 }
 collides(a,b){
  if(!this.overlaps(a,b))return false;
  const sa=this.spriteMask(a),sb=this.spriteMask(b);
  const special=[1,2].includes(sa?.info.SepMasks)||[1,2].includes(sb?.info.SepMasks);
  if(!special)return true;
  const left=Math.max(a.left,b.left),right=Math.min(a.right,b.right),top=Math.max(a.top,b.top),bottom=Math.min(a.bottom,b.bottom);
  const stride=Math.max(1,Math.ceil(Math.sqrt((right-left)*(bottom-top)/262144))),dx=Math.min(stride,right-left),dy=Math.min(stride,bottom-top);
  for(let y=top+dy/2;y<bottom;y+=dy)for(let x=left+dx/2;x<right;x+=dx)if(this.maskContains(a,x,y)&&this.maskContains(b,x,y))return true;
  return false;
 }
 buildGrid(){
  this.grid=new Map();this.largeStatics=[];
  for(const s of this.instances){if(s.dead||this.isDynamic(s))continue;const b=this.bounds(s);if(!b.valid||!Number.isFinite(b.left+b.right+b.top+b.bottom))continue;
   const x1=Math.floor(b.left/256),x2=Math.floor(b.right/256),y1=Math.floor(b.top/256),y2=Math.floor(b.bottom/256);
   if((x2-x1+1)*(y2-y1+1)>4096){this.largeStatics.push(s);continue;}
   for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++){const key=`${x}:${y}`;let cell=this.grid.get(key);if(!cell)this.grid.set(key,cell=[]);cell.push(s);}
  }
  this.gridDirty=false;
 }
 *candidates(b,target,self){
  if(!b.valid||!Number.isFinite(b.left+b.right+b.top+b.bottom))return;
  if(Number(target)>=100000){const s=this.first(target);if(s&&!s.dead&&s!==self)yield s;return;}
  if(this.gridDirty||!this.grid)this.buildGrid();
  const dynamic=target===-3?this.instances.filter(s=>this.isDynamic(s)):this.dynamicByObject.get(Number(target))||[];
  for(const s of dynamic)if(!s.dead&&s!==self)yield s;
  const seen=new Set(),matches=s=>!s.dead&&s!==self&&(target===-3||this.objectMeta[s.object_index].ancestors.includes(Number(target)));
  const x1=Math.floor(b.left/256),x2=Math.floor(b.right/256),y1=Math.floor(b.top/256),y2=Math.floor(b.bottom/256);
  if((x2-x1+1)*(y2-y1+1)>4096){for(const s of this.instances)if(!this.isDynamic(s)&&matches(s))yield s;return;}
  for(const s of this.largeStatics)if(matches(s)){seen.add(s.id);yield s;}
  for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(const s of this.grid.get(`${x}:${y}`)||[])if(!seen.has(s.id)&&matches(s)){seen.add(s.id);yield s;}
 }
 query(b,target,self){const found=[];for(const s of this.candidates(b,target,self))if(this.collides(b,this.bounds(s)))found.push(s);return found;}
 place(s,x,y,target){const b=this.bounds(s,x,y);for(const other of this.candidates(b,target,s))if(this.collides(b,this.bounds(other)))return other;return null;}
 recoverPlayer(s){
  if(!gmlBoolean(this.global.hascontrol)||this.first(this.assets.oPDead))return false;
  const b=this.bounds(s),walls=this.query(b,this.assets.wall,s);
  if(!walls.length)return false;
  // Search only around the character. A distant edge of a large floor is not an escape.
  const rx=Math.min(128,b.right-b.left+8),ry=Math.min(512,(b.bottom-b.top)*4),xs=new Set([0]),ys=new Set([0]);let best=null;
  const consider=(dx,dy)=>{const distance=Math.hypot(dx,dy);if(!distance||Math.abs(dx)>rx||Math.abs(dy)>ry||best&&distance>=best.distance)return;if(!this.place(s,s.x+dx,s.y+dy,this.assets.wall))best={dx,dy,distance};};
  const search={...b,left:b.left-rx,right:b.right+rx,top:b.top-ry,bottom:b.bottom+ry};
  for(const wall of this.candidates(search,this.assets.wall,s)){const w=this.bounds(wall);if(!this.overlaps(search,w))continue;
   for(const dx of [w.left-b.right-1e-6,w.right-b.left+1e-6])if(Math.abs(dx)<=rx)xs.add(dx);
   for(const dy of [w.top-b.bottom-1e-6,w.bottom-b.top+1e-6])if(Math.abs(dy)<=ry)ys.add(dy);
  }
  // Diagonal corrections handle adjacent tiles without falling back to a remote wall edge.
  for(const dx of xs)for(const dy of ys)consider(dx,dy);
  if(!best)return false;
  const fraction=Math.min(1,8/best.distance);s.x+=best.dx*fraction;s.y+=best.dy*fraction;s.hsp=0;s.vsp=0;
  return !!this.place(s,s.x,s.y,this.assets.wall);
 }
 movePlayerVertical(s,amount){
  if(!Number.isFinite(amount)||!amount)return;
  const b=this.bounds(s),sweep={...b,top:Math.min(b.top,b.top+amount),bottom:Math.max(b.bottom,b.bottom+amount)};
  let move=amount;
  for(const wall of this.candidates(sweep,this.assets.wall,s)){
   const w=this.bounds(wall);if(b.left>=w.right||b.right<=w.left)continue;
   const distance=amount>0?w.top-b.bottom:w.bottom-b.top;
   if(amount>0?distance<0||distance>move:distance>0||distance<move)continue;
   // Verify the swept contact against the actual collision masks.
   if(this.collides(this.bounds(s,s.x,s.y+distance+Math.sign(amount)),w))move=distance;
  }
  s.y+=move;if(move!==amount)s.vsp=0;
 }
 guardMapFall(){
  if(this.pendingRoom!==null)return;
  const player=this.first(this.assets.Object1),body=this.first(this.assets.oPDead),s=body||player;
  if(!s||!body&&!gmlBoolean(this.global.hascontrol))return;
  if(body?.done===1&&body.vsp===0)return;
  const b=this.bounds(s);
  if(!b.valid||b.top<=this.room.info.Height+256&&b.right>=-256&&b.left<=this.room.info.Width+256)return;
  // Original terrain extends beyond the nominal room. Only the outer void is lethal.
  let left=0,right=this.room.info.Width,bottom=this.room.info.Height;
  for(const wall of this.resolve(this.assets.wall)){const w=this.bounds(wall);if(w.valid){left=Math.min(left,w.left);right=Math.max(right,w.right);bottom=Math.max(bottom,w.bottom);}}
  if(b.top<=bottom+256&&b.right>=left-256&&b.left<=right+256)return;
  if(!body)new Context(this,player).call('KillPlayer',[true]);
  const corpse=body||this.first(this.assets.oPDead);if(!corpse)return;
  const ready=corpse.done===1&&corpse.vsp===0;
  // No floor exists here to finish the normal landing. Enable its existing revive path.
  Object.assign(corpse,{done:1,hsp:0,vsp:0,hspeed:0,vspeed:0,speed:0,gravity:0,image_index:1});
  if(player)Object.assign(player,{hsp:0,vsp:0,gunkickx:0,gunkicky:0});
  if(!ready){corpse.alarm[0]=60;this.onFallRecovery?.(true);}
 }
 step(){
  if(this.paused||!this.room)return;this.freezePointer();try{this.guardMapFall();const wasDead=!!this.first(this.assets.oPDead);this.frame++;this.timeMs+=1000/this.fps;this.updateFireEligibility();const before=[...this.instances];for(const s of before)if(s.hspeed||s.vspeed||s.gravity)this.promoteDynamic(s);
  for(const s of before){if(s.dead)continue;s.xprevious=s.x;s.yprevious=s.y;if(this.objectMeta[s.object_index].beginStep)this.runEvent(s,3,1);}
  this.alarms.step(before,(s,i)=>this.runEvent(s,2,i));
  for(const s of before){if(s.dead)continue;if(this.objectMeta[s.object_index].keysPressed)for(const k of this.input.pressed)this.runEvent(s,9,k);if(this.objectMeta[s.object_index].keysReleased)for(const k of this.input.released)this.runEvent(s,10,k);if(this.objectMeta[s.object_index].keysHeld)for(const k of this.input.keys)this.runEvent(s,5,k);if(this.input.pressed.size&&this.objectMeta[s.object_index].keysPressed)this.runEvent(s,9,1);this.runMouse(s);if(this.objectMeta[s.object_index].step)this.runEvent(s,3,0);}
  for(const s of before){if(s.dead||!(s.hspeed||s.vspeed||s.gravity||s.speed))continue;if(s.hspeed||s.vspeed){s.x+=s.hspeed;s.y+=s.vspeed;}if(s.gravity){s.hspeed+=lx(s.gravity,s.gravity_direction);s.vspeed+=ly(s.gravity,s.gravity_direction);}const speed=Math.hypot(s.hspeed,s.vspeed);if(speed&&s.friction>0){const ratio=Math.max(0,speed-s.friction)/speed;s.hspeed*=ratio;s.vspeed*=ratio;}s.speed=Math.hypot(s.hspeed,s.vspeed);if(s.speed)s.direction=direction(0,0,s.hspeed,s.vspeed);}
  for(const s of before){if(s.dead)continue;for(const sub of this.objectMeta[s.object_index].collisions)for(const t of this.query(this.bounds(s),sub,s)){this.runEvent(s,4,sub,t);if(s.dead)break;}}
  for(const s of before){if(s.dead)continue;if(this.objectMeta[s.object_index].endStep)this.runEvent(s,3,2);const spr=this.sprites[s.sprite_index];if(spr){const rate=spr.info.GMS2PlaybackSpeedType?spr.info.GMS2PlaybackSpeed:spr.info.GMS2PlaybackSpeed/this.fps;const frames=spr.textures.length;s.image_index+=s.image_speed*rate;if(frames&&s.image_index>=frames){s.image_index%=frames;if(this.objectMeta[s.object_index].animationEnd)this.runEvent(s,7,7);}if(s.image_index<0&&frames)s.image_index=(s.image_index%frames+frames)%frames;}}
  for(const l of this.layers){l.info.XOffset+=l.info.HSpeed;l.info.YOffset+=l.info.VSpeed;}
  for(const s of before)if(!s.dead&&this.projectileTypes.has(s.object_index)&&(s.x < -256||s.y < -256||s.x>this.room.info.Width+256||s.y>this.room.info.Height+256))this.destroy(s);
  if(this.needsSweep){this.instances=this.instances.filter(s=>!s.dead);this.needsSweep=false;}
  this.input.pressed.clear();this.input.released.clear();this.input.bpressed.clear();this.input.breleased.clear();
  if(this.pendingRoom!==null)this.loadRoom(this.pendingRoom);
  if(wasDead&&!this.first(this.assets.oPDead))this.resumeAudio();
  this.faceEgg.syncAudio();
  }finally{this.stepPointer=null;}
 }
 runMouse(s){if(!this.objectMeta[s.object_index].mouse||!(this.input.buttons.size||this.input.bpressed.size||this.input.breleased.size))return;const b=this.bounds(s),{x,y}=this.pointerWorld(),inside=x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom;for(const n of this.input.bpressed){this.runEvent(s,6,49+n);if(inside)this.runEvent(s,6,3+n);}for(const n of this.input.buttons)if(inside)this.runEvent(s,6,n-1);for(const n of this.input.breleased)if(inside)this.runEvent(s,6,6+n);}
 readFile(name){if(this.memoryFiles.has(name))return this.memoryFiles.get(name);try{return this.storage?.getItem('himr:file:'+name)??null;}catch{return null;}}
 writeFile(name,text){this.memoryFiles.set(name,text);this.lastFileWritePersistent=false;try{if(this.storage){this.storage.setItem('himr:file:'+name,text);this.lastFileWritePersistent=true;this.memoryFiles.delete(name);}}catch{}return this.lastFileWritePersistent;}
 saveCheckpoint(){try{const {text}=encodeWorld(this.captureWorld(),this.data);this.writeFile('checkpoint',text);return true;}catch{return false;}}
 convertLegacyCheckpoint(text){
  const s=JSON.parse(text);if(s.format===WORLD_FORMAT)return validateWorld(s,this.data);
  if(![1,2].includes(s.version)||!this.data.rooms[s.room]||!s.global)throw new Error('Unsupported legacy checkpoint.');
  const isolated=new Engine(this.data,null,{getItem:()=>null,setItem(){},removeItem(){}},{seed:12345});isolated.audioEnabled=false;isolated.loadRoom(s.room,false);
  Object.assign(isolated.global,cloneState(s.global));
  if(s.version===2&&Array.isArray(s.instances)){isolated.instances=cloneState(s.instances);for(const i of isolated.instances)isolated.alarms.register(i,true);isolated.rebuildIndexes();isolated.nextId=isolated.instances.reduce((max,i)=>Math.max(max,i.id+1),200000);isolated.frame=s.frame||0;for(const info of s.layers||[]){const l=isolated.getLayer(info.LayerId);if(l)Object.assign(l.info,info);}}
  const p=isolated.first(isolated.assets.Object1);if(p){p.x=s.x;p.y=s.y;const cam=isolated.first(isolated.assets.oCamera);if(cam){cam.follow=isolated.first(isolated.assets.oPDead)?.id??p.id;isolated.camera.x=cam.x-cam.view_w_half;isolated.camera.y=cam.y-cam.view_h_half;}}
  isolated.repairWeaponOwnership();isolated.repairPetrolMessages();isolated.reconcileWeapon(isolated.global.equippedweapon);const world=isolated.captureWorld();if(Number.isFinite(s.time))world.savedAt=s.time;return validateWorld(world,this.data);
 }
 restoreCheckpoint(){try{const text=this.readFile('checkpoint');if(!text)return false;return this.applyWorld(this.convertLegacyCheckpoint(text));}catch{return false;}}
 audioPlay(id,loop,priority=0){return this.audio.play(id,loop,priority);}
 suspendAudio(){this.audio.suspend();this.faceEgg?.stopAudio(false);}
 audioStop(){this.audio.stop();this.faceEgg?.stopAudio();}
 resumeAudio(){
  const world=['room26','room1','room3','petrolstationroom'].includes(this.room?.info.Name),alive=!!this.first(this.assets.Object1)&&!this.first(this.assets.oPDead);
  if(world&&alive)this.audio.play(this.assets.nightsounds,true,7);
  if(alive)this.audio.resume();this.faceEgg?.syncAudio(true);
 }
 makeBuiltins(){
  const g=this,r=this.renderer;
  const f={
   sign:(_,n)=>Math.sign(n),abs:(_,n)=>Math.abs(n),sin:(_,n)=>Math.sin(n),floor:(_,n)=>Math.floor(n),min:(_, ...a)=>Math.min(...a.filter(n=>!Number.isNaN(n))),max:(_, ...a)=>Math.max(...a.filter(n=>!Number.isNaN(n))),clamp:(_,n,a,b)=>Math.max(a,Math.min(b,n)),random_range:(_,a,b)=>a+g.random()*(b-a),choose:(_, ...a)=>a[Math.floor(g.random()*a.length)],lengthdir_x:(_,n,d)=>lx(n,d),lengthdir_y:(_,n,d)=>ly(n,d),point_direction:(_,x,y,a,b)=>direction(x,y,a,b),point_distance:(_,x,y,a,b)=>Math.hypot(x-a,y-b),point_in_circle:(_,x,y,a,b,r)=>Math.hypot(x-a,y-b)<=r,
   keyboard_check:(_,k)=>k===1?g.input.keys.size>0:g.input.keys.has(k),keyboard_check_pressed:(_,k)=>k===1?g.input.pressed.size>0:g.input.pressed.has(k),mouse_check_button:(_,n)=>g.input.buttons.has(n),mouse_check_button_pressed:(_,n)=>g.input.bpressed.has(n),ord:(_,s)=>String(s).toUpperCase().charCodeAt(0),device_mouse_y_to_gui:()=>g.input.my*g.gui.h,
   instance_exists:(e,o)=>!!g.first(o,e.self,e.other),instance_create_layer:(e,x,y,l,o)=>g.create(o,x,y,l).id,instance_destroy:(e,o)=>g.destroy(o,e.self),instnce_destroy:(e,o)=>g.destroy(o,e.self),instance_change:(e,o,v)=>g.change(e.self,o,v),place_meeting:(e,x,y,o)=>!!g.place(e.self,x,y,o),instance_place:(e,x,y,o)=>g.place(e.self,x,y,o)?.id??-4,player_unstick:e=>g.recoverPlayer(e.self),player_move_vertical:(e,amount)=>g.movePlayerVertical(e.self,amount),petrol_shift_start:()=>g.resetPetrolShift(),cheat_enabled:(_,name)=>g.cheats[name]===true,new_adventure:()=>g.beginNewAdventure(),adventure_resume_room:()=>g.adventureResumeRoom(),
   collision_line:(e,x1,y1,x2,y2,o,precise,notme)=>{const b={left:Math.min(x1,x2),right:Math.max(x1,x2)+1,top:Math.min(y1,y2),bottom:Math.max(y1,y2)+1,valid:true};for(const s of g.query(b,o,notme?e.self:null)){const a=g.bounds(s);let lo=0,hi=1;for(const [p,q] of [[-(x2-x1),x1-a.left],[x2-x1,a.right-x1],[-(y2-y1),y1-a.top],[y2-y1,a.bottom-y1]]){if(p===0&&q<0){lo=2;break;}if(p<0)lo=Math.max(lo,q/p);else if(p>0)hi=Math.min(hi,q/p);}if(lo<=hi){if(!precise)return s.id;const count=Math.max(1,Math.ceil(Math.hypot(x2-x1,y2-y1)*(hi-lo)*2));for(let k=0;k<=count;k++){const t=lo+(hi-lo)*k/count;if(g.maskContains(a,x1+(x2-x1)*t,y1+(y2-y1)*t))return s.id;}}}return -4;},
   event_perform:(e,type,sub)=>g.runEvent(e.self,type,sub,e.other),event_inherited:(e)=>{if(!e.event)return;const p=g.objects[e.event.owner]?.info.ParentId;if(p)g.runEvent(e.self,e.event.type,e.event.sub,e.other,g.assets[p]);},alarm_set:(e,n,v)=>e.self.alarm[n]=v,
   layer_set_visible:(_,l,v)=>{const layer=g.getLayer(l);if(layer)layer.info.IsVisible=!!v;},layer_exists:(_,l)=>!!g.getLayer(l),layer_x:(_,l,v)=>{const layer=g.getLayer(l);if(layer)layer.info.XOffset=v;},layer_add_instance:(_,l,id)=>{const s=g.resolve(id)[0],layer=g.getLayer(l);if(s&&layer){s.layer=layer.info.LayerId;s.depth=layer.info.LayerDepth;}},
   room_goto:(_,i)=>g.pendingRoom=i,room_goto_next:()=>{const order=g.data.roomOrder;g.pendingRoom=g.assets[order[(order.indexOf(g.room.info.Name)+1)%order.length]];},game_restart:()=>{g.beginNewAdventure();g.instances=[];g.rebuildIndexes();g.pendingRoom=g.assets[g.data.roomOrder[0]];},game_end:()=>{g.paused=true;g.onExit?.();},game_set_speed:(_,fps)=>g.fps=fps,
   camera_get_view_width:()=>g.camera.w,camera_get_view_height:()=>g.camera.h,camera_get_view_x:()=>g.camera.x,camera_get_view_y:()=>g.camera.y,camera_set_view_pos:(_,id,x,y)=>{if(Number.isFinite(x+y)){g.camera.x=x;g.camera.y=y;}},display_set_gui_size:(_,w,h)=>g.gui={w,h},display_get_gui_width:()=>g.gui.w,display_get_gui_height:()=>g.gui.h,font_get_size:(_,i)=>g.fonts[i]?.info.EmSize||24,
   draw_set_colour:(_,c)=>r.col=c,draw_set_color:(_,c)=>r.col=c,draw_set_alpha:(_,a)=>r.alpha=a,draw_set_font:(_,f)=>r.font=f,draw_set_halign:(_,v)=>r.halign=v,draw_set_valign:(_,v)=>r.valign=v,draw_self:(e)=>r.self(e.self),draw_sprite:(_,s,n,x,y)=>r.sprite(s,n,x,y),draw_text:(_,x,y,t)=>r.text(x,y,t),draw_text_transformed:(_,x,y,t,sx,sy,a)=>{const c=r.ctx;if(!c)return;c.save();c.translate(x,y);c.rotate(-rad(a));c.scale(sx,sy);r.text(0,0,t);c.restore();},draw_rectangle:(_,a,b,c,d,o)=>r.rectangle(a,b,c,d,o),draw_roundrect_ext:(_,a,b,c,d,rx,ry,o)=>r.rectangle(a,b,c,d,o,true),shader_set:()=>r.white=true,shader_reset:()=>r.white=false,
   string:(_,v)=>typeof v==='number'?formatGameNumber(v):String(v),string_length:(_,v)=>String(v).length,string_copy:(_,v,start,n)=>String(v).substr(Math.max(0,start-1),n),string_height:(_,v)=>r.measure(v).height,string_width:(_,v)=>r.measure(v).width,string_insert:(_,s,t,n)=>String(t).slice(0,Math.max(0,n-1))+s+String(t).slice(Math.max(0,n-1)),array_length_1d:(_,a)=>a.length||0,
   ds_list_create:()=>[],ds_list_add:(_,a,...v)=>a.push(...v),ds_list_size:(_,a)=>a.length||0,ds_list_find_value:(_,a,i)=>a[i]??0,ds_list_destroy:(_,a)=>{a.length=0;},ds_map_find_value:(_,a,k)=>a?.[k]??0,get_timer:()=>g.timeMs*1000,
   audio_play_sound:(_,id,priority,loop)=>g.audioPlay(id,loop,priority),audio_stop_all:()=>g.audioStop(),file_exists:(_,n)=>g.readFile(n)!==null,file_delete:(_,n)=>{g.memoryFiles.delete(n);try{g.storage?.removeItem('himr:file:'+n);}catch{}},ini_open:(_,n)=>{const parsed=parseFile(g.readFile(n),{});g.ini={name:n,data:parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{}};},ini_read_real:(_,section,k,d)=>{const v=g.ini?.data[section]?.[k];return typeof v==='boolean'?Number(v):Number.isFinite(v)?v:d;},ini_write_real:(_,section,k,v)=>{g.ini.data[section]??={};g.ini.data[section][k]=v;},ini_close:()=>{if(g.ini)g.writeFile(g.ini.name,JSON.stringify(g.ini.data));g.ini=null;},
   file_text_open_write:(_,n)=>({name:n,values:[],index:0}),file_text_write_real:(_,file,v)=>file.values.push(v),file_text_open_read:(_,n)=>{const values=parseFile(g.readFile(n),[]);const valid=Array.isArray(values)&&values.every(Number.isFinite);return {name:n,values:valid&&!(n==='Save.sav'&&!g.data.rooms[values[0]])?values:n==='Save.sav'?[g.assets.room26,g.global.kills]:[],index:0,read:true};},file_text_read_real:(_,f)=>f.values[f.index++]??0,file_text_close:(_,f)=>{if(!f.read)g.writeFile(f.name,JSON.stringify(f.values));}
  };
  return f;
 }
}
