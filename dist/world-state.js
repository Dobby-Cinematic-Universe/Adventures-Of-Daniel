export const WORLD_FORMAT='himr-world';
export const WORLD_VERSION=3;
export const MAX_WORLD_BYTES=8*1024*1024;
export const DEFAULT_CHEATS=Object.freeze({invincible:false,infiniteAmmo:false,infiniteSlowmo:false});
export const ROOM_VARIABLES=Object.freeze(['customer1spd','customer2spd','customer3spd','customer1done','customer2done','customer3done','petrolpaid','petrolweapon','respawnweapon','hascontrol','gosleep','clickedbed','greentimer','killsgreen','killsred','killsthisroom','dontshoot','stocksdown']);
const numericGlobals=['kills','stocks','slowmo','greentimer','killsgreen','killsred','killsthisroom','customer1spd','customer2spd','customer3spd','equippedweapon','respawnweapon','petrolweapon'];
const flagGlobals=['hascontrol','gosleep','clickedbed','dontshoot','stocksdown','customer1done','customer2done','customer3done','petrolpaid','weapon1','weapon2','takenallowance','hasquest1','hasquest2','hasquest3','quest1','quest2','quest3','acceptedquest','hasslept','newmail','pcclickedon','messageread'];
const forbidden=new Set(['__proto__','prototype','constructor']);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);

export function cloneState(value,budget={nodes:0},depth=0){
 if(++budget.nodes>400000||depth>24)throw new Error('This world contains too much nested data.');
 if(value===null||typeof value==='boolean')return value;
 if(typeof value==='number'){if(!Number.isFinite(value))throw new Error('The world contains an invalid number.');return value;}
 if(typeof value==='string'){if(value.length>65536)throw new Error('A saved text value is too large.');return value;}
 if(Array.isArray(value)){if(value.length>20000)throw new Error('A saved list is too large.');return value.map(v=>cloneState(v,budget,depth+1));}
 if(!value||typeof value!=='object')throw new Error('The world contains an unsupported value.');
 const result={};
 for(const key of Object.keys(value)){
  if(forbidden.has(key))throw new Error('The save contains an invalid property.');
  if(value[key]===undefined)continue;
  result[key]=cloneState(value[key],budget,depth+1);
 }
 return result;
}
function number(v,label,min=-Infinity,max=Infinity){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw new Error(`Invalid ${label} in the world save.`);return v;}
function integer(v,label,min,max){number(v,label,min,max);if(!Number.isInteger(v))throw new Error(`Invalid ${label} in the world save.`);return v;}
function record(v,label){if(!v||typeof v!=='object'||Array.isArray(v))throw new Error(`Invalid ${label} in the world save.`);return v;}
function globals(values){
 for(const key of numericGlobals)if(own(values,key))number(values[key],key);
 for(const key of flagGlobals)if(own(values,key)&&typeof values[key]!=='boolean')number(values[key],key);
}

export function validateWorld(source,data){
 if(typeof source==='string'){
  if(source.length>MAX_WORLD_BYTES)throw new Error('This save is larger than 8 MB.');
  try{source=JSON.parse(source);}catch{throw new Error('This file is not a valid JSON world save.');}
 }
 record(source,'world');
 if(source.format!==WORLD_FORMAT||source.version!==WORLD_VERSION||source.game!=='himr-1.6')throw new Error('This is not a supported HIMR world save.');
 const world=cloneState(source);
 record(world.global,'statistics');record(world.rooms,'rooms');record(world.cheats,'cheats');
 globals(world.global);
 integer(world.randomState,'random state',1,4294967295);integer(world.nextId,'next instance ID',200000,2147483647);
 number(world.timeMs,'play time',0,1e12);number(world.savedAt,'save time',0,1e15);
 if(Object.keys(world.cheats).length!==Object.keys(DEFAULT_CHEATS).length)throw new Error('Invalid cheat settings in the world save.');
 for(const key of Object.keys(DEFAULT_CHEATS))if(typeof world.cheats[key]!=='boolean')throw new Error('Invalid cheat settings in the world save.');
 if(own(world.global,'php'))integer(world.global.php,'health',0,8);
 for(const key of ['ammo','bullets','tapes'])if(own(world.global,key))integer(world.global[key],key,0,1e12);
 const roomNames=new Map(data.rooms.map((r,i)=>[r.info.Name,i]));
 if(!roomNames.has(world.active)||!own(world.rooms,world.active))throw new Error('The saved active room is missing.');
 if(Object.keys(world.rooms).length>data.rooms.length)throw new Error('The save contains too many rooms.');
 const allIds=new Set();let total=0;
 for(const [name,state] of Object.entries(world.rooms)){
  if(!roomNames.has(name))throw new Error('The save contains an unknown room.');
  record(state,'room');if(state.room!==name)throw new Error('The saved room names do not match.');
  integer(state.frame,'room frame',0,1e10);number(state.fps,'frame rate',1,240);
  const camera=record(state.camera,'camera'),gui=record(state.gui,'interface size');
  for(const key of ['x','y'])number(camera[key],'camera position',-1e7,1e7);
  for(const key of ['w','h']){number(camera[key],'camera size',1,32768);number(gui[key],'interface size',1,32768);}
  record(state.locals,'room variables');
  if(Object.keys(state.locals).some(key=>!ROOM_VARIABLES.includes(key)))throw new Error('The save contains an invalid room variable.');
  globals(state.locals);
  if(!Array.isArray(state.instances)||state.instances.length>10000||(total+=state.instances.length)>20000)throw new Error('The save contains too many objects.');
  const scene=data.rooms[roomNames.get(name)];
  if(!Array.isArray(state.layers)||state.layers.length!==scene.layers.length)throw new Error('The saved room layers are incomplete.');
  const layerIds=new Set(scene.layers.map(l=>l.info.LayerId)),seenLayers=new Set();
  for(const layer of state.layers){
   record(layer,'layer');if(!layerIds.has(layer.LayerId)||seenLayers.has(layer.LayerId))throw new Error('The save contains an invalid layer.');seenLayers.add(layer.LayerId);
   const original=scene.layers.find(l=>l.info.LayerId===layer.LayerId).info;if(layer.LayerName!==original.LayerName||layer.LayerType!==original.LayerType)throw new Error('The saved layer definitions do not match this room.');
   for(const key of ['XOffset','YOffset','HSpeed','VSpeed','LayerDepth'])if(own(layer,key))number(layer[key],'layer value',-1e7,1e7);
   if(typeof layer.IsVisible!=='boolean')throw new Error('Invalid layer visibility in the world save.');
  }
  for(const s of state.instances){
   record(s,'object');integer(s.id,'instance ID',100000,2147483646);
   if(allIds.has(s.id))throw new Error('The world contains duplicate instance IDs.');allIds.add(s.id);
   integer(s.object_index,'object type',0,data.objects.length-1);
   for(const key of ['x','y','xstart','ystart','xprevious','yprevious'])number(s[key],'object position',-1e7,1e7);
   for(const key of ['image_xscale','image_yscale'])number(s[key],'object scale',-10000,10000);
   integer(s.sprite_index,'sprite',-1,data.sprites.length-1);integer(s.mask_index,'collision mask',-1,data.sprites.length-1);
   const mask=data.sprites[s.mask_index>=0?s.mask_index:s.sprite_index];if(mask&&[1,2].includes(mask.info.SepMasks)&&(Math.abs(s.image_xscale)>8||Math.abs(s.image_yscale)>8))throw new Error('A precise collision mask is too large.');
   for(const key of ['image_index','image_speed','image_angle','image_alpha','hspeed','vspeed','gravity','gravity_direction','friction','speed','direction','depth'])number(s[key],'object value',-1e7,1e7);
   for(const key of ['hsp','vsp','spd','hp'])if(own(s,key))number(s[key],'object '+key,-1e7,1e7);
   integer(s.image_blend,'object colour',0,0xffffff);integer(s.layer,'object layer',-1,2147483647);
   if(s.dead||s.destroying)throw new Error('A world save cannot contain destroyed objects.');
   if(typeof s.visible!=='boolean'||typeof s.persistent!=='boolean')throw new Error('Invalid object visibility in the world save.');
   if(!Array.isArray(s.alarm)||s.alarm.length!==12)throw new Error('The saved alarms are incomplete.');
   for(const alarm of s.alarm)integer(alarm,'alarm',-1,1e9);
   if(name!==world.active&&s.persistent)throw new Error('Persistent objects belong in the active room.');
   if(s.id>=world.nextId&&s.id>=200000)throw new Error('The next instance ID would overwrite a saved object.');
  }
 }
 return world;
}
export function encodeWorld(world,data){
 const checked=validateWorld(world,data),text=JSON.stringify(checked);
 if(new TextEncoder().encode(text).byteLength>MAX_WORLD_BYTES)throw new Error('This world is larger than 8 MB.');
 return {world:checked,text};
}
export function worldMetadata(slot,name,world,text){
 return {slot,name:String(name||`World ${slot}`).trim().slice(0,50)||`World ${slot}`,savedAt:world.savedAt,room:world.active,rooms:Object.keys(world.rooms).length,timeMs:world.timeMs,cheats:Object.values(world.cheats).some(Boolean),bytes:new TextEncoder().encode(text).byteLength};
}
