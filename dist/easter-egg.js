const STORAGE_KEY='himr:secret-face';
const MOON_DELAY=180,MOON_FLIGHT=720,MOON_PERIOD=2400,MOON_RADIUS=95;

// Head anchors use the original frame coordinates; collision sprites stay intact.
const upright=(center,bottom,left,width)=>({cut:[left,0,width,bottom],x:center,y:bottom-26,w:44,h:60,angle:0});
export const FACE_LAYOUTS={
 daniel:[[59,56,31,56],[61,56,33,58],[63,56,36,58],[57,58,29,59],[59.5,56,33,57],[59.5,56,30,58],[59,56,30,57]].map(v=>upright(...v)),
 runningSprite:[[59.5,56,31,59],[59.5,56,30,61],[62,52,31,61],[59.5,56,30,62]].map(v=>upright(...v)),
 danielJump:[[61,56,30,63],[58.5,58,29,62]].map(v=>upright(...v)),
 runningSprite73:[[60,56,31,59],[60,56,30,61],[62,52,31,61],[60,56,30,62]].map(v=>upright(...v)),
 playerDead:[{cut:[62,59,66,69],x:93,y:95,w:44,h:60,angle:60},{cut:[74,80,54,48],x:96,y:106,w:44,h:60,angle:90}]
};

export class FaceEasterEgg {
 constructor(game){
  this.game=game;this.enabled=false;this.saved=true;this.menu=null;this.image=null;this.loading=null;this.busy=false;this.activating=false;this.whiteImage=null;this.moonImage=null;this.moonLoading=null;this.moonLoadFailed=false;this.flightStart=0;this.departure=null;this.lastMoon=null;this.pin={x:.82,y:.18};
  this.music=null;this.musicAttempt=null;this.musicBlocked=false;
  try{this.enabled=game.storage?.getItem(STORAGE_KEY)==='1';}catch{}
 }
 layout(name,frame){const frames=FACE_LAYOUTS[name];if(!this.enabled||!this.image||!frames)return null;return frames[((Math.floor(frame)%frames.length)+frames.length)%frames.length];}
 async load(){
  if(this.image)return this.image;
  if(this.loading)return this.loading;
  this.loading=new Promise((resolve,reject)=>{
   const image=new Image();image.onload=()=>{this.image=image;this.applySampling();this.game.drawVersion++;resolve(image);};image.onerror=()=>reject(new Error('The secret face could not load. Try again.'));image.src='assets/secret-face.png';
  });
  try{return await this.loading;}finally{this.loading=null;}
 }
 setEnabled(value){
  this.enabled=!!value;this.saved=false;
  try{if(this.game.storage){this.game.storage.setItem(STORAGE_KEY,this.enabled?'1':'0');this.saved=true;}}catch{}
  this.applySampling();
  this.game.drawVersion++;
  this.syncAudio(true);
 }
 musicActive(){const g=this.game;return this.enabled&&g.audioEnabled&&!g.paused&&g.room?.info.Name==='rMenu';}
 syncAudio(retry=false){
  if(!this.musicActive()){this.stopAudio(!this.enabled||this.game.room?.info.Name!=='rMenu');return;}
  if(typeof Audio==='undefined')return;
  if(!this.music){this.music=new Audio('assets/easter-egg-menu.mp3');this.music.preload='none';this.music.loop=true;this.music.volume=.55;}
  if(this.musicAttempt||!this.music.paused||(this.musicBlocked&&!retry))return;
  this.musicBlocked=false;const attempt={};this.musicAttempt=attempt;
  try{
   Promise.resolve(this.music.play()).catch(()=>{if(this.musicAttempt===attempt)this.musicBlocked=true;}).finally(()=>{if(this.musicAttempt===attempt)this.musicAttempt=null;});
  }catch{this.musicBlocked=true;this.musicAttempt=null;}
 }
 stopAudio(reset=!this.enabled||this.game.room?.info.Name!=='rMenu'){
  if(this.music){if(!this.music.paused||this.musicAttempt)this.music.pause();if(reset&&this.music.currentTime!==0)try{this.music.currentTime=0;}catch{}}
  this.musicAttempt=null;this.musicBlocked=false;
 }
 applySampling(){const style=this.game.renderer?.canvas?.style;if(style){const sampling=this.enabled||(this.moonImage&&this.moonFrame())?'auto':'pixelated';if(style.imageRendering!==sampling)style.imageRendering=sampling;}}
 async toggle(){
  if(this.busy)return null;this.busy=true;
  try{
   const enabled=!this.enabled,g=this.game,moon=this.lastMoon||this.moonFrame();this.activating=enabled;
   if(enabled){if(moon)this.pin={x:Math.max(.12,Math.min(.88,(moon.x-g.camera.x)/g.camera.w)),y:Math.max(.14,Math.min(.3,(moon.y-g.camera.y)/g.camera.h))};this.departure=null;await this.load();}
   else if(g.room?.info.Name==='rMenu'){this.departure={frame:g.frame,x:this.pin.x,y:this.pin.y};this.flightStart=g.frame+180+1200;}
   this.setEnabled(enabled);return enabled;
  }finally{this.activating=false;this.busy=false;}
 }
 moonFrame(){
  const g=this.game;if(g.room?.info.Name!=='rMenu'){this.menu=null;return null;}
  const menu=g.first(g.assets.oMenu);if(menu!==this.menu){this.menu=menu;this.flightStart=g.frame+MOON_DELAY;this.departure=null;this.lastMoon=null;this.moonLoadFailed=false;}
  const camera=g.camera;
  if(this.enabled||this.activating)return {x:camera.x+this.pin.x*camera.w,y:camera.y+this.pin.y*camera.h,r:MOON_RADIUS,pinned:true};
  if(this.departure){const age=g.frame-this.departure.frame;if(age<180){const start=this.departure.x*camera.w;return {x:camera.x+start+(camera.w+MOON_RADIUS-start)*age/180,y:camera.y+this.departure.y*camera.h,r:MOON_RADIUS,pinned:false};}this.departure=null;}
  const elapsed=g.frame-this.flightStart;if(elapsed<0)return null;const phase=elapsed%MOON_PERIOD;if(phase>=MOON_FLIGHT)return null;
  const progress=phase/MOON_FLIGHT;
  return {x:camera.x-MOON_RADIUS+(camera.w+2*MOON_RADIUS)*progress,y:camera.y+camera.h*(.18+.025*Math.sin(progress*Math.PI)),r:MOON_RADIUS,pinned:false};
 }
 async loadMoon(){
  if(this.moonImage||this.moonLoading||this.moonLoadFailed||typeof Image==='undefined')return;
  this.moonLoading=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{this.moonImage=image;this.game.drawVersion++;resolve();};image.onerror=()=>reject(new Error('Moon image unavailable.'));image.src='assets/face-moon.png';});
  try{await this.moonLoading;}catch(error){this.moonLoadFailed=true;throw error;}finally{this.moonLoading=null;}
 }
 moonHit(mx,my){const moon=this.moonFrame(),g=this.game;return !!(moon&&this.moonImage&&!g.paused&&Math.hypot(g.camera.x+mx*g.camera.w-moon.x,g.camera.y+my*g.camera.h-moon.y)<=moon.r);}
 menuClick(mx,my){const handled=this.moonHit(mx,my);if(handled)this.lastMoon=this.moonFrame();return {handled,triggered:handled&&!this.busy};}
 drawMoon(ctx){
  if(this.game.room?.info.Name==='rMenu'&&!this.moonImage)this.loadMoon().catch(()=>{});
  const moon=this.moonFrame();this.applySampling();if(!moon||!this.moonImage)return;
  ctx.save();ctx.globalAlpha=1;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.beginPath();ctx.arc(moon.x,moon.y,moon.r,0,Math.PI*2);ctx.clip();ctx.drawImage(this.moonImage,moon.x-moon.r,moon.y-moon.r,moon.r*2,moon.r*2);ctx.restore();
 }
 draw(ctx,layout,originX,originY,white=false){
  if(!this.image||!layout)return;
  let image=this.image,source=[173,12,931,1257];
  if(white){
   if(!this.whiteImage){const mask=document.createElement('canvas');mask.width=210;mask.height=280;const c=mask.getContext('2d');c.drawImage(image,...source,0,0,210,280);c.globalCompositeOperation='source-in';c.fillStyle='white';c.fillRect(0,0,210,280);this.whiteImage=mask;}
   image=this.whiteImage;source=[0,0,210,280];
  }
  ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.translate(layout.x-originX,layout.y-originY);ctx.rotate(layout.angle*Math.PI/180);ctx.drawImage(image,...source,-layout.w/2,-layout.h/2,layout.w,layout.h);ctx.restore();
 }
}
