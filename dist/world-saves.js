import {encodeWorld,validateWorld,worldMetadata} from './world-state.js';

function slotId(slot){if(!Number.isInteger(slot)||slot<1||slot>3)throw new Error('Choose a world slot from 1 to 3.');return slot;}

export class BrowserWorldStorage {
 constructor(indexedDB){
  this.ready=new Promise((resolve,reject)=>{
   if(!indexedDB){reject(new Error('World storage is unavailable. Export your world to keep a file.'));return;}
   let request;
   try{request=indexedDB.open('himr-world-saves',1);}catch{reject(new Error('World storage is unavailable. Export your world to keep a file.'));return;}
   request.onupgradeneeded=()=>{const db=request.result;db.createObjectStore('worlds');db.createObjectStore('metadata');};
   request.onsuccess=()=>{this.db=request.result;this.db.onversionchange=()=>this.db.close();resolve(this.db);};
   request.onerror=()=>reject(new Error('Could not open world storage. Export your world to keep a file.'));
   request.onblocked=()=>reject(new Error('Another game tab is blocking world storage. Close it and try again.'));
  });
 }
 async transaction(stores,mode,action){
  const db=await this.ready;
  return new Promise((resolve,reject)=>{
   let tx,result;
   try{tx=db.transaction(stores,mode);result=action(tx);}catch(error){reject(error);return;}
   tx.oncomplete=()=>resolve(typeof result==='function'?result():result);
   tx.onabort=tx.onerror=()=>reject(new Error('The world was not saved. Browser storage may be full; export your world to keep a file.'));
  });
 }
 list(){return this.transaction(['metadata'],'readonly',tx=>{const request=tx.objectStore('metadata').getAll();return ()=>request.result;});}
 read(slot){return this.transaction(['worlds'],'readonly',tx=>{const request=tx.objectStore('worlds').get(slot);return ()=>request.result??null;});}
 write(slot,text,metadata){return this.transaction(['worlds','metadata'],'readwrite',tx=>{tx.objectStore('worlds').put(text,slot);tx.objectStore('metadata').put(metadata,slot);});}
}

export class MemoryWorldStorage {
 constructor(){this.worlds=new Map();this.metadata=new Map();this.failWrites=false;}
 async list(){return [...this.metadata.values()].map(m=>({...m}));}
 async read(slot){return this.worlds.get(slot)??null;}
 async write(slot,text,metadata){if(this.failWrites)throw new Error('Storage is full.');this.worlds.set(slot,text);this.metadata.set(slot,{...metadata});}
}

export class WorldSaveRepository {
 constructor(data,storage){this.data=data;this.storage=storage;}
 async list(){return (await this.storage.list()).filter(m=>Number.isInteger(m.slot)&&m.slot>=1&&m.slot<=3).sort((a,b)=>a.slot-b.slot);}
 async save(slot,name,snapshot){
  slotId(slot);const {world,text}=encodeWorld(snapshot,this.data),metadata=worldMetadata(slot,name,world,text);
  await this.storage.write(slot,text,metadata);return metadata;
 }
 async load(slot){slotId(slot);const text=await this.storage.read(slot);if(!text)throw new Error('This world slot is empty.');return validateWorld(text,this.data);}
 async export(slot){slotId(slot);const text=await this.storage.read(slot);if(!text)throw new Error('This world slot is empty.');validateWorld(text,this.data);return text;}
 async import(slot,name,text){slotId(slot);const world=validateWorld(text,this.data);world.savedAt=Date.now();return this.save(slot,name,world);}
 async latest(){const saved=await this.list();if(!saved.length)return null;return saved.reduce((a,b)=>a.savedAt>b.savedAt?a:b);}
 async migrateLegacy(game){
  if((await this.list()).length)return false;
  const text=game.readFile('checkpoint');if(!text)return false;
  await this.save(1,'Previous adventure',game.convertLegacyCheckpoint(text));return true;
 }
}
