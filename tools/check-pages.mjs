import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readdir,readFile,lstat} from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist');
const files=new Map();
const extensions=new Set(['.html','.css','.js','.json','.png','.ogg','.mp3']);

async function scan(directory){
 for(const entry of await readdir(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name),stat=await lstat(file);
  assert.ok(!stat.isSymbolicLink()&&(stat.isDirectory()||stat.nlink===1),'Deployment must not contain links: '+file);
  if(entry.isDirectory()){await scan(file);continue;}
  assert.ok(entry.isFile(),'Unexpected deployment entry: '+file);
  const name=path.relative(dist,file).split(path.sep).join('/');
  assert.ok(name==='.nojekyll'||extensions.has(path.extname(name)),'Unexpected public file: '+name);
  files.set(name,stat.size);
 }
}
async function verify(basePath){
 const base=new URL('https://example.invalid'+basePath);
 const references=new Set();
 function reference(value,from='index.html'){
  assert.ok(!value.startsWith('/'),'Use a relative URL for repository-path hosting: '+value);
  const url=new URL(value,new URL(from,base));
  assert.equal(url.origin,base.origin,'Deployment must be self-contained: '+value);
  assert.ok(url.pathname.startsWith(basePath),'Reference escaped the project path: '+value);
  const name=decodeURIComponent(url.pathname.slice(basePath.length))+(url.pathname.endsWith('/')?'index.html':'');
  assert.ok(files.has(name),'Missing file referenced by '+from+': '+value);
  references.add(name);
 }

 for(const name of files.keys()){
  if(!['.html','.css','.js'].includes(path.extname(name)))continue;
  const source=await readFile(path.join(dist,name),'utf8');
  if(name.endsWith('.html'))for(const match of source.matchAll(/\b(?:src|href)="([^"]+)"/g))reference(match[1],name);
  if(name.endsWith('.css'))for(const match of source.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))reference(match[1],name);
  if(name.endsWith('.js')){
   for(const match of source.matchAll(/^import\s+.*?from\s+['"]([^'"]+)['"]/gm))reference(match[1],name);
   for(const match of source.matchAll(/(?:fetch\(|new Audio\(|\.src\s*=\s*)['"]([^'"]+)['"]\s*(?=[);,])/g))reference(match[1],name);
  }
 }
 const data=JSON.parse(await readFile(path.join(dist,'data.json'),'utf8'));
 for(const sound of data.sounds)reference('assets/'+sound.path);
 for(const texture of [...data.sprites.flatMap(sprite=>sprite.textures),...data.fonts.map(font=>font.texture)]){
  const index=/^Texture (\d+)$/.exec(texture.TexturePage);
  assert.ok(index,'Unknown texture atlas: '+texture.TexturePage);
  reference('assets/texture'+index[1]+'.png');
 }

 const child=spawn(process.execPath,['--max-old-space-size=128','server.mjs'],{
  cwd:root,env:{...process.env,PORT:'0',BASE_PATH:basePath},stdio:['ignore','pipe','pipe']
 });
 try{
  const local=await new Promise((resolve,reject)=>{
   let errorOutput='';
   child.stderr.on('data',chunk=>{errorOutput=(errorOutput+chunk.toString()).slice(-4096);});
   const timer=setTimeout(()=>reject(new Error('Preview server did not start')),10000);
   child.once('error',error=>{clearTimeout(timer);reject(error);});
   child.once('exit',code=>{clearTimeout(timer);reject(new Error('Preview server exited: '+code+'\n'+errorOutput));});
   child.stdout.on('data',chunk=>{
    const url=/Local: (http:\/\/127\.0\.0\.1:\d+\/[^\s]*)/.exec(chunk.toString());
    if(url){clearTimeout(timer);resolve(new URL(url[1]));}
   });
  });
  if(basePath!=='/'){
   const redirect=await fetch(new URL(basePath.slice(0,-1)+'?check=1',local),{redirect:'manual',signal:AbortSignal.timeout(5000)});
   assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),basePath+'?check=1');
  }
  const outside=await fetch(new URL(basePath==='/'?'/missing-project-path/assets/texture0.png':'/assets/texture0.png',local),{signal:AbortSignal.timeout(5000)});
  assert.equal(outside.status,404,'Preview must expose incorrect URL prefixes');
  const entry=await fetch(local,{signal:AbortSignal.timeout(5000)});
  assert.equal(entry.status,200,'Could not serve the game at '+basePath);
  assert.equal(createHash('sha256').update(new Uint8Array(await entry.arrayBuffer())).digest('hex'),createHash('sha256').update(await readFile(path.join(dist,'index.html'))).digest('hex'));
  const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.ogg':'audio/ogg','.mp3':'audio/mpeg'};
  for(const [name,size] of files){
   const response=await fetch(new URL(name,local),{signal:AbortSignal.timeout(5000)});
   assert.equal(response.status,200,'Could not serve '+name);
   assert.equal(Number(response.headers.get('content-length')),size,'Incorrect size for '+name);
   if(mime[path.extname(name)])assert.ok(response.headers.get('content-type').startsWith(mime[path.extname(name)]),'Incorrect MIME type for '+name);
   const served=createHash('sha256').update(new Uint8Array(await response.arrayBuffer())).digest('hex');
   const expected=createHash('sha256').update(await readFile(path.join(dist,name))).digest('hex');
   assert.equal(served,expected,'Incorrect content for '+name);
  }
  console.log('Pages check passed: '+files.size+' files, '+references.size+' referenced files, '+(Array.from(files.values()).reduce((a,b)=>a+b,0)/1048576).toFixed(2)+' MiB served at '+basePath);
 }finally{
  if(child.exitCode===null)await new Promise(resolve=>{child.once('exit',resolve);child.kill('SIGTERM');});
 }
}

await scan(dist);
assert.ok(files.has('index.html')&&files.has('.nojekyll'),'Missing deployment entry files');
for(const basePath of ['/','/Adventures-Of-Daniel/'])await verify(basePath);
