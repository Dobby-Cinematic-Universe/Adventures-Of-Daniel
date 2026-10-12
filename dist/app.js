import {Engine} from './engine.js';
import {ACTIONS,BindingProfile,InputRouter,gameContext,keyLabel,canvasPoint} from './bindings.js';
import {PlayerMenus} from './player-menus.js';
import {VirtualGamepad} from './gamepad.js';

const $=id=>document.getElementById(id);
const canvas=$('game'),overlay=$('overlay'),dialog=$('controlsDialog');
let game,started=false,toastTimer,wasPaused=false,last=0,accumulator=0,capture=null,lastHelpTime=0,lastDrawKey='';
let storage=null;try{storage=localStorage;}catch{}
const profile=new BindingProfile(storage);
const router=new InputRouter(profile,()=>game?.input,()=>gameContext(game));
const roomNames={room26:'Home',rMenu:'Original menu',introroom2:'The story begins',introroom:'A new day',room1:'Into the world',room3:'The adventure continues',rEnding:'The end',petrolstationroom:'Petrol station'};
const menus=new PlayerMenus({getGame:()=>game,isStarted:()=>started,pause:paused,clearInput,loaded:snapshot=>{game.applyWorld(snapshot);clearInput();started=true;game.audioEnabled=!$('soundButton').classList.contains('muted');for(const id of ['pauseButton','menuButton'])$(id).disabled=false;paused(false);lastDrawKey='';updateGameplayHelp();},notify:toast});
const stage=$('playerStage');
for(const id of ['controlsDialog','worldDialog','cheatsDialog'])stage.append($(id));
const touchSettings=document.createElement('button');touchSettings.id='touchSettingsButton';touchSettings.type='button';touchSettings.hidden=true;touchSettings.textContent='Controls';touchSettings.setAttribute('aria-label','Gamepad and keyboard controls');document.querySelector('.player-actions').insertBefore(touchSettings,$('fullscreenButton'));
const gamepad=new VirtualGamepad({element:$('virtualGamepad'),router,getGame:()=>game,isReady:()=>started&&!dialog.open&&!menus.isOpen(),storage,onModeChange:()=>{clearInput();updateHints();}});
const focusGame=()=>canvas.focus({preventScroll:true});

function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2200);}
function clearInput(){router.clear();gamepad.clear();}
function pauseHint(){if(gamepad.visible)return 'Tap Resume game to continue';const key=profile.first('pause');return key?`Press ${keyLabel(key)} to resume`:'Use Resume to continue';}
function paused(value){
  if(!started)return;game.paused=value;clearInput();overlay.hidden=!value;
  $('panelKicker').textContent='TAKE A BREATHER';$('panelTitle').textContent='Adventure can wait.';
  $('panelDescription').textContent='Your world is right where you left it.';$('playLabel').textContent='Resume game';
  $('continueButton').hidden=true;$('startHint').textContent=pauseHint();$('pauseLabel').textContent=value?'Resume':'Pause';
  $('playerStatus').textContent=value?'PAUSED':'PLAYING';$('statusDot').classList.toggle('paused',value);
  if(value)game.audioStop();else{resumeAmbience();focusGame();}last=0;accumulator=0;
}
function resumeAmbience(){if(game.audioEnabled&&['room26','petrolstationroom'].includes(game.room.info.Name))game.audioPlay(game.assets.nightsounds,true);game.faceEgg.syncAudio(true);}
function start(){
  if(!game?.room)return;
  if(started){paused(false);return;}started=true;game.paused=false;
  game.audioEnabled=!$('soundButton').classList.contains('muted');
  overlay.hidden=true;for(const id of ['pauseButton','saveButton','menuButton'])$(id).disabled=false;
  $('playerStatus').textContent='PLAYING';resumeAmbience();focusGame();last=0;
}
function openMenu(){game.fps=60;clearInput();game.loadRoom(game.assets.rMenu);paused(false);focusGame();}
function frame(time){
  requestAnimationFrame(frame);if(!game)return;if(!last)last=time;
  const dt=Math.min(100,time-last);last=time;
  gamepad.tick(time);
  if(started&&!game.paused){accumulator+=dt;let n=0;while(accumulator>=1000/game.fps&&n++<5){const step=1000/game.fps;gamepad.input.updateAim();game.step();gamepad.afterStep();accumulator-=step;}if(n>5)accumulator=Math.min(accumulator,1000/game.fps);}
  else accumulator=0;
  const drawKey=`${game.roomIndex}:${game.frame}:${game.drawVersion}`;if(drawKey!==lastDrawKey){game.renderer.draw();lastDrawKey=drawKey;}
  if(time-lastHelpTime>200){updateGameplayHelp();lastHelpTime=time;}
}
function updateGameplayHelp(){
  if(!game)return;
  const dead=game.first(game.assets.oPDead),gun=game.first(game.assets.oGun),launcher=game.first(game.assets.oGun59),p=game.first(game.assets.Object1),girl=game.first(game.assets.oGirl16364),bed=game.first(game.assets.oBedSleep);
  const moon=game.room?.info.Name==='rMenu'?game.faceEgg.moonFrame():null;
  const moonAvailable=moon&&game.faceEgg.moonImage&&moon.x-moon.r>=game.camera.x&&moon.x+moon.r<=game.camera.x+game.camera.w;
  const touch=gamepad.visible,tap=touch?'tap':'click';
  const touchLabels={jump:'Jump',interact:'Use',secondary:'Close',weapon:'Weapon'};
  const key=id=>touch&&touchLabels[id]?touchLabels[id]:profile.first(id)?keyLabel(profile.first(id)):null;
  const revive=key('jump')?`press ${key('jump')} or click Revive`:'click Revive';
  let text=`Walk up to people and objects, then ${tap} them. `+(key('interact')?`${key('interact')} opens doors and collects crates.`:'Use Controls to choose an interaction key.');
  $('reviveButton').hidden=!(dead&&dead.done===1&&dead.vsp===0);
  if(dead)text=dead.done===1&&dead.vsp===0?touch?'Defeated — tap Revive to return.':`Defeated — ${revive} to return.`:`Wait for Daniel to land, then ${touch?'tap Revive':revive}.`;
  else if(gameContext(game)==='story')text=touch?'Tap Next to continue the story.':key('weapon')?`Press ${key('weapon')} to continue the story.`:'Set a story key in Controls to continue.';
  else if(gameContext(game)==='menu')text=(touch?'Choose with the left stick, then tap Select.':`Choose with ${key('menuUp')||'a menu key'} / ${key('menuDown')||'a menu key'}, then ${key('confirm')||'your confirm key'}.`)+(moonAvailable?game.faceEgg.enabled?` ${tap} the moon to restore the original faces.`:` ${tap} the moon to reveal a familiar face.`:'');
  else if(gameContext(game)==='ending')text=touch?'Tap Next to advance the ending text.':'Press any key to advance the ending text.';
  else if(game.global.clickedbed)text='Sleeping — wait for the fade to clear. Health and slow motion recover.';
  else if(!game.global.hascontrol)text=game.resolve(game.assets.oButtonOff).length?`${tap} an option. The power button closes the computer.`:`${tap} an option to continue.`;
  else if(p&&p.x>18000&&game.resolve(game.assets.oQuestObjectives3).length)text=game.global.quest3===1?`Shift complete — ${tap} the door on the right to go home.`:`${key('interact')||'Your interaction key'} collects each crate. Serve all three customers, then use the exit door.`;
  else if(p&&girl&&Math.hypot(p.x-girl.x,p.y-girl.y)<=111)text=`Hold ${key('interact')||'your interaction key'} while moving to guide her. From her left, ${key('secondary')||'your secondary key'} kisses. Bring her onto the bed to restore hearts.`;
  else if(p&&bed&&Math.hypot(p.x-bed.x,p.y-bed.y)<=130)text=`${tap} the bed to sleep. Bring the companion onto the bed to restore hearts.`;
  else if(gun||launcher){const weapon=launcher?'Grenade launcher':'Gun',other=launcher?'gun':'grenades',unlocked=launcher?game.global.weapon1:game.global.weapon2;text=`${weapon} equipped · ${touch?'Right stick aims and fires':'Left click to fire'}${game.cheats.infiniteAmmo?' · Unlimited ammunition':''}${unlocked&&key('weapon')?` · ${key('weapon')} switches to ${other}`:''}.`;}
  if(started&&!game.paused)$('playerStatus').textContent=Object.values(game.cheats).some(Boolean)?'PLAYING · CHEATS':'PLAYING';
  if($('gameHelpText').textContent!==text)$('gameHelpText').textContent=text;
}
$('reviveButton').onclick=()=>{
  if(!game||!started)return;
  if(game.paused)paused(false);
  router.action('jump','revive-button');game.step();router.up('revive-button');updateGameplayHelp();focusGame();
};
$('playButton').onclick=()=>start();$('continueButton').onclick=()=>menus.continueWorld();
$('pauseButton').onclick=()=>paused(!game.paused);
$('menuButton').onclick=openMenu;
$('soundButton').onclick=()=>{
  const muted=$('soundButton').classList.toggle('muted');$('soundButton').setAttribute('aria-pressed',String(muted));
  $('soundButton').setAttribute('aria-label',muted?'Unmute sound':'Mute sound');$('soundButton').title=muted?'Unmute sound':'Mute sound';
  document.querySelector('.sound-waves').style.opacity=muted?'0.15':'1';
  if(game){game.audioEnabled=started&&!muted;if(muted)game.audioStop();else if(started&&!game.paused)resumeAmbience();}focusGame();
};
$('fullscreenButton').onclick=async()=>{
 clearInput();
 if(document.fullscreenElement){try{await document.exitFullscreen();}catch{toast('Use your browser’s fullscreen control to exit.');}return;}
 if(stage.classList.contains('expanded')){stage.classList.remove('expanded');document.body.classList.remove('player-expanded');updateFullscreen();return;}
 try{if(!stage.requestFullscreen)throw new Error('Fullscreen unavailable');await stage.requestFullscreen();}
 catch{stage.classList.add('expanded');document.body.classList.add('player-expanded');updateFullscreen();}
 focusGame();
};
function updateFullscreen(){clearInput();const expanded=!!document.fullscreenElement||stage.classList.contains('expanded');$('fullscreenButton').setAttribute('aria-label',expanded?'Exit expanded game':'Expand game');$('fullscreenButton').title=expanded?'Exit expanded game':'Expand game';touchSettings.hidden=!gamepad.visible&&!expanded;}
document.addEventListener('fullscreenchange',updateFullscreen);

function setBindingStatus(text,error=false){$('bindingStatus').textContent=text;$('bindingStatus').classList.toggle('binding-error',error);}
function updateHints(){
  const hint=(id,actions,text)=>{const el=$(id);el.replaceChildren();for(const action of actions){const code=profile.first(action);if(code){const k=document.createElement('kbd');k.textContent=keyLabel(code);el.append(k);}}el.append(document.createTextNode(text));};
  hint('moveHint',['left','right'],' Move');hint('jumpHint',['jump'],' Jump');hint('weaponHint',['weapon'],' Switch weapon');
  $('pauseButton').title=`Pause${profile.first('pause')?` (${keyLabel(profile.first('pause'))})`:''}`;
  $('saveButton').title='Save, load, import, or export a full world';
  if(started&&game?.paused)$('startHint').textContent=pauseHint();
  canvas.setAttribute('aria-label',gamepad.visible?'HIMR game. Left stick moves, right stick aims and fires. Jump double jumps or revives. Use opens doors and collects crates. Tap objects to interact.':`HIMR game. Move with ${keyLabel(profile.first('left'))} and ${keyLabel(profile.first('right'))}. Jump with ${keyLabel(profile.first('jump'))}. Mouse aims and interacts.`);
  if(!started)$('startHint').textContent=gamepad.visible?'Touch controls ready · Best in landscape':'Keyboard + mouse recommended';
  updateGameplayHelp();
}
function renderBindings(){
  const root=$('bindingRows');root.replaceChildren();
  for(const [group,title] of [['game','MOVEMENT & GAMEPLAY'],['player','PLAYER & MENUS']]){
    const section=document.createElement('section');section.className='binding-group';
    const h=document.createElement('h3');h.textContent=title;section.append(h);
    for(const action of ACTIONS.filter(a=>a.group===group)){
      const row=document.createElement('div');row.className='binding-row';
      const copy=document.createElement('div');copy.className='binding-copy';
      const label=document.createElement('strong');label.textContent=action.label;copy.append(label);
      if(action.help){const help=document.createElement('small');help.textContent=action.help;help.id=`help-${action.id}`;copy.append(help);}
      const options=document.createElement('div');options.className='binding-options';
      if(action.mouse){const fixed=document.createElement('span');fixed.className='mouse-binding';fixed.textContent=action.mouse;options.append(fixed);}
      const slots=Math.max(2,action.defaults.length,profile.bindings[action.id].length);
      for(let slot=0;slot<slots;slot++){
        const part=document.createElement('span');part.className='binding-slot';
        const button=document.createElement('button');button.type='button';button.className='binding-key';button.dataset.action=action.id;button.dataset.slot=slot;
        button.setAttribute('aria-label',`Rebind ${action.label}, ${slot===0?'primary':`alternative ${slot}`}`);
        if(action.help)button.setAttribute('aria-describedby',`help-${action.id}`);
        const listening=capture?.id===action.id&&capture.slot===slot;button.classList.toggle('listening',listening);
        button.textContent=listening?'Press a key…':profile.bindings[action.id][slot]?keyLabel(profile.bindings[action.id][slot]):'Add key';
        button.setAttribute('aria-label',button.getAttribute('aria-label')+`: ${listening?'listening for a new key':profile.bindings[action.id][slot]?keyLabel(profile.bindings[action.id][slot]):'unbound'}`);
        button.onclick=()=>{clearInput();capture={id:action.id,slot};$('cancelBinding').hidden=false;setBindingStatus(`Press a key for ${action.label}. Escape cancels.`);renderBindings();root.querySelector(`[data-action="${action.id}"][data-slot="${slot}"]`).focus();};
        part.append(button);
        if(profile.bindings[action.id][slot]){
          const clear=document.createElement('button');clear.type='button';clear.className='clear-binding';clear.textContent='×';clear.title='Clear binding';clear.setAttribute('aria-label',`Clear ${action.label}, ${slot===0?'primary':`alternative ${slot}`}`);
          clear.onclick=()=>{capture=null;clearInput();profile.bind(action.id,slot,'');$('cancelBinding').hidden=true;renderBindings();updateHints();setBindingStatus(`${action.label} binding cleared.${profile.saved?'':' Preferences could not be saved; they work for this session.'}`);};part.append(clear);
        }
        options.append(part);
      }
      row.append(copy,options);section.append(row);
    }
    root.append(section);
  }
}
function cancelCapture(){capture=null;$('cancelBinding').hidden=true;renderBindings();setBindingStatus('Assignment cancelled. Preferences save in this browser.');}
$('cancelBinding').onclick=cancelCapture;
$('resetBindings').onclick=()=>{capture=null;clearInput();profile.reset();$('cancelBinding').hidden=true;renderBindings();updateHints();setBindingStatus(`Default key bindings restored.${profile.saved?'':' Preferences could not be saved; they work for this session.'}`);};
$('controlsButton').onclick=()=>{wasPaused=game?.paused??true;if(started)paused(true);capture=null;renderBindings();setBindingStatus('Preferences save in this browser. Escape cancels a key assignment.');dialog.showModal();};
touchSettings.onclick=()=>$('controlsButton').click();
dialog.addEventListener('close',()=>{capture=null;$('cancelBinding').hidden=true;clearInput();if(started&&!wasPaused)paused(false);});
dialog.addEventListener('cancel',e=>{if(capture){e.preventDefault();cancelCapture();}});

function handleCommands(commands){for(const command of commands){if(command==='pause')paused(!game.paused);if(command==='menu')openMenu();if(command==='worldSaves')menus.openWorld();if(command==='cheats')menus.openCheats();}}
document.addEventListener('keydown',e=>{
  if(stage.classList.contains('expanded')&&e.code==='Escape'&&!dialog.open&&!menus.isOpen()){e.preventDefault();stage.classList.remove('expanded');document.body.classList.remove('player-expanded');updateFullscreen();if(started)paused(true);return;}
  if(menus.isOpen())return;
  if(dialog.open){
    if(!capture)return;
    if(e.code==='Escape'){e.preventDefault();e.stopPropagation();cancelCapture();return;}
    if(e.code==='Tab')return;
    e.preventDefault();e.stopPropagation();if(e.repeat)return;
    if(e.metaKey||((e.ctrlKey||e.altKey)&&!/^Control|^Alt/.test(e.code))){setBindingStatus('Choose a single key. Key combinations and Command are reserved for browser shortcuts.',true);return;}
    const action=ACTIONS.find(a=>a.id===capture.id),result=profile.bind(capture.id,capture.slot,e.code);
    if(!result.ok){setBindingStatus(result.message,true);return;}
    clearInput();capture=null;$('cancelBinding').hidden=true;renderBindings();updateHints();
    setBindingStatus(`${action.label} set to ${keyLabel(e.code)}.${profile.saved?' Saved in this browser.':' Preferences could not be saved; they work for this session.'}`);return;
  }
  if(e.target.closest?.('.virtual-gamepad button')&&['Enter','Space'].includes(e.code))return;
  if(!game?.room||e.metaKey||((e.ctrlKey||e.altKey)&&!/^Control|^Alt/.test(e.code)))return;
  if(!started){if(e.code==='Enter'||e.code==='Space'||profile.matches(e.code,'game').some(a=>a.id==='jump')){e.preventDefault();start();}return;}
  const commandActions=profile.matches(e.code,gameContext(game)).filter(a=>a.command);
  if(commandActions.length){e.preventDefault();if(!e.repeat)handleCommands(router.down(e.code).commands);return;}
  if(game.paused)return;
  const result=router.down(e.code);if(result.handled)e.preventDefault();
});
document.addEventListener('keyup',e=>router.up(e.code));
canvas.addEventListener('pointermove',e=>{if(!game)return;gamepad.canvasAim();const point=canvasPoint(canvas.getBoundingClientRect(),canvas.width,canvas.height,e.clientX,e.clientY);game.input.mx=point.mx;game.input.my=point.my;canvas.style.cursor=point.inside&&game.faceEgg.moonHit(point.mx,point.my)?'pointer':'';});
const mouseNumber=e=>e.button===2?2:e.button===1?3:1;
canvas.addEventListener('pointerdown',async e=>{
  if(!game||game.paused||!started)return;const point=canvasPoint(canvas.getBoundingClientRect(),canvas.width,canvas.height,e.clientX,e.clientY);if(!point.inside)return;gamepad.canvasAim();focusGame();canvas.setPointerCapture(e.pointerId);
  game.input.mx=point.mx;game.input.my=point.my;
  const secret=e.button===0?game.faceEgg.menuClick(point.mx,point.my):{handled:false};
  if(secret.handled){e.preventDefault();clearInput();if(secret.triggered){try{toast('A familiar face is arriving…');const enabled=await game.faceEgg.toggle();if(enabled!==null)toast(enabled?'A familiar face.':'The original face returns.');}catch(error){toast(error.message);}}return;}
  router.mouse(mouseNumber(e),`pointer:${e.pointerId}:${e.button}`);e.preventDefault();
});
canvas.addEventListener('pointerup',e=>router.up(`pointer:${e.pointerId}:${e.button}`));
canvas.addEventListener('pointercancel',()=>clearInput());canvas.addEventListener('lostpointercapture',e=>{for(const source of [...router.sources.keys()])if(source.startsWith(`pointer:${e.pointerId}:`))router.up(source);});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('blur',()=>{if(started&&!game.paused)paused(true);clearInput();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&started&&!game.paused)paused(true);});
async function init(){
  try{
    const response=await fetch('data.json');if(!response.ok)throw new Error('Game data could not load');
    game=new Engine(await response.json(),canvas);game.audioEnabled=false;await game.renderer.load();game.loadRoom(game.assets.room26,false);
    for(let i=0;i<2;i++)game.step();game.paused=true;
    game.onRoomChange=name=>{clearInput();$('location').textContent=roomNames[name]||'Exploring';};
    game.onStatsSave=persisted=>toast(persisted?'Original statistics saved':'Statistics saved for this session; browser storage is unavailable');game.onExit=()=>paused(true);
    $('playButton').disabled=false;$('playLabel').textContent='Play the game';$('continueButton').hidden=true;
    window.himr=game;requestAnimationFrame(frame);await menus.initialize(game);
  }catch(error){console.error(error);$('panelTitle').textContent='The adventure is loading.';$('panelDescription').textContent='Reload the page to try again.';$('playLabel').textContent='Unable to load';}
}
renderBindings();updateHints();init();
