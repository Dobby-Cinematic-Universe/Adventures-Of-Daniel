export const CONTROL_STORAGE_KEY = 'himr:controls:v1';

// Physical browser keys are translated to the original GameMaker input codes.
// The recovered scripts stay independent of the player's chosen keyboard layout.
export const ACTIONS = [
  {id:'left',label:'Move left',group:'game',keys:[65],defaults:['KeyA','ArrowLeft'],contexts:['game']},
  {id:'right',label:'Move right',group:'game',keys:[68],defaults:['KeyD','ArrowRight'],contexts:['game']},
  {id:'jump',label:'Jump / revive',group:'game',keys:[32],defaults:['Space','KeyW','ArrowUp'],contexts:['game'],help:'Press again for a double jump. Revive after landing when defeated.'},
  {id:'interact',label:'Open / interact',group:'game',keys:[69],defaults:['KeyE'],contexts:['game'],help:'Open doors and collect crates. Hold while moving to guide the companion; bring her onto the bed to restore hearts.'},
  {id:'secondary',label:'Close door / kiss',group:'game',keys:[81],defaults:['KeyQ'],contexts:['game'],help:'Close a nearby door; kiss the companion when standing to her left.'},
  {id:'weapon',label:'Grenades / story',group:'game',keys:[70],defaults:['KeyF'],contexts:['game','story'],help:'Original F selects and fires grenades; hold to keep firing. Primary fire returns to the acquired gun. Also continues story screens.'},
  {id:'fire',label:'Fire / click',group:'game',buttons:[1],defaults:[],contexts:['game'],mouse:'Left click',help:'Fire the equipped weapon or click an object. Optional keyboard shortcut.'},
  {id:'slowmo',label:'Slow motion',group:'game',buttons:[2],defaults:[],contexts:['game'],mouse:'Right click',help:'Hold while slow-motion energy remains. Optional keyboard shortcut.'},
  {id:'heal',label:'Restore hearts',group:'game',keys:[16],defaults:['ShiftLeft','ShiftRight'],contexts:['game'],help:'Original shortcut: restores hearts, up to eight.'},
  {id:'reset',label:'Reset money & inventory',group:'game',keys:[82],defaults:['KeyR'],contexts:['game'],help:'Clears money, ammunition, grenades, tapes, stocks, and the allowance flag.'},
  {id:'save',label:'Save statistics',group:'player',keys:[83],defaults:['KeyS'],contexts:['game'],help:'Original money, health, and inventory statistics. World saves keep the full adventure separately.'},
  {id:'load',label:'Load saved statistics',group:'player',keys:[76],defaults:['KeyL'],contexts:['game'],help:'Reload original saved statistics. World saves restores the full adventure.'},
  {id:'pause',label:'Pause / resume',group:'player',command:'pause',defaults:['Escape'],contexts:['all']},
  {id:'menu',label:'Original menu',group:'player',command:'menu',defaults:[],contexts:['game','story','ending'],help:'Return to the original title menu. Optional keyboard shortcut.'},
  {id:'worldSaves',label:'World saves',group:'player',command:'worldSaves',defaults:[],contexts:['all'],help:'Open the independent full-world save slots. Optional keyboard shortcut.'},
  {id:'cheats',label:'Cheat menu',group:'player',command:'cheats',defaults:[],contexts:['all'],help:'Open health, inventory, weapon, and invulnerability options. Optional keyboard shortcut.'},
  {id:'menuUp',label:'Menu up',group:'player',keys:[38],defaults:['ArrowUp'],contexts:['menu']},
  {id:'menuDown',label:'Menu down',group:'player',keys:[40],defaults:['ArrowDown'],contexts:['menu']},
  {id:'confirm',label:'Confirm menu selection',group:'player',keys:[13],defaults:['Enter'],contexts:['menu']},
];
const definitions=new Map(ACTIONS.map(a=>[a.id,a]));
const overlaps=(a,b)=>a.includes('all')||b.includes('all')||a.some(c=>b.includes(c));
const active=(a,context)=>a.contexts.includes('all')||a.contexts.includes(context);

export function isBindable(code){
  return typeof code==='string' && /^(Key[A-Z]|Digit[0-9]|Arrow(Left|Right|Up|Down)|Space|Enter|Escape|Shift(Left|Right)|Control(Left|Right)|Alt(Left|Right)|Backspace|Delete|Insert|Home|End|Page(Up|Down)|CapsLock|Bracket(Left|Right)|Backslash|Semicolon|Quote|Backquote|Minus|Equal|Comma|Period|Slash|Numpad([0-9]|Enter|Add|Subtract|Multiply|Divide|Decimal)|F([1-4]|[6-9]|10))$/.test(code);
}

export function keyLabel(code){
  const labels={Space:'SPACE',Escape:'ESC',Enter:'ENTER',ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓',ShiftLeft:'L SHIFT',ShiftRight:'R SHIFT',ControlLeft:'L CTRL',ControlRight:'R CTRL',AltLeft:'L ALT',AltRight:'R ALT',Backquote:'`',BracketLeft:'[',BracketRight:']',Backslash:'\\',Semicolon:';',Quote:"'",Minus:'−',Equal:'=',Comma:',',Period:'.',Slash:'/',PageUp:'PAGE UP',PageDown:'PAGE DOWN',CapsLock:'CAPS'};
  return labels[code]||code?.replace(/^Key|^Digit/,'').replace(/^Numpad/,'NUM ')||'Unbound';
}

export function gameContext(game){
  const room=game?.room?.info.Name;
  if(room==='rMenu')return 'menu';
  if(room==='rEnding')return 'ending';
  if(room==='introroom'||room==='introroom2')return 'story';
  return 'game';
}
export function canvasPoint(rect,width,height,x,y){
 const scale=Math.min(rect.width/width,rect.height/height),w=width*scale,h=height*scale,left=rect.left+(rect.width-w)/2,top=rect.top+(rect.height-h)/2;
 return {mx:Math.max(0,Math.min(1,(x-left)/w)),my:Math.max(0,Math.min(1,(y-top)/h)),inside:x>=left&&x<=left+w&&y>=top&&y<=top+h};
}

export class BindingProfile {
  constructor(storage=null){
    this.storage=storage;this.saved=true;
    this.bindings=Object.fromEntries(ACTIONS.map(a=>[a.id,[...a.defaults]]));
    try {
      const data=JSON.parse(storage?.getItem(CONTROL_STORAGE_KEY)||'null');
      if(data?.version===1 && data.bindings && typeof data.bindings==='object'){
        for(const a of ACTIONS)if(Array.isArray(data.bindings[a.id]))this.bindings[a.id]=data.bindings[a.id].slice(0,3).map(k=>isBindable(k)?k:'');
        // Malformed external preferences cannot make one key trigger two actions.
        const claimed=[];
        for(const a of ACTIONS)this.bindings[a.id]=this.bindings[a.id].map(code=>{
          if(!code)return '';
          if(claimed.some(b=>b.code===code&&overlaps(a.contexts,b.contexts)))return '';
          claimed.push({code,contexts:a.contexts});return code;
        });
      }
    }catch{this.saved=false;}
  }
  matches(code,context){return ACTIONS.filter(a=>active(a,context)&&this.bindings[a.id].includes(code));}
  first(id){return this.bindings[id]?.find(Boolean)||null;}
  bind(id,slot,code){
    const a=definitions.get(id);
    if(!a||!Number.isInteger(slot)||slot<0||slot>2)return {ok:false,message:'Unknown control.'};
    if(code && !isBindable(code))return {ok:false,message:'Tab and browser/system shortcuts stay available for navigation.'};
    if(code){
      const conflict=ACTIONS.find(b=>overlaps(a.contexts,b.contexts)&&this.bindings[b.id].some((k,i)=>k===code&&(b.id!==id||i!==slot)));
      if(conflict)return {ok:false,message:`${keyLabel(code)} is already assigned to ${conflict.label}. Clear that binding or choose another key.`};
    }
    this.bindings[id][slot]=code||'';this.persist();return {ok:true};
  }
  reset(){this.bindings=Object.fromEntries(ACTIONS.map(a=>[a.id,[...a.defaults]]));this.persist();}
  persist(){try{this.storage?.setItem(CONTROL_STORAGE_KEY,JSON.stringify({version:1,bindings:this.bindings}));this.saved=!!this.storage;}catch{this.saved=false;}}
}

export class InputRouter {
  constructor(profile,getInput,getContext){Object.assign(this,{profile,getInput,getContext});this.sources=new Map();this.keyOwners=new Map();this.buttonOwners=new Map();}
  apply(source,keys=[],buttons=[],commands=[]){
    if(this.sources.has(source))return {handled:true,commands:[]};
    const input=this.getInput();if(!input)return {handled:false,commands:[]};
    this.sources.set(source,{keys,buttons});
    for(const [values,owners,held,pressed] of [[keys,this.keyOwners,input.keys,input.pressed],[buttons,this.buttonOwners,input.buttons,input.bpressed]])for(const v of new Set(values)){
      let set=owners.get(v);if(!set){set=new Set();owners.set(v,set);}
      if(!set.size){held.add(v);pressed.add(v);}set.add(source);
    }
    return {handled:true,commands};
  }
  down(code,source=code){
    if(this.sources.has(source))return {handled:true,commands:[]};
    const context=this.getContext(),actions=this.profile.matches(code,context);
    if(!actions.length)return context==='ending'&&isBindable(code)?this.apply(source,[65535]):{handled:false,commands:[]};
    return this.apply(source,actions.flatMap(a=>a.keys||[]),actions.flatMap(a=>a.buttons||[]),actions.flatMap(a=>a.command?[a.command]:[]));
  }
  action(id,source){const a=definitions.get(id);return a&&active(a,this.getContext())?this.apply(source,a.keys||[],a.buttons||[],a.command?[a.command]:[]):{handled:false,commands:[]};}
  mouse(button,source){return this.apply(source,[],[button]);}
  up(source){
    const state=this.sources.get(source);if(!state)return;
    const input=this.getInput();this.sources.delete(source);
    for(const [values,owners,held,released] of [[state.keys,this.keyOwners,input?.keys,input?.released],[state.buttons,this.buttonOwners,input?.buttons,input?.breleased]])for(const v of new Set(values)){
      const set=owners.get(v);set?.delete(source);if(!set?.size){owners.delete(v);held?.delete(v);released?.add(v);}
    }
  }
  clear(){for(const source of [...this.sources.keys()])this.up(source);const i=this.getInput();if(i){i.keys.clear();i.buttons.clear();i.pressed.clear();i.released.clear();i.bpressed.clear();i.breleased.clear();}}
}
