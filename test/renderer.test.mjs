import test from 'node:test';
import assert from 'node:assert/strict';
import {Renderer} from '../dist/engine.js';

function canvas(width=2,height=1,pixels=null){
 const c={width,height,pixels:pixels||new Uint8ClampedArray(width*height*4),calls:[]};
 const states=[];
 const ctx={globalAlpha:1,globalCompositeOperation:'source-over',fillStyle:'#000000',
  save(){states.push({globalAlpha:this.globalAlpha,globalCompositeOperation:this.globalCompositeOperation,fillStyle:this.fillStyle});},
  restore(){Object.assign(this,states.pop());},
  drawImage(source,...args){c.calls.push({op:'image',source,args,alpha:this.globalAlpha});if(args.length===8&&args[6]===c.width&&args[7]===c.height&&source.pixels)c.pixels=source.pixels.slice();},
  getImageData(){return {data:c.pixels.slice()};},putImageData(p){c.pixels=p.data.slice();},
  fillRect(...args){c.calls.push({op:'fill',args,alpha:this.globalAlpha,color:this.fillStyle});if(this.globalCompositeOperation==='source-in'){const rgb=this.fillStyle==='white'?[255,255,255]:this.fillStyle.match(/\d+/g).map(Number);for(let n=0;n<c.pixels.length;n+=4){c.pixels[n]=rgb[0];c.pixels[n+1]=rgb[1];c.pixels[n+2]=rgb[2];}}},
  translate(){},rotate(){},scale(){},setTransform(){},beginPath(){},rect(){},clip(){},stroke(){},fill(){},clearRect(){throw new Error('A fully repainted opaque canvas needs no clear.');}
 };
 c.ctx=ctx;c.getContext=(type,options)=>{c.contextOptions=options;return ctx;};return c;
}
function game(){
 const texture={TexturePage:'Texture 0',SourceX:0,SourceY:0,SourceWidth:2,SourceHeight:1,TargetX:0,TargetY:0,TargetWidth:2,TargetHeight:1};
 const info={Name:'tiny',Width:2,Height:1,OriginX:0,OriginY:0,GMS2PlaybackSpeed:1};
 return {sprites:[{info,textures:[texture]}],fonts:[{info:{EmSize:10},texture,glyphMap:new Map([[65,{Shift:5,Offset:0,SourceX:0,SourceY:0,SourceWidth:1,SourceHeight:1}],[0x1f600,{Shift:7,Offset:0,SourceX:1,SourceY:0,SourceWidth:1,SourceHeight:1}]]),lineHeight:8}],assets:{tiny:0},camera:{x:0,y:0,w:100,h:100},gui:{w:100,h:100},room:{info:{Name:'room1'}},frame:0,layers:[],instances:[],objectMeta:[{gui:true}],faceEgg:{layout:()=>null,draw(){},drawMoon(){},applySampling(){}},layerVisible:()=>true,eventFor:()=>null,runEvent(){}};
}
function withDocument(fn){const original=globalThis.document;globalThis.document={createElement:()=>canvas()};try{return fn();}finally{if(original===undefined)delete globalThis.document;else globalThis.document=original;}}

test('sprite tinting preserves the recovered RGB multiplication and source alpha exactly',()=>withDocument(()=>{
 const g=game(),target=canvas(),r=new Renderer(g,target),source=canvas(2,1,new Uint8ClampedArray([200,100,40,128,255,1,20,0]));r.images=[source];r.alpha=.4;
 r.sprite(0,0,10,20,-1,2,30,0x4080ff,.5);const draw=target.calls.at(-1);
 assert.deepEqual([...draw.source.pixels],[200,50,10,128,255,1,5,0]);assert.equal(draw.alpha,.2);assert.deepEqual(draw.args,[0,0,2,1]);assert.deepEqual(target.contextOptions,{alpha:false});
 const cached=draw.source;r.sprite(0,0,11,21,1,1,0,0x4080ff);assert.equal(target.calls.at(-1).source,cached);assert.equal(r.tintCache.size,1);
}));

test('white hit flashes retain sprite transparency, reuse the mask, and still draw the secret face',()=>withDocument(()=>{
 const g=game(),target=canvas(),r=new Renderer(g,target);r.images=[canvas(2,1,new Uint8ClampedArray([200,100,40,128,255,1,20,0]))];r.white=true;let faces=0;g.faceEgg.layout=()=>({cut:[0,0,1,1]});g.faceEgg.draw=()=>faces++;
 r.sprite(0,0,10,20,1,1,0,0x123456,1,true);const mask=target.calls.at(-1).source;assert.deepEqual([...mask.pixels],[255,255,255,128,255,255,255,0]);assert.equal(faces,1);
 r.sprite(0,0,10,20);assert.equal(target.calls.at(-1).source,mask);assert.equal(r.tintCache.size,1);
}));

test('shared tint and font cache evicts the least recently used canvas within byte and count limits',()=>{
 const r=new Renderer(game(),canvas());r.cacheLimit=16;r.cacheCount=2;const a=canvas(),b=canvas(),c=canvas();r.cache('a',a);r.cache('b',b);assert.equal(r.cacheBytes,16);r.cached('a');r.cache('c',c);
 assert.deepEqual([...r.tintCache.keys()],['a','c']);assert.equal(b.width,0);assert.equal(b.height,0);assert.equal(r.cacheBytes,16);
 const big=canvas(3,2);r.cache('oversized',big);assert.equal(r.tintCache.has('oversized'),false);assert.equal(big.width,3);assert.equal(r.cacheBytes,16);
 r.cache('a',a);assert.equal(r.cacheBytes,16);r.cache('a',canvas(1,1));assert.equal(a.width,0);assert.equal(r.cacheBytes,12);
});

test('bitmap text keeps multiline, Unicode, alignment, glyph color and alpha behavior',()=>withDocument(()=>{
 const g=game(),target=canvas(),r=new Renderer(g,target);r.images=[canvas(2,1,new Uint8ClampedArray([255,255,255,128,255,255,255,255]))];r.col=0x332211;r.alpha=.6;r.halign=1;r.valign=2;
 assert.deepEqual(r.measure('A😀#?'),{width:12,height:16});r.text(20,30,'A😀#?');const images=target.calls.filter(c=>c.op==='image');assert.equal(images.length,2);assert.deepEqual(images[0].args,[0,0,1,1,14,14,1,1]);assert.deepEqual(images[1].args,[1,0,1,1,19,14,1,1]);assert.equal(images[0].alpha,.6);assert.deepEqual([...images[0].source.pixels],[17,34,51,128,17,34,51,255]);
 const atlas=images[0].source;r.text(20,30,'A');assert.equal(target.calls.at(-1).source,atlas);assert.equal(r.tintCache.size,1);
}));

test('texture-page parsing occurs once for each immutable sprite or font atlas entry',()=>{
 const g=game(),r=new Renderer(g,canvas()),t=g.sprites[0].textures[0];let reads=0;Object.defineProperty(t,'TexturePage',{get(){reads++;return 'Texture 0';}});assert.equal(r.texturePage(t),0);assert.equal(r.texturePage(t),0);assert.equal(reads,1);
});

function instance(id,depth=0,extra={}){return {id,depth,object_index:0,visible:true,layer:0,sprite_index:0,x:20,y:20,image_xscale:1,image_yscale:1,image_angle:0,...extra};}
test('draw order reuses commands while honoring changed depths, stable ties, culling, GUI and draw side effects',()=>{
 const g=game(),r=new Renderer(g,canvas(100,100)),a=instance('a',5),b=instance('b',5),off=instance('off',8,{x:1e6}),hidden=instance('hidden',20,{visible:false});g.instances=[a,b,off,hidden];let log=[];
 g.eventFor=()=>({active:true});g.runEvent=(s,type,sub)=>{log.push(`${s.id}:${sub}`);if(sub===0)s.flash=(s.flash||0)+1;};r.draw();assert.deepEqual(log,['off:0','a:0','b:0','off:64','a:64','b:64']);const commands=r.commands.slice();assert.equal(off.flash,1);
 log=[];r.draw();assert.deepEqual(r.commands,commands);assert.equal(r.commandOrderDirty,false);assert.equal(off.flash,2);
 b.depth=10;log=[];r.draw();assert.deepEqual(log.slice(0,3),['b:0','off:0','a:0']);assert.equal(r.commandOrderDirty,true);
 g.eventFor=()=>null;r.self=s=>log.push(s.id);log=[];r.draw();assert.deepEqual(log.slice(0,2),['b','a']);assert.equal(r.commandCount,2);assert.equal(r.commandPool[2].ref,null);
 a.dead=true;log=[];r.draw();assert.equal(r.commandCount,1);assert.equal(r.commandPool[1].ref,null);assert.equal(r.guiCommands.length,0);
});

test('layer sprites, backgrounds and menu moon keep equal-depth enqueue order and animated values',()=>{
 const g=game(),r=new Renderer(g,canvas()),layer={info:{LayerType:1,LayerDepth:950,IsVisible:true,XOffset:3,YOffset:4},data:{},sprites:[{Sprite:'tiny',X:10,Y:20,ScaleX:1,ScaleY:1,Rotation:0,FrameIndex:2,AnimationSpeedType:1,AnimationSpeed:.5,Color:0xffffff}]};g.layers=[layer];g.room.info.Name='rMenu';g.frame=10;g.instances=[instance('player',950)];const log=[];g.faceEgg.drawMoon=()=>log.push('moon');r.background=()=>log.push('background');r.sprite=(...args)=>log.push(args);r.self=()=>log.push('player');r.draw();assert.deepEqual(log.slice(0,2),['moon','background']);assert.deepEqual(log[2],[0,7,13,24,1,1,0,0xffffff,1,false]);assert.equal(log[3],'player');
 layer.info.IsVisible=false;log.length=0;r.draw();assert.deepEqual(log,['moon','background','player']);
});

test('rotated sprite culling matches the original corner calculation for negative scales and boundaries',()=>{
 const g=game(),r=new Renderer(g,canvas()),i=g.sprites[0].info;Object.assign(i,{Width:80,Height:100,OriginX:25,OriginY:40});
 const original=(x,y,sx,sy,angle)=>{let left=x-i.OriginX*sx,top=y-i.OriginY*sy,right=left+i.Width*sx,bottom=top+i.Height*sy;if(angle){const c=Math.cos(angle*Math.PI/180),s=Math.sin(angle*Math.PI/180),p=[[left-x,top-y],[right-x,top-y],[right-x,bottom-y],[left-x,bottom-y]].map(([a,b])=>[x+a*c+b*s,y-a*s+b*c]);left=Math.min(...p.map(p=>p[0]));right=Math.max(...p.map(p=>p[0]));top=Math.min(...p.map(p=>p[1]));bottom=Math.max(...p.map(p=>p[1]));}else{if(left>right)[left,right]=[right,left];if(top>bottom)[top,bottom]=[bottom,top];}return right>=-150&&left<=250&&bottom>=-150&&top<=250;};
 for(const sx of [-2,-1,.5,1,2])for(const sy of [-1,.5,1])for(const angle of [-180,-90,-35,0,30,90,180])for(const x of [-251,-150,0,249,300])for(const y of [-250,-150,0,250,300])assert.equal(r.inView(0,x,y,sx,sy,angle),original(x,y,sx,sy,angle));
});

test('draw-command object cache remains capped after unusually large scenes',()=>{
 const g=game(),r=new Renderer(g,canvas());g.instances=Array.from({length:2050},(_,n)=>instance(n));g.objectMeta[0].gui=false;r.self=()=>{};r.draw();assert.equal(r.commandPool.length,2048);assert.equal(r.commands.length,0);assert.equal(r.commandSlots.length,0);assert.equal(r.commandCount,0);
 g.instances.length=1;r.draw();assert.equal(r.commandCount,1);assert.equal(r.commandPool.length,2048);assert.equal(r.commandPool[2047].ref,null);
});
