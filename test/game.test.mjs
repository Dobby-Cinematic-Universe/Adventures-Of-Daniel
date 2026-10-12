import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Engine,formatGameNumber} from '../dist/engine.js';
import {SCRIPTS} from '../dist/code.js';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const make=(room='room26')=>{const g=new Engine(data);g.loadRoom(room,false);return g;};
const settle=(g,n=100)=>{for(let i=0;i<n;i++)g.step();};
const player=g=>g.resolve(g.assets.Object1)[0];
const object=(g,name)=>g.resolve(g.assets[name])[0];
function click(g,name){const s=object(g,name);assert.ok(s,name+' exists');const b=g.bounds(s);g.input.mx=((b.left+b.right)/2-g.camera.x)/g.camera.w;g.input.my=((b.top+b.bottom)/2-g.camera.y)/g.camera.h;g.input.bpressed.add(1);g.input.buttons.add(1);g.step();g.input.buttons.clear();}
function drawEvents(g){for(const s of [...g.instances]){if(s.dead)continue;g.runEvent(s,8,0);g.runEvent(s,8,64);}}
test('all recovered rooms run their events and drawing scripts without errors',()=>{for(let r=0;r<data.rooms.length;r++){const g=make(r);for(let n=0;n<150;n++){g.step();drawEvents(g);}assert.equal(g.errors.length,0,JSON.stringify(g.errors));for(const s of g.instances)assert.ok(Number.isFinite(s.x+s.y),data.rooms[r].info.Name+' '+g.objects[s.object_index].info.Name);}});
test('movement, double jump, and camera follow use the recovered player script',()=>{const g=make();settle(g);const p=player(g),start=p.x,ground=p.y;g.input.keys.add(68);settle(g,20);g.input.keys.clear();assert.equal(p.x,start+80);p.x=start;settle(g,5);g.input.pressed.add(32);g.step();assert.ok(p.y<ground);assert.equal(p.jumps,1);settle(g,3);g.input.pressed.add(32);g.step();assert.equal(p.jumps,0);assert.equal(g.camera.x,p.x-g.camera.w/2);assert.equal(g.errors.length,0);});
test('computer, email, and benefit collection remain interactive',()=>{const g=make();settle(g);player(g).x=7280;settle(g,5);click(g,'oSign');assert.ok(object(g,'oshopping2'));assert.equal(g.global.hascontrol,0);click(g,'oButtonMail');assert.ok(object(g,'oshoppingmail'));click(g,'oButtoninbox3');assert.equal(g.global.takenallowance,1);assert.equal(g.global.kills,500);assert.equal(g.errors.length,0);});
test('quest acceptance and doors follow the original scripts',()=>{const g=make();settle(g);const p=player(g);p.x=object(g,'oMum').x-65;p.y=object(g,'oMum').y;settle(g,5);click(g,'oMum');assert.ok(object(g,'oQuestBox'));click(g,'oQuestAnswer2');assert.ok(object(g,'oQuestObjectives'));assert.equal(g.global.acceptedquest,true);p.x=object(g,'oDoor').x-65;p.y=object(g,'oDoor').y;g.input.pressed.add(69);g.step();assert.ok(object(g,'oDoorOpen'));assert.equal(object(g,'oDoor'),undefined);assert.equal(g.errors.length,0);});
test('weapon fire consumes ammunition and damages the original enemies',()=>{const g=make('room1');settle(g,60);const p=player(g);assert.ok(object(g,'oGun'));const ammo=g.global.ammo;g.input.mx=.8;g.input.my=.2;g.input.buttons.add(1);settle(g,8);g.input.buttons.clear();assert.ok(g.global.ammo<ammo);assert.ok(object(g,'oBullet'));const enemy=object(g,'oEnemy'),hp=enemy.hp;const shot=g.create(g.assets.oBullet,enemy.x,enemy.y,'bullets',null,{spd:0});g.runEvent(shot,3,0);assert.equal(enemy.hp,hp-1);assert.equal(g.errors.length,0);});
test('world checkpoint saves room, position, stats, quests, and layers separately from original statistics',()=>{const g=make();settle(g);g.global.kills=900;g.global.acceptedquest=true;g.create(g.assets.oQuestObjectives,100,100,'quests');player(g).x=7400;g.getLayer('Gun').info.IsVisible=false;const statistics=g.readFile('User.sav');assert.ok(g.saveCheckpoint());player(g).x=7200;g.global.kills=0;assert.ok(g.restoreCheckpoint());assert.equal(player(g).x,7400);assert.equal(g.global.kills,900);assert.ok(object(g,'oQuestObjectives'));assert.equal(g.getLayer('Gun').info.IsVisible,false);assert.equal(g.readFile('User.sav'),statistics);assert.equal(g.errors.length,0);});
test('original menu, introduction, level transitions, and ending are reachable',()=>{const g=make('rMenu');settle(g,100);g.input.pressed.add(13);settle(g,160);assert.equal(g.room.info.Name,'introroom2');const end=object(g,'oLevelEnd53');assert.ok(end);g.input.keys.add(70);g.step();g.input.keys.clear();settle(g,120);assert.equal(g.room.info.Name,'room26');g.loadRoom('room1');const p=player(g),exit=object(g,'oLevelEnd');p.x=exit.x;p.y=exit.y;g.buildGrid();g.step();settle(g,100);assert.equal(g.room.info.Name,'room3');g.loadRoom('rEnding');assert.ok(object(g,'oEnding'));settle(g,60);drawEvents(g);assert.equal(g.errors.length,0);});
test('every referenced GameMaker function is implemented',()=>{const calls=JSON.parse(fs.readFileSync(new URL('calls.json',import.meta.url)));const g=new Engine(data);assert.deepEqual(calls.filter(n=>!g.builtins[n]&&!SCRIPTS[n]),[]);});
test('precise car masks reject transparent pixels within their bounding box',()=>{const g=make();const car=object(g,'oCar');assert.ok(car);const b=g.bounds(car),sp=g.spriteMask(b);assert.equal(sp.info.SepMasks,1);let solid=null,empty=null;for(let y=Math.ceil(b.top);y<b.bottom;y++)for(let x=Math.ceil(b.left);x<b.right;x++){if(g.maskContains(b,x+.5,y+.5))solid??=[x,y];else empty??=[x,y];}assert.ok(solid);assert.ok(empty);assert.equal(g.collides({left:solid[0],right:solid[0]+1,top:solid[1],bottom:solid[1]+1,valid:true},b),true);assert.equal(g.collides({left:empty[0],right:empty[0]+1,top:empty[1],bottom:empty[1]+1,valid:true},b),false);});
test('grenades, slow motion, death, and restart retain original behavior with bounded prompts',()=>{const g=make();settle(g);const p=player(g);g.runEvent(p,4,g.assets.ogrenadepickup,object(g,'ogrenadepickup'));g.global.bullets=4;g.input.buttons.add(1);settle(g,5);g.input.buttons.clear();assert.ok(g.global.bullets<4);assert.ok(object(g,'oBulletBomb'));g.input.buttons.add(2);const slow=g.global.slowmo;g.step();assert.equal(g.fps,30);assert.equal(g.global.slowmo,slow-1);g.input.buttons.clear();g.step();assert.equal(g.fps,60);g.global.php=1;const enemyShot=g.create(g.assets.eEbullet,p.x,p.y,'bullets');g.runEvent(p,4,g.assets.eEbullet,enemyShot);assert.ok(object(g,'oPDead'));assert.equal(g.global.hascontrol,0);settle(g,100);assert.ok(g.resolve(g.assets.oDanielText6).length<=1);g.input.pressed.add(32);g.step();assert.equal(object(g,'oPDead'),undefined);assert.equal(g.global.hascontrol,1);assert.equal(g.errors.length,0);});

test('F toggles acquired weapons once, keeps ownership, and fires only the equipped weapon',()=>{
 const g=make();settle(g);const p=player(g);
 g.runEvent(object(g,'oGunPickup'),4,g.assets.Object1,p);
 g.runEvent(p,4,g.assets.ogrenadepickup,object(g,'ogrenadepickup'));
 const equipped=object(g,'oGun59'),id=equipped.id;
 assert.ok(g.global.weapon1&&g.global.weapon2);
 g.input.pressed.add(70);g.input.keys.add(70);g.step();settle(g,12);g.input.keys.clear();
 assert.equal(object(g,'oGun').id,id);assert.equal(object(g,'oGun59'),undefined);
 assert.ok(g.global.weapon1&&g.global.weapon2);assert.ok(g.layerVisible(object(g,'oGun').layer));
 const ammo=g.global.ammo,bombs=g.global.bullets;g.input.buttons.add(1);settle(g,4);g.input.buttons.clear();
 assert.ok(g.global.ammo<ammo);assert.equal(g.global.bullets,bombs);
 g.input.pressed.add(70);g.step();assert.equal(object(g,'oGun59').id,id);
 g.input.buttons.add(1);settle(g,4);g.input.buttons.clear();assert.ok(g.global.bullets<bombs);
 assert.equal(g.resolve(g.assets.oGun).length+g.resolve(g.assets.oGun59).length,1);assert.equal(g.errors.length,0);
});
test('switching with an unowned weapon keeps the existing gun, even when empty',()=>{
 const g=make('room1');settle(g,40);const gun=object(g,'oGun');g.global.weapon2=false;g.global.ammo=0;
 g.input.pressed.add(70);g.step();assert.equal(object(g,'oGun').id,gun.id);assert.equal(object(g,'oGun59'),undefined);assert.equal(g.errors.length,0);
});
test('closing the computer restores the gun layer and stocks render inside the stock screen only',()=>{
 const g=make();settle(g);const p=player(g);p.x=7280;settle(g,5);g.create(g.assets.oGun,p.x,p.y,'Gun');
 const ctx=new Proxy({}, {get:(o,k)=>o[k]??(()=>{})});g.renderer.ctx=ctx;g.renderer.canvas={width:1366,height:768};
 const labels=[];g.renderer.text=(x,y,t)=>{if(String(t).startsWith('Stocks:'))labels.push({x,y,t});};
 g.renderer.draw();assert.equal(labels.length,0);
 click(g,'oSign');assert.equal(g.layerVisible(object(g,'oGun').layer),false);
 click(g,'oButton3rd');g.global.stocks=123.456789;g.renderer.draw();assert.equal(labels.length,1);
 const shop=object(g,'oshoppingstocks'),label=labels[0];
 const worldX=label.x*g.camera.w/g.gui.w+g.camera.x,worldY=label.y*g.camera.h/g.gui.h+g.camera.y;
 assert.ok(worldX>shop.x+40&&worldX<shop.x+510);assert.ok(worldY>shop.y+305&&worldY<shop.y+415);assert.equal(label.t,'Stocks: $ 123.46');
 click(g,'oButtonOff');assert.equal(g.layerVisible(object(g,'oGun').layer),true);labels.length=0;g.renderer.draw();assert.equal(labels.length,0);assert.equal(g.errors.length,0);
});
test('game numbers display two decimal places at most without changing inventory values',()=>{
 const g=make();for(const [v,expected] of [[0,'0'],[500,'500'],[0.1+0.2,'0.3'],[5.879999999,'5.88'],[123.456789,'123.46'],[-0.0000001,'0']]){
  assert.equal(formatGameNumber(v),expected);assert.equal(g.builtins.string(null,v),expected);
 }
 g.global.stocks=123.456789;g.builtins.string(null,g.global.stocks);assert.equal(g.global.stocks,123.456789);
});

test('aiming away from an interactive object clears its firing block without moving Daniel',()=>{
 const g=make();settle(g);const p=player(g);g.create(g.assets.oGun59,p.x,p.y,'Gun');g.global.bullets=8;
 const b=g.bounds(object(g,'oSign'));g.input.mx=((b.left+b.right)/2-g.camera.x)/g.camera.w;g.input.my=((b.top+b.bottom)/2-g.camera.y)/g.camera.h;
 g.input.buttons.add(1);g.step();assert.equal(g.global.bullets,8);assert.equal(g.global.dontshoot,false);
 g.input.mx=.1;g.input.my=.1;settle(g,4);g.input.buttons.clear();assert.ok(g.global.bullets<8);assert.equal(g.errors.length,0);
});
test('two petrol shifts finish, pay once each, keep one completion message, and restore the selected weapon',()=>{
 const g=make();settle(g);const p=player(g);g.global.kills=725;g.global.hasquest2=1;
 g.runEvent(object(g,'oGunPickup'),4,g.assets.Object1,p);g.runEvent(p,4,g.assets.ogrenadepickup,object(g,'ogrenadepickup'));
 const base=g.instances.length;
 for(let round=0;round<2;round++){
  if(round){g.global.hasslept=true;g.step();}
  const sign=object(g,'oJobSign');p.x=sign.x-50;p.y=sign.y;settle(g,2);click(g,'oJobSign');click(g,'ojobbutton1');
  assert.equal(g.global.quest3,0);assert.equal(g.resolve(g.assets.oNepalguytext).length,0);
  for(const name of ['oCustoemrs','oCustoemrs2','oCustoemrs3','oCustomerArea','oCustomerArea2','oCustomerArea3'])assert.ok(object(g,name));
  const door=object(g,'oPetrolstationDoor');p.x=door.x-60;p.y=door.y;settle(g,2);click(g,'oPetrolstationDoor');
  assert.equal(g.resolve(g.assets.oGun).length+g.resolve(g.assets.oGun59).length,0);
  let served=0;
  for(let t=0;t<1800&&g.global.quest3!==1;t++){
   const crate=['oCrate','oCrate2','oCrate3'].map(n=>object(g,n)).find(Boolean);
   if(crate){p.x=crate.x-40;p.y=crate.y-30;g.input.pressed.add(69);served++;}
   g.step();assert.ok(g.instances.length<=base+20,'station object count stays bounded');
  }
  assert.equal(served,3);assert.equal(g.global.quest3,1);assert.equal(g.global.kills,725+300*(round+1));
  settle(g,600);assert.equal(g.resolve(g.assets.oNepalguytext).length,1);assert.equal(g.global.kills,725+300*(round+1));assert.ok(g.instances.length<=base+20);
  const exit=object(g,'oPetrolstationDoor153');p.x=exit.x-60;p.y=exit.y;settle(g,2);click(g,'oPetrolstationDoor153');
  assert.equal(p.x,sign.x);assert.equal(g.global.quest3,1);assert.equal(object(g,'oQuestObjectives3'),undefined);
  assert.equal(g.resolve(g.assets.oGun59).length,1);assert.equal(object(g,'oGun'),undefined);assert.ok(g.layerVisible(object(g,'oGun59').layer));
 }
 assert.equal(g.errors.length,0);
});
test('older checkpoints collapse duplicated station messages without paying the completed shift again',()=>{
 const g=make();settle(g);g.global.hasquest3=1;g.create(g.assets.oQuestObjectives3,0,0,'quests');
 for(const n of ['oCustoemrs','oCustoemrs2','oCustoemrs3'])g.destroy(g.assets[n]);
 for(let n=0;n<12;n++)g.create(g.assets.oNepalguytext,18578,1883,'stuff');
 g.global.quest3=1;g.global.kills=1025;g.writeFile('checkpoint',JSON.stringify({version:2,room:g.roomIndex,x:player(g).x,y:player(g).y,global:{...g.global},instances:g.instances.filter(s=>!s.dead),layers:g.layers.map(l=>l.info),frame:g.frame,time:Date.now()}));assert.ok(g.restoreCheckpoint());settle(g,60);
 assert.equal(g.resolve(g.assets.oNepalguytext).length,1);assert.equal(g.global.kills,1025);assert.equal(g.global.quest3,1);assert.equal(g.errors.length,0);
});
test('revival waits for landing, returns the camera and control, and restores one equipped weapon',()=>{
 for(const room of ['room26','room1']){
  const g=make(room);settle(g,100);const p=player(g);g.global.kills=700;
  if(room==='room26'){g.runEvent(object(g,'oGunPickup'),4,g.assets.Object1,p);g.runEvent(p,4,g.assets.ogrenadepickup,object(g,'ogrenadepickup'));}
  const selected=object(g,'oGun59')?'oGun59':'oGun';g.global.php=1;
  for(let i=0;i<2;i++){const shot=g.create(g.assets.eEbullet,p.x,p.y,'bullets');g.runEvent(p,4,g.assets.eEbullet,shot);}
  const dead=object(g,'oPDead');assert.ok(dead);assert.equal(g.global.php,0);assert.equal(g.global.kills,500);
  g.input.pressed.add(32);g.step();assert.ok(object(g,'oPDead'));assert.equal(object(g,'oCamera').follow,dead.id);
  settle(g,160);assert.equal(object(g,'oPDead').done,1);g.input.pressed.add(32);g.step();settle(g,2);
  assert.equal(object(g,'oPDead'),undefined);assert.equal(g.global.hascontrol,1);assert.equal(g.global.php,8);assert.equal(g.fps,60);
  assert.equal(object(g,'oCamera').follow,p.id);assert.ok(g.layerVisible(p.layer));assert.ok(object(g,selected));
  assert.equal(g.resolve(g.assets.oGun).length+g.resolve(g.assets.oGun59).length,1);assert.equal(g.global.kills,500);
  const bed=object(g,'oBedSleep');assert.equal(p.x,bed?bed.x:p.xstart);assert.equal(g.errors.length,0);
 }
});
test('sleep fades finish, remove temporary objects, and allow another night, including a mid-sleep save',()=>{
 const g=make();settle(g);const p=player(g),bed=object(g,'oBedSleep');
 for(let night=0;night<2;night++){
  p.x=bed.x;p.y=bed.y-90;p.vsp=0;settle(g,2);g.global.php=2;g.global.slowmo=1;click(g,'oBedSleep');
  assert.equal(g.global.clickedbed,true);assert.equal(g.global.hascontrol,0);assert.ok(object(g,'oSleepBlck'));
  settle(g,200);if(!night){assert.ok(g.saveCheckpoint());assert.ok(g.restoreCheckpoint());}
  settle(g,260);assert.equal(g.global.hascontrol,1);assert.equal(g.global.clickedbed,false);assert.equal(g.global.gosleep,0);
  assert.equal(g.global.php,8);assert.equal(g.global.slowmo,100);
  for(const n of ['oSleepBlck','oSleepBlck119','oText5'])assert.equal(object(g,n),undefined);
  assert.equal(object(g,'oBedSleep').alarm[1],-1);assert.ok(object(g,'oQuestMarker2'));
 }
 assert.equal(g.errors.length,0);
});
test('guiding the companion onto the bed restores hearts, and temporary heart effects expire',()=>{
 const g=make();settle(g);const p=player(g),girl=object(g,'oGirl16364'),trigger=object(g,'girltrigger1');
 p.x=trigger.x+60;p.y=trigger.y-35;p.vsp=0;girl.x=p.x+67;girl.y=p.y;girl.vsp=0;g.global.php=2;
 g.input.keys.add(69);settle(g,3);g.input.keys.clear();
 assert.equal(object(g,'girltrigger1'),undefined);assert.equal(g.global.php,8);assert.ok(object(g,'oGirl163'));assert.ok(object(g,'oGirl16378'));
 girl.hspeed=-.1;g.step();assert.equal(girl.hspeed,0);settle(g,160);
 assert.equal(object(g,'oGirl163'),undefined);assert.equal(object(g,'oGirl16378'),undefined);assert.equal(g.errors.length,0);
});
