import {Engine} from './engine.js';
import {ACTIONS,BindingProfile,InputRouter,gameContext,keyLabel} from './bindings.js';

const $=id=>document.getElementById(id);
const canvas=$('game'),overlay=$('overlay'),dialog=$('controlsDialog');
let game,started=false,toastTimer,wasPaused=false,last=0,accumulator=0,capture=null,lastHelpTime=0;
let storage=null;try{storage=localStorage;}catch{}
const profile=new BindingProfile(storage);
const router=new InputRouter(profile,()=>game?.input,()=>gameContext(game));
const roomNames={room26:'Home',rMenu:'Original menu',introroom2:'The story begins',introroom:'A new day',room1:'Into the world',room3:'The adventure continues',rEnding:'The end',petrolstationroom:'Petrol station'};

function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2200);}
function clearInput(){router.clear();for(const b of document.querySelectorAll('.touch-controls button'))b.classList.remove('active');}
function pauseHint(){const key=profile.first('pause');return key?`Press ${keyLabel(key)} to resume`:'Use Resume to continue';}
function paused(value){
  if(!started)return;game.paused=value;clearInput();overlay.hidden=!value;
  $('panelKicker').textContent='TAKE A BREATHER';$('panelTitle').textContent='Adventure can wait.';
  $('panelDescription').textContent='Your world is right where you left it.';$('playLabel').textContent='Resume game';
  $('continueButton').hidden=true;$('startHint').textContent=pauseHint();$('pauseLabel').textContent=value?'Resume':'Pause';
  $('playerStatus').textContent=value?'PAUSED':'PLAYING';$('statusDot').classList.toggle('paused',value);
  if(value)game.audioStop();else{resumeAmbience();canvas.focus();}last=0;accumulator=0;
}
function resumeAmbience(){if(game.audioEnabled&&['room26','petrolstationroom'].includes(game.room.info.Name))game.audioPlay(game.assets.nightsounds,true);}
function start(restore=false){
  if(started){paused(false);return;}started=true;game.paused=false;
  game.audioEnabled=!$('soundButton').classList.contains('muted');
  if(restore&&!game.restoreCheckpoint())toast('No saved adventure yet.');
  overlay.hidden=true;for(const id of ['pauseButton','saveButton','menuButton'])$(id).disabled=false;
  $('playerStatus').textContent='PLAYING';resumeAmbience();canvas.focus();last=0;
}
function openMenu(){game.saveCheckpoint();game.fps=60;clearInput();game.loadRoom(game.assets.rMenu);paused(false);canvas.focus();}
function frame(time){
  requestAnimationFrame(frame);if(!game)return;if(!last)last=time;
  const dt=Math.min(100,time-last);last=time;
  if(started&&!game.paused){accumulator+=dt;const step=1000/game.fps;let n=0;while(accumulator>=step&&n++<5){game.step();accumulator-=step;}}
  else accumulator=0;game.renderer.draw();if(time-lastHelpTime>200){updateGameplayHelp();lastHelpTime=time;}
}
function updateGameplayHelp(){
  if(!game)return;
  const dead=game.resolve(game.assets.oPDead)[0],gun=game.resolve(game.assets.oGun)[0],launcher=game.resolve(game.assets.oGun59)[0],p=game.resolve(game.assets.Object1)[0],girl=game.resolve(game.assets.oGirl16364)[0],bed=game.resolve(game.assets.oBedSleep)[0];
  const key=id=>profile.first(id)?keyLabel(profile.first(id)):null;
  const revive=key('jump')?`press ${key('jump')} or click Revive`:'click Revive';
  let text='Walk up to people and objects, then click them. '+(key('interact')?`${key('interact')} opens doors and collects crates.`:'Use Controls to choose an interaction key.');
  $('reviveButton').hidden=!(dead&&dead.done===1&&dead.vsp===0);
  const touchJump=document.querySelector('[data-action="jump"]');touchJump.textContent=dead?'Revive':'Jump';
  if(dead)text=dead.done===1&&dead.vsp===0?`Defeated — ${revive} to return.`:`Wait for Daniel to land, then ${revive}.`;
  else if(gameContext(game)==='story')text=key('weapon')?`Press ${key('weapon')} to continue the story.`:'Set a story key in Controls to continue.';
  else if(gameContext(game)==='menu')text=`Choose with ${key('menuUp')||'a menu key'} / ${key('menuDown')||'a menu key'}, then ${key('confirm')||'your confirm key'}.`;
  else if(gameContext(game)==='ending')text='Press any key to advance the ending text.';
  else if(game.global.clickedbed)text='Sleeping — wait for the fade to clear. Health and slow motion recover.';
  else if(!game.global.hascontrol)text=game.resolve(game.assets.oButtonOff).length?'Click an option. The power button closes the computer.':'Click an option to continue.';
  else if(p&&p.x>18000&&game.resolve(game.assets.oQuestObjectives3).length)text=game.global.quest3===1?'Shift complete — click the door on the right to go home.':`${key('interact')||'Your interaction key'} collects each crate. Serve all three customers, then use the exit door.`;
  else if(p&&girl&&Math.hypot(p.x-girl.x,p.y-girl.y)<=111)text=`Hold ${key('interact')||'your interaction key'} while moving to guide her. From her left, ${key('secondary')||'your secondary key'} kisses. Bring her onto the bed to restore hearts.`;
  else if(p&&bed&&Math.hypot(p.x-bed.x,p.y-bed.y)<=130)text='Click the bed to sleep. Bring the companion onto the bed to restore hearts.';
  else if(gun||launcher){const weapon=launcher?'Grenade launcher':'Gun',other=launcher?'gun':'grenades',unlocked=launcher?game.global.weapon1:game.global.weapon2;text=`${weapon} equipped · Left click to fire${unlocked&&key('weapon')?` · ${key('weapon')} switches to ${other}`:''}.`;}
  if($('gameHelpText').textContent!==text)$('gameHelpText').textContent=text;
}
$('reviveButton').onclick=()=>{
  if(!game||!started)return;
  if(game.paused)paused(false);
  router.action('jump','revive-button');game.step();router.up('revive-button');updateGameplayHelp();canvas.focus();
};
$('playButton').onclick=()=>start();$('continueButton').onclick=()=>start(true);
$('pauseButton').onclick=()=>paused(!game.paused);
$('saveButton').onclick=()=>{if(!game.saveCheckpoint())toast('Save when Daniel is in the world.');canvas.focus();};
$('menuButton').onclick=openMenu;
$('soundButton').onclick=()=>{
  const muted=$('soundButton').classList.toggle('muted');$('soundButton').setAttribute('aria-pressed',String(muted));
  $('soundButton').setAttribute('aria-label',muted?'Unmute sound':'Mute sound');$('soundButton').title=muted?'Unmute sound':'Mute sound';
  document.querySelector('.sound-waves').style.opacity=muted?'0.15':'1';
  if(game){game.audioEnabled=!muted;if(muted)game.audioStop();else if(started&&!game.paused)resumeAmbience();}canvas.focus();
};
$('fullscreenButton').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.game-frame').requestFullscreen();canvas.focus();}catch{toast('Fullscreen is unavailable in this browser.');}};

function setBindingStatus(text,error=false){$('bindingStatus').textContent=text;$('bindingStatus').classList.toggle('binding-error',error);}
function updateHints(){
  const hint=(id,actions,text)=>{const el=$(id);el.replaceChildren();for(const action of actions){const code=profile.first(action);if(code){const k=document.createElement('kbd');k.textContent=keyLabel(code);el.append(k);}}el.append(document.createTextNode(text));};
  hint('moveHint',['left','right'],' Move');hint('jumpHint',['jump'],' Jump');hint('weaponHint',['weapon'],' Switch weapon');
  $('pauseButton').title=`Pause${profile.first('pause')?` (${keyLabel(profile.first('pause'))})`:''}`;
  $('saveButton').title=`Save${profile.first('save')?` (${keyLabel(profile.first('save'))})`:''}`;
  if(started&&game?.paused)$('startHint').textContent=pauseHint();
  canvas.setAttribute('aria-label',`HIMR game. Move with ${keyLabel(profile.first('left'))} and ${keyLabel(profile.first('right'))}. Jump with ${keyLabel(profile.first('jump'))}. Mouse aims and interacts.`);
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
dialog.addEventListener('close',()=>{capture=null;$('cancelBinding').hidden=true;clearInput();if(started&&!wasPaused)paused(false);});
dialog.addEventListener('cancel',e=>{if(capture){e.preventDefault();cancelCapture();}});

function handleCommands(commands){for(const command of commands){if(command==='pause')paused(!game.paused);if(command==='menu')openMenu();}}
document.addEventListener('keydown',e=>{
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
  if(!game||e.metaKey||((e.ctrlKey||e.altKey)&&!/^Control|^Alt/.test(e.code)))return;
  if(!started){if(e.code==='Enter'||e.code==='Space'||profile.matches(e.code,'game').some(a=>a.id==='jump')){e.preventDefault();start();}return;}
  const commandActions=profile.matches(e.code,gameContext(game)).filter(a=>a.command);
  if(commandActions.length){e.preventDefault();if(!e.repeat)handleCommands(router.down(e.code).commands);return;}
  if(game.paused)return;
  const result=router.down(e.code);if(result.handled)e.preventDefault();
});
document.addEventListener('keyup',e=>router.up(e.code));
canvas.addEventListener('pointermove',e=>{if(!game)return;const b=canvas.getBoundingClientRect();game.input.mx=(e.clientX-b.left)/b.width;game.input.my=(e.clientY-b.top)/b.height;});
const mouseNumber=e=>e.button===2?2:e.button===1?3:1;
canvas.addEventListener('pointerdown',e=>{
  if(!game||game.paused||!started)return;canvas.focus();canvas.setPointerCapture(e.pointerId);
  const b=canvas.getBoundingClientRect();game.input.mx=(e.clientX-b.left)/b.width;game.input.my=(e.clientY-b.top)/b.height;
  router.mouse(mouseNumber(e),`pointer:${e.pointerId}:${e.button}`);e.preventDefault();
});
canvas.addEventListener('pointerup',e=>router.up(`pointer:${e.pointerId}:${e.button}`));
canvas.addEventListener('pointercancel',()=>clearInput());canvas.addEventListener('lostpointercapture',e=>{for(const source of [...router.sources.keys()])if(source.startsWith(`pointer:${e.pointerId}:`))router.up(source);});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('blur',()=>{if(started&&!game.paused)paused(true);clearInput();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&started&&!game.paused)paused(true);});
for(const button of document.querySelectorAll('.touch-controls button')){
  const source=`touch:${button.dataset.action}`;
  button.addEventListener('pointerdown',e=>{if(!game||!started||game.paused)return;button.setPointerCapture(e.pointerId);router.action(button.dataset.action,source);button.classList.add('active');e.preventDefault();});
  const release=()=>{router.up(source);button.classList.remove('active');};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
}
async function init(){
  try{
    const response=await fetch('data.json');if(!response.ok)throw new Error('Game data could not load');
    game=new Engine(await response.json(),canvas);game.audioEnabled=false;await game.renderer.load();game.loadRoom(game.assets.room26,false);
    for(let i=0;i<2;i++)game.step();game.paused=true;
    game.onRoomChange=name=>{clearInput();$('location').textContent=roomNames[name]||'Exploring';};
    game.onSave=()=>toast('Adventure saved');game.onExit=()=>paused(true);
    $('playButton').disabled=false;$('playLabel').textContent='Play the game';$('continueButton').hidden=!game.readFile('checkpoint');
    window.himr=game;requestAnimationFrame(frame);
  }catch(error){console.error(error);$('panelTitle').textContent='The adventure is loading.';$('panelDescription').textContent='Reload the page to try again.';$('playLabel').textContent='Unable to load';}
}
renderBindings();updateHints();init();
