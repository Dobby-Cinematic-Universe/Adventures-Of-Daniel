// Alarm activity is derived from the ordinary saved arrays. The index itself is never serialized.
const indexedAlarms=Symbol('indexed alarms');
export class AlarmIndex {
 constructor(){this.arrays=new WeakMap();}
 register(instance,ownedArray=false){return this.state(instance,ownedArray);}
 update(array,key){
  if(key==='length'){array.mask=0;for(let i=0;i<12;i++)if(array.target[i]>0)array.mask|=1<<i;}
  else {const i=typeof key==='string'?Number(key):-1;if(!Number.isInteger(i)||i<0||i>=12||String(i)!==key)return;const bit=1<<i;if(array.target[i]>0)array.mask|=bit;else array.mask&=~bit;}
 }
 state(instance,ownedArray=false){
  const value=instance.alarm;
  const cached=instance[indexedAlarms];if(cached&&value===cached.proxy){if(cached.aliasable)this.update(cached,'length');return cached;}
  if(Array.isArray(value)){
   let array=this.arrays.get(value);
   if(!array){
    array={target:value,mask:0,proxy:null,aliasable:!ownedArray};for(let i=0;i<12;i++)if(value[i]>0)array.mask|=1<<i;
    array.proxy=new Proxy(value,{
     set:(target,key,value)=>{const result=Reflect.set(target,key,value);if(result)this.update(array,key);return result;},
     deleteProperty:(target,key)=>{const result=Reflect.deleteProperty(target,key);if(result)this.update(array,key);return result;},
     defineProperty:(target,key,descriptor)=>{const result=Reflect.defineProperty(target,key,descriptor);if(result)this.update(array,key);return result;}
    });
    this.arrays.set(value,array);this.arrays.set(array.proxy,array);
   }
   // Supplied/replaced arrays may still have raw aliases. Recheck those after every event;
   // only freshly allocated runtime arrays and cloned snapshots are known to be owned.
   if(value!==array.proxy&&!ownedArray)array.aliasable=true;
   // Whole-array replacements remain ordinary writable instance properties, including during an event.
   if(value!==array.proxy){this.update(array,'length');instance.alarm=array.proxy;}
   if(Object.prototype.hasOwnProperty.call(instance,indexedAlarms))instance[indexedAlarms]=array;
   else Object.defineProperty(instance,indexedAlarms,{value:array,writable:true});
   return array;
  }
  return null;
 }
 step(before,fire){
  // Keep the original instance and slot order. Events may start a later timer in this same pass.
  for(const instance of before){
   if(instance.dead)continue;
   const cached=instance[indexedAlarms];
   if(cached&&instance.alarm===cached.proxy&&!cached.aliasable&&!cached.mask)continue;
   if(!this.state(instance)?.mask)continue;
   let next=0;
   while(next<12){
    const mask=(this.state(instance)?.mask||0)&(0xfff<<next);if(!mask)break;
    const slot=31-Math.clz32(mask&-mask),alarm=instance.alarm;next=slot+1;
    if(alarm[slot]>0&&--alarm[slot]===0){alarm[slot]=-1;fire(instance,slot);}
   }
  }
 }
}
