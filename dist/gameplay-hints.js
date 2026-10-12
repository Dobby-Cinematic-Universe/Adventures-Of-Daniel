import {gameContext} from './bindings.js';

const truthy=value=>typeof value==='number'?value>.5:!!value;
const touchKeys={jump:'Jump',interact:'Use',secondary:'Close',weapon:'Grenade'};

// Derive hints from live instances, rather than caching whichever object was
// encountered first. These radii match each object's recovered input event.
export function gameplayHint(game,{touch=false,key=()=>null,weaponMode='gun'}={}){
 if(!game?.room)return '';
 const first=name=>game.assets[name]===undefined?null:game.first(game.assets[name]);
 const exists=name=>!!first(name);
 const label=id=>touch&&touchKeys[id]?touchKeys[id]:key(id);
 const tap=touch?'Tap':'Click',context=gameContext(game),dead=first('oPDead');
 if(dead){
  if(dead.done===1&&dead.vsp===0)return touch?'Defeated — tap Revive to return.':label('jump')?`Defeated — press ${label('jump')} or click Revive to return.`:'Defeated — click Revive to return.';
  return `Wait for Daniel to land, then ${touch?'tap':'click'} Revive.`;
 }
 if(context==='story')return touch?'Tap Next to continue the story.':label('weapon')?`Press ${label('weapon')} to continue the story.`:'Set a story key in Controls to continue.';
 if(context==='ending')return touch?'Tap Next to advance the ending text.':'Press any key to advance the ending text.';
 if(context==='menu'){
  let text=touch?'Choose with the left stick, then tap Select.':`Choose with ${label('menuUp')||'a menu key'} / ${label('menuDown')||'a menu key'}, then ${label('confirm')||'your confirm key'}.`;
  const moon=game.faceEgg?.moonFrame(),camera=game.camera;
  if(moon&&game.faceEgg.moonImage&&camera&&moon.x-moon.r>=camera.x&&moon.x+moon.r<=camera.x+camera.w)text+=` ${tap} the moon to ${game.faceEgg.enabled?'restore the original faces':'reveal a familiar face'}.`;
  return text;
 }
 if(truthy(game.global.clickedbed))return 'Sleeping — wait for the fade to clear. Health and slow motion recover.';
 if(!truthy(game.global.hascontrol))return exists('oButtonOff')?`${tap} an option. The power button closes the computer.`:`${tap} an option to continue.`;
 const player=first('Object1');
 if(!player)return 'Choose an option to continue.';
 if(touch&&weaponMode==='grenade'&&truthy(game.global.weapon1)&&truthy(game.global.weapon2))return 'Grenade ready — tap a target to throw once, then the gun returns. Tap Cancel to disarm.';
 const visible=s=>!s.dead&&s.visible!==false&&game.layerVisible(s.layer);
 const nearby=(name,radius)=>{
  const type=game.assets[name];if(type===undefined)return [];
  return game.resolve(type).filter(s=>visible(s)&&Math.hypot(player.x-s.x,player.y-s.y)<=radius);
 };
 const action=(id,verb)=>label(id)?`${touch?'Tap':'Press'} ${label(id)} to ${verb}.`:`Bind ${id==='interact'?'Open / interact':'Close door / kiss'} in Controls to ${verb}.`;
 const candidates=[];
 const add=(s,text,priority=1)=>candidates.push({distance:Math.hypot(player.x-s.x,player.y-s.y),text,priority});
 // Keyboard doors deliberately take precedence over click interactions. The
 // wave controller's unused "closed" local does not block these input events.
 for(const s of nearby('oDoor',80))add(s,action('interact','open the door'),0);
 for(const s of nearby('oDoor2',100))add(s,action('interact','open the door'),0);
 for(const s of nearby('oDoorOpen',120))add(s,action('secondary','close the door'),0);
 for(const name of ['oCrate','oCrate2','oCrate3'])for(const s of nearby(name,100))add(s,action('interact','collect the crate'));
 for(const s of nearby('oPetrolstationDoor',200))add(s,exists('oQuestObjectives3')?`${tap} the petrol station door to enter your shift.`:'Accept a shift at the job sign before entering.');
 for(const s of nearby('oPetrolstationDoor153',200))add(s,game.global.quest3===1?`Shift complete — ${touch?'tap':'click'} the exit door to go home.`:'Serve all three customers before leaving.');
 for(const s of nearby('oJobSign',100))add(s,exists('oQuestMarker2')?`${tap} the job sign to choose a shift.`:'Sleep before starting another shift.');
 for(const s of nearby('oBedSleep',100))add(s,`${tap} the bed to sleep and restore hearts.`);
 for(const s of nearby('oSign',120)){
  if(!exists('oButtongoback')&&game.place(s,player.x,player.y,game.assets.wall))add(s,`${tap} the computer to open it.`);
 }
 for(const s of nearby('oMum',120))add(s,game.global.quest1===1&&exists('oQuestObjectives')?`${tap} Mum to finish your quest.`:`${tap} Mum to talk about your quest.`);
 for(const s of nearby('oGirl16364',111)){
  let text=label('interact')?`Hold ${label('interact')} while moving to guide her.`:'Bind Open / interact in Controls to guide her.';
  if(player.x<s.x&&label('secondary'))text+=` ${label('secondary')} kisses.`;
  text+=' Bring her onto the bed to restore hearts.';add(s,text);
 }
 candidates.sort((a,b)=>a.priority-b.priority||a.distance-b.distance);
 const gun=exists('oGun'),launcher=exists('oGun59'),hasGun=truthy(game.global.weapon1),hasGrenades=truthy(game.global.weapon2);
 const armedGrenade=weaponMode==='grenade'||!hasGun&&launcher;
 const shortCombat=touch?armedGrenade?'Right stick aims and throws.':'Right stick aims and fires.':'';
 if(candidates.length){
  const text=candidates[0].text;
  return touch&&(gun||launcher)&&text.length<90?`${text} ${shortCombat}`:text;
 }
 if(exists('oQuestObjectives3')&&(player.x>18000||game.room.info.Name==='petrolstationroom'))return game.global.quest3===1?`Shift complete — ${touch?'tap':'click'} the exit door to go home.`:label('interact')?`${label('interact')} collects crates. Serve all three customers, then use the exit door.`:'Bind Open / interact in Controls to collect crates and finish your shift.';
 if(gun||launcher){
  if(touch)return armedGrenade?'Right stick aims and throws grenades; tap Throw to fire.':`Right stick aims and fires the gun.${hasGrenades?' Tap Grenade, then tap a target for one throw.':''}`;
  const primary=hasGun||gun?'the gun':'grenades';
  return `Left click fires ${primary}${game.cheats?.infiniteAmmo?' · Unlimited ammunition':''}${hasGrenades&&label('weapon')?` · ${label('weapon')} fires grenades`:''}.`;
 }
 return `Walk near people and objects, then ${touch?'tap':'click'} them. ${label('interact')?`${label('interact')} opens doors and collects crates.`:'Use Controls to choose an interaction key.'}`;
}
