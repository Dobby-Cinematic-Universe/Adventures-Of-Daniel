import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';

const root=path.join(import.meta.dirname,'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.ogg':'audio/ogg','.mp3':'audio/mpeg'};
const port=Number(process.env.PORT||4173);
const baseParts=(process.env.BASE_PATH||'').split('/').filter(Boolean);
const basePath='/'+baseParts.join('/')+(baseParts.length?'/':'');

const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost'),pathname=decodeURIComponent(url.pathname);
  if(basePath!=='/'&&pathname===basePath.slice(0,-1)){
   res.writeHead(308,{'Location':basePath+url.search});res.end();return;
  }
  if(!pathname.startsWith(basePath)){res.writeHead(404);res.end('Not found');return;}
  const file=path.resolve(root,pathname.slice(basePath.length)||'index.html');
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-cache'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+server.address().port+basePath));
