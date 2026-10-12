import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {Engine} from '../dist/engine.js';

const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
let seed=12345;
Math.random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
const results=[];
for(const room of ['room26','room1','room3']){
 const game=new Engine(data,null,null,{seed:12345});game.audioEnabled=false;game.loadRoom(room,false);
 game.global.php=10000;
 if(room==='room1'){game.input.buttons.add(1);game.input.mx=.8;game.input.my=.2;}
 for(let n=0;n<40;n++)game.step();
 const samples=[];
 for(let n=0;n<180;n++){const begin=performance.now();game.step();samples.push(performance.now()-begin);}
 samples.sort((a,b)=>a-b);
 results.push({room,frames:samples.length,medianMs:+samples[90].toFixed(3),p95Ms:+samples[171].toFixed(3),meanMs:+(samples.reduce((a,b)=>a+b,0)/samples.length).toFixed(3),instances:game.instances.length,errors:game.errors.length});
}
console.log(JSON.stringify({results,heapMiB:+(process.memoryUsage().heapUsed/1048576).toFixed(2)},null,2));
