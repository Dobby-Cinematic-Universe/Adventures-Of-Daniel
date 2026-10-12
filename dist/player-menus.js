import {BrowserWorldStorage,WorldSaveRepository} from './world-saves.js';
import {encodeWorld,MAX_WORLD_BYTES} from './world-state.js';
import {formatGameNumber} from './engine.js';

const $=id=>document.getElementById(id);
const roomLabels={room26:'Home',room1:'Into the world',room3:'The adventure continues',rMenu:'Original menu',rEnding:'Ending',introroom:'A new day',introroom2:'The story begins',petrolstationroom:'Petrol station'};
const cheatActions=[['heal','Restore hearts / revive'],['money','Add $1,000'],['ammo','Add 1,000 bullets'],['grenades','Add 50 grenades'],['slowmo','Refill slow motion'],['weapons','Unlock both weapons']];
const cheatToggles=[['invincible','Invulnerability','Enemy attacks cannot reduce health.'],['infiniteAmmo','Unlimited ammunition','Fire either weapon without using bullets or grenades.'],['infiniteSlowmo','Unlimited slow motion','Hold your slow-motion control without using energy.']];
function button(label,aria,action){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',aria);b.onclick=action;return b;}

export class PlayerMenus {
 constructor({getGame,isStarted,pause,clearInput,loaded,notify}){
  Object.assign(this,{getGame,isStarted,pause,clearInput,loaded,notify});this.names={};this.busy=false;
  $('saveButton').onclick=()=>this.openWorld();$('cheatsButton').onclick=()=>this.openCheats();
  for(const [id,key] of [['worldDialog','worldPaused'],['cheatsDialog','cheatsPaused']])$(id).addEventListener('close',()=>{clearInput();if(isStarted()&&!this[key])pause(false);});
  $('exportCurrentWorld').onclick=()=>this.exportCurrent();
  $('importWorldButton').onclick=()=>{if(!this.busy)$('importWorldFile').click();};
  $('importWorldFile').onchange=()=>this.importFile();
 }
 isOpen(){return $('worldDialog').open||$('cheatsDialog').open;}
 async initialize(game){
  let indexedDB;try{indexedDB=window.indexedDB;}catch{}
  this.repository=new WorldSaveRepository(game.data,new BrowserWorldStorage(indexedDB));
  $('saveButton').disabled=false;$('cheatsButton').disabled=false;
  try{await this.repository.migrateLegacy(game);await this.refreshWorlds();}catch(error){this.worldStatus(error.message,true);}
 }
 worldStatus(message,error=false){$('worldSaveStatus').textContent=message;$('worldSaveStatus').classList.toggle('menu-error',error);}
 async refreshWorlds(){
  this.metadata=await this.repository.list();this.renderWorlds();
  $('continueButton').hidden=this.isStarted()||!this.metadata.length;
 }
 renderWorlds(){
  const rows=$('worldSlots');rows.replaceChildren();
  const selector=$('importWorldSlot'),selected=selector.value;selector.replaceChildren();
  for(let slot=1;slot<=3;slot++){
   const saved=this.metadata?.find(m=>m.slot===slot),card=document.createElement('section');card.className='world-slot';
   const heading=document.createElement('div');heading.className='world-slot-heading';
   const label=document.createElement('label');label.htmlFor=`worldName${slot}`;label.textContent=`SLOT ${slot}`;
   const name=document.createElement('input');name.id=`worldName${slot}`;name.maxLength=50;name.setAttribute('aria-label',`World ${slot} name`);name.value=this.names[slot]??saved?.name??`World ${slot}`;name.oninput=()=>this.names[slot]=name.value;
   heading.append(label,name);card.append(heading);
   const detail=document.createElement('p');detail.className='slot-detail';
   detail.textContent=saved?`${roomLabels[saved.room]||saved.room} · ${new Date(saved.savedAt).toLocaleString()} · ${saved.rooms} room${saved.rooms===1?'':'s'}${saved.cheats?' · Cheats active':''}`:'Empty slot';card.append(detail);
   const actions=document.createElement('div');actions.className='slot-actions';
   const save=button(saved?'Save over this world':'Save here',`Save world ${slot}`,()=>this.operation(async()=>{
    const name=$(`worldName${slot}`).value,meta=await this.repository.save(slot,name,this.getGame().captureWorld());this.names[slot]=meta.name;await this.refreshWorlds();this.worldStatus(`World saved in slot ${slot}. Original statistics saves are unchanged.`);
   }));
   const load=button('Load',`Load world ${slot}`,()=>this.operation(async()=>{const snapshot=await this.repository.load(slot);this.loaded(snapshot);this.worldPaused=false;$('worldDialog').close();this.notify(`World ${slot} restored`);}));
   const exportButton=button('Export file',`Export world ${slot}`,()=>this.operation(async()=>{this.download(await this.repository.export(slot),`himr-world-${slot}.json`);this.worldStatus(`World ${slot} exported. Keep the file to restore it in another browser.`);}));
   load.disabled=exportButton.disabled=!saved;actions.append(save,load,exportButton);card.append(actions);rows.append(card);
   const option=document.createElement('option');option.value=String(slot);option.textContent=`Slot ${slot}: ${name.value}`;selector.append(option);
  }
  if(selected)selector.value=selected;
 }
 async operation(action){
  if(this.busy)return;this.busy=true;$('worldDialog').classList.add('menu-busy');this.worldStatus('Working…');
  try{await action();}catch(error){this.worldStatus(error.message,true);}
  finally{this.busy=false;$('worldDialog').classList.remove('menu-busy');}
 }
 async openWorld(){
  if(!this.getGame())return;this.worldPaused=this.getGame().paused||!this.isStarted();if(this.isStarted())this.pause(true);this.clearInput();
  this.worldStatus('Full worlds are separate from the original S / L statistics save.');this.renderWorlds();$('worldDialog').showModal();
  try{await this.refreshWorlds();}catch(error){this.worldStatus(error.message,true);}
 }
 async continueWorld(){
  if(this.continuing)return;this.continuing=true;$('continueButton').disabled=true;
  try{const latest=await this.repository.latest();if(!latest)throw new Error('No saved world yet.');this.loaded(await this.repository.load(latest.slot));}
  catch(error){this.notify(error.message);}
  finally{this.continuing=false;$('continueButton').disabled=false;}
 }
 download(text,name){
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 exportCurrent(){
  try{const {text}=encodeWorld(this.getGame().captureWorld(),this.getGame().data);this.download(text,'himr-current-world.json');this.worldStatus('Current world exported. This also works when browser storage is unavailable.');}
  catch(error){this.worldStatus(error.message,true);}
 }
 async importFile(){
  const file=$('importWorldFile').files?.[0];$('importWorldFile').value='';if(!file)return;
  await this.operation(async()=>{
   if(file.size>MAX_WORLD_BYTES)throw new Error('Choose a world file no larger than 8 MB.');
   const slot=Number($('importWorldSlot').value),name=file.name.replace(/\.json$/i,'').slice(0,50);
   const metadata=await this.repository.import(slot,name,await file.text());this.names[slot]=metadata.name;await this.refreshWorlds();this.worldStatus(`World imported into slot ${slot}. Select Load to enter it.`);
  });
 }
 renderCheats(){
  const game=this.getGame(),ready=!!game.first(game.assets.Object1);
  $('cheatSummary').textContent=`Hearts ${formatGameNumber(game.global.php)} / 8 · $${formatGameNumber(game.global.kills)} · ${formatGameNumber(game.global.ammo)} bullets · ${formatGameNumber(game.global.bullets)} grenades`;
  const actions=$('cheatActions');actions.replaceChildren();
  for(const [key,label] of cheatActions){const b=button(label,label,()=>{try{game.applyCheat(key);this.clearInput();this.renderCheats();$('cheatStatus').textContent=label+' applied.';}catch(error){$('cheatStatus').textContent=error.message;}});b.disabled=!ready;actions.append(b);}
  const toggles=$('cheatToggles');toggles.replaceChildren();
  for(const [key,title,description] of cheatToggles){
   const label=document.createElement('label');label.className='cheat-toggle';
   const input=document.createElement('input');input.type='checkbox';input.checked=game.cheats[key];input.setAttribute('aria-label',title);
   input.onchange=()=>{game.setCheat(key,input.checked);$('cheatStatus').textContent=`${title} ${input.checked?'enabled':'disabled'}.`;};
   const copy=document.createElement('span'),strong=document.createElement('strong'),small=document.createElement('small');strong.textContent=title;small.textContent=description;copy.append(strong,small);label.append(input,copy);toggles.append(label);
  }
 }
 openCheats(){
  if(!this.getGame())return;this.cheatsPaused=this.getGame().paused||!this.isStarted();if(this.isStarted())this.pause(true);this.clearInput();this.renderCheats();
  $('cheatStatus').textContent='Cheats apply to this adventure and are included in world saves.';$('cheatsDialog').showModal();
 }
}
