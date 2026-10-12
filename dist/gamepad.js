import {gameContext} from './bindings.js';

export const GAMEPAD_STORAGE_KEY='himr:gamepad:v1';
const DEAD_ZONE=.24;
export function readGamepadMode(storage){try{const value=storage?.getItem(GAMEPAD_STORAGE_KEY);return ['auto','show','hide'].includes(value)?value:'auto';}catch{return 'auto';}}
export function stickVector(rect,x,y){
 const radius=Math.max(8,Math.min(rect.width,rect.height)/2-18);
 let dx=(x-rect.left-rect.width/2)/radius,dy=(y-rect.top-rect.height/2)/radius;
 if(!Number.isFinite(dx+dy))return {x:0,y:0,radius};
 const length=Math.hypot(dx,dy);if(length>1){dx/=length;dy/=length;}
 return {x:dx,y:dy,radius};
}

// Each finger owns its input source, so releasing one control cannot release another.
export class GamepadInput{
 constructor({router,getGame,isReady=()=>true,onChange=()=>{}}){
  Object.assign(this,{router,getGame,isReady,onChange});this.sticks={move:null,aim:null};this.buttons=new Map();this.pulses=new Map();this.holds=new Map();this.fireLocks=new Set();this.weaponMode='gun';this.aim=null;this.relativeAim=false;this.walkAim=false;this.context=null;this.repeatAt=0;
 }
 active(){const g=this.getGame();return !!(g?.room&&this.isReady()&&!g.paused);}
 player(){const g=this.getGame();return g?.first(g.assets.Object1);}
 dead(){const g=this.getGame();return g?.first(g.assets.oPDead);}
 controllable(){const g=this.getGame();return this.active()&&!!this.player()&&!this.dead()&&Number(g.global.hascontrol)>.5;}
 canStick(kind){return ['move','aim'].includes(kind)&&this.active()&&(kind==='move'&&gameContext(this.getGame())==='menu'||gameContext(this.getGame())==='game'&&(kind==='move'?this.controllable():this.canButton('fire')));}
 buttonAction(id){const context=gameContext(this.getGame());return id==='interact'?context==='menu'?'confirm':context==='story'?'weapon':context==='ending'?'advance':id:id;}
 selectedWeapon(){const g=this.getGame();return g?.global.weapon2&&(this.weaponMode==='grenade'||!g.global.weapon1)?'grenade':'gun';}
 fireAction(){return this.selectedWeapon()==='grenade'?'weapon':'fire';}
 selectWeapon(){
  if(!this.canButton('weapon'))return false;
  this.weaponMode=this.selectedWeapon()==='grenade'?'gun':'grenade';
  // Changing selection never fires. A firing finger must lift or re-center first.
  if(this.holds.has('gamepad:aim')){this.fireLocks.add('gamepad:aim');this.hold('gamepad:aim',null);}
  for(const b of this.buttons.values())if(b.action==='fire'){this.fireLocks.add(b.source);this.hold(b.source,null);}
  for(const [source,action] of this.pulses)if(action==='fire'){this.hold(source,null);this.pulses.delete(source);}
  this.onChange();return true;
 }
 fire(source,enabled){if(!enabled)this.fireLocks.delete(source);this.hold(source,enabled&&!this.fireLocks.has(source)?this.fireAction():null);}
 canButton(id){
  if(!this.active())return false;const g=this.getGame(),context=gameContext(g),dead=this.dead();
  if(id==='interact'&&context!=='game')return true;
  if(context!=='game')return false;
  if(id==='jump'&&dead)return dead.done===1&&dead.vsp===0;
  if(!this.controllable())return false;
  if(id==='fire')return !!(g.first(g.assets.oGun)||g.first(g.assets.oGun59));
  if(id==='weapon')return !!g.global.weapon1&&!!g.global.weapon2;
  return ['jump','interact','secondary','slowmo'].includes(id);
 }
 hasPointer(id){return this.sticks.move?.id===id||this.sticks.aim?.id===id||this.buttons.has(id);}
 hold(source,action){
  if(this.holds.get(source)===action)return;
  this.router.up(source);this.holds.delete(source);
  if(!action)return;
  const result=action==='advance'?this.router.apply(source,[65535]):this.router.action(action,source);
  if(result.handled)this.holds.set(source,action);
 }
 movement(){
  const v=this.sticks.move?.vector,context=gameContext(this.getGame());let action=null;
  if(v&&this.canStick('move'))action=context==='menu'?v.y<-DEAD_ZONE?'menuUp':v.y>DEAD_ZONE?'menuDown':null:v.x<-DEAD_ZONE?'left':v.x>DEAD_ZONE?'right':null;
  if(this.holds.get('gamepad:move')!==action)this.repeatAt=0;
  this.hold('gamepad:move',action);
 }
 startStick(kind,id,vector){
  if(!this.canStick(kind)||this.sticks[kind]||this.hasPointer(id))return false;
  this.sticks[kind]={id,vector};this.moveStick(kind,id,vector);return true;
 }
 moveStick(kind,id,vector){
  if(this.sticks[kind]?.id!==id)return;
  this.sticks[kind].vector=vector;
  if(kind==='move'){this.walkAim=true;this.movement();this.updateAim();}
  else{
   const length=Math.hypot(vector.x,vector.y),aiming=length>DEAD_ZONE&&this.canStick('aim');
   if(aiming){this.aim={x:vector.x/length,y:vector.y/length};this.relativeAim=true;this.updateAim();}
   this.fire('gamepad:aim',aiming);
  }
  this.onChange();
 }
 pressButton(action,id){
  if(!this.canButton(action)||this.hasPointer(id)||this.buttons.size>=12)return false;
  const source='gamepad:button:'+id;
  if(action==='weapon'){this.buttons.set(id,{action,source});this.selectWeapon();return true;}
  if(action==='fire'){this.relativeAim=true;this.updateAim();}
  this.buttons.set(id,{action,source});if(action==='fire')this.fire(source,true);else this.hold(source,this.buttonAction(action));this.onChange();return true;
 }
 pulse(action){
  if(!this.canButton(action))return;
  if(action==='weapon'){this.selectWeapon();return;}
  const source='gamepad:pulse:'+action;
  if(action==='fire'){this.relativeAim=true;this.updateAim();}
  this.pulses.set(source,action);if(action==='fire')this.fire(source,true);else this.hold(source,this.buttonAction(action));this.onChange();
 }
 afterStep(){for(const source of this.pulses.keys())this.hold(source,null);if(this.pulses.size){this.pulses.clear();this.onChange();}}
 release(id){
  let changed=false;
  for(const kind of ['move','aim'])if(this.sticks[kind]?.id===id){this.sticks[kind]=null;this.hold('gamepad:'+kind,null);this.fireLocks.delete('gamepad:'+kind);changed=true;}
  const button=this.buttons.get(id);if(button){this.hold(button.source,null);this.fireLocks.delete(button.source);this.buttons.delete(id);changed=true;}
  if(changed)this.onChange();
 }
 clear(){
  const changed=this.sticks.move||this.sticks.aim||this.buttons.size||this.pulses.size||this.holds.size||this.weaponMode!=='gun';
  for(const source of [...this.holds.keys()])this.hold(source,null);
  this.sticks.move=this.sticks.aim=null;this.buttons.clear();this.pulses.clear();this.fireLocks.clear();this.weaponMode='gun';this.relativeAim=false;this.walkAim=false;this.repeatAt=0;
  if(changed)this.onChange();
 }
 canvasAim(){
  if(this.sticks.aim)this.release(this.sticks.aim.id);
  for(const [id,b] of this.buttons)if(b.action==='fire')this.release(id);
  for(const [source,action] of this.pulses)if(action==='fire'){this.hold(source,null);this.pulses.delete(source);}
  this.relativeAim=false;this.walkAim=false;
 }
 updateAim(){
  const movement=this.holds.get('gamepad:move'),v=this.sticks.aim?.vector,aiming=v&&Math.hypot(v.x,v.y)>DEAD_ZONE;
  if(this.walkAim&&['left','right'].includes(movement)&&this.controllable()&&!aiming&&!this.buttonActive('fire')&&!this.buttonActive('weapon')&&!this.getGame().input.buttons.has(1)){
   const x=movement==='left'?-1:1;if(this.aim?.x!==x||this.aim?.y!==0)this.aim={x,y:0};this.relativeAim=true;
  }
  if(!this.relativeAim||!this.controllable())return;
  const g=this.getGame(),p=this.player(),direction=this.aim||{x:p.image_xscale<0?-1:1,y:0};
  g.input.mx=(p.x+direction.x*650-g.camera.x)/g.camera.w;
  g.input.my=(p.y-28+direction.y*650-g.camera.y)/g.camera.h;
 }
 tick(time){
  const context=gameContext(this.getGame());
  if(!this.active()||this.context!==null&&context!==this.context)this.clear();this.context=context;
  for(const kind of ['move','aim'])if(this.sticks[kind]&&!this.canStick(kind))this.release(this.sticks[kind].id);
  for(const [id,b] of this.buttons)if(!this.canButton(b.action))this.release(id);
  if(context==='game'&&!this.controllable())this.weaponMode='gun';
  this.movement();
  const movement=this.holds.get('gamepad:move');
  if(context==='menu'&&movement){
   if(!this.repeatAt)this.repeatAt=time+400;
   else if(time>=this.repeatAt){this.router.up('gamepad:move');this.router.action(movement,'gamepad:move');this.repeatAt=time+180;}
  }
  this.updateAim();
  if(this.sticks.aim)this.fire('gamepad:aim',Math.hypot(this.sticks.aim.vector.x,this.sticks.aim.vector.y)>DEAD_ZONE&&this.canStick('aim'));
  for(const b of this.buttons.values())if(b.action==='fire')this.fire(b.source,true);
 }
 buttonActive(action){for(const b of this.buttons.values())if(b.action===action)return true;for(const a of this.pulses.values())if(a===action)return true;return action==='fire'&&this.holds.has('gamepad:aim');}
}

export class VirtualGamepad{
 constructor({element,router,getGame,isReady,storage,onModeChange=()=>{}}){
  Object.assign(this,{element,storage,onModeChange});this.mode=readGamepadMode(storage);this.seenTouch=false;
  this.media=window.matchMedia('(any-pointer: coarse)');this.modeSelect=document.getElementById('gamepadMode');this.modeSelect.value=this.mode;
  this.stickElements={move:document.getElementById('moveStick'),aim:document.getElementById('aimStick')};
  this.buttons=[...element.querySelectorAll('[data-pad-action]')];
  this.input=new GamepadInput({router,getGame,isReady:()=>this.visible&&isReady(),onChange:()=>this.render()});
  for(const [kind,el] of Object.entries(this.stickElements))this.bindPointer(el,e=>this.input.startStick(kind,e.pointerId,stickVector(el.getBoundingClientRect(),e.clientX,e.clientY)),e=>this.input.moveStick(kind,e.pointerId,stickVector(el.getBoundingClientRect(),e.clientX,e.clientY)));
  for(const button of this.buttons){
   this.bindPointer(button,e=>this.input.pressButton(button.dataset.padAction,e.pointerId));
   button.addEventListener('click',e=>{if(e.detail===0)this.input.pulse(button.dataset.padAction);});
  }
  element.addEventListener('contextmenu',e=>e.preventDefault());
  this.modeSelect.addEventListener('change',()=>{
   this.mode=this.modeSelect.value;
   try{storage?.setItem(GAMEPAD_STORAGE_KEY,this.mode);}catch{}
   this.syncVisibility();
  });
  this.media.addEventListener('change',()=>this.syncVisibility());
  document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!this.seenTouch){this.seenTouch=true;this.syncVisibility();}},{capture:true});
  window.addEventListener('resize',()=>this.clear());
  this.syncVisibility(false);
 }
 bindPointer(element,start,move){
  element.addEventListener('pointerdown',e=>{
   if(e.button!==0||!start(e))return;e.preventDefault();
   try{element.setPointerCapture(e.pointerId);}catch{this.input.release(e.pointerId);}
  });
  if(move)element.addEventListener('pointermove',move);
  for(const event of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(event,e=>this.input.release(e.pointerId));
 }
 syncVisibility(notify=true){
  const visible=this.mode==='show'||this.mode==='auto'&&(this.media.matches||this.seenTouch),changed=this.visible!==visible;
  this.visible=visible;this.element.hidden=!visible;document.body.classList.toggle('touch-game',visible);
  document.getElementById('touchSettingsButton').hidden=!visible&&!document.fullscreenElement&&!document.getElementById('playerStage').classList.contains('expanded');
  if(changed){this.clear();if(notify)this.onModeChange();}
  this.render();
 }
 clear(){this.input.clear();this.render();}
 tick(time){this.input.tick(time);this.render();}
 afterStep(){this.input.afterStep();}
 canvasAim(){this.input.canvasAim();}
 render(){
  const context=gameContext(this.input.getGame()),dead=this.input.dead(),grenade=this.input.selectedWeapon()==='grenade';
  for(const [kind,el] of Object.entries(this.stickElements)){
   const vector=this.input.sticks[kind]?.vector;
   const x=(vector?vector.x*vector.radius:0)+'px',y=(vector?vector.y*vector.radius:0)+'px',disabled=String(!this.input.canStick(kind));
   if(el.style.getPropertyValue('--stick-x')!==x)el.style.setProperty('--stick-x',x);if(el.style.getPropertyValue('--stick-y')!==y)el.style.setProperty('--stick-y',y);
   if(el.classList.contains('active')!==!!vector)el.classList.toggle('active',!!vector);if(el.getAttribute('aria-disabled')!==disabled)el.setAttribute('aria-disabled',disabled);
  }
  const aimLabel=grenade?'Aim and launch grenades stick. Drag in the direction you want to throw.':'Aim and fire stick. Drag in the direction you want to shoot.';
  if(this.stickElements.aim.getAttribute('aria-label')!==aimLabel)this.stickElements.aim.setAttribute('aria-label',aimLabel);
  const aimText=document.getElementById('aimStickLabel'),aimTitle=grenade?'AIM + THROW':'AIM + FIRE';if(aimText.textContent!==aimTitle)aimText.textContent=aimTitle;
  const label=document.getElementById('moveStickLabel'),text=context==='menu'?'CHOOSE ↑ ↓':'MOVE ← →';if(label.textContent!==text)label.textContent=text;
  for(const button of this.buttons){
   const action=button.dataset.padAction,disabled=!this.input.canButton(action),active=action==='weapon'?grenade:this.input.buttonActive(action);if(button.disabled!==disabled)button.disabled=disabled;if(button.classList.contains('active')!==active)button.classList.toggle('active',active);
   if(action==='weapon'){
    const pressed=String(grenade),description=grenade?'Grenade mode selected. Tap to select the gun.':'Gun mode selected. Tap to select grenades; then use the aim stick or Fire to launch.';
    if(button.getAttribute('aria-pressed')!==pressed)button.setAttribute('aria-pressed',pressed);if(button.getAttribute('aria-label')!==description)button.setAttribute('aria-label',description);
   }
   if(action==='fire'){const description=grenade?'Launch a grenade in the last aimed direction':'Fire the gun in the last aimed direction';if(button.getAttribute('aria-label')!==description)button.setAttribute('aria-label',description);}
   const label=action==='interact'?context==='menu'?'Select':context==='story'||context==='ending'?'Next':'Use':action==='jump'?dead?dead.done===1&&dead.vsp===0?'Revive':'Wait':'Jump':action==='weapon'?grenade?'Gun':'Grenade':action==='fire'?grenade?'Throw':'Fire':null;
   if(label&&button.textContent!==label)button.textContent=label;
  }
 }
}
