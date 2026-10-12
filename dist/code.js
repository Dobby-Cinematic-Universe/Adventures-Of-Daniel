export const CODE={
"gml_GlobalScript_screenShake":function(E){
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
if((E.get("argument0") > E.get("shake_remain"))){
E.set("shake_magnitude",E.get("argument0"));
E.set("shake_remain",E.get("argument0"));
E.set("shake_length",E.get("argument1"));
}
else {}
}
}}
}
,
"gml_GlobalScript_slideTransition":function(E){
for(const __target1 of E.targets(E.get("oTransition"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("mode",E.index(E.get("argument"),0));
if((E.get("argument_count") > 1)){
E.set("target",E.index(E.get("argument"),1));
}
else {}
}
}}
}
,
"gml_Object_KillTxext_Collision_Object1":function(E){
E.call("instnce_destroy",[54]);
}
,
"gml_Object_KillTxext_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_Object1_Alarm_0":function(E){
E.put(E.get("global"),"greentimer",(E.member(E.get("global"),"greentimer") - 1));
E.call("alarm_set",[0,30]);
if((E.member(E.get("global"),"greentimer") == (-10))){
E.put(E.get("global"),"greentimer",0);
}
else {}
}
,
"gml_Object_Object1_Alarm_1":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-10),10]))));
if((E.member(E.get("global"),"stocksdown") == 1)){
E.call("alarm_set",[1,22]);
}
else {
E.call("alarm_set",[1,(-1)]);
}

}
,
"gml_Object_Object1_Collision_Object59":function(E){
E.set("flash",3);
}
,
"gml_Object_Object1_Collision_eEbullet":function(E){
E.call("KillPlayer",[]);
for(const __target1 of E.targets(E.get("other"))){const E2=E.withSelf(__target1);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
E.call("audio_play_sound",[E.get("death"),2,false]);
E.set("flash",7);
}
,
"gml_Object_Object1_Collision_oEnemy":function(E){
E.call("KillPlayer",[]);
E.set("flash",7);
}
,
"gml_Object_Object1_Collision_oEnemyBig":function(E){
E.call("KillPlayer",[]);
}
,
"gml_Object_Object1_Collision_oExplosion":function(E){
E.set("vsp",(-20));
E.set("direction",E.call("point_direction",[E.member(E.get("other"),"x"),E.member(E.get("other"),"y"),E.get("x"),E.get("y")]));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
}
,
"gml_Object_Object1_Collision_oGunPickup":function(E){
E.set("flash",3);
}
,
"gml_Object_Object1_Collision_oKillTrigger":function(E){
E.call("KillPlayer",[]);
}
,
"gml_Object_Object1_Collision_oMission":function(E){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),(E.member(E.get("Object1"),"y") - 100),E.get("layer"),E.get("oDanielText4")]);
E.call("instance_destroy",[E.get("oMission")]);
}
,
"gml_Object_Object1_Collision_oSpawner":function(E){
}
,
"gml_Object_Object1_Collision_oSpring":function(E){
E.set("vsp",(-10));
E.call("audio_play_sound",[E.get("bedbounce"),1,false]);
}
,
"gml_Object_Object1_Collision_oSpring51":function(E){
E.set("vsp",(-20));
E.call("audio_play_sound",[E.get("bedbounce"),1,false]);
}
,
"gml_Object_Object1_Collision_ogrenadepickup":function(E){
E.call("instance_destroy",[E.get("oGun")]);
E.call("instance_destroy",[E.get("oGun59")]);
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"Gun",E.get("oGun59")]);
E.call("instance_destroy",[E.get("ogrenadepickup")]);
E.put(E.get("global"),"weapon2",true);
E.put(E.get("global"),"bullets",(E.member(E.get("global"),"bullets") + 8));
E.set("flash",3);
E.call("audio_play_sound",[E.get("reloadSound"),1,false]);
}
,
"gml_Object_Object1_Collision_wall":function(E){
}
,
"gml_Object_Object1_Create_0":function(E){
E.set("friction",1);
E.set("hsp",0);
E.set("vsp",0);
E.set("grv",0.4);
E.set("walksp",4);
E.set("hitfrom",0);
E.set("vspeed",0);
E.put(E.get("global"),"hascontrol",true);
E.set("canjump",0);
E.set("flash",0);
E.put(E.get("global"),"gosleep",0);
E.put(E.get("global"),"ammo",110);
E.put(E.get("global"),"stocksdown",0);
E.put(E.get("global"),"kills",E.member(E.get("global"),"kills"));
E.put(E.get("global"),"messageread",0);
E.put(E.get("global"),"php",4);
E.put(E.get("global"),"takenallowance",0);
E.set("jumps",0);
E.put(E.get("global"),"clickedbed",false);
E.put(E.get("global"),"tapes",0);
E.put(E.get("global"),"bullets",0);
E.put(E.get("global"),"stocks",0);
E.set("gunkickx",0);
E.set("gunkicky",0);
E.call("audio_play_sound",[E.get("nightsounds"),7,true]);
if((E.member(E.get("global"),"stocksdown") == 0)){
E.putIndex(E.ensureArray("alarm"),1,(-1));
}
else {}
E.put(E.get("global"),"acceptedquest",false);
E.put(E.get("global"),"greentimer",0);
E.putIndex(E.ensureArray("alarm"),0,(E.index(E.get("alarm"),0) + 30));
E.put(E.get("global"),"hasquest1",0);
E.put(E.get("global"),"hasquest2",0);
E.put(E.get("global"),"hasquest3",0);
E.put(E.get("global"),"quest1",0);
E.put(E.get("global"),"quest2",0);
E.put(E.get("global"),"quest3",0);
E.call("instance_destroy",[E.get("oBulletsLeftGreen")]);
E.put(E.get("global"),"hasslept",true);
}
,
"gml_Object_Object1_Draw_0":function(E){
E.call("draw_self",[]);
if((E.get("flash") > 0)){
E.set("flash",(E.get("flash") - 1));
E.call("shader_set",[E.get("shWhite")]);
E.call("draw_self",[]);
E.call("shader_reset",[]);
}
else {}
}
,
"gml_Object_Object1_KeyPress_69":function(E){
}
,
"gml_Object_Object1_KeyPress_81":function(E){
}
,
"gml_Object_Object1_KeyPress_82":function(E){
E.put(E.get("global"),"kills",0);
E.put(E.get("global"),"ammo",0);
E.put(E.get("global"),"bullets",0);
E.put(E.get("global"),"tapes",0);
E.put(E.get("global"),"stocks",0);
E.put(E.get("global"),"takenallowance",0);
}
,
"gml_Object_Object1_Mouse_4":function(E){
}
,
"gml_Object_Object1_Other_4":function(E){
if(E.truthy(E.call("file_exists",["Save.sav"]))){
E.call("file_delete",["Save.sav"]);
}
else {}
E.declare("file",E.call("file_text_open_write",["Save.sav"]));
E.call("file_text_write_real",[E.get("file"),E.get("room")]);
E.call("file_text_write_real",[E.get("file"),E.member(E.get("global"),"kills")]);
E.call("file_text_close",[E.get("file")]);
if((E.member(E.get("global"),"stocks") > 1)){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oButton1Stock")]);
}
else {}
E.call("loadgame",[]);
E.put(E.get("global"),"greentimer",0);
E.call("layer_set_visible",["specialbutton",(!E.truthy(E.get("visible")))]);
}
,
"gml_Object_Object1_Other_7":function(E){
if((E.get("sprite_index") == E.get("runningSprite"))){
E.call("audio_play_sound",[E.call("choose",[E.get("foot1"),E.get("foot2"),E.get("foot3"),E.get("foot4"),E.get("foot5"),E.get("foot6")]),1,false]);
}
else {}
}
,
"gml_Object_Object1_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_Object1_Step_0":function(E){
if(((!E.truthy(E.member(E.get("global"),"hascontrol"))) && ((E.truthy(E.call("instance_exists",[E.get("ojobmenu")])) || E.truthy(E.call("instance_exists",[E.get("oQuestBox")]))) || E.truthy(E.call("instance_exists",[E.get("oButtonOff")]))))){
E.set("hsp",0);
E.set("vsp",0);
E.set("gunkickx",0);
E.set("gunkicky",0);
E.call("game_set_speed",[60,E.get("gamespeed_fps")]);
return ;
}
else {}
if(E.truthy(E.call("player_unstick",[]))){
E.set("gunkickx",0);
E.set("gunkicky",0);
return ;
}
else {}
if(E.truthy(E.member(E.get("global"),"hascontrol"))){
E.set("key_left",(E.truthy(E.call("keyboard_check_pressed",[E.get("vk_left")])) || E.truthy(E.call("keyboard_check",[E.call("ord",["A"])]))));
E.set("key_right",(E.truthy(E.call("keyboard_check",[E.get("vk_right")])) || E.truthy(E.call("keyboard_check",[E.call("ord",["D"])]))));
E.set("key_jump",(E.truthy(E.call("keyboard_check_pressed",[E.get("vk_space")])) || E.truthy(E.call("keyboard_check",[E.call("ord",["W"])]))));
}
else {
E.set("key_right",0);
E.set("key_left",0);
E.set("key_jump",0);
}

E.declare("move",(E.get("key_right") - E.get("key_left")));
E.set("hsp",((E.get("move") * E.get("walksp")) + E.get("gunkickx")));
E.set("gunkickx",0);
E.set("vsp",((E.get("vsp") + E.get("grv")) + E.get("gunkicky")));
E.set("gunkicky",0);
if((E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])) || E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("oSign")])))){
E.set("jumps",2);
}
else {}
if((E.truthy(E.get("key_jump")) && (E.get("jumps") > 0))){
E.set("jumps",(E.get("jumps") - 1));
E.set("vsp",(-9));
}
else {}
if((E.truthy(E.call("mouse_check_button",[E.get("mb_right")])) && ((E.member(E.get("global"),"slowmo") > 0) || E.truthy(E.call("cheat_enabled",["infiniteSlowmo"]))))){
E.call("game_set_speed",[30,E.get("gamespeed_fps")]);
if((!E.truthy(E.call("cheat_enabled",["infiniteSlowmo"])))){
E.put(E.get("global"),"slowmo",(E.member(E.get("global"),"slowmo") - 1));
}
else {}
}
else {
E.call("game_set_speed",[60,E.get("gamespeed_fps")]);
}

if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("Object1")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("Object1")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("oDoor")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if((E.call("abs",[E.get("vsp")]) > 32)){
E.call("player_move_vertical",[E.get("vsp")]);
}
else {
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
}

E.declare("aimside",E.call("sign",[(E.get("mouse_x") - E.get("x"))]));
if((E.get("aimside") != 0)){
E.set("image_xscale",E.get("aimside"));
}
else {}
if((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])))){
E.set("sprite_index",E.get("danielJump"));
E.set("image_speed",0);
if((E.call("sign",[E.get("vsp")]) > 0)){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

}
else {
E.set("canjump",10);
if((E.get("sprite_index") == E.get("danielJump"))){
E.call("audio_play_sound",[E.get("groundland"),4,false]);
for(let __repeat1=Math.max(0,Math.trunc(5));__repeat1>0;__repeat1--){E.tick();{
for(const __target2 of E.targets(E.call("instance_create_layer",[E.get("x"),E.get("bbox_bottom"),"bullets",E.get("odust")]))){const E2=E.withSelf(__target2);{const E=E2;{
E.set("vsp",0);
}
}}
}
}
}
else {}
E.set("image_speed",1);
if((E.get("hsp") == 0)){
E.set("sprite_index",E.get("daniel"));
}
else {
E.set("sprite_index",E.get("runningSprite"));
if((E.get("aimside") != E.call("sign",[E.get("hsp")]))){
E.set("sprite_index",E.get("runningSprite"));
}
else {}
}

}

if(E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["S"])]))){
E.call("savegame",[]);
if((!E.truthy(E.call("instance_exists",[E.get("oDanielText5")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oDanielText5")]);
}
else {}
}
else {}
if(E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["L"])]))){
E.call("loadgame",[]);
}
else {}
if((E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["A"])])) || (E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["D"])])) && (!E.truthy(E.call("instance_exists",[E.get("oButtonOff")])))))){
E.put(E.get("global"),"dontshoot",true);
}
else {}
if(((((E.truthy(E.call("point_in_circle",[E.member(E.get("oGirl16364"),"x"),E.member(E.get("oGirl16364"),"y"),E.get("x"),E.get("y"),800])) && (!E.truthy(E.call("instance_exists",[E.get("oGirltext2")])))) && (!E.truthy(E.call("instance_exists",[E.get("oGirltext71")])))) && (!E.truthy(E.call("instance_exists",[E.get("oPDead")])))) && E.truthy(E.call("instance_exists",[E.get("oGirl16364")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),"Gun",E.get("oGirltext2")]);
}
else {}
if(E.truthy(E.call("point_in_circle",[E.member(E.get("oGirl16364"),"x"),E.member(E.get("oGirl16364"),"y"),E.get("x"),E.get("y"),200]))){
E.call("instance_destroy",[E.get("oGirltext2")]);
}
else {}
if((E.truthy(E.call("instance_exists",[E.get("oPDead")])) && (!E.truthy(E.call("instance_exists",[E.get("oGirltext71")]))))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),"Gun",E.get("oGirltext71")]);
}
else {}
}
,
"gml_Object_Object1_Step_1":function(E){
}
,
"gml_Object_Object59_Collision_Object1":function(E){
E.put(E.get("global"),"tapes",(E.member(E.get("global"),"tapes") + 1));
E.call("audio_play_sound",[E.call("choose",[E.get("powerup"),E.get("powerup23")]),2,false]);
E.set("flash",3);
E.call("instance_destroy",[]);
}
,
"gml_Object_Object59_Create_0":function(E){
E.set("y",(E.get("ystart") + (E.call("sin",[(E.call("get_timer",[]) / 200000)]) * 10)));
}
,
"gml_Object_Object59_Other_7":function(E){
}
,
"gml_Object_Object59_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_Object59_Step_0":function(E){
E.set("y",(E.get("ystart") + (E.call("sin",[(E.call("get_timer",[]) / 200000)]) * 10)));
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("Object1")]))){
for(const __target1 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("Object1")]))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
}
else {}
}
,
"gml_Object_Object59_Step_1":function(E){
}
,
"gml_Object_ZZZ_Create_0":function(E){
E.set("image_alpha",0);
}
,
"gml_Object_ZZZ_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_ZZZ_Step_0":function(E){
E.set("image_alpha",(E.get("image_alpha") + 0.0015));
}
,
"gml_Object_computerbottom_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_eEbullet_Other_7":function(E){
E.set("image_speed",0);
E.set("image_index",1);
}
,
"gml_Object_eEbullet_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_eEbullet_Step_0":function(E){
E.set("x",(E.get("x") + E.call("lengthdir_x",[E.get("spd"),E.get("direction")])));
E.set("y",(E.get("y") + E.call("lengthdir_y",[E.get("spd"),E.get("direction")])));
if((E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("wall")])) && (E.get("image_index") != 0))){
while(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("wall")]))){E.tick();
{
E.set("x",(E.get("x") - E.call("lengthdir_x",[1,E.get("direction")])));
E.set("y",(E.get("y") - E.call("lengthdir_y",[1,E.get("direction")])));
}
}
E.set("spd",0);
E.call("instance_change",[E.get("oHitspark"),true]);
}
else {}
}
,
"gml_Object_girltrigger1_Collision_oGirl16364":function(E){
E.call("audio_play_sound",[E.get("harp"),4,false]);
E.call("instance_destroy",[]);
E.put(E.get("global"),"php",8);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") - 53),(E.member(E.get("Object1"),"y") - 190),E.get("layer"),E.get("oGirl163")]);
E.call("audio_play_sound",[E.get("kissing"),2,false]);
E.call("instance_create_layer",[(E.member(E.get("oGirl16364"),"x") - 53),(E.member(E.get("oGirl16364"),"y") - 190),E.get("layer"),E.get("oGirl16378")]);
}
,
"gml_Object_girltrigger1_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_mud45_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_mud_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_mudblockssmall_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_mudrocks_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oAlarm_Alarm_2":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-10),10]))));
E.call("alarm_set",[2,22]);
}
,
"gml_Object_oAlarm_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oBedSleep_Alarm_1":function(E){
E.put(E.get("global"),"gosleep",(E.member(E.get("global"),"gosleep") - 1));
E.call("alarm_set",[1,30]);
}
,
"gml_Object_oBedSleep_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oBedSleep_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
E.put(E.get("global"),"dontshoot",false);
}
else {
E.set("image_index",0);
}

if((((E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),100])) && E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")]))) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"clickedbed") == false))){
E.put(E.get("global"),"clickedbed",true);
E.call("instance_create_layer",[E.get("x"),E.get("y"),"gosleepzzz",E.get("oText5")]);
E.putIndex(E.ensureArray("alarm"),1,30);
E.call("instance_create_layer",[E.get("x"),E.get("y"),"gobackbutton2",E.get("oSleepBlck")]);
E.put(E.get("global"),"slowmo",100);
E.put(E.get("global"),"php",8);
E.put(E.get("global"),"hascontrol",0);
E.put(E.get("global"),"hasslept",true);
E.put(E.get("global"),"quest3",0);
}
else {}
if((E.member(E.get("global"),"gosleep") == (-15))){
E.put(E.get("global"),"gosleep",0);
E.putIndex(E.ensureArray("alarm"),1,(-1));
}
else {}
}
,
"gml_Object_oBulletBomb_Other_7":function(E){
E.set("image_speed",0);
E.set("image_index",1);
}
,
"gml_Object_oBulletBomb_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oBulletBomb_Step_0":function(E){
E.set("x",(E.get("x") + E.call("lengthdir_x",[E.get("spd"),E.get("direction")])));
E.set("y",(E.get("y") + E.call("lengthdir_y",[E.get("spd"),E.get("direction")])));
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("pshootable")]))){
for(const __target1 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("pshootable")]))){const E2=E.withSelf(__target1);{const E=E2;{
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oExplosion")]);
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
E.call("instance_destroy",[]);
}
else {}
if((E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("wall")])) && (E.get("image_index") != 0))){
while(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("wall")]))){E.tick();
{
E.set("x",(E.get("x") - E.call("lengthdir_x",[1,E.get("direction")])));
E.set("y",(E.get("y") - E.call("lengthdir_y",[1,E.get("direction")])));
}
}
E.set("spd",0);
E.call("instance_change",[E.get("oHitspark"),true]);
E.call("instance_change",[E.get("oExplosion"),true]);
E.call("layer_add_instance",["player",E.get("id")]);
E.set("depth",(E.get("depth") + 1));
}
else {}
}
,
"gml_Object_oBulletTapes_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"tapes",0);
E.set("killtextscale",1);
}
,
"gml_Object_oBulletTapes_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,1,2,0]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_text_transformed",[188,80,(E.call("string",[E.member(E.get("global"),"tapes")]) + " tapes"),E.get("killtextscale"),E.get("killtextscale"),0]);
if((E.member(E.get("global"),"tapes") == 0)){
E.call("draw_text",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"no more bullets"]);
}
else {}
}
else {}
}
,
"gml_Object_oBulletTapes_Other_4":function(E){
E.put(E.get("global"),"killsthisroom",0);
}
,
"gml_Object_oBulletTapes_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oBullet_Collision_oGirl16364":function(E){
}
,
"gml_Object_oBullet_Other_7":function(E){
E.set("image_speed",0);
E.set("image_index",1);
}
,
"gml_Object_oBullet_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oBullet_Step_0":function(E){
E.set("x",(E.get("x") + E.call("lengthdir_x",[E.get("spd"),E.get("direction")])));
E.set("y",(E.get("y") + E.call("lengthdir_y",[E.get("spd"),E.get("direction")])));
E.call("layer_add_instance",["floor",E.get("id")]);
E.set("depth",(E.get("depth") + 1));
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("pshootable")]))){
for(const __target1 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("pshootable")]))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",7);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
E.call("instance_destroy",[]);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oCar")]))){
for(const __target2 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("oCar")]))){const E2=E.withSelf(__target2);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
E.call("instance_destroy",[]);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oCar49")]))){
for(const __target3 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("oCar49")]))){const E2=E.withSelf(__target3);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oEnemyBig")]))){
for(const __target4 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("oEnemyBig")]))){const E2=E.withSelf(__target4);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
}
else {}
E.call("instance_destroy",[]);
}
else {}
if((E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("wall")])) && (E.get("image_index") != 0))){
while(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("wall")]))){E.tick();
{
E.set("x",(E.get("x") - E.call("lengthdir_x",[1,E.get("direction")])));
E.set("y",(E.get("y") - E.call("lengthdir_y",[1,E.get("direction")])));
}
}
E.set("spd",0);
E.call("instance_change",[E.get("oHitspark"),true]);
E.call("layer_add_instance",["floor",E.get("id")]);
E.set("depth",(E.get("depth") + 1));
}
else {}
}
,
"gml_Object_oBulletsLeft97_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"stocks",0);
E.put(E.get("global"),"killsthisroom",0);
E.set("killtextscale",1);
}
,
"gml_Object_oBulletsLeft97_Draw_64":function(E){
if(E.truthy(E.call("instance_exists",[E.get("oshoppingstocks")]))){
E.declare("cam",E.index(E.get("view_camera"),0));
E.declare("sx",(E.call("display_get_gui_width",[]) / E.call("camera_get_view_width",[E.get("cam")])));
E.declare("sy",(E.call("display_get_gui_height",[]) / E.call("camera_get_view_height",[E.get("cam")])));
E.call("DrawSetText",[E.get("c_black"),E.get("fsign"),E.get("fa_center"),E.get("fa_top")]);
E.call("draw_text",[(((E.member(E.get("oshoppingstocks"),"x") + 277) - E.call("camera_get_view_x",[E.get("cam")])) * E.get("sx")),(((E.member(E.get("oshoppingstocks"),"y") + 335) - E.call("camera_get_view_y",[E.get("cam")])) * E.get("sy")),("Stocks: $ " + E.call("string",[E.member(E.get("global"),"stocks")]))]);
}
else {}
}
,
"gml_Object_oBulletsLeft97_Other_4":function(E){
E.put(E.get("global"),"killsthisroom",0);
}
,
"gml_Object_oBulletsLeft97_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oBulletsLeftGreen_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"killsgreen",0);
E.set("killtextscale",1);
}
,
"gml_Object_oBulletsLeftGreen_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,1,2,0]);
E.call("draw_set_colour",[E.get("c_lime")]);
E.call("draw_text_transformed",[1014,50,("+ $ " + E.call("string",[E.member(E.get("global"),"killsgreen")])),E.get("killtextscale"),E.get("killtextscale"),0]);
if((E.member(E.get("global"),"greentimer") <= (-5))){
E.call("instance_destroy",[]);
}
else {}
}
else {}
}
,
"gml_Object_oBulletsLeftGreen_Other_4":function(E){
E.put(E.get("global"),"killsthisroom",0);
}
,
"gml_Object_oBulletsLeftGreen_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oBulletsLeftRed_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"killsred",0);
E.set("killtextscale",1);
}
,
"gml_Object_oBulletsLeftRed_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,1,2,0]);
E.call("draw_set_colour",[E.get("c_red")]);
E.call("draw_text_transformed",[1014,50,E.call("string",[E.member(E.get("global"),"killsred")]),E.get("killtextscale"),E.get("killtextscale"),0]);
}
else {}
}
,
"gml_Object_oBulletsLeftRed_Other_4":function(E){
E.put(E.get("global"),"killsthisroom",0);
}
,
"gml_Object_oBulletsLeftRed_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oBulletsLeft_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"kills",0);
E.put(E.get("global"),"killsthisroom",0);
E.set("killtextscale",1);
}
,
"gml_Object_oBulletsLeft_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,1,2,0]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_text_transformed",[1014,10,("$ " + E.call("string",[E.member(E.get("global"),"kills")])),E.get("killtextscale"),E.get("killtextscale"),0]);
}
else {}
}
,
"gml_Object_oBulletsLeft_Other_4":function(E){
E.put(E.get("global"),"killsthisroom",0);
}
,
"gml_Object_oBulletsLeft_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oBulletsammo_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"ammo",0);
E.put(E.get("global"),"killsthisroom",0);
E.set("killtextscale",1);
}
,
"gml_Object_oBulletsammo_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,1,2,0]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_text_transformed",[188,45,(E.call("string",[E.member(E.get("global"),"ammo")]) + " ammo"),E.get("killtextscale"),E.get("killtextscale"),0]);
if((E.member(E.get("global"),"ammo") == 0)){
E.call("draw_text",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"no more bullets"]);
}
else {}
}
else {}
}
,
"gml_Object_oBulletsammo_Other_4":function(E){
E.put(E.get("global"),"killsthisroom",0);
}
,
"gml_Object_oBulletsammo_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButton1Stock_Alarm_1":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-1),1]))));
E.call("alarm_set",[1,10]);
}
,
"gml_Object_oButton1Stock_Alarm_2":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-1),1]))));
E.call("alarm_set",[2,10]);
}
,
"gml_Object_oButton1Stock_Alarm_3":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-1),1]))));
E.call("alarm_set",[3,10]);
}
,
"gml_Object_oButton1Stock_Alarm_4":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-1),1]))));
E.call("alarm_set",[4,10]);
}
,
"gml_Object_oButton1Stock_Alarm_5":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-1),1]))));
E.call("alarm_set",[5,10]);
}
,
"gml_Object_oButton1Stock_Alarm_6":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-1),1]))));
E.call("alarm_set",[6,10]);
}
,
"gml_Object_oButton1Stock_Alarm_7":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-1),1]))));
E.call("alarm_set",[7,10]);
}
,
"gml_Object_oButton1Stock_Alarm_8":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-1),1]))));
E.call("alarm_set",[8,10]);
}
,
"gml_Object_oButton1Stock_Collision_Object1":function(E){
}
,
"gml_Object_oButton1Stock_Create_0":function(E){
if((E.member(E.get("global"),"stocks") > 1)){
E.putIndex(E.ensureArray("alarm"),1,30);
}
else {}
if((E.member(E.get("global"),"stocks") > 100)){
E.putIndex(E.ensureArray("alarm"),2,30);
}
else {}
if((E.member(E.get("global"),"stocks") > 200)){
E.putIndex(E.ensureArray("alarm"),3,30);
}
else {}
if((E.member(E.get("global"),"stocks") > 300)){
E.putIndex(E.ensureArray("alarm"),4,30);
}
else {}
if((E.member(E.get("global"),"stocks") > 400)){
E.putIndex(E.ensureArray("alarm"),5,30);
}
else {}
if((E.member(E.get("global"),"stocks") > 500)){
E.putIndex(E.ensureArray("alarm"),6,30);
}
else {}
if((E.member(E.get("global"),"stocks") > 600)){
E.putIndex(E.ensureArray("alarm"),7,30);
}
else {}
if((E.member(E.get("global"),"stocks") > 700)){
E.putIndex(E.ensureArray("alarm"),8,30);
}
else {}
}
,
"gml_Object_oButton1Stock_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButton1Stock_Step_0":function(E){
E.set("visible",E.call("instance_exists",[E.get("oshoppingstocks")]));
if((!E.truthy(E.get("visible")))){
return ;
}
else {}
E.set("x",(E.member(E.get("oshoppingstocks"),"x") + 120));
E.set("y",(E.member(E.get("oshoppingstocks"),"y") + 450));
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"kills") >= 100))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") - 100));
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + 100));
E.putIndex(E.ensureArray("alarm"),1,30);
}
else if((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"kills") < 100)) && (!E.truthy(E.call("instance_exists",[E.get("oDanielText2")]))))){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),(E.member(E.get("Object1"),"y") - 85),E.get("layer"),E.get("oDanielText2")]);
}
else {}

if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"stocks") > 100))){
E.putIndex(E.ensureArray("alarm"),2,30);
}
else {}
if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"stocks") > 200))){
E.putIndex(E.ensureArray("alarm"),3,30);
}
else {}
if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"stocks") > 300))){
E.putIndex(E.ensureArray("alarm"),4,30);
}
else {}
if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"stocks") > 400))){
E.putIndex(E.ensureArray("alarm"),5,30);
}
else {}
if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"stocks") > 500))){
E.putIndex(E.ensureArray("alarm"),6,30);
}
else {}
if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"stocks") > 600))){
E.putIndex(E.ensureArray("alarm"),7,30);
}
else {}
if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"stocks") > 700))){
E.putIndex(E.ensureArray("alarm"),8,30);
}
else {}
}
,
"gml_Object_oButton1_Collision_Object1":function(E){
}
,
"gml_Object_oButton1_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButton1_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
if((E.member(E.get("global"),"kills") >= 50)){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") - 50));
E.put(E.get("global"),"bullets",(E.member(E.get("global"),"bullets") + 1));
}
else if((!E.truthy(E.call("instance_exists",[E.get("oDanielText2")])))){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),(E.member(E.get("Object1"),"y") - 85),E.get("layer"),E.get("oDanielText2")]);
}
else {}

}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 130));
E.set("y",(E.member(E.get("Object1"),"y") - 100));
}
,
"gml_Object_oButton2Stock_Alarm_1":function(E){
E.put(E.get("global"),"stocks",0);
E.call("alarm_set",[1,0]);
}
,
"gml_Object_oButton2Stock_Collision_Object1":function(E){
}
,
"gml_Object_oButton2Stock_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButton2Stock_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 350));
E.set("y",(E.member(E.get("Object1"),"y") - 100));
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"stocks") != 0))){
E.call("audio_play_sound",[E.get("chaching"),4,false]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + E.member(E.get("global"),"stocks")));
E.put(E.get("global"),"stocks",0);
E.put(E.get("global"),"stocks",E.call("max",[0]));
E.put(E.get("global"),"stocksdown",0);
E.call("instance_destroy",[E.get("oButton1Stock")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 200),(E.member(E.get("Object1"),"y") - 100),E.get("layer"),E.get("oButton1Stock")]);
}
else {}
}
,
"gml_Object_oButton2_Collision_Object1":function(E){
}
,
"gml_Object_oButton2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButton2_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
if((E.member(E.get("global"),"kills") >= 100)){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") - 100));
E.put(E.get("global"),"ammo",(E.member(E.get("global"),"ammo") + 100));
}
else if((!E.truthy(E.call("instance_exists",[E.get("oDanielText2")])))){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),(E.member(E.get("Object1"),"y") - 85),E.get("layer"),E.get("oDanielText2")]);
}
else {}

}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 274));
E.set("y",(E.member(E.get("Object1"),"y") - 100));
}
,
"gml_Object_oButton3Stock_Collision_Object1":function(E){
}
,
"gml_Object_oButton3Stock_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButton3Stock_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") - 10));
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 400));
E.set("y",(E.member(E.get("Object1"),"y") - 100));
}
,
"gml_Object_oButton3_Collision_Object1":function(E){
}
,
"gml_Object_oButton3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButton3_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
if((E.member(E.get("global"),"quest2") == 1)){
return ;
}
else {}
if((E.member(E.get("global"),"kills") >= 3000)){
E.call("audio_play_sound",[E.get("chaching"),4,false]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") - 3000));
E.put(E.get("global"),"quest2",1);
}
else if((!E.truthy(E.call("instance_exists",[E.get("oDanielText2")])))){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),(E.member(E.get("Object1"),"y") - 85),E.get("layer"),E.get("oDanielText2")]);
}
else {}

}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 415));
E.set("y",(E.member(E.get("Object1"),"y") - 100));
}
,
"gml_Object_oButton3rd_Collision_Object1":function(E){
}
,
"gml_Object_oButton3rd_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButton3rd_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
if((!E.truthy(E.call("instance_exists",[E.get("oButton1Stock")])))){
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 200),(E.member(E.get("Object1"),"y") - 100),"buttons",E.get("oButton1Stock")]);
}
else {
E.put(E.get("oButton1Stock"),"x",(E.member(E.get("Object1"),"x") + 200));
E.put(E.get("oButton1Stock"),"y",(E.member(E.get("Object1"),"y") - 100));
E.put(E.get("oButton1Stock"),"visible",true);
}

E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 300),(E.member(E.get("Object1"),"y") - 100),"buttons",E.get("oButton2Stock")]);
E.call("instance_destroy",[E.get("oButton4th")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"computerbackgrounds",E.get("oshoppingstocks")]);
E.call("instance_destroy",[E.get("oButton3rd")]);
E.call("instance_destroy",[E.get("oshopping2")]);
E.call("instance_destroy",[E.get("oButtonAmazon")]);
E.call("instance_destroy",[E.get("oButtonMail")]);
E.call("layer_set_visible",["specialbutton",E.get("visible")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),E.member(E.get("Object1"),"y"),"mailboxbuttons",E.get("oButtongoback")]);
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 255));
E.set("y",(E.member(E.get("Object1"),"y") - 7));
}
,
"gml_Object_oButton4th_Collision_Object1":function(E){
}
,
"gml_Object_oButton4th_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButton4th_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"computerbackgrounds",E.get("oshoppingyoutube")]);
E.call("instance_destroy",[E.get("oButton3rd")]);
E.call("instance_destroy",[E.get("oButton4th")]);
E.call("instance_destroy",[E.get("oshopping2")]);
E.call("instance_destroy",[E.get("oButtonAmazon")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 255),(E.member(E.get("Object1"),"y") - 7),"mailboxbuttons",E.get("oButtonYoutube")]);
E.call("instance_destroy",[E.get("oButtonMail")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),(E.member(E.get("Object1"),"y") - 7),"mailboxbuttons",E.get("oButtongoback")]);
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 255));
E.set("y",(E.member(E.get("Object1"),"y") - 154));
}
,
"gml_Object_oButtonAmazon_Collision_Object1":function(E){
}
,
"gml_Object_oButtonAmazon_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButtonAmazon_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 200),(E.member(E.get("Object1"),"y") - 100),"buttons",E.get("oButton1")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 300),(E.member(E.get("Object1"),"y") - 100),"buttons",E.get("oButton2")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 333),(E.member(E.get("Object1"),"y") - 100),"buttons",E.get("oButton3")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),E.member(E.get("Object1"),"y"),"mailboxbuttons",E.get("oButtongoback")]);
E.call("instance_destroy",[E.get("oButtonAmazon")]);
E.call("instance_destroy",[E.get("oButtonMail")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"computerbackgrounds",E.get("oshopping3")]);
E.call("instance_destroy",[E.get("oshopping2")]);
E.call("instance_destroy",[E.get("oButton3rd")]);
E.call("instance_destroy",[E.get("oButton4th")]);
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 455));
E.set("y",(E.member(E.get("Object1"),"y") - 154));
}
,
"gml_Object_oButtonMail_Collision_Object1":function(E){
}
,
"gml_Object_oButtonMail_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButtonMail_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"mailinbox",E.get("oshoppingmail")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),(E.member(E.get("Object1"),"y") - 7),"gobackbutton",E.get("oButtongoback")]);
E.call("instance_destroy",[E.get("oButton3rd")]);
E.call("instance_destroy",[E.get("oButton4th")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 380),(E.member(E.get("Object1"),"y") - 220),"mailboxbuttons",E.get("oButtoninbox1")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 380),(E.member(E.get("Object1"),"y") - 170),"mailboxbuttons",E.get("oButtoninbox2")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 380),(E.member(E.get("Object1"),"y") - 120),"mailboxbuttons",E.get("oButtoninbox3")]);
E.call("instance_destroy",[E.get("oButton1")]);
E.call("instance_destroy",[E.get("oButton2")]);
E.call("instance_destroy",[E.get("oButton3")]);
if((E.member(E.get("global"),"messageread") == 1)){
E.call("instance_create_layer",[E.get("x"),E.get("y"),"gobackbutton",E.get("oMessageRead")]);
}
else {}
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 455));
E.set("y",(E.member(E.get("Object1"),"y") - 7));
}
,
"gml_Object_oButtonOff_Collision_Object1":function(E){
}
,
"gml_Object_oButtonOff_Create_0":function(E){
if((!E.truthy(E.call("instance_exists",[E.get("oshopping2")])))){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oButtonOff_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButtonOff_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
if((E.member(E.get("global"),"hascontrol") == 0)){
E.call("layer_set_visible",["quests",E.get("visible")]);
E.call("instance_destroy",[E.get("oshopping2")]);
E.call("instance_destroy",[E.get("oButton1")]);
E.call("instance_destroy",[E.get("oButton2")]);
E.call("instance_destroy",[E.get("oButton3")]);
E.call("instance_destroy",[E.get("oButtonMail")]);
E.call("instance_destroy",[E.get("oText2")]);
E.put(E.get("global"),"hascontrol",1);
E.call("layer_set_visible",["gun",E.get("visible")]);
E.call("instance_destroy",[E.get("oMessageRead")]);
E.call("instance_destroy",[E.get("oButtonAmazon")]);
E.call("instance_destroy",[E.get("oshopping3")]);
E.call("instance_destroy",[E.get("oshoppinginbox")]);
E.call("instance_destroy",[E.get("oButtoninbox1")]);
E.call("instance_destroy",[E.get("oButtoninbox2")]);
E.call("instance_destroy",[E.get("oButtoninbox3")]);
E.call("instance_destroy",[E.get("computerbottom")]);
E.call("instance_destroy",[E.get("oButtonOff")]);
E.call("instance_destroy",[E.get("oButtongoback2")]);
E.call("instance_destroy",[E.get("oButtongoback")]);
E.call("instance_destroy",[E.get("oshoppingmail")]);
E.call("instance_destroy",[E.get("oButton3rd")]);
E.call("instance_destroy",[E.get("oButton4th")]);
E.call("instance_destroy",[E.get("oshoppingyoutube")]);
E.call("instance_destroy",[E.get("oButtonYoutube")]);
if(E.truthy(E.call("instance_exists",[E.get("oButton1Stock")]))){
E.put(E.get("oButton1Stock"),"y",(E.member(E.get("Object1"),"y") - 1000));
E.put(E.get("oButton1Stock"),"visible",false);
}
else {}
E.put(E.get("oBulletsLeft97"),"y",(E.member(E.get("Object1"),"y") - 1000));
if((!E.truthy(E.call("instance_exists",[E.get("oshopping2")])))){
E.call("instance_destroy",[]);
}
else {}
E.call("instance_destroy",[E.get("oButton2Stock")]);
E.call("instance_destroy",[E.get("oButton3Stock")]);
E.call("instance_destroy",[E.get("oshoppingstocks")]);
E.call("layer_set_visible",["specialbutton",(!E.truthy(E.get("visible")))]);
E.call("instance_destroy",[E.get("oshoppinginbox")]);
E.call("instance_destroy",[E.get("oshoppinginbox2")]);
E.call("instance_destroy",[E.get("oshoppinginbox3")]);
E.call("instance_destroy",[E.get("oDanielText2")]);
E.call("instance_destroy",[E.get("oText2")]);
E.call("instance_destroy",[E.get("oText3")]);
E.call("instance_destroy",[E.get("oText4")]);
E.call("instance_destroy",[]);
}
else {}
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 489));
E.set("y",(E.member(E.get("Object1"),"y") + 190));
}
,
"gml_Object_oButtonOff_Step_2":function(E){
}
,
"gml_Object_oButtonYoutube_Collision_Object1":function(E){
}
,
"gml_Object_oButtonYoutube_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButtonYoutube_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if(((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"tapes") > 0))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.put(E.get("global"),"tapes",(E.member(E.get("global"),"tapes") - 1));
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + E.call("random_range",[25,100])));
E.call("instance_destroy",[E.get("oButtongoback2")]);
E.call("audio_play_sound",[E.get("chaching"),4,false]);
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 255));
E.set("y",(E.member(E.get("Object1"),"y") - 7));
}
,
"gml_Object_oButtongoback2_Collision_Object1":function(E){
}
,
"gml_Object_oButtongoback2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButtongoback2_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
if((E.member(E.get("global"),"messageread") == 1)){
E.call("instance_create_layer",[E.get("x"),E.get("y"),"gobackbutton",E.get("oMessageRead")]);
}
else {}
E.call("instance_destroy",[E.get("oshoppinginbox")]);
E.call("instance_destroy",[E.get("oshoppinginbox2")]);
E.call("instance_destroy",[E.get("oshoppinginbox3")]);
E.call("instance_destroy",[E.get("oButton1")]);
E.call("instance_destroy",[E.get("oButton2")]);
E.call("instance_destroy",[E.get("oButton3")]);
E.call("instance_destroy",[E.get("oButtongoback2")]);
E.call("instance_destroy",[E.get("oText2")]);
E.call("instance_destroy",[E.get("oText3")]);
E.call("instance_destroy",[E.get("oText4")]);
E.call("instance_destroy",[E.get("oDanielText2")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),(E.member(E.get("Object1"),"y") - 7),"gobackbutton",E.get("oButtongoback")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"mailinbox",E.get("oshoppingmail")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 380),(E.member(E.get("Object1"),"y") - 220),"mailboxbuttons",E.get("oButtoninbox1")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 380),(E.member(E.get("Object1"),"y") - 170),"mailboxbuttons",E.get("oButtoninbox2")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 380),(E.member(E.get("Object1"),"y") - 120),"mailboxbuttons",E.get("oButtoninbox3")]);
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 255));
E.set("y",(E.member(E.get("Object1"),"y") - 7));
}
,
"gml_Object_oButtongoback_Alarm_1":function(E){
E.put(E.get("global"),"stocks",(E.member(E.get("global"),"stocks") + (-E.call("random_range",[(-10),10]))));
E.call("alarm_set",[1,90]);
}
,
"gml_Object_oButtongoback_Collision_Object1":function(E){
}
,
"gml_Object_oButtongoback_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButtongoback_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"computerbackgrounds",E.get("oshopping2")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),E.member(E.get("Object1"),"y"),"buttons",E.get("oButtonMail")]);
E.call("instance_destroy",[E.get("oshoppingmail")]);
E.call("instance_destroy",[E.get("oButtongoback")]);
E.call("instance_destroy",[E.get("oButtongoback2")]);
E.call("instance_destroy",[E.get("oButton1")]);
E.call("instance_destroy",[E.get("oButton2")]);
E.call("instance_destroy",[E.get("oButton3")]);
E.call("instance_destroy",[]);
E.call("instance_destroy",[E.get("oButton2Stock")]);
E.call("instance_destroy",[E.get("oButton3Stock")]);
E.call("instance_destroy",[E.get("oButton1")]);
E.call("instance_destroy",[E.get("oButton2")]);
E.call("instance_destroy",[E.get("oButton3")]);
E.call("instance_destroy",[E.get("oButtoninbox1")]);
E.call("instance_destroy",[E.get("oButtoninbox2")]);
E.call("instance_destroy",[E.get("oButtoninbox3")]);
if(E.truthy(E.call("instance_exists",[E.get("oMessageRead")]))){
E.call("instance_destroy",[E.get("oMessageRead")]);
}
else {}
E.call("instance_destroy",[E.get("oshoppinginbox")]);
E.call("instance_destroy",[E.get("oshoppinginbox2")]);
E.call("instance_destroy",[E.get("oshoppinginbox3")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),(E.member(E.get("Object1"),"y") - 147),"buttons",E.get("oButtonAmazon")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 255),E.member(E.get("Object1"),"y"),"buttons",E.get("oButton3rd")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 255),(E.member(E.get("Object1"),"y") - 147),"buttons",E.get("oButton4th")]);
E.call("instance_destroy",[E.get("oshopping3")]);
E.call("instance_destroy",[E.get("oButtonYoutube")]);
E.call("instance_destroy",[E.get("oshoppingstocks")]);
E.call("instance_destroy",[E.get("oshoppingyoutube")]);
E.call("instance_destroy",[E.get("oText2")]);
E.call("instance_destroy",[E.get("oText3")]);
E.call("instance_destroy",[E.get("oText4")]);
E.call("instance_destroy",[E.get("oDanielText2")]);
if(E.truthy(E.call("instance_exists",[E.get("oButton1Stock")]))){
E.put(E.get("oButton1Stock"),"y",(E.member(E.get("Object1"),"y") - 1000));
E.put(E.get("oButton1Stock"),"visible",false);
}
else {}
E.call("layer_set_visible",["specialbutton",(!E.truthy(E.get("visible")))]);
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 455));
E.set("y",(E.member(E.get("Object1"),"y") - 7));
}
,
"gml_Object_oButtoninbox1_Collision_Object1":function(E){
}
,
"gml_Object_oButtoninbox1_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButtoninbox1_Step_0":function(E){
E.put(E.get("global"),"messageread",0);
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"mailinboxopen",E.get("oshoppinginbox")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),(E.member(E.get("Object1"),"y") - 7),"gobackbutton2",E.get("oButtongoback2")]);
E.call("instance_create_layer",[E.get("x"),(E.member(E.get("Object1"),"y") - 200),"gobackbutton",E.get("oText2")]);
E.put(E.get("global"),"newmail",0);
E.call("instance_destroy",[E.get("oButtoninbox1")]);
E.call("instance_destroy",[E.get("oButtoninbox2")]);
E.call("instance_destroy",[E.get("oButtoninbox3")]);
E.call("instance_destroy",[E.get("oButton1")]);
E.call("instance_destroy",[E.get("oButton2")]);
E.call("instance_destroy",[E.get("oButton3")]);
E.put(E.get("global"),"messageread",1);
if((!E.truthy(E.call("instance_exists",[E.get("oQuestObjectives2")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),"quests",E.get("oQuestObjectives2")]);
for(const __target1 of E.targets(E.get("oQuestObjectives2"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("killtextscale",2);
}
}}
E.put(E.get("global"),"pcclickedon",true);
E.put(E.get("global"),"hasquest1",1);
}
else {}
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 360));
E.set("y",(E.member(E.get("Object1"),"y") - 220));
}
,
"gml_Object_oButtoninbox2_Collision_Object1":function(E){
}
,
"gml_Object_oButtoninbox2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButtoninbox2_Step_0":function(E){
E.put(E.get("global"),"messageread1",0);
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"mailinboxopen",E.get("oshoppinginbox2")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),(E.member(E.get("Object1"),"y") - 7),"gobackbutton2",E.get("oButtongoback2")]);
E.call("instance_create_layer",[E.get("x"),(E.member(E.get("Object1"),"y") - 200),"gobackbutton",E.get("oText3")]);
E.put(E.get("global"),"newmail",0);
E.call("instance_destroy",[E.get("oButtoninbox1")]);
E.call("instance_destroy",[E.get("oButtoninbox2")]);
E.call("instance_destroy",[E.get("oButtoninbox3")]);
E.call("instance_destroy",[E.get("oButton1")]);
E.call("instance_destroy",[E.get("oButton2")]);
E.call("instance_destroy",[E.get("oButton3")]);
E.put(E.get("global"),"messageread1",1);
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 360));
E.set("y",(E.member(E.get("Object1"),"y") - 170));
}
,
"gml_Object_oButtoninbox3_Collision_Object1":function(E){
}
,
"gml_Object_oButtoninbox3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oButtoninbox3_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"mailinboxopen",E.get("oshoppinginbox3")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),(E.member(E.get("Object1"),"y") - 7),"gobackbutton2",E.get("oButtongoback2")]);
E.call("instance_create_layer",[E.get("x"),(E.member(E.get("Object1"),"y") - 200),"gobackbutton",E.get("oText4")]);
E.put(E.get("global"),"newmail",0);
E.call("instance_destroy",[E.get("oButtoninbox1")]);
E.call("instance_destroy",[E.get("oButtoninbox2")]);
E.call("instance_destroy",[E.get("oButtoninbox3")]);
E.call("instance_destroy",[E.get("oButton1")]);
E.call("instance_destroy",[E.get("oButton2")]);
E.call("instance_destroy",[E.get("oButton3")]);
if((E.member(E.get("global"),"takenallowance") == 0)){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oBulletsLeftGreen")]);
E.put(E.get("global"),"greentimer",0);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + 500));
E.put(E.get("global"),"killsgreen",(E.member(E.get("global"),"killsgreen") + 500));
for(const __target1 of E.targets(E.get("oBulletsLeftGreen"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("killtextscale",23);
}
}}
E.call("audio_play_sound",[E.get("chaching"),1,false]);
E.put(E.get("global"),"takenallowance",1);
}
else {}
E.call("instance_destroy",[]);
}
else {}
E.set("x",(E.member(E.get("Object1"),"x") + 360));
E.set("y",(E.member(E.get("Object1"),"y") - 120));
}
,
"gml_Object_oCamera_Create_0":function(E){
E.set("cam",E.index(E.get("view_camera"),0));
E.set("follow",136);
E.set("view_w_half",(E.call("camera_get_view_width",[E.get("cam")]) * 0.5));
E.set("view_h_half",(E.call("camera_get_view_height",[E.get("cam")]) * 0.5));
E.set("xTo",E.get("xstart"));
E.set("yTo",E.get("ystart"));
E.set("shake_length",0);
E.set("shake_magnitude",0);
E.set("shake_remain",0);
E.set("buff",32);
}
,
"gml_Object_oCamera_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oCamera_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("follow")]))){
E.set("xTo",E.member(E.get("follow"),"x"));
E.set("yTo",E.member(E.get("follow"),"y"));
if((E.member(E.get("follow"),"object_index") == E.get("Object1"))){
E.set("x",E.get("xTo"));
E.set("y",E.get("yTo"));
}
else {}
}
else {}
E.set("x",(E.get("x") + ((E.get("xTo") - E.get("x")) / 25)));
E.set("y",(E.get("y") + ((E.get("yTo") - E.get("y")) / 25)));
E.set("x",E.call("clamp",[E.get("x"),(E.get("view_w_half") + E.get("buff")),((E.get("room_width") - E.get("view_w_half")) - E.get("buff"))]));
E.set("y",E.call("clamp",[E.get("y"),(E.get("view_h_half") + E.get("buff")),((E.get("room_height") - E.get("view_h_half")) - E.get("buff"))]));
E.set("x",(E.get("x") + E.call("random_range",[(-E.get("shake_remain")),E.get("shake_remain")])));
E.set("y",(E.get("y") + E.call("random_range",[(-E.get("shake_remain")),E.get("shake_remain")])));
E.set("shake_remain",E.call("max",[0,(E.get("shake_remain") - ((1 / E.get("shake_length")) * E.get("shake_magnitude")))]));
E.call("camera_set_view_pos",[E.get("cam"),(E.get("x") - E.get("view_w_half")),(E.get("y") - E.get("view_h_half"))]);
if(E.truthy(E.call("layer_exists",["mountains"]))){
E.call("layer_x",["mountains",(E.get("x") / 4)]);
}
else {}
if(E.truthy(E.call("layer_exists",["trees"]))){
E.call("layer_x",["trees",(E.get("x") / 4)]);
}
else {}
if(E.truthy(E.call("layer_exists",["trees2"]))){
E.call("layer_x",["trees",(E.get("x") / 2)]);
}
else {}
if(E.truthy(E.call("layer_exists",["stars_1"]))){
E.call("layer_x",["stars_1",(E.get("x") / 1)]);
}
else {}
}
,
"gml_Object_oCar49_Create_0":function(E){
E.set("hp",3);
E.set("flash",3);
E.set("grv",0.3);
E.set("vsp",0);
E.set("hsp",0);
}
,
"gml_Object_oCar49_Draw_0":function(E){
E.call("draw_self",[]);
if((E.get("flash") > 0)){
E.set("flash",(E.get("flash") - 1));
E.call("shader_set",[E.get("shWhite")]);
E.call("draw_self",[]);
E.call("shader_reset",[]);
}
else {}
}
,
"gml_Object_oCar49_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oCar49_Step_0":function(E){
if((E.get("hp") <= 0)){
E.declare("remains",E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oCarDead49")]));
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oExplosion")]);
for(const __target1 of E.targets(E.get("remains"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("direction",E.member(E.get("other"),"hitfrom"));
E.set("hsp",E.call("lengthdir_x",[3,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[3,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
}
}}
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oCar49_Step_1":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("oDoor")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
}
,
"gml_Object_oCarDead49_Collision_oBullet":function(E){
}
,
"gml_Object_oCarDead49_Collision_oDoor":function(E){
E.set("hspeed",(-E.get("hspeed")));
}
,
"gml_Object_oCarDead49_Create_0":function(E){
E.set("hsp",(0 + E.call("random_range",[(-5),3])));
E.set("vsp",((-3) + E.call("random_range",[(-6),1])));
E.set("grv",0.3);
E.set("done",0);
E.set("image_speed",0);
E.call("screenShake",[6,60]);
E.call("audio_play_sound",[E.get("explode"),2,false]);
}
,
"gml_Object_oCarDead49_Other_7":function(E){
}
,
"gml_Object_oCarDead49_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oCarDead49_Step_1":function(E){
if((E.get("done") == 0)){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
E.set("x",(E.get("x") - E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
if((E.get("vsp") > 0)){
E.set("done",1);
E.set("image_index",1);
}
else {}
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
E.call("audio_play_sound",[E.get("splash"),4,false]);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
}
else {}
}
,
"gml_Object_oCarDead_Collision_oBullet":function(E){
}
,
"gml_Object_oCarDead_Collision_oDoor":function(E){
E.set("hspeed",(-E.get("hspeed")));
}
,
"gml_Object_oCarDead_Create_0":function(E){
E.set("hsp",(0 + E.call("random_range",[(-5),3])));
E.set("vsp",((-3) + E.call("random_range",[(-6),1])));
E.set("grv",0.3);
E.set("done",0);
E.set("image_speed",0);
E.call("screenShake",[6,60]);
E.call("audio_play_sound",[E.get("explode"),2,false]);
}
,
"gml_Object_oCarDead_Other_7":function(E){
}
,
"gml_Object_oCarDead_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oCarDead_Step_1":function(E){
if((E.get("done") == 0)){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
E.set("x",(E.get("x") - E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
if((E.get("vsp") > 0)){
E.set("done",1);
E.set("image_index",1);
}
else {}
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
E.call("audio_play_sound",[E.get("splash"),4,false]);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
}
else {}
}
,
"gml_Object_oCar_Create_0":function(E){
E.set("hp",3);
E.set("flash",3);
E.set("grv",0.3);
E.set("vsp",0);
E.set("hsp",0);
}
,
"gml_Object_oCar_Draw_0":function(E){
E.call("draw_self",[]);
if((E.get("flash") > 0)){
E.set("flash",(E.get("flash") - 1));
E.call("shader_set",[E.get("shWhite")]);
E.call("draw_self",[]);
E.call("shader_reset",[]);
}
else {}
}
,
"gml_Object_oCar_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oCar_Step_0":function(E){
if((E.get("hp") <= 0)){
E.declare("remains",E.call("instance_create_layer",[E.get("x"),E.get("y"),"housematerials",E.get("oCarDead")]));
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oExplosion")]);
for(const __target1 of E.targets(E.get("remains"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("direction",E.member(E.get("other"),"hitfrom"));
E.set("hsp",E.call("lengthdir_x",[3,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[3,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
}
}}
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oCar_Step_1":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("oDoor")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
}
,
"gml_Object_oComputerDead_Collision_Object1":function(E){
}
,
"gml_Object_oComputerDead_Collision_oBullet":function(E){
E.set("direction",E.call("point_direction",[E.member(E.get("other"),"x"),E.member(E.get("other"),"y"),E.get("x"),E.get("y")]));
E.set("hspeed",E.call("lengthdir_x",[6,E.get("direction")]));
}
,
"gml_Object_oComputerDead_Create_0":function(E){
E.set("hspeed",(0 + E.call("random_range",[(-5),3])));
E.set("vspeed",((-3) + E.call("random_range",[(-6),1])));
E.set("grv",0.8);
E.set("done",0);
E.set("friction",0.1);
E.set("hitfrom",0);
E.set("image_speed",0);
E.call("screenShake",[6,60]);
E.call("audio_play_sound",[E.get("explode"),2,false]);
}
,
"gml_Object_oComputerDead_Other_7":function(E){
}
,
"gml_Object_oComputerDead_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oComputerDead_Step_1":function(E){
E.set("vspeed",(E.get("vspeed") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hspeed")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hspeed")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hspeed")])));
}
}
E.set("hspeed",(-E.get("hspeed")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hspeed")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hspeed")])),E.get("y"),E.get("oDoor")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hspeed")])));
}
}
E.set("hspeed",(-E.get("hspeed")));
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vspeed")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vspeed")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vspeed")])));
}
}
E.set("vspeed",0);
}
else {}
}
,
"gml_Object_oCrate2_Create_0":function(E){
}
,
"gml_Object_oCrate2_Destroy_0":function(E){
}
,
"gml_Object_oCrate2_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("vsp",0);
E.set("grv",0.3);
}
,
"gml_Object_oCrate2_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wallcustomer")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wallcustomer")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["E"])])) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),100])))){
E.put(E.get("global"),"killsgreen",0);
E.call("audio_play_sound",[E.get("chaching"),4,false]);
E.call("instance_destroy",[]);
E.call("instance_destroy",[E.get("oDanielText7")]);
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),(E.member(E.get("Object1"),"y") - 80),E.get("layer"),E.get("oDanielText7")]);
E.put(E.get("global"),"customer2spd",2);
E.put(E.get("global"),"customer2done",true);
}
else {}
}
,
"gml_Object_oCrate3_Create_0":function(E){
}
,
"gml_Object_oCrate3_Destroy_0":function(E){
}
,
"gml_Object_oCrate3_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("vsp",0);
E.set("grv",0.3);
}
,
"gml_Object_oCrate3_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wallcustomer")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wallcustomer")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["E"])])) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),100])))){
E.put(E.get("global"),"killsgreen",0);
E.call("audio_play_sound",[E.get("chaching"),4,false]);
E.call("instance_destroy",[]);
E.call("instance_destroy",[E.get("oDanielText7")]);
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),(E.member(E.get("Object1"),"y") - 80),E.get("layer"),E.get("oDanielText7")]);
E.put(E.get("global"),"customer3spd",2);
E.put(E.get("global"),"customer3done",true);
}
else {}
}
,
"gml_Object_oCrate_Create_0":function(E){
}
,
"gml_Object_oCrate_Destroy_0":function(E){
if((E.get("hp") == 0)){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oExplosion")]);
}
else {}
}
,
"gml_Object_oCrate_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("vsp",0);
E.set("grv",0.3);
}
,
"gml_Object_oCrate_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wallcustomer")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wallcustomer")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["E"])])) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),100])))){
E.put(E.get("global"),"killsgreen",0);
E.call("audio_play_sound",[E.get("chaching"),4,false]);
E.call("instance_destroy",[]);
if(E.truthy(E.call("instance_exists",[E.get("oDanielText7")]))){
E.call("instance_destroy",[E.get("oDanielText7")]);
}
else {}
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),(E.member(E.get("Object1"),"y") - 80),E.get("layer"),E.get("oDanielText7")]);
E.put(E.get("global"),"customer3spd",(E.member(E.get("global"),"customer3spd") - 2));
}
else {}
}
,
"gml_Object_oCrowdsound_Collision_Object1":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.call("audio_play_sound",[E.get("chargecrowd"),8,false]);
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oCrowdsound_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oCustoemrs2_Alarm_0":function(E){
E.put(E.get("global"),"greentimer",(E.member(E.get("global"),"greentimer") - 1));
E.call("alarm_set",[0,30]);
}
,
"gml_Object_oCustoemrs2_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oCustoemrs2_Collision_oSpring51":function(E){
E.set("vsp",E.call("random_range",[(-10),(-40)]));
E.call("audio_play_sound",[E.get("bedbounce"),4,false]);
}
,
"gml_Object_oCustoemrs2_Create_0":function(E){
E.set("size",E.call("random_range",[0.6,1]));
E.put(E.get("global"),"customer2spd",(-2));
E.put(E.get("global"),"customer2done",false);
if(E.truthy(E.get("hasweapon"))){
E.set("mygun",E.call("instance_create_layer",[E.get("x"),E.get("y"),"Gun",E.get("oEgun")]));
for(const __target1 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("owner",E.member(E.get("other"),"id"));
}
}}
}
else {
E.set("mygun",(-4));
}

}
,
"gml_Object_oCustoemrs2_Destroy_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("oSpawner")]))){
for(const __target1 of E.targets(E.get("oSpawner"))){const E2=E.withSelf(__target1);{const E=E2;{
if(E.truthy(E.get("triggered"))){
E.putIndex(E.ensureArray("remaining"),E.get("current_wave"),(E.index(E.get("remaining"),E.get("current_wave")) - 1));
}
else {}
}
}}
}
else {}
}
,
"gml_Object_oCustoemrs2_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("vsp",0);
E.set("grv",0.3);
E.set("walksp",3);
E.set("hitfrom",0);
E.set("afraidofheights",false);
E.set("grounded",false);
E.set("hasweapon",false);
}
,
"gml_Object_oCustoemrs2_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(((E.truthy(E.get("grounded")) && E.truthy(E.get("afraidofheights"))) && (!E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer2spd")),(E.get("y") + 1),E.get("wall")]))))){
E.put(E.get("global"),"customer2spd",(-E.member(E.get("global"),"customer2spd")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer2spd")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer2spd")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer2spd")])));
}
}
E.put(E.get("global"),"customer2spd",(-E.member(E.get("global"),"customer2spd")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer2spd")),E.get("y"),E.get("oCustoemrs")]))){
E.put(E.get("global"),"customer2spd",0);
}
else {}
E.set("x",(E.get("x") + E.member(E.get("global"),"customer2spd")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("playerwall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])))){
E.set("grounded",false);
E.set("sprite_index",E.get("enemyJump"));
E.set("image_speed",0);
if((E.call("sign",[E.get("vsp")]) > 0)){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

}
else {
E.set("grounded",true);
E.set("image_speed",1);
if((E.member(E.get("global"),"customer2spd") == 0)){
E.set("sprite_index",E.get("customerstand"));
}
else {
E.set("sprite_index",E.get("custoemrun"));
}

}

if((E.member(E.get("global"),"customer2spd") != 0)){
E.set("image_xscale",(E.call("sign",[E.member(E.get("global"),"customer2spd")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
if((E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oPetrolstationDoor153")])) && (!E.truthy(E.call("instance_exists",[E.get("oCustomerArea")]))))){
E.call("instance_destroy",[]);
}
else {}
if((E.member(E.get("global"),"customer2done") == true)){
E.put(E.get("global"),"customer2spd",2);
}
else {}
if((!E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oCustomerArea2")])))){
E.put(E.get("global"),"customer2spd",(-2));
}
else {
E.put(E.get("global"),"customer2spd",0);
}

if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oCustomerArea2")]))){
E.put(E.get("global"),"customer2spd",0);
}
else {}
if(E.truthy(E.call("instance_exists",[E.get("oCrate2")]))){
E.put(E.get("global"),"customer2spd",0);
}
else {}
if((E.member(E.get("global"),"customer2done") == true)){
E.put(E.get("global"),"customer2spd",2);
}
else {}
}
,
"gml_Object_oCustoemrs2_Step_1":function(E){
if((E.get("hp") <= 0)){
E.declare("remains",E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oDead")]));
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oEnemyBloodspatter")]);
for(const __target1 of E.targets(E.get("remains"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("direction",E.member(E.get("other"),"hitfrom"));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.member(E.get("global"),"customer2spd")]) != 0)){
E.set("image_xscale",E.call("sign",[E.member(E.get("global"),"customer2spd")]));
}
else {}
}
}}
for(const __target2 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target2);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oBulletsLeftGreen")]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + 0.2));
E.put(E.get("global"),"killsgreen",(E.member(E.get("global"),"killsgreen") + 0.2));
E.put(E.get("global"),"killsthisroom",(E.member(E.get("global"),"killsthisroom") + 0.2));
E.put(E.get("global"),"greentimer",0);
for(const __target3 of E.targets(E.get("oBulletsLeftGreen"))){const E2=E.withSelf(__target3);{const E=E2;{
E.set("killtextscale",3);
}
}}
E.putIndex(E.ensureArray("alarm"),0,30);
if((E.member(E.get("global"),"greentimer") == (-2))){
E.call("instance_destroy",[E.get("oBulletsLeftGreen")]);
}
else {}
if((E.member(E.get("global"),"greentimer") == (-1))){
E.put(E.get("global"),"greentimer",0);
E.putIndex(E.ensureArray("alarm"),0,(-1));
}
else {}
}
else {}
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oCustoemrs3_Alarm_0":function(E){
E.put(E.get("global"),"greentimer",(E.member(E.get("global"),"greentimer") - 1));
E.call("alarm_set",[0,30]);
}
,
"gml_Object_oCustoemrs3_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oCustoemrs3_Collision_oSpring51":function(E){
E.set("vsp",E.call("random_range",[(-10),(-40)]));
E.call("audio_play_sound",[E.get("bedbounce"),4,false]);
}
,
"gml_Object_oCustoemrs3_Create_0":function(E){
E.set("size",0.5);
E.put(E.get("global"),"customer3spd",(-2));
E.put(E.get("global"),"customer3done",false);
if(E.truthy(E.get("hasweapon"))){
E.set("mygun",E.call("instance_create_layer",[E.get("x"),E.get("y"),"Gun",E.get("oEgun")]));
for(const __target1 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("owner",E.member(E.get("other"),"id"));
}
}}
}
else {
E.set("mygun",(-4));
}

}
,
"gml_Object_oCustoemrs3_Destroy_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("oSpawner")]))){
for(const __target1 of E.targets(E.get("oSpawner"))){const E2=E.withSelf(__target1);{const E=E2;{
if(E.truthy(E.get("triggered"))){
E.putIndex(E.ensureArray("remaining"),E.get("current_wave"),(E.index(E.get("remaining"),E.get("current_wave")) - 1));
}
else {}
}
}}
}
else {}
}
,
"gml_Object_oCustoemrs3_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("vsp",0);
E.set("grv",0.3);
E.set("walksp",3);
E.set("hitfrom",0);
E.set("afraidofheights",false);
E.set("grounded",false);
E.set("hasweapon",false);
}
,
"gml_Object_oCustoemrs3_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(((E.truthy(E.get("grounded")) && E.truthy(E.get("afraidofheights"))) && (!E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer3spd")),(E.get("y") + 1),E.get("wall")]))))){
E.put(E.get("global"),"customer3spd",(-E.member(E.get("global"),"customer3spd")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer3spd")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer3spd")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer3spd")])));
}
}
E.put(E.get("global"),"customer3spd",(-E.member(E.get("global"),"customer3spd")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer3spd")),E.get("y"),E.get("oCustoemrs2")]))){
E.put(E.get("global"),"customer3spd",0);
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer3spd")),E.get("y"),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer3spd")])),E.get("y"),E.get("playerwall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer3spd")])));
}
}
E.put(E.get("global"),"customer3spd",(-E.member(E.get("global"),"customer3spd")));
}
else {}
E.set("x",(E.get("x") + E.member(E.get("global"),"customer3spd")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("playerwall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])))){
E.set("grounded",false);
E.set("sprite_index",E.get("enemyJump"));
E.set("image_speed",0);
if((E.call("sign",[E.get("vsp")]) > 0)){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

}
else {
E.set("grounded",true);
E.set("image_speed",1);
if((E.member(E.get("global"),"customer3spd") == 0)){
E.set("sprite_index",E.get("customerstand"));
}
else {
E.set("sprite_index",E.get("custoemrun"));
}

}

if((E.member(E.get("global"),"customer3spd") != 0)){
E.set("image_xscale",(E.call("sign",[E.member(E.get("global"),"customer3spd")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
if((E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oPetrolstationDoor153")])) && (!E.truthy(E.call("instance_exists",[E.get("oCustomerArea")]))))){
E.call("instance_destroy",[]);
}
else {}
if((E.member(E.get("global"),"customer3done") == true)){
E.put(E.get("global"),"customer3spd",2);
}
else {}
if((!E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oCustomerArea3")])))){
E.put(E.get("global"),"customer3spd",(-2));
}
else {
E.put(E.get("global"),"customer3spd",0);
}

if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oCustomerArea3")]))){
E.put(E.get("global"),"customer3spd",0);
}
else {}
if(E.truthy(E.call("instance_exists",[E.get("oCrate3")]))){
E.put(E.get("global"),"customer3spd",0);
}
else {}
if((E.member(E.get("global"),"customer3done") == true)){
E.put(E.get("global"),"customer3spd",2);
}
else {}
}
,
"gml_Object_oCustoemrs3_Step_1":function(E){
if((E.get("hp") <= 0)){
E.declare("remains",E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oDead")]));
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oEnemyBloodspatter")]);
for(const __target1 of E.targets(E.get("remains"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("direction",E.member(E.get("other"),"hitfrom"));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.member(E.get("global"),"customer2spd")]) != 0)){
E.set("image_xscale",E.call("sign",[E.member(E.get("global"),"customer2spd")]));
}
else {}
}
}}
for(const __target2 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target2);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oBulletsLeftGreen")]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + 0.2));
E.put(E.get("global"),"killsgreen",(E.member(E.get("global"),"killsgreen") + 0.2));
E.put(E.get("global"),"killsthisroom",(E.member(E.get("global"),"killsthisroom") + 0.2));
E.put(E.get("global"),"greentimer",0);
for(const __target3 of E.targets(E.get("oBulletsLeftGreen"))){const E2=E.withSelf(__target3);{const E=E2;{
E.set("killtextscale",3);
}
}}
E.putIndex(E.ensureArray("alarm"),0,30);
if((E.member(E.get("global"),"greentimer") == (-2))){
E.call("instance_destroy",[E.get("oBulletsLeftGreen")]);
}
else {}
if((E.member(E.get("global"),"greentimer") == (-1))){
E.put(E.get("global"),"greentimer",0);
E.putIndex(E.ensureArray("alarm"),0,(-1));
}
else {}
}
else {}
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oCustoemrs_Alarm_0":function(E){
E.put(E.get("global"),"greentimer",(E.member(E.get("global"),"greentimer") - 1));
E.call("alarm_set",[0,30]);
}
,
"gml_Object_oCustoemrs_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oCustoemrs_Collision_oSpring51":function(E){
E.set("vsp",E.call("random_range",[(-10),(-40)]));
E.call("audio_play_sound",[E.get("bedbounce"),4,false]);
}
,
"gml_Object_oCustoemrs_Create_0":function(E){
E.set("size",E.call("random_range",[0.6,1]));
E.put(E.get("global"),"customer1spd",(-2));
E.put(E.get("global"),"customer1done",false);
if(E.truthy(E.get("hasweapon"))){
E.set("mygun",E.call("instance_create_layer",[E.get("x"),E.get("y"),"Gun",E.get("oEgun")]));
for(const __target1 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("owner",E.member(E.get("other"),"id"));
}
}}
}
else {
E.set("mygun",(-4));
}

}
,
"gml_Object_oCustoemrs_Destroy_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("oSpawner")]))){
for(const __target1 of E.targets(E.get("oSpawner"))){const E2=E.withSelf(__target1);{const E=E2;{
if(E.truthy(E.get("triggered"))){
E.putIndex(E.ensureArray("remaining"),E.get("current_wave"),(E.index(E.get("remaining"),E.get("current_wave")) - 1));
}
else {}
}
}}
}
else {}
}
,
"gml_Object_oCustoemrs_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("vsp",0);
E.set("grv",0.3);
E.set("walksp",3);
E.set("hitfrom",0);
E.set("afraidofheights",false);
E.set("grounded",false);
E.set("hasweapon",false);
}
,
"gml_Object_oCustoemrs_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(((E.truthy(E.get("grounded")) && E.truthy(E.get("afraidofheights"))) && (!E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer1spd")),(E.get("y") + 1),E.get("wall")]))))){
E.put(E.get("global"),"customer1spd",(-E.member(E.get("global"),"customer1spd")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer1spd")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer1spd")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer1spd")])));
}
}
E.put(E.get("global"),"customer1spd",(-E.member(E.get("global"),"customer1spd")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer1spd")),E.get("y"),E.get("playerwallcustomer")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer1spd")])),E.get("y"),E.get("playerwallcustomer")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer1spd")])));
}
}
E.put(E.get("global"),"customer1spd",0);
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer1spd")),E.get("y"),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer1spd")])),E.get("y"),E.get("playerwall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer1spd")])));
}
}
E.put(E.get("global"),"customer1spd",(-E.member(E.get("global"),"customer1spd")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.member(E.get("global"),"customer1spd")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer1spd")])),E.get("y"),E.get("oDoor")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.member(E.get("global"),"customer1spd")])));
}
}
E.put(E.get("global"),"customer1spd",(-E.member(E.get("global"),"customer1spd")));
}
else {}
E.set("x",(E.get("x") + E.member(E.get("global"),"customer1spd")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("playerwall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])))){
E.set("grounded",false);
E.set("sprite_index",E.get("enemyJump"));
E.set("image_speed",0);
if((E.call("sign",[E.get("vsp")]) > 0)){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

}
else {
E.set("grounded",true);
E.set("image_speed",1);
if((E.member(E.get("global"),"customer1spd") == 0)){
E.set("sprite_index",E.get("customerstand"));
}
else {
E.set("sprite_index",E.get("custoemrun"));
}

}

if((E.member(E.get("global"),"customer1spd") != 0)){
E.set("image_xscale",(E.call("sign",[E.member(E.get("global"),"customer1spd")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
if(((!E.truthy(E.call("instance_exists",[E.get("oCrate")]))) && (!E.truthy(E.call("instance_exists",[E.get("oCustomerArea")]))))){
E.put(E.get("global"),"customer1spd",10);
}
else {}
if((E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oPetrolstationDoor153")])) && (!E.truthy(E.call("instance_exists",[E.get("oCustomerArea")]))))){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oCustoemrs_Step_1":function(E){
if((E.get("hp") <= 0)){
E.declare("remains",E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oDead")]));
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oEnemyBloodspatter")]);
for(const __target1 of E.targets(E.get("remains"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("direction",E.member(E.get("other"),"hitfrom"));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
}
}}
for(const __target2 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target2);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oBulletsLeftGreen")]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + 0.2));
E.put(E.get("global"),"killsgreen",(E.member(E.get("global"),"killsgreen") + 0.2));
E.put(E.get("global"),"killsthisroom",(E.member(E.get("global"),"killsthisroom") + 0.2));
E.put(E.get("global"),"greentimer",0);
for(const __target3 of E.targets(E.get("oBulletsLeftGreen"))){const E2=E.withSelf(__target3);{const E=E2;{
E.set("killtextscale",3);
}
}}
E.putIndex(E.ensureArray("alarm"),0,30);
if((E.member(E.get("global"),"greentimer") == (-2))){
E.call("instance_destroy",[E.get("oBulletsLeftGreen")]);
}
else {}
if((E.member(E.get("global"),"greentimer") == (-1))){
E.put(E.get("global"),"greentimer",0);
E.putIndex(E.ensureArray("alarm"),0,(-1));
}
else {}
}
else {}
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oCustomerArea2_Collision_oCustoemrs2":function(E){
E.call("instance_create_layer",[(E.get("x") + 20),(E.get("y") - 30),"stuff",E.get("oCrate2")]);
E.call("instance_destroy",[]);
E.put(E.get("global"),"customer2spd",0);
}
,
"gml_Object_oCustomerArea2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oCustomerArea3_Collision_oCustoemrs3":function(E){
E.call("instance_create_layer",[(E.get("x") + 20),(E.get("y") - 30),"stuff",E.get("oCrate3")]);
E.call("instance_destroy",[]);
if(E.truthy(E.call("instance_exists",[E.get("oCrate3")]))){
E.put(E.get("global"),"customer3spd",0);
}
else {}
}
,
"gml_Object_oCustomerArea3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oCustomerArea_Collision_oCustoemrs":function(E){
E.call("instance_create_layer",[(E.get("x") + 20),(E.get("y") - 30),"stuff",E.get("oCrate")]);
E.call("instance_destroy",[]);
if(E.truthy(E.call("instance_exists",[E.get("oCrate")]))){
E.put(E.get("global"),"customer1spd",0);
}
else {}
E.put(E.get("global"),"customer1done",true);
}
,
"gml_Object_oCustomerArea_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText1_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","no more grenades");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oDanielText1_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[0.5]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oDanielText1_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText1_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("Object1"),"x"));
E.set("y",(E.member(E.get("Object1"),"y") - 85));
}
else {
E.call("instance_destroy",[]);
}

E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oDanielText2_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","not enough money");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oDanielText2_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[0.5]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oDanielText2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText2_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("Object1"),"x"));
E.set("y",(E.member(E.get("Object1"),"y") - 85));
}
else {
E.call("instance_destroy",[]);
}

E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oDanielText3_Collision_Object1":function(E){
}
,
"gml_Object_oDanielText3_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","I cant believe i got up so high!");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oDanielText3_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[0.5]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oDanielText3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText3_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("Object1"),"x"));
E.set("y",(E.member(E.get("Object1"),"y") - 85));
}
else {}
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 55))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oDanielText4_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","i should save up some money\nto buy a ticket to japan!");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oDanielText4_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[0.5]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oDanielText4_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText4_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("Object1"),"x"));
E.set("y",(E.member(E.get("Object1"),"y") - 85));
}
else {
E.call("instance_destroy",[]);
}

E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oDanielText5_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","Game Saved.");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oDanielText5_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[0.5]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oDanielText5_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText5_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("Object1"),"x"));
E.set("y",(E.member(E.get("Object1"),"y") - 85));
}
else {
E.call("instance_destroy",[]);
}

E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oDanielText6_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","Press space to continue.");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oDanielText6_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oDanielText6_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText6_Step_0":function(E){
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((!E.truthy(E.call("instance_exists",[E.get("oPDead")])))){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oDanielText7_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text",("that will be $" + E.call("string",[E.call("random_range",[1,10])])));
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oDanielText7_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oDanielText7_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText7_Step_0":function(E){
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.member(E.get("global"),"greentimer") == (-5))){
E.call("instance_destroy",[]);
}
else {}
E.set("x",E.member(E.get("Object1"),"x"));
E.set("y",(E.member(E.get("Object1"),"y") - 80));
}
,
"gml_Object_oDanielText8_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","come back tomorrow");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oDanielText8_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oDanielText8_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText8_Step_0":function(E){
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.member(E.get("global"),"greentimer") == (-5))){
E.call("instance_destroy",[]);
}
else {}
E.set("x",(E.member(E.get("oJobSign"),"x") + 30));
E.set("y",(E.member(E.get("oJobSign"),"y") - 30));
}
,
"gml_Object_oDanielText_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","NEVER");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oDanielText_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[0.5]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oDanielText_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDanielText_Step_0":function(E){
E.set("x",E.member(E.get("Object1"),"x"));
E.set("y",(E.member(E.get("Object1"),"y") - 85));
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oDanielbaby115_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oDanielbaby115_Collision_oSpring51":function(E){
E.set("vsp",E.call("random_range",[(-10),(-40)]));
E.call("audio_play_sound",[E.get("bedbounce"),4,false]);
}
,
"gml_Object_oDanielbaby115_Create_0":function(E){
E.set("size",E.call("random_range",[0.5,0.7]));
E.set("hsp",E.call("random_range",[4,14]));
}
,
"gml_Object_oDanielbaby115_Destroy_0":function(E){
}
,
"gml_Object_oDanielbaby115_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("vsp",0);
E.set("grv",0.3);
E.set("walksp",3);
E.set("hitfrom",0);
E.set("afraidofheights",false);
E.set("grounded",false);
E.set("hasweapon",false);
}
,
"gml_Object_oDanielbaby115_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(((E.truthy(E.get("grounded")) && E.truthy(E.get("afraidofheights"))) && (!E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),(E.get("y") + 1),E.get("wall")]))))){
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("playerwall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("oDoor")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("playerwall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])))){
E.set("grounded",false);
E.set("sprite_index",E.get("car1"));
E.set("image_speed",0);
if((E.call("sign",[E.get("vsp")]) > 0)){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

}
else {
E.set("grounded",true);
E.set("image_speed",1);
if((E.get("hsp") == 0)){
E.set("sprite_index",E.get("car1"));
}
else {
E.set("sprite_index",E.get("car1"));
}

}

if((E.get("hsp") != 0)){
E.set("image_xscale",(E.call("sign",[E.get("hsp")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
}
,
"gml_Object_oDanielbaby115_Step_1":function(E){
}
,
"gml_Object_oDanielbaby_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oDanielbaby_Collision_oSpring51":function(E){
E.set("vsp",E.call("random_range",[(-10),(-40)]));
E.call("audio_play_sound",[E.get("bedbounce"),4,false]);
}
,
"gml_Object_oDanielbaby_Create_0":function(E){
E.set("size",E.call("random_range",[0.3,0.7]));
E.set("hsp",E.call("random_range",[3,8]));
}
,
"gml_Object_oDanielbaby_Destroy_0":function(E){
}
,
"gml_Object_oDanielbaby_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("vsp",0);
E.set("grv",0.3);
E.set("walksp",3);
E.set("hitfrom",0);
E.set("afraidofheights",false);
E.set("grounded",false);
E.set("hasweapon",false);
}
,
"gml_Object_oDanielbaby_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(((E.truthy(E.get("grounded")) && E.truthy(E.get("afraidofheights"))) && (!E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),(E.get("y") + 1),E.get("wall")]))))){
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wallcustomer")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wallcustomer")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
E.call("instance_create_layer",[E.member(E.get("wallcustomer"),"x"),(E.member(E.get("wallcustomer"),"y") - 200),E.get("layer"),E.get("oCrate")]);
if(E.truthy(E.call("instance_exists",[E.get("oCrate")]))){
E.call("instance_create_layer",[E.member(E.get("oCrate"),"x"),(E.member(E.get("oCrate"),"y") - 50),E.get("layer"),E.get("oCrate")]);
}
else {}
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("playerwall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("oDoor")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("playerwall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])))){
E.set("grounded",false);
E.set("sprite_index",E.get("danielJump"));
E.set("image_speed",0);
if((E.call("sign",[E.get("vsp")]) > 0)){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

}
else {
E.set("grounded",true);
E.set("image_speed",1);
if((E.get("hsp") == 0)){
E.set("sprite_index",E.get("daniel"));
}
else {
E.set("sprite_index",E.get("runningSprite"));
}

}

if((E.get("hsp") != 0)){
E.set("image_xscale",(E.call("sign",[E.get("hsp")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
}
,
"gml_Object_oDanielbaby_Step_1":function(E){
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("pshootable")]))){
for(const __target1 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("pshootable")]))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",7);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
}
else {}
}
,
"gml_Object_oDeadBig_Create_0":function(E){
E.set("hsp",(0 + E.call("random_range",[(-5),3])));
E.set("vsp",((-3) + E.call("random_range",[(-6),1])));
E.set("grv",0.3);
E.set("done",0);
E.set("size",E.call("random_range",[0.1,1]));
E.set("image_speed",0);
E.call("screenShake",[6,25]);
E.call("audio_play_sound",[E.call("choose",[E.get("fatguyfal")]),4,false]);
E.call("audio_play_sound",[E.call("choose",[E.get("massivescream")]),4,false]);
E.call("screenShake",[30,60]);
}
,
"gml_Object_oDeadBig_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDeadBig_Step_0":function(E){
if((E.get("hsp") != 0)){
E.set("image_xscale",(E.call("sign",[E.get("hsp")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
if((E.get("done") == 0)){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
E.set("x",(E.get("x") - E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
if((E.get("vsp") > 0)){
E.set("done",1);
E.set("image_index",1);
}
else {}
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
}
else {}
}
,
"gml_Object_oDead_Create_0":function(E){
E.set("size",E.call("random_range",[0.4,1]));
E.set("hsp",(0 + E.call("random_range",[(-5),3])));
E.set("vsp",((-3) + E.call("random_range",[(-6),1])));
E.set("grv",0.3);
E.set("done",0);
E.call("screenShake",[6,25]);
E.set("image_speed",0);
E.call("audio_play_sound",[E.call("choose",[E.get("bigdeath"),E.get("death")]),4,false]);
}
,
"gml_Object_oDead_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDead_Step_0":function(E){
if((E.get("hsp") != 0)){
E.set("image_xscale",(E.call("sign",[E.get("hsp")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
if((E.get("done") == 0)){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
E.set("x",(E.get("x") - E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
if((E.get("vsp") > 0)){
E.set("done",1);
E.set("image_index",1);
}
else {}
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
}
else {}
}
,
"gml_Object_oDoor2_Collision_Object1":function(E){
}
,
"gml_Object_oDoor2_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oDoor2_Create_0":function(E){
E.set("hitfrom",0);
E.set("hsp",4);
}
,
"gml_Object_oDoor2_Draw_0":function(E){
E.call("draw_self",[]);
if((E.get("flash") > 0)){
E.set("flash",(E.get("flash") - 1));
E.call("shader_set",[E.get("shWhite")]);
E.call("draw_self",[]);
E.call("shader_reset",[]);
}
else {}
}
,
"gml_Object_oDoor2_Other_7":function(E){
}
,
"gml_Object_oDoor2_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("text","default");
E.set("flash",3);
}
,
"gml_Object_oDoor2_Step_1":function(E){
if((E.get("hp") <= 0)){
E.declare("remains",E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oDoorDead")]));
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oExplosion65")]);
for(const __target1 of E.targets(E.get("remains"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("direction",E.member(E.get("other"),"hitfrom"));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
}
}}
E.call("instance_destroy",[]);
}
else {}
if(((E.truthy(E.call("instance_exists",[E.get("Object1")])) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),100]))) && E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["E"])])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oDoorOpen")]);
E.call("audio_play_sound",[E.get("dooropensound"),1,false]);
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oDoorBarrier_Collision_Object1":function(E){
}
,
"gml_Object_oDoorBarrier_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDoorBarrier_Step_0":function(E){
}
,
"gml_Object_oDoorDead_Collision_oBullet":function(E){
}
,
"gml_Object_oDoorDead_Create_0":function(E){
E.set("hsp",(30 + E.call("random_range",[(-7),7])));
E.set("vsp",((-3) + E.call("random_range",[(-4),1])));
E.set("grv",0.3);
E.set("done",0);
E.set("hitfrom",0);
E.set("image_speed",0);
E.call("screenShake",[6,60]);
E.call("audio_play_sound",[E.get("explode"),2,false]);
}
,
"gml_Object_oDoorDead_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDoorDead_Step_0":function(E){
}
,
"gml_Object_oDoorDead_Step_1":function(E){
if((E.get("done") == 0)){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
if((E.get("vsp") > 0)){
E.set("done",1);
E.set("image_index",1);
}
else {}
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
E.call("instance_destroy",[]);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
}
else {}
}
,
"gml_Object_oDoorOpen_Create_0":function(E){
E.set("doorisclosed",true);
E.set("doorisopen",true);
}
,
"gml_Object_oDoorOpen_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oDoorOpen_Step_2":function(E){
if((E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),120])) && E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["Q"])])))){
E.call("instance_create_layer",[(E.get("x") - 30),E.get("y"),E.get("layer"),E.get("oDoor")]);
E.call("instance_destroy",[E.get("oDoorOpen")]);
E.call("audio_play_sound",[E.get("doorclosesound"),1,false]);
}
else {}
}
,
"gml_Object_oDoor_Collision_Object1":function(E){
}
,
"gml_Object_oDoor_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oDoor_Create_0":function(E){
E.set("hitfrom",0);
E.set("hsp",4);
E.set("doorisopen",false);
}
,
"gml_Object_oDoor_Draw_0":function(E){
E.call("draw_self",[]);
if((E.get("flash") > 0)){
E.set("flash",(E.get("flash") - 1));
E.call("shader_set",[E.get("shWhite")]);
E.call("draw_self",[]);
E.call("shader_reset",[]);
}
else {}
}
,
"gml_Object_oDoor_Other_7":function(E){
}
,
"gml_Object_oDoor_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("text","default");
E.set("flash",3);
}
,
"gml_Object_oDoor_Step_1":function(E){
if((((E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),80])) && E.truthy(E.call("instance_exists",[E.get("Object1")]))) && E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["E"])]))) && E.truthy(E.call("instance_exists",[E.get("oDoor")])))){
E.call("instance_create_layer",[(E.get("x") + 30),E.get("y"),E.get("layer"),E.get("oDoorOpen")]);
E.call("instance_destroy",[E.get("oDoor")]);
E.call("audio_play_sound",[E.get("dooropensound"),1,false]);
}
else {}
}
,
"gml_Object_oEgun_Create_0":function(E){
E.set("countdownrate",40);
E.set("countdown",E.get("countdownrate"));
}
,
"gml_Object_oEgun_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oEgun_Step_1":function(E){
E.set("x",E.member(E.get("owner"),"x"));
E.set("y",(E.member(E.get("owner"),"y") + 10));
E.set("image_xscale",E.call("abs",[E.member(E.get("owner"),"image_xscale")]));
E.set("image_yscale",E.call("abs",[E.member(E.get("owner"),"image_yscale")]));
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
if((E.member(E.get("Object1"),"x") < E.get("x"))){
E.set("image_yscale",(-E.get("image_yscale")));
}
else {}
if((E.call("point_distance",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y")]) < 600)){
E.set("image_angle",E.call("point_direction",[E.get("x"),E.get("y"),E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y")]));
E.set("countdown",(E.get("countdown") - 1));
if((E.get("countdown") <= 0)){
E.set("countdown",E.get("countdownrate"));
if(((!E.truthy(E.call("collision_line",[E.get("x"),E.get("y"),E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("wall"),false,false]))) && (!E.truthy(E.call("collision_line",[E.get("x"),E.get("y"),E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("oDoor"),false,false]))))){
E.call("audio_play_sound",[E.get("gunshot"),5,false]);
for(const __target1 of E.targets(E.call("instance_create_layer",[E.get("x"),E.get("y"),"bullets",E.get("eEbullet")]))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("spd",18);
E.set("direction",(E.member(E.get("other"),"image_angle") + E.call("random_range",[(-45),45])));
E.set("image_angle",E.get("direction"));
}
}}
}
else {}
}
else {}
}
else {}
}
else {}
}
,
"gml_Object_oEnding_Create_0":function(E){
if((E.member(E.get("global"),"kills") > 0)){
E.putIndex(E.ensureArray("endtext"),0,(("And on this dau our hero had slain " + E.call("string",[E.member(E.get("global"),"kills")])) + " people."));
E.putIndex(E.ensureArray("endtext"),1,"but some of those people had guns too so...");
E.putIndex(E.ensureArray("endtext"),2,"he was probably saving the world of somethign.");
E.putIndex(E.ensureArray("endtext"),3,"regardless, he was arrested two days later and spent the rest of his life in prison");
E.putIndex(E.ensureArray("endtext"),4,"the defense team tried to argue that the sexy recoil effects and hit flashes were to blame,\nbutto no avail");
E.putIndex(E.ensureArray("endtext"),5,"the park ranger would later state she was no angry");
E.putIndex(E.ensureArray("endtext"),6,"the end");
E.putIndex(E.ensureArray("endtext"),7,"");
}
else {
E.putIndex(E.ensureArray("endtext"),0,"on this day we walked through a park and had a nice day");
}

E.set("spd",0.5);
E.set("letters",0);
E.set("currentline",0);
E.set("length",E.call("string_length",[E.index(E.get("endtext"),E.get("currentline"))]));
E.set("text","");
}
,
"gml_Object_oEnding_Draw_64":function(E){
E.call("draw_set_color",[E.get("c_black")]);
E.call("draw_rectangle",[0,0,1024,128,false]);
E.call("draw_rectangle",[0,640,1024,768,false]);
E.call("DrawSetText",[0,3,1,0]);
E.call("draw_text",[514,309.2,E.get("text")]);
E.call("draw_set_color",[E.get("c_white")]);
E.call("draw_text",[512,307.2,E.get("text")]);
}
,
"gml_Object_oEnding_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oEnding_Step_0":function(E){
E.declare("UnknownEnum",{"Value_3": 3});
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text",E.call("string_copy",[E.index(E.get("endtext"),E.get("currentline")),1,E.call("floor",[E.get("letters")])]));
if(((E.get("letters") >= E.get("length")) && E.truthy(E.call("keyboard_check_pressed",[E.get("vk_anykey")])))){
if(((E.get("currentline") + 1) == E.call("array_length_1d",[E.get("endtext")]))){
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_3")]);
}
else {
E.set("currentline",(E.get("currentline") + 1));
E.set("letters",0);
E.set("length",E.call("string_length",[E.index(E.get("endtext"),E.get("currentline"))]));
}

}
else {}
}
,
"gml_Object_oEnemyBig_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oEnemyBig_Collision_oSpring51":function(E){
E.set("vsp",(-10));
}
,
"gml_Object_oEnemyBig_Create_0":function(E){
E.set("size",E.call("random_range",[0.1,0.8]));
if(E.truthy(E.get("hasweapon"))){
E.set("mygun",E.call("instance_create_layer",[E.get("x"),E.get("y"),"Gun",E.get("oEgun")]));
for(const __target1 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("owner",E.member(E.get("other"),"id"));
}
}}
}
else {
E.set("mygun",(-4));
}

}
,
"gml_Object_oEnemyBig_Destroy_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("oSpawner")]))){
for(const __target1 of E.targets(E.get("oSpawner"))){const E2=E.withSelf(__target1);{const E=E2;{
if(E.truthy(E.get("triggered"))){
E.putIndex(E.ensureArray("remaining"),E.get("current_wave"),(E.index(E.get("remaining"),E.get("current_wave")) - 1));
}
else {}
}
}}
}
else {}
}
,
"gml_Object_oEnemyBig_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("hsp",4.22);
E.set("vsp",0);
E.set("grv",0.3);
E.set("walksp",3);
E.set("hitfrom",0);
E.set("size",1);
E.set("afraidofheights",false);
E.set("grounded",false);
E.set("hasweapon",false);
E.set("hp",15);
}
,
"gml_Object_oEnemyBig_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(((E.truthy(E.get("grounded")) && E.truthy(E.get("afraidofheights"))) && (!E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),(E.get("y") + 1),E.get("wall")]))))){
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("oDoor")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
E.call("screenShake",[6,25]);
E.call("audio_play_sound",[E.call("choose",[E.get("fatguyfal")]),4,false]);
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])))){
E.set("grounded",false);
E.set("sprite_index",E.get("fatguy"));
E.set("image_speed",0);
if((E.call("sign",[E.get("vsp")]) > 0)){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

}
else {
E.set("grounded",true);
E.set("image_speed",1);
if((E.get("hsp") == 0)){
E.set("sprite_index",E.get("fatguy"));
}
else {
E.set("sprite_index",E.get("fatguy"));
}

}

if((E.get("hsp") != 0)){
E.set("image_xscale",(E.call("sign",[E.get("hsp")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
}
,
"gml_Object_oEnemyBig_Step_1":function(E){
if((E.get("hp") <= 0)){
E.declare("remains",E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oDeadBig")]));
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oEnemyBloodspatter")]);
for(const __target1 of E.targets(E.get("remains"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("direction",E.member(E.get("other"),"hitfrom"));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
}
}}
for(const __target2 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target2);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + E.call("random_range",[2.22,5.71])));
E.put(E.get("global"),"killsthisroom",(E.member(E.get("global"),"killsthisroom") + 0.2));
for(const __target3 of E.targets(E.get("oBulletsLeft"))){const E2=E.withSelf(__target3);{const E=E2;{
E.set("killtextscale",2);
}
}}
}
else {}
E.call("instance_destroy",[]);
}
else {}
if((E.get("hsp") != 0)){
E.set("image_xscale",(E.call("sign",[E.get("hsp")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
}
,
"gml_Object_oEnemyBloodspatter_Create_0":function(E){
E.call("screenShake",[6,60]);
E.call("audio_play_sound",[E.get("splash"),2,false]);
}
,
"gml_Object_oEnemyBloodspatter_Other_7":function(E){
E.set("sprite_index",E.get("bloodspatter"));
E.call("instance_destroy",[]);
}
,
"gml_Object_oEnemyBloodspatter_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oEnemy_Alarm_0":function(E){
E.put(E.get("global"),"greentimer",(E.member(E.get("global"),"greentimer") - 1));
E.call("alarm_set",[0,30]);
}
,
"gml_Object_oEnemy_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oEnemy_Collision_oSpring51":function(E){
E.set("vsp",E.call("random_range",[(-10),(-40)]));
if(E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),1000]))){
E.call("audio_play_sound",[E.get("bedbounce"),4,false]);
}
else {}
}
,
"gml_Object_oEnemy_Create_0":function(E){
E.set("size",E.call("random_range",[0.6,1]));
E.set("hsp",E.call("random_range",[3,8]));
if(E.truthy(E.get("hasweapon"))){
E.set("mygun",E.call("instance_create_layer",[E.get("x"),E.get("y"),"Gun",E.get("oEgun")]));
for(const __target1 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("owner",E.member(E.get("other"),"id"));
}
}}
}
else {
E.set("mygun",(-4));
}

}
,
"gml_Object_oEnemy_Destroy_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("oSpawner")]))){
for(const __target1 of E.targets(E.get("oSpawner"))){const E2=E.withSelf(__target1);{const E=E2;{
if(E.truthy(E.get("triggered"))){
E.putIndex(E.ensureArray("remaining"),E.get("current_wave"),(E.index(E.get("remaining"),E.get("current_wave")) - 1));
}
else {}
}
}}
}
else {}
}
,
"gml_Object_oEnemy_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("vsp",0);
E.set("grv",0.3);
E.set("walksp",3);
E.set("hitfrom",0);
E.set("afraidofheights",false);
E.set("grounded",false);
E.set("hasweapon",false);
}
,
"gml_Object_oEnemy_Step_0":function(E){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(((E.truthy(E.get("grounded")) && E.truthy(E.get("afraidofheights"))) && (!E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),(E.get("y") + 1),E.get("wall")]))))){
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("playerwall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("oDoor")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",(-E.get("hsp")));
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wallcustomer")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wallcustomer")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("playerwall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("playerwall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
if((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])))){
E.set("grounded",false);
E.set("sprite_index",E.get("enemyJump"));
E.set("image_speed",0);
if((E.call("sign",[E.get("vsp")]) > 0)){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

}
else {
E.set("grounded",true);
E.set("image_speed",1);
if((E.get("hsp") == 0)){
E.set("sprite_index",E.get("enemyA"));
}
else {
E.set("sprite_index",E.get("enemyRun"));
}

}

if((E.get("hsp") != 0)){
E.set("image_xscale",(E.call("sign",[E.get("hsp")]) * E.get("size")));
}
else {}
E.set("image_yscale",E.get("size"));
}
,
"gml_Object_oEnemy_Step_1":function(E){
if((E.get("hp") <= 0)){
E.declare("remains",E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oDead")]));
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oEnemyBloodspatter")]);
for(const __target1 of E.targets(E.get("remains"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("direction",E.member(E.get("other"),"hitfrom"));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
}
}}
for(const __target2 of E.targets(E.get("mygun"))){const E2=E.withSelf(__target2);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oBulletsLeftGreen")]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + 5.87));
E.put(E.get("global"),"killsgreen",(E.member(E.get("global"),"killsgreen") + 5.87));
E.put(E.get("global"),"killsthisroom",(E.member(E.get("global"),"killsthisroom") + 0.2));
E.put(E.get("global"),"greentimer",0);
for(const __target3 of E.targets(E.get("oBulletsLeftGreen"))){const E2=E.withSelf(__target3);{const E=E2;{
E.set("killtextscale",3);
}
}}
E.putIndex(E.ensureArray("alarm"),0,30);
if((E.member(E.get("global"),"greentimer") == (-2))){
E.call("instance_destroy",[E.get("oBulletsLeftGreen")]);
}
else {}
if((E.member(E.get("global"),"greentimer") == (-1))){
E.put(E.get("global"),"greentimer",0);
E.putIndex(E.ensureArray("alarm"),0,(-1));
}
else {}
}
else {}
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oExplosion65_Create_0":function(E){
E.set("sprite_index",E.get("computerbroken"));
E.call("layer_add_instance",["floor",E.get("id")]);
E.set("depth",(E.get("depth") + 1));
E.call("screenShake",[6,60]);
E.call("audio_play_sound",[E.get("explode"),2,false]);
E.set("hitfrom",0);
}
,
"gml_Object_oExplosion65_Other_7":function(E){
E.call("instance_destroy",[]);
}
,
"gml_Object_oExplosion65_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oExplosion_Create_0":function(E){
E.set("sprite_index",E.get("computerbroken"));
E.call("layer_add_instance",["floor",E.get("id")]);
E.set("depth",(E.get("depth") + 1));
E.call("screenShake",[6,60]);
E.call("audio_play_sound",[E.get("explode"),2,false]);
E.set("hitfrom",0);
}
,
"gml_Object_oExplosion_Other_7":function(E){
E.call("instance_destroy",[]);
}
,
"gml_Object_oExplosion_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGame_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"kills",0);
E.put(E.get("global"),"killsthisroom",0);
E.set("killtextscale",1);
}
,
"gml_Object_oGame_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,1,2,0]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_text_transformed",[188,10,(E.call("string",[E.member(E.get("global"),"bullets")]) + " Grenades"),E.get("killtextscale"),E.get("killtextscale"),0]);
if((E.member(E.get("global"),"bullets") == 0)){
E.call("draw_text",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"no more bullets"]);
}
else {}
}
else {}
}
,
"gml_Object_oGame_Other_4":function(E){
}
,
"gml_Object_oGame_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGirl16364_Collision_Object1":function(E){
}
,
"gml_Object_oGirl16364_Collision_oExplosion":function(E){
E.set("vsp",(-20));
}
,
"gml_Object_oGirl16364_Collision_oSpring51":function(E){
E.set("vsp",(-20));
E.call("audio_play_sound",[E.get("bedbounce"),1,false]);
}
,
"gml_Object_oGirl16364_Collision_wall":function(E){
}
,
"gml_Object_oGirl16364_Create_0":function(E){
E.set("flash",0);
E.set("hitfrom",0);
E.set("vsp",0);
E.set("grv",0.15);
E.set("hsp",0);
E.set("walksp",3);
E.set("friction",0.25);
if((((E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),800])) && (!E.truthy(E.call("instance_exists",[E.get("oGirltext2")])))) && (!E.truthy(E.call("instance_exists",[E.get("oGirltext71")])))) && (!E.truthy(E.call("instance_exists",[E.get("oPDead")]))))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),"Gun",E.get("oGirltext2")]);
}
else {}
if(E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),200]))){
E.call("instance_destroy",[E.get("oGirltext2")]);
}
else {}
if((E.truthy(E.call("instance_exists",[E.get("oPDead")])) && (!E.truthy(E.call("instance_exists",[E.get("oGirltext71")]))))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),"Gun",E.get("oGirltext71")]);
}
else {}
E.call("instance_destroy",[E.get("oGirltext2")]);
}
,
"gml_Object_oGirl16364_Draw_0":function(E){
E.call("draw_self",[]);
if((E.get("flash") > 0)){
E.set("flash",(E.get("flash") - 1));
E.call("shader_set",[E.get("shWhite")]);
E.call("draw_self",[]);
E.call("shader_reset",[]);
}
else {}
}
,
"gml_Object_oGirl16364_Keyboard_32":function(E){
}
,
"gml_Object_oGirl16364_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGirl16364_Step_0":function(E){
if((E.get("hsp") > 2)){
E.set("hsp",(-2));
}
else {
}

E.set("vsp",(E.get("vsp") + E.get("grv")));
if((((E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),111])) && E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["Q"])]))) && (E.member(E.get("Object1"),"x") < E.member(E.get("oGirl16364"),"x"))) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oDanielbaby")]);
E.call("audio_play_sound",[E.get("kissing"),3,false]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") - 53),(E.member(E.get("Object1"),"y") - 190),E.get("layer"),E.get("oGirl163")]);
E.call("instance_create_layer",[(E.member(E.get("oGirl16364"),"x") - 53),(E.member(E.get("oGirl16364"),"y") - 190),E.get("layer"),E.get("oGirl16378")]);
}
else {}
E.set("hspeed",0);
if((((E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),111])) && E.truthy(E.call("keyboard_check",[E.call("ord",["E"])]))) && E.truthy(E.call("instance_exists",[E.get("Object1")]))) && E.truthy(E.member(E.get("global"),"hascontrol")))){
if(E.truthy(E.call("keyboard_check",[E.call("ord",["D"])]))){
E.set("x",(E.member(E.get("Object1"),"x") - 67));
E.set("sprite_index",E.get("girlrunning"));
}
else if(E.truthy(E.call("keyboard_check",[E.call("ord",["A"])]))){
E.set("x",(E.member(E.get("Object1"),"x") + 67));
E.set("sprite_index",E.get("girlrunning"));
}
else if((E.member(E.get("Object1"),"x") < E.get("x"))){
E.set("x",(E.member(E.get("Object1"),"x") + 67));
}
else {
E.set("x",(E.member(E.get("Object1"),"x") - 67));
}



E.set("y",E.member(E.get("Object1"),"y"));
E.declare("aimside",E.call("sign",[(E.get("mouse_x") - E.get("x"))]));
if((E.get("aimside") != 0)){
E.set("image_xscale",E.get("aimside"));
}
else {}
if(E.truthy(E.call("keyboard_check_pressed",[E.get("vk_space")]))){
E.set("vsp",(-9));
E.set("sprite_index",E.get("girljump2"));
}
else {}
}
else {}
if((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + 1),E.get("wall")])))){
E.set("sprite_index",E.get("girljump2"));
E.set("image_speed",1);
if((E.call("sign",[E.get("vsp")]) > 0)){
E.set("sprite_index",E.get("girljump"));
}
else {}
}
else if((E.get("sprite_index") == E.get("girljump"))){
E.call("audio_play_sound",[E.get("groundland"),4,false]);
for(let __repeat1=Math.max(0,Math.trunc(5));__repeat1>0;__repeat1--){E.tick();{
for(const __target2 of E.targets(E.call("instance_create_layer",[E.get("x"),E.get("bbox_bottom"),"bullets",E.get("odust")]))){const E2=E.withSelf(__target2);{const E=E2;{
E.set("vsp",0);
}
}}
}
}
}
else {}

if((((E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("wall")])) && (E.get("vsp") < 0)) && (E.get("sprite_index") != E.get("daniel113"))) && (E.get("hsp") == 0))){
E.call("audio_play_sound",[E.get("groundland"),4,false]);
for(let __repeat3=Math.max(0,Math.trunc(5));__repeat3>0;__repeat3--){E.tick();{
for(const __target4 of E.targets(E.call("instance_create_layer",[E.get("x"),E.get("bbox_bottom"),"bullets",E.get("odust")]))){const E2=E.withSelf(__target4);{const E=E2;{
E.set("vspeed",0);
E.set("vsp",0);
}
}}
}
}
}
else {}
}
,
"gml_Object_oGirl16364_Step_1":function(E){
if((E.member(E.get("global"),"php") == 0)){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oGirltext71")]);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
E.call("audio_play_sound",[E.call("choose",[E.get("fatguyfal")]),4,false]);
E.call("screenShake",[6,25]);
E.call("audio_play_sound",[E.get("groundland"),4,false]);
E.call("instance_create_layer",[E.get("x"),E.get("bbox_bottom"),"bullets",E.get("odust")]);
}
}
E.set("vsp",0);
E.set("image_speed",1);
E.set("sprite_index",E.get("daniel113"));
E.set("gravity",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
E.set("vspeed",0);
}
,
"gml_Object_oGirl16378_Collision_Object1":function(E){
}
,
"gml_Object_oGirl16378_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGirl16378_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",(E.member(E.get("oGirl16364"),"x") - 53));
E.set("y",(E.member(E.get("oGirl16364"),"y") - 190));
E.set("image_alpha",(E.get("image_alpha") - 0.008));
}
else {}
if((E.get("image_alpha") <= 0)){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oGirl163_Collision_Object1":function(E){
}
,
"gml_Object_oGirl163_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGirl163_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",(E.member(E.get("Object1"),"x") - 53));
E.set("y",(E.member(E.get("Object1"),"y") - 190));
E.set("image_alpha",(E.get("image_alpha") - 0.008));
}
else {}
if((E.get("image_alpha") <= 0)){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oGirl1_Collision_Object1":function(E){
if((E.member(E.get("global"),"php") != 8)){
E.put(E.get("global"),"php",(E.member(E.get("global"),"php") + 3));
E.call("instance_destroy",[]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") - 53),(E.member(E.get("Object1"),"y") - 190),E.get("layer"),E.get("oGirl163")]);
E.putIndex(E.ensureArray("alarm"),10,(E.get("room_speed") * 3));
E.call("audio_play_sound",[E.get("kissing"),1,false]);
E.call("audio_play_sound",[E.get("harp"),10,false]);
}
else {}
}
,
"gml_Object_oGirl1_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGirl1_Step_0":function(E){
}
,
"gml_Object_oGirltext2_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","Someone please help me!");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oGirltext2_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oGirltext2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGirltext2_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("oGirl16364"),"x"));
E.set("y",(E.member(E.get("oGirl16364"),"y") - 85));
}
else {}
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oGirltext71_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","Daniel, NOoooo :(");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oGirltext71_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oGirltext71_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGirltext71_Step_0":function(E){
E.set("x",E.member(E.get("oGirl16364"),"x"));
E.set("y",(E.member(E.get("oGirl16364"),"y") - 85));
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oGirltext_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","stop shooting me :(");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oGirltext_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oGirltext_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGirltext_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("oGirl16364"),"x"));
E.set("y",(E.member(E.get("oGirl16364"),"y") - 85));
}
else {}
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oGun59_Create_0":function(E){
E.set("firingdelay",0);
E.set("recoil",0);
E.put(E.get("global"),"weapon2",true);
E.put(E.get("global"),"dontshoot",true);
E.put(E.get("global"),"equippedweapon",E.get("oGun59"));
}
,
"gml_Object_oGun59_KeyPress_70":function(E){
if((((E.member(E.get("global"),"bullets") == 0) && (!E.truthy(E.call("cheat_enabled",["infiniteAmmo"])))) && (!E.truthy(E.call("instance_exists",[E.get("oDanielText1")]))))){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("layer"),E.get("oDanielText1")]);
}
else {}
}
,
"gml_Object_oGun59_KeyPress_82":function(E){
}
,
"gml_Object_oGun59_Mouse_4":function(E){
}
,
"gml_Object_oGun59_Mouse_7":function(E){
}
,
"gml_Object_oGun59_Other_7":function(E){
}
,
"gml_Object_oGun59_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGun59_Step_1":function(E){
E.set("x",(E.member(E.get("Object1"),"x") - 20));
E.set("y",(E.member(E.get("Object1"),"y") + 10));
E.set("image_angle",E.call("point_direction",[E.get("x"),E.get("y"),E.get("mouse_x"),E.get("mouse_y")]));
E.set("firingdelay",(E.get("firingdelay") - 1));
E.set("recoil",E.call("max",[0,(E.get("recoil") - 1)]));
if(((((((E.truthy(E.call("mouse_check_button",[E.get("mb_left")])) || E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")]))) && (!E.truthy(E.call("keyboard_check",[E.call("ord",["F"])])))) && (!E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["F"])])))) && E.truthy(E.member(E.get("global"),"hascontrol"))) && E.truthy(E.member(E.get("global"),"dontshoot"))) && E.truthy(E.member(E.get("global"),"weapon1")))){
E.call("instance_change",[E.get("oGun"),true]);
E.call("event_perform",[3,1]);
return ;
}
else {}
if(((((((E.truthy(E.call("keyboard_check",[E.call("ord",["F"])])) || E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["F"])]))) || ((E.truthy(E.call("mouse_check_button",[E.get("mb_left")])) || E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")]))) && (!E.truthy(E.member(E.get("global"),"weapon1"))))) && (E.get("firingdelay") < 0)) && ((E.member(E.get("global"),"bullets") > 0) || E.truthy(E.call("cheat_enabled",["infiniteAmmo"])))) && E.truthy(E.member(E.get("global"),"hascontrol"))) && E.truthy(E.member(E.get("global"),"dontshoot")))){
if((!E.truthy(E.call("cheat_enabled",["infiniteAmmo"])))){
E.put(E.get("global"),"bullets",(E.member(E.get("global"),"bullets") - 1));
}
else {}
E.set("recoil",15);
E.set("firingdelay",3);
E.call("audio_play_sound",[E.get("grenadeshot"),5,false]);
for(const __target1 of E.targets(E.call("instance_create_layer",[(E.get("x") + 5),E.get("y"),"bullets",E.get("oBulletBomb")]))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("spd",25);
E.set("direction",(E.member(E.get("other"),"image_angle") + E.call("random_range",[(-3),3])));
E.set("image_angle",E.get("direction"));
}
}}
for(const __target2 of E.targets(E.get("Object1"))){const E2=E.withSelf(__target2);{const E=E2;{
E.set("gunkickx",E.call("lengthdir_x",[1.5,(E.member(E.get("other"),"image_angle") - 180)]));
E.set("gunkicky",E.call("lengthdir_y",[1,(E.member(E.get("other"),"image_angle") - 180)]));
}
}}
}
else {}
if(((((E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["F"])])) || E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")]))) && (E.member(E.get("global"),"bullets") == 0)) && (!E.truthy(E.call("cheat_enabled",["infiniteAmmo"])))) && E.truthy(E.member(E.get("global"),"hascontrol")))){
E.call("audio_play_sound",[E.get("gunempty"),2,false]);
}
else {}
E.set("x",(E.get("x") - E.call("lengthdir_x",[E.get("recoil"),E.get("image_angle")])));
E.set("y",(E.get("y") - E.call("lengthdir_y",[E.get("recoil"),E.get("image_angle")])));
if(((E.get("image_angle") > 90) && (E.get("image_angle") < 270))){
E.set("image_yscale",(-1));
E.set("x",(E.get("x") + 25));
}
else {
E.set("image_yscale",1);
}

}
,
"gml_Object_oGunPickup_Collision_Object1":function(E){
E.call("instance_destroy",[E.get("oGun")]);
E.call("instance_destroy",[E.get("oGun59")]);
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"Gun",E.get("oGun")]);
E.call("instance_destroy",[E.get("oGunPickup")]);
E.put(E.get("global"),"weapon1",true);
E.set("flash",3);
E.call("audio_play_sound",[E.get("reloadSound"),1,false]);
E.put(E.get("global"),"ammo",(E.member(E.get("global"),"ammo") + 100));
}
,
"gml_Object_oGunPickup_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGunPickup_Step_0":function(E){
E.set("y",(E.get("ystart") + (E.call("sin",[(E.call("get_timer",[]) / 200000)]) * 10)));
}
,
"gml_Object_oGun_Create_0":function(E){
E.set("firingdelay",0);
E.set("recoil",0);
E.put(E.get("global"),"weapon1",true);
E.put(E.get("global"),"dontshoot",true);
E.put(E.get("global"),"equippedweapon",E.get("oGun"));
}
,
"gml_Object_oGun_KeyPress_70":function(E){
}
,
"gml_Object_oGun_Mouse_4":function(E){
}
,
"gml_Object_oGun_Mouse_7":function(E){
}
,
"gml_Object_oGun_Other_7":function(E){
}
,
"gml_Object_oGun_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oGun_Step_1":function(E){
E.set("x",(E.member(E.get("Object1"),"x") - 20));
E.set("y",(E.member(E.get("Object1"),"y") + 10));
E.set("image_angle",E.call("point_direction",[E.get("x"),E.get("y"),E.get("mouse_x"),E.get("mouse_y")]));
E.set("firingdelay",(E.get("firingdelay") - 1));
E.set("recoil",E.call("max",[0,(E.get("recoil") - 1)]));
if(((E.truthy(E.call("keyboard_check",[E.call("ord",["F"])])) || E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["F"])]))) && E.truthy(E.member(E.get("global"),"hascontrol")))){
if(E.truthy(E.member(E.get("global"),"weapon2"))){
E.call("instance_change",[E.get("oGun59"),true]);
E.call("audio_play_sound",[E.get("reloadSound"),1,false]);
E.call("event_perform",[3,1]);
return ;
}
else if(E.truthy(E.call("keyboard_check_pressed",[E.call("ord",["F"])]))){
E.call("audio_play_sound",[E.get("gunempty"),2,false]);
}
else {}

}
else {}
if((((((E.truthy(E.call("mouse_check_button",[E.get("mb_left")])) || E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")]))) && (E.get("firingdelay") < 0)) && ((E.member(E.get("global"),"ammo") > 0) || E.truthy(E.call("cheat_enabled",["infiniteAmmo"])))) && E.truthy(E.member(E.get("global"),"hascontrol"))) && E.truthy(E.member(E.get("global"),"dontshoot")))){
if((!E.truthy(E.call("cheat_enabled",["infiniteAmmo"])))){
E.put(E.get("global"),"ammo",(E.member(E.get("global"),"ammo") - 1));
}
else {}
E.set("recoil",15);
E.set("firingdelay",3);
E.call("audio_play_sound",[E.get("gunshot"),5,false]);
for(const __target1 of E.targets(E.call("instance_create_layer",[(E.get("x") + 5),E.get("y"),"bullets",E.get("oBullet")]))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("spd",25);
E.set("direction",(E.member(E.get("other"),"image_angle") + E.call("random_range",[(-3),3])));
E.set("image_angle",E.get("direction"));
}
}}
for(const __target2 of E.targets(E.get("Object1"))){const E2=E.withSelf(__target2);{const E=E2;{
E.set("gunkickx",E.call("lengthdir_x",[1.5,(E.member(E.get("other"),"image_angle") - 180)]));
E.set("gunkicky",E.call("lengthdir_y",[1,(E.member(E.get("other"),"image_angle") - 180)]));
}
}}
}
else {}
if((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && (E.member(E.get("global"),"ammo") == 0)) && (!E.truthy(E.call("cheat_enabled",["infiniteAmmo"])))) && E.truthy(E.member(E.get("global"),"hascontrol")))){
E.call("audio_play_sound",[E.get("gunempty"),2,false]);
}
else {}
E.set("x",(E.get("x") - E.call("lengthdir_x",[E.get("recoil"),E.get("image_angle")])));
E.set("y",(E.get("y") - E.call("lengthdir_y",[E.get("recoil"),E.get("image_angle")])));
if(((E.get("image_angle") > 90) && (E.get("image_angle") < 270))){
E.set("image_yscale",(-1));
E.set("x",(E.get("x") + 25));
}
else {
E.set("image_yscale",1);
}

}
,
"gml_Object_oHealthBar_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.set("heartheight",5);
E.put(E.get("global"),"php",4);
E.set("killtextscale",1);
}
,
"gml_Object_oHealthBar_Draw_64":function(E){
E.set("heartheight",10);
E.set("horizontalhearts",(-60));
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
if((E.truthy(E.call("place_meeting",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("oGirl1")])) && (E.member(E.get("global"),"php") < 8))){
E.put(E.get("global"),"php",(E.member(E.get("global"),"php") + 1));
}
else {}
if((E.member(E.get("global"),"php") == 8)){
E.call("draw_sprite",[E.get("hearts"),58,(198 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(228 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(258 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(288 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(318 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(348 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(378 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(408 - E.get("horizontalhearts")),E.get("heartheight")]);
}
else {}
if((E.member(E.get("global"),"php") == 7)){
E.call("draw_sprite",[E.get("hearts"),58,(198 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(228 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(258 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(288 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(318 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(348 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(378 - E.get("horizontalhearts")),E.get("heartheight")]);
}
else {}
if((E.member(E.get("global"),"php") == 6)){
E.call("draw_sprite",[E.get("hearts"),58,(198 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(228 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(258 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(288 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(318 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(348 - E.get("horizontalhearts")),E.get("heartheight")]);
}
else {}
if((E.member(E.get("global"),"php") == 5)){
E.call("draw_sprite",[E.get("hearts"),58,(198 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(228 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(258 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(288 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(318 - E.get("horizontalhearts")),E.get("heartheight")]);
}
else {}
if((E.member(E.get("global"),"php") == 4)){
E.call("draw_sprite",[E.get("hearts"),58,(198 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(228 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(258 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(288 - E.get("horizontalhearts")),E.get("heartheight")]);
}
else {}
if((E.member(E.get("global"),"php") == 3)){
E.call("draw_sprite",[E.get("hearts"),58,(198 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(228 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(258 - E.get("horizontalhearts")),E.get("heartheight")]);
}
else {}
if((E.member(E.get("global"),"php") == 2)){
E.call("draw_sprite",[E.get("hearts"),58,(198 - E.get("horizontalhearts")),E.get("heartheight")]);
E.call("draw_sprite",[E.get("hearts"),58,(228 - E.get("horizontalhearts")),E.get("heartheight")]);
}
else {}
if((E.member(E.get("global"),"php") == 1)){
E.call("draw_sprite",[E.get("hearts"),58,(198 - E.get("horizontalhearts")),E.get("heartheight")]);
}
else {}
}
else {}
if((E.member(E.get("global"),"php") > 8)){
E.put(E.get("global"),"php",8);
}
else {}
}
,
"gml_Object_oHealthBar_KeyPress_16":function(E){
if((E.member(E.get("global"),"php") != 8)){
E.put(E.get("global"),"php",(E.member(E.get("global"),"php") + 1));
}
else {}
}
,
"gml_Object_oHealthBar_Other_4":function(E){
E.put(E.get("global"),"php",8);
}
,
"gml_Object_oHealthBar_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oHearts_Draw_0":function(E){
}
,
"gml_Object_oHearts_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oHitspark_Create_0":function(E){
E.set("image_index",0);
E.set("image_speed",1);
}
,
"gml_Object_oHitspark_Other_7":function(E){
E.call("instance_destroy",[]);
}
,
"gml_Object_oHitspark_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oJobSign_Collision_Object1":function(E){
}
,
"gml_Object_oJobSign_Create_0":function(E){
}
,
"gml_Object_oJobSign_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oJobSign_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
E.put(E.get("global"),"dontshoot",false);
}
else {
E.set("image_index",0);
}

if((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),100]))) && E.truthy(E.call("instance_exists",[E.get("oQuestMarker2")])))){
E.call("layer_set_visible",["Gun",(!E.truthy(E.get("visible")))]);
E.put(E.get("global"),"hascontrol",0);
E.call("instance_create_layer",[(E.member(E.get("oJobSign"),"x") - 122),(E.member(E.get("oJobSign"),"y") + 122),"gobackbutton",E.get("ojobmenu")]);
E.call("instance_create_layer",[(E.member(E.get("oJobSign"),"x") - 350),(E.member(E.get("oJobSign"),"y") - 93),"gobackbutton2",E.get("ojobbutton1")]);
E.call("instance_create_layer",[(E.member(E.get("oJobSign"),"x") - 55),(E.member(E.get("oJobSign"),"y") - 93),"gobackbutton2",E.get("ojobbutton2")]);
}
else {}
if((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),100]))) && (!E.truthy(E.call("instance_exists",[E.get("oQuestMarker2")]))))){
E.call("instance_create_layer",[(E.member(E.get("oJobSign"),"x") + 30),(E.member(E.get("oJobSign"),"y") - 30),E.get("layer"),E.get("oDanielText8")]);
}
else {}
if((E.member(E.get("global"),"hasslept") == true)){
E.call("instance_create_layer",[(E.member(E.get("oJobSign"),"x") + 60),(E.member(E.get("oJobSign"),"y") - 60),E.get("layer"),E.get("oQuestMarker2")]);
E.put(E.get("global"),"hasslept",false);
}
else {}
}
,
"gml_Object_oKillTrigger_Alarm_0":function(E){
E.declare("UnknownEnum",{"Value_2": 2});
E.call("game_set_speed",[60,E.get("gamespeed_fps")]);
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_2"),E.get("room")]);
E.call("audio_stop_all",[]);
}
,
"gml_Object_oKillTrigger_Collision_Object1":function(E){
}
,
"gml_Object_oKillTrigger_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oLadder_Collision_Object1":function(E){
E.set("hspeed",(E.get("hspeed") + 20));
E.set("direction",E.call("point_direction",[E.member(E.get("other"),"x"),E.member(E.get("other"),"y"),E.get("x"),E.get("y")]));
}
,
"gml_Object_oLadder_Collision_wall":function(E){
E.set("gravity",0);
E.set("vspeed",(E.get("vspeed") + E.get("gravity")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vspeed")),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vspeed")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vspeed")])));
}
}
E.set("vspeed",0);
}
else {}
E.set("y",(E.get("y") + E.get("vspeed")));
}
,
"gml_Object_oLadder_Create_0":function(E){
E.set("gravity",2);
E.set("friction",2);
E.set("vspeed",0);
E.set("hspeed",0);
}
,
"gml_Object_oLadder_Destroy_0":function(E){
}
,
"gml_Object_oLadder_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oLadder_Step_0":function(E){
}
,
"gml_Object_oLevelEnd53_Collision_Object1":function(E){
E.declare("UnknownEnum",{"Value_2": 2});
for(const __target1 of E.targets(E.get("Object1"))){const E2=E.withSelf(__target1);{const E=E2;{
if(E.truthy(E.member(E.get("global"),"hascontrol"))){
E.put(E.get("global"),"hascontrol",false);
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_2"),E.member(E.get("other"),"target")]);
}
else {}
}
}}
}
,
"gml_Object_oLevelEnd53_Create_0":function(E){
}
,
"gml_Object_oLevelEnd53_Keyboard_70":function(E){
E.declare("UnknownEnum",{"Value_2": 2});
if((E.get("room") == E.get("introroom2"))){
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_2"),E.member(E.get("other"),"target")]);
}
else {}
}
,
"gml_Object_oLevelEnd53_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oLevelEnd_Collision_Object1":function(E){
E.declare("UnknownEnum",{"Value_2": 2});
for(const __target1 of E.targets(E.get("Object1"))){const E2=E.withSelf(__target1);{const E=E2;{
if(E.truthy(E.member(E.get("global"),"hascontrol"))){
E.put(E.get("global"),"hascontrol",false);
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_2"),E.member(E.get("other"),"target")]);
}
else {}
}
}}
}
,
"gml_Object_oLevelEnd_Create_0":function(E){
}
,
"gml_Object_oLevelEnd_Keyboard_70":function(E){
E.declare("UnknownEnum",{"Value_2": 2});
if((E.get("room") == E.get("introroom"))){
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_2"),E.member(E.get("other"),"target")]);
}
else {}
}
,
"gml_Object_oLevelEnd_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oLeveldoor_Collision_Object1":function(E){
E.declare("UnknownEnum",{"Value_2": 2});
for(const __target1 of E.targets(E.get("Object1"))){const E2=E.withSelf(__target1);{const E=E2;{
if(E.truthy(E.member(E.get("global"),"hascontrol"))){
E.put(E.get("global"),"hascontrol",false);
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_2"),E.member(E.get("other"),"target")]);
}
else {}
}
}}
}
,
"gml_Object_oLeveldoor_Create_0":function(E){
}
,
"gml_Object_oLeveldoor_Keyboard_70":function(E){
E.declare("UnknownEnum",{"Value_2": 2});
if((E.get("room") == E.get("introroom"))){
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_2"),E.member(E.get("other"),"target")]);
}
else {}
}
,
"gml_Object_oLeveldoor_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMenu_Create_0":function(E){
E.set("gui_width",E.call("display_get_gui_width",[]));
E.set("gui_height",E.call("display_get_gui_height",[]));
E.set("gui_margin",32);
E.set("menu_x",(E.get("gui_width") + 200));
E.set("menu_y",(E.get("gui_height") - E.get("gui_margin")));
E.set("menu_x_target",(E.get("gui_width") - E.get("gui_margin")));
E.set("menu_speed",25);
E.set("menu_font",1);
E.set("menu_itemheight",E.call("font_get_size",[E.get("fMenu")]));
E.set("menu_committed",(-1));
E.set("menu_control",true);
E.putIndex(E.ensureArray("menu"),2,"New Game");
E.putIndex(E.ensureArray("menu"),1,"Continue");
E.putIndex(E.ensureArray("menu"),0,"Quit");
E.set("menu_items",E.call("array_length_1d",[E.get("menu")]));
E.set("menu_top",(E.get("menu_y") - ((E.get("menu_itemheight") * 1.5) * E.get("menu_items"))));
E.set("menu_cursor",2);
}
,
"gml_Object_oMenu_Draw_64":function(E){
E.call("draw_set_font",[E.get("fMenu")]);
E.call("draw_set_halign",[E.get("fa_right")]);
E.call("draw_set_valign",[E.get("fa_bottom")]);
{E.declare("i",0);
for(;(E.get("i") < E.get("menu_items"));E.set("i",(E.get("i") + 1))){E.tick();{
E.declare("offset",2);
E.declare("txt",E.index(E.get("menu"),E.get("i")));
E.declare("col",0);
if((E.get("menu_cursor") == E.get("i"))){
E.set("txt",E.call("string_insert",["> ",E.get("txt"),0]));
E.set("col",16777215);
}
else {
E.set("col",8421504);
}

E.declare("xx",E.get("menu_x"));
E.declare("yy",(E.get("menu_y") - (E.get("menu_itemheight") * (E.get("i") * 1.5))));
E.call("draw_set_color",[E.get("c_black")]);
E.call("draw_text",[(E.get("xx") - E.get("offset")),E.get("yy"),E.get("txt")]);
E.call("draw_text",[(E.get("xx") + E.get("offset")),E.get("yy"),E.get("txt")]);
E.call("draw_text",[E.get("xx"),(E.get("yy") + E.get("offset")),E.get("txt")]);
E.call("draw_text",[E.get("xx"),(E.get("yy") - E.get("offset")),E.get("txt")]);
E.call("draw_set_color",[E.get("col")]);
E.call("draw_text",[E.get("xx"),E.get("yy"),E.get("txt")]);
}
}}
}
,
"gml_Object_oMenu_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMenu_Step_0":function(E){
E.declare("UnknownEnum",{"Value_1": 1, "Value_2": 2});
E.set("menu_x",(E.get("menu_x") + ((E.get("menu_x_target") - E.get("menu_x")) / E.get("menu_speed"))));
if(E.truthy(E.get("menu_control"))){
if(E.truthy(E.call("keyboard_check_pressed",[E.get("vk_up")]))){
E.set("menu_cursor",(E.get("menu_cursor") + 1));
if((E.get("menu_cursor") >= E.get("menu_items"))){
E.set("menu_cursor",0);
}
else {}
}
else {}
if(E.truthy(E.call("keyboard_check_pressed",[E.get("vk_down")]))){
E.set("menu_cursor",(E.get("menu_cursor") - 1));
if((E.get("menu_cursor") < 0)){
E.set("menu_cursor",(E.get("menu_items") - 1));
}
else {}
}
else {}
if(E.truthy(E.call("keyboard_check_pressed",[E.get("vk_enter")]))){
E.set("menu_x_target",(E.get("gui_width") + 200));
E.set("menu_committed",E.get("menu_cursor"));
E.call("screenShake",[4,30]);
E.set("menu_control",false);
E.call("audio_play_sound",[E.get("menusound"),3,false]);
}
else {}
E.declare("mouse_y_gui",E.call("device_mouse_y_to_gui",[0]));
if(((E.get("mouse_y_gui") < E.get("menu_y")) && (E.get("mouse_y_gui") > E.get("menu_top")))){
E.set("menu_cursor",Math.trunc((E.get("menu_y") - E.get("mouse_y_gui"))/(E.get("menu_itemheight") * 1.5)));
if(E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")]))){
E.set("menu_x_target",(E.get("gui_width") + 200));
E.set("menu_committed",E.get("menu_cursor"));
E.call("screenShake",[4,30]);
E.set("menu_control",false);
E.call("audio_play_sound",[E.get("menusound"),3,false]);
}
else {}
}
else {}
}
else {}
if(((E.get("menu_x") > (E.get("gui_width") + 150)) && (E.get("menu_committed") != (-1)))){
switch(E.get("menu_committed")){case 2:default:E.call("new_adventure",[]);
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_1")]);
break;
case 1:if((!E.truthy(E.call("file_exists",["Save.sav"])))){
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_1")]);
}
else {
E.declare("file",E.call("file_text_open_read",["Save.sav"]));
E.declare("target",E.call("file_text_read_real",[E.get("file")]));
E.put(E.get("global"),"kills",E.call("file_text_read_real",[E.get("file")]));
E.call("file_text_close",[E.get("file")]);
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_2"),E.get("target")]);
}

break;
case 0:E.set("menu_x_target",(E.get("gui_width") - E.get("gui_margin")));
E.set("menu_x",E.get("menu_x_target"));
E.set("menu_control",true);
E.call("game_end",[]);
break;
}
E.set("menu_committed",(-1));
}
else {}
}
,
"gml_Object_oMessageRead_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMessageRead_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 156));
E.set("y",(E.member(E.get("Object1"),"y") - 240));
}
,
"gml_Object_oMission_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMovingCar_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMumText2_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","stupid boy...");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oMumText2_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oMumText2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMumText2_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("oMum"),"x"));
E.set("y",(E.member(E.get("oMum"),"y") - 110));
}
else {}
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oMumText3_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","have you been to the petrol station yet?");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oMumText3_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oMumText3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMumText3_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("oMum"),"x"));
E.set("y",(E.member(E.get("oMum"),"y") - 110));
}
else {}
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oMumTextCompletequest_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","well done. here's some extra\n pocket money for you :)");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oMumTextCompletequest_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oMumTextCompletequest_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMumTextCompletequest_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("oMum"),"x"));
E.set("y",(E.member(E.get("oMum"),"y") - 110));
}
else {}
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oMumText_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","good boy");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oMumText_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oMumText_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMumText_Step_0":function(E){
if(E.truthy(E.call("instance_exists",[E.get("Object1")]))){
E.set("x",E.member(E.get("oMum"),"x"));
E.set("y",(E.member(E.get("oMum"),"y") - 110));
}
else {}
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((E.get("letters") >= (E.get("length") + 35))){
E.call("instance_destroy",[]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",136);
}
}}
}
else {}
}
,
"gml_Object_oMum_Alarm_0":function(E){
}
,
"gml_Object_oMum_Create_0":function(E){
E.put(E.get("global"),"quest1",0);
E.put(E.get("global"),"quest2",0);
}
,
"gml_Object_oMum_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oMum_Step_0":function(E){
if((((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),120])))){
E.set("sprite_index",E.get("mum2"));
E.put(E.get("global"),"dontshoot",false);
}
else {
E.set("sprite_index",E.get("mum1"));
}

if(((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"quest1") == 0)) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),120]))) && (E.member(E.get("global"),"acceptedquest") == false))){
E.call("instance_create_layer",[(E.get("x") + 27),(E.get("y") - 266),"bullets",E.get("oQuestBox")]);
E.call("instance_create_layer",[(E.get("x") + 280),(E.get("y") - 10),"buttons",E.get("oQuestAnswer1")]);
E.call("instance_create_layer",[(E.get("x") + 280),(E.get("y") + 80),"buttons",E.get("oQuestAnswer2")]);
E.call("instance_create_layer",[(E.get("x") + 280),(E.get("y") + 170),"buttons",E.get("oQuestAnswer3")]);
E.put(E.get("global"),"hascontrol",0);
E.call("audio_play_sound",[E.get("clicks"),3,false]);
E.call("layer_set_visible",["gun",(!E.truthy(E.get("visible")))]);
}
else {}
if(((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"quest1") == 1)) && (!E.truthy(E.call("instance_exists",[E.get("oMumText")])))) && E.truthy(E.call("instance_exists",[E.get("oQuestObjectives")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oMumTextCompletequest")]);
E.call("audio_play_sound",[E.call("choose",[E.get("chaching")]),2,false]);
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oBulletsLeftGreen")]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + 50));
E.put(E.get("global"),"killsgreen",(E.member(E.get("global"),"killsgreen") + 50));
E.call("greentext",[]);
E.call("instance_destroy",[E.get("oQuestObjectives")]);
}
else if(((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && (E.member(E.get("global"),"acceptedquest") == true)) && (E.member(E.get("global"),"quest1") == 0)) && (!E.truthy(E.call("instance_exists",[E.get("oMumText3")]))))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oMumText3")]);
}
else {}

}
,
"gml_Object_oNepalGuy_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oNepalGuy_Step_0":function(E){
if(((((!E.truthy(E.call("instance_exists",[E.get("oCustoemrs")]))) && (!E.truthy(E.call("instance_exists",[E.get("oCustoemrs2")])))) && (!E.truthy(E.call("instance_exists",[E.get("oCustoemrs3")])))) && E.truthy(E.call("instance_exists",[E.get("oQuestObjectives3")])))){
E.put(E.get("global"),"quest3",1);
if((!E.truthy(E.call("instance_exists",[E.get("oNepalguytext")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oNepalguytext")]);
}
else {}
}
else {}
}
,
"gml_Object_oNepalguysound_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oNepalguysound_Step_0":function(E){
if(((((!E.truthy(E.call("instance_exists",[E.get("oCustoemrs")]))) && (!E.truthy(E.call("instance_exists",[E.get("oCustoemrs2")])))) && (!E.truthy(E.call("instance_exists",[E.get("oCustoemrs3")])))) && E.truthy(E.call("instance_exists",[E.get("oQuestObjectives3")])))){
E.call("instance_destroy",[]);
if((!E.truthy(E.member(E.get("global"),"petrolpaid")))){
E.put(E.get("global"),"petrolpaid",true);
E.put(E.get("global"),"quest3",1);
E.call("audio_play_sound",[E.get("powerup"),4,false]);
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oBulletsLeftGreen")]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") + 300));
E.put(E.get("global"),"killsgreen",300);
E.call("greentext",[]);
}
else {}
}
else {}
}
,
"gml_Object_oNepalguytext_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","good job daniel.\ngo home now.");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oNepalguytext_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[1]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oNepalguytext_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oNepalguytext_Step_0":function(E){
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
E.set("x",(E.member(E.get("oNepalGuy"),"x") + 65));
E.set("y",(E.member(E.get("oNepalGuy"),"y") - 80));
}
,
"gml_Object_oPDead_Alarm_0":function(E){
E.call("game_set_speed",[60,E.get("gamespeed_fps")]);
E.call("audio_stop_all",[]);
}
,
"gml_Object_oPDead_Alarm_1":function(E){
}
,
"gml_Object_oPDead_Create_0":function(E){
E.put(E.get("global"),"hascontrol",0);
E.set("hsp",3);
E.set("vsp",(-4));
E.set("grv",0.2);
E.set("done",0);
E.call("screenShake",[6,25]);
E.set("image_speed",0);
E.set("image_index",0);
E.call("screenShake",[6,60]);
E.call("audio_play_sound",[E.get("bigdeath"),10,false]);
E.call("game_set_speed",[30,E.get("gamespeed_fps")]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",E.member(E.get("other"),"id"));
}
}}
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("obulletsgreentimer")]);
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oBulletsLeftRed")]);
E.put(E.get("global"),"killsred",(E.member(E.get("global"),"killsred") - 200));
for(const __target2 of E.targets(E.get("oBulletsLeftGreen"))){const E2=E.withSelf(__target2);{const E=E2;{
E.set("killtextscale",17);
}
}}
}
,
"gml_Object_oPDead_KeyPress_32":function(E){
}
,
"gml_Object_oPDead_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oPDead_Step_0":function(E){
if((E.get("done") == 0)){
E.set("vsp",(E.get("vsp") + E.get("grv")));
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("wall")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("wall")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("wall")]))){
if((E.get("vsp") > 0)){
E.call("audio_play_sound",[E.get("splash"),2,false]);
E.call("instance_create_layer",[E.member(E.get("oPDead"),"x"),(E.member(E.get("oPDead"),"y") - 80),E.get("layer"),E.get("oDanielText6")]);
E.call("audio_play_sound",[E.call("choose",[E.get("fatguyfal")]),4,false]);
E.call("screenShake",[6,25]);
E.set("done",1);
E.set("image_index",1);
E.putIndex(E.ensureArray("alarm"),0,60);
E.put(E.get("Object1"),"x",E.member(E.get("oPDead"),"x"));
E.put(E.get("Object1"),"y",(E.member(E.get("oPDead"),"y") + 2.5));
}
else {}
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("wall")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
E.set("y",(E.get("y") + E.get("vsp")));
}
else {}
if((E.get("hspeed") == 0)){
E.call("instance_create_layer",[E.member(E.get("oPDead"),"x"),(E.member(E.get("oPDead"),"y") + 500),"player",E.get("oDanielText6")]);
}
else {}
if(((E.truthy(E.call("keyboard_check_pressed",[E.get("vk_space")])) && (E.get("vsp") == 0)) && (E.get("done") == 1))){
E.call("instance_destroy",[]);
E.put(E.get("global"),"hascontrol",1);
E.call("layer_set_visible",["player",true]);
E.call("layer_set_visible",["Gun",true]);
if(E.truthy(E.call("instance_exists",[E.get("oBedSleep")]))){
E.put(E.get("Object1"),"x",E.member(E.get("oBedSleep"),"x"));
E.put(E.get("Object1"),"y",(E.member(E.get("oBedSleep"),"y") - 90));
}
else {
E.put(E.get("Object1"),"x",E.member(E.get("Object1"),"xstart"));
E.put(E.get("Object1"),"y",E.member(E.get("Object1"),"ystart"));
}

E.put(E.get("Object1"),"vsp",0);
E.put(E.get("Object1"),"hsp",0);
E.put(E.get("Object1"),"jumps",2);
E.put(E.get("global"),"php",8);
E.call("game_set_speed",[60,E.get("gamespeed_fps")]);
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("follow",E.member(E.get("Object1"),"id"));
}
}}
E.call("instance_destroy",[E.get("oBulletsLeftRed")]);
E.call("instance_destroy",[E.get("oDanielText6")]);
E.call("instance_destroy",[E.get("oGun")]);
E.call("instance_destroy",[E.get("oGun59")]);
if(((E.member(E.get("global"),"respawnweapon") == E.get("oGun59")) && E.truthy(E.member(E.get("global"),"weapon2")))){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"Gun",E.get("oGun59")]);
}
else if(E.truthy(E.member(E.get("global"),"weapon1"))){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"Gun",E.get("oGun")]);
}
else if(E.truthy(E.member(E.get("global"),"weapon2"))){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"Gun",E.get("oGun59")]);
}
else {}


}
else {}
if((E.member(E.get("global"),"greentimer") == (-5))){
E.call("instance_destroy",[E.get("oBulletsLeftRed")]);
}
else {}
}
,
"gml_Object_oPetrolstationDoor153_Collision_Object1":function(E){
}
,
"gml_Object_oPetrolstationDoor153_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oPetrolstationDoor153_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),200]))) && (E.member(E.get("global"),"quest3") == 1))){
E.call("audio_play_sound",[E.get("doorclosesound"),4,false]);
E.put(E.get("Object1"),"x",E.member(E.get("oJobSign"),"x"));
E.put(E.get("Object1"),"y",(E.member(E.get("oJobSign"),"y") - 100));
E.call("instance_destroy",[E.get("oQuestObjectives3")]);
E.put(E.get("global"),"hasquest3",0);
E.put(E.get("global"),"hasslept",false);
E.call("instance_destroy",[E.get("oGun")]);
E.call("instance_destroy",[E.get("oGun59")]);
if(((E.member(E.get("global"),"petrolweapon") == E.get("oGun59")) && E.truthy(E.member(E.get("global"),"weapon2")))){
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"Gun",E.get("oGun59")]);
}
else {
E.call("instance_create_layer",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),"Gun",E.get("oGun")]);
}

E.call("layer_set_visible",["Gun",true]);
}
else {}
}
,
"gml_Object_oPetrolstationDoor_Collision_Object1":function(E){
}
,
"gml_Object_oPetrolstationDoor_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oPetrolstationDoor_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
E.put(E.get("global"),"dontshoot",false);
}
else {
E.set("image_index",0);
}

if((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),200]))) && E.truthy(E.call("instance_exists",[E.get("oQuestObjectives3")])))){
E.put(E.get("Object1"),"x",(E.member(E.get("wallcustomer"),"x") - 60));
E.put(E.get("Object1"),"y",(E.member(E.get("wallcustomer"),"y") - 100));
E.call("instance_destroy",[E.get("playerwallcustomer")]);
E.call("audio_play_sound",[E.get("dooropensound"),3,false]);
E.put(E.get("global"),"customer1spd",(-2));
E.put(E.get("global"),"customer2spd",(-2));
E.put(E.get("global"),"customer3spd",(-2));
E.put(E.get("global"),"petrolweapon",E.get("oGun"));
if(E.truthy(E.call("instance_exists",[E.get("oGun59")]))){
E.put(E.get("global"),"petrolweapon",E.get("oGun59"));
}
else {}
E.call("instance_destroy",[E.get("oGun")]);
E.call("instance_destroy",[E.get("oGun59")]);
}
else {}
}
,
"gml_Object_oPunch_Create_0":function(E){
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oSign")]))){
for(const __target1 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("oSign")]))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
E.call("instance_destroy",[]);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oDoor")]))){
for(const __target2 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("oDoor")]))){const E2=E.withSelf(__target2);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
E.call("instance_destroy",[]);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oEnemy")]))){
for(const __target3 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("oEnemy")]))){const E2=E.withSelf(__target3);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
}
}}
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oPunch_Other_7":function(E){
}
,
"gml_Object_oPunch_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestAnswer1_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestAnswer1_Step_0":function(E){
E.set("x",(E.member(E.get("oMum"),"x") + 280));
E.set("y",(E.member(E.get("oMum"),"y") - 10));
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),3,false]);
E.call("instance_destroy",[E.get("oQuestBox")]);
E.call("instance_destroy",[]);
E.call("instance_destroy",[E.get("oQuestAnswer2")]);
E.call("instance_destroy",[E.get("oQuestAnswer3")]);
E.put(E.get("global"),"hascontrol",1);
if((!E.truthy(E.call("instance_exists",[E.get("oMumText2")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oMumText2")]);
}
else {}
E.call("instance_destroy",[E.get("oMumText")]);
E.call("layer_set_visible",["gun",E.get("visible")]);
}
else {}
}
,
"gml_Object_oQuestAnswer2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestAnswer2_Step_0":function(E){
E.set("x",(E.member(E.get("oMum"),"x") + 280));
E.set("y",(E.member(E.get("oMum"),"y") + 80));
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),3,false]);
E.call("layer_set_visible",["gun",E.get("visible")]);
E.call("instance_destroy",[E.get("oQuestBox")]);
E.put(E.get("oQuestMarker"),"image_alpha",(E.member(E.get("oQuestMarker"),"image_alpha") - 0.008));
E.call("instance_destroy",[E.get("oQuestAnswer1")]);
E.call("instance_destroy",[E.get("oQuestAnswer2")]);
E.call("instance_destroy",[E.get("oQuestAnswer3")]);
E.put(E.get("global"),"hascontrol",1);
if(E.truthy(E.call("instance_exists",[E.get("oMumText2")]))){
E.call("instance_destroy",[E.get("oMumText2")]);
}
else {}
if((!E.truthy(E.call("instance_exists",[E.get("oMumText2")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oMumText")]);
}
else {}
if((!E.truthy(E.call("instance_exists",[E.get("oMumText")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oMumText")]);
}
else {}
if((!E.truthy(E.call("instance_exists",[E.get("oQuestObjectives")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),"quests",E.get("oQuestObjectives")]);
for(const __target1 of E.targets(E.get("oQuestObjectives"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("killtextscale",2);
}
}}
E.put(E.get("global"),"acceptedquest",true);
E.put(E.get("global"),"hasquest2",1);
}
else {}
}
else {}
}
,
"gml_Object_oQuestAnswer3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestAnswer3_Step_0":function(E){
E.set("x",(E.member(E.get("oMum"),"x") + 280));
E.set("y",(E.member(E.get("oMum"),"y") + 170));
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("audio_play_sound",[E.get("clicks"),3,false]);
E.call("instance_destroy",[E.get("oQuestBox")]);
E.call("instance_destroy",[E.get("oQuestAnswer1")]);
E.call("instance_destroy",[E.get("oQuestAnswer2")]);
E.call("instance_destroy",[E.get("oQuestAnswer3")]);
E.call("layer_set_visible",["gun",E.get("visible")]);
E.put(E.get("global"),"hascontrol",1);
E.call("instance_destroy",[E.get("oMumText")]);
if((!E.truthy(E.call("instance_exists",[E.get("oMumText2")])))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oMumText2")]);
}
else {}
}
else {}
}
,
"gml_Object_oQuestBox_Create_0":function(E){
}
,
"gml_Object_oQuestBox_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestBox_Step_0":function(E){
E.set("x",(E.member(E.get("oMum"),"x") + 27));
E.set("y",(E.member(E.get("oMum"),"y") - 266));
}
,
"gml_Object_oQuestLocation_Collision_Object1":function(E){
if(E.truthy(E.call("instance_exists",[E.get("oQuestObjectives")]))){
E.put(E.get("global"),"quest1",(E.member(E.get("global"),"quest1") + 1));
for(const __target1 of E.targets(E.get("oQuestObjectives"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("killtextscale",2);
}
}}
E.call("instance_destroy",[]);
E.call("audio_play_sound",[E.call("choose",[E.get("powerup"),E.get("powerup23")]),2,false]);
}
else {}
}
,
"gml_Object_oQuestLocation_Create_0":function(E){
}
,
"gml_Object_oQuestLocation_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestLocation_Step_0":function(E){
}
,
"gml_Object_oQuestMarker2151_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestMarker2151_Step_0":function(E){
E.set("y",(E.get("ystart") + (E.call("sin",[(E.call("get_timer",[]) / 200000)]) * 10)));
if((E.member(E.get("global"),"pcclickedon") == true)){
E.set("image_alpha",(E.get("image_alpha") - 0.008));
}
else {}
}
,
"gml_Object_oQuestMarker2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestMarker2_Step_0":function(E){
E.set("y",(E.get("ystart") + (E.call("sin",[(E.call("get_timer",[]) / 200000)]) * 10)));
}
,
"gml_Object_oQuestMarker_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestMarker_Step_0":function(E){
E.set("y",(E.get("ystart") + (E.call("sin",[(E.call("get_timer",[]) / 200000)]) * 10)));
if(E.truthy(E.call("instance_exists",[E.get("oQuestObjectives")]))){
E.set("image_alpha",(E.get("image_alpha") - 0.008));
}
else {}
}
,
"gml_Object_oQuestObjectives2_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"quest2",0);
E.set("killtextscale",1);
}
,
"gml_Object_oQuestObjectives2_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,0,2,0]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_text_transformed",[1013,150,(("Buy Plane Ticket to Japan " + E.call("string",[E.member(E.get("global"),"quest2")])) + " /1"),E.get("killtextscale"),E.get("killtextscale"),0]);
}
else {}
}
,
"gml_Object_oQuestObjectives2_Other_4":function(E){
}
,
"gml_Object_oQuestObjectives2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestObjectives2_Step_0":function(E){
}
,
"gml_Object_oQuestObjectives3_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"quest3",0);
E.set("killtextscale",1);
if((E.member(E.get("global"),"hasquest3") == 0)){
E.call("layer_set_visible",["questlayer",(!E.truthy(E.get("visible")))]);
}
else {}
}
,
"gml_Object_oQuestObjectives3_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,0,2,0]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_text_transformed",[1013,190,(("Complete 1 shift at petrol station " + E.call("string",[E.member(E.get("global"),"quest3")])) + " /1"),E.get("killtextscale"),E.get("killtextscale"),0]);
}
else {}
}
,
"gml_Object_oQuestObjectives3_Other_4":function(E){
}
,
"gml_Object_oQuestObjectives3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestObjectives3_Step_0":function(E){
}
,
"gml_Object_oQuestObjectives_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"quest1",0);
E.set("killtextscale",1);
if((E.member(E.get("global"),"hasquest1") == 0)){
E.call("layer_set_visible",["questlayer",(!E.truthy(E.get("visible")))]);
}
else {}
}
,
"gml_Object_oQuestObjectives_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,0,2,0]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_text_transformed",[1013,110,(("Go to the Petrol Station " + E.call("string",[E.member(E.get("global"),"quest1")])) + " /1"),E.get("killtextscale"),E.get("killtextscale"),0]);
}
else {}
}
,
"gml_Object_oQuestObjectives_Other_4":function(E){
}
,
"gml_Object_oQuestObjectives_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oQuestObjectives_Step_0":function(E){
}
,
"gml_Object_oSaver_Create_0":function(E){
E.call("loadgame",[]);
}
,
"gml_Object_oSaver_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oSign_Collision_Object1":function(E){
}
,
"gml_Object_oSign_Collision_oExplosion":function(E){
E.set("hp",0);
}
,
"gml_Object_oSign_Create_0":function(E){
E.put(E.get("global"),"newmail",1);
E.put(E.get("global"),"pcclickedon",false);
E.set("hp",3);
E.set("flash",3);
E.set("grv",0.3);
E.set("vsp",0);
E.set("hsp",0);
E.call("instance_create_layer",[E.member(E.get("oSign"),"x"),(E.member(E.get("oSign"),"y") - 80),E.get("layer"),E.get("oQuestMarker2151")]);
}
,
"gml_Object_oSign_Draw_0":function(E){
E.call("draw_self",[]);
if((E.get("flash") > 0)){
E.set("flash",(E.get("flash") - 1));
E.call("shader_set",[E.get("shWhite")]);
E.call("draw_self",[]);
E.call("shader_reset",[]);
}
else {}
}
,
"gml_Object_oSign_Other_7":function(E){
}
,
"gml_Object_oSign_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("text","frfr");
E.set("text2","dede");
}
,
"gml_Object_oSign_Step_0":function(E){
if(((E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),120])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("image_index",1);
E.put(E.get("global"),"dontshoot",false);
}
else {
E.set("image_index",0);
}

if((((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))) && E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),120]))) && E.truthy(E.call("place_meeting",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("wall")])))){
if(((E.truthy(E.call("point_in_circle",[E.member(E.get("oSign"),"x"),E.member(E.get("oSign"),"y"),E.get("x"),E.get("y"),100])) && (!E.truthy(E.call("instance_exists",[E.get("oButtongoback")])))) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.call("audio_play_sound",[E.get("clicks"),4,false]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 80),(E.member(E.get("Object1"),"y") - 550),"computerbackgrounds",E.get("oshopping2")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),(E.member(E.get("Object1"),"y") - 154),"buttons",E.get("oButtonAmazon")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 255),(E.member(E.get("Object1"),"y") - 7),"buttons",E.get("oButton3rd")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 255),(E.member(E.get("Object1"),"y") - 154),"buttons",E.get("oButton4th")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") - 70),(E.member(E.get("Object1"),"y") - 55),"gobackbutton",E.get("computerbottom")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 455),(E.member(E.get("Object1"),"y") - 7),"buttons",E.get("oButtonMail")]);
E.call("instance_create_layer",[(E.member(E.get("Object1"),"x") + 700),(E.member(E.get("Object1"),"y") + 66),"gobackbutton2",E.get("oButtonOff")]);
E.put(E.get("global"),"hascontrol",0);
E.call("layer_set_visible",["Gun",(!E.truthy(E.get("visible")))]);
if((E.member(E.get("global"),"messageread") == 1)){
E.call("instance_create_layer",[E.get("x"),E.get("y"),"gobackbutton",E.get("oMessageRead")]);
}
else {}
E.call("layer_set_visible",["quests",(!E.truthy(E.get("visible")))]);
}
else {}
}
else {}
}
,
"gml_Object_oSign_Step_1":function(E){
}
,
"gml_Object_oSleepBlck119_Create_0":function(E){
E.set("image_alpha",1);
E.set("woken",false);
E.set("messagecleared",false);
}
,
"gml_Object_oSleepBlck119_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oSleepBlck119_Step_0":function(E){
E.set("image_alpha",E.call("max",[0,(E.get("image_alpha") - 0.005)]));
if(((!E.truthy(E.get("woken"))) && (E.get("image_alpha") <= 0.5))){
E.set("woken",true);
E.put(E.get("global"),"hascontrol",1);
}
else {}
if(((!E.truthy(E.get("messagecleared"))) && (E.get("image_alpha") <= 0.3))){
E.set("messagecleared",true);
E.call("instance_destroy",[E.get("oText5")]);
}
else {}
if((E.get("image_alpha") <= 0)){
E.put(E.get("global"),"hascontrol",1);
E.put(E.get("global"),"clickedbed",false);
E.put(E.get("global"),"gosleep",0);
E.call("instance_destroy",[E.get("oText5")]);
for(const __target1 of E.targets(E.get("oBedSleep"))){const E2=E.withSelf(__target1);{const E=E2;{
E.putIndex(E.ensureArray("alarm"),1,(-1));
}
}}
E.call("instance_destroy",[]);
}
else {}
E.set("x",E.member(E.get("Object1"),"x"));
E.set("y",E.member(E.get("Object1"),"y"));
}
,
"gml_Object_oSleepBlck_Alarm_0":function(E){
}
,
"gml_Object_oSleepBlck_Create_0":function(E){
E.set("image_alpha",0);
}
,
"gml_Object_oSleepBlck_Other_7":function(E){
E.set("image_alpha",(E.get("image_alpha") - 0.0065));
}
,
"gml_Object_oSleepBlck_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oSleepBlck_Step_0":function(E){
E.set("image_alpha",(E.get("image_alpha") + 0.015));
if((E.member(E.get("global"),"gosleep") == (-6))){
E.call("instance_destroy",[]);
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oSleepBlck119")]);
}
else {}
}
,
"gml_Object_oSleepBlck_Step_2":function(E){
}
,
"gml_Object_oSlowmo_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"slowmo",100);
E.set("killtextscale",1);
}
,
"gml_Object_oSlowmo_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,1,2,0]);
E.call("draw_text_transformed",[759,12,("slowmo: " + E.call("string",[E.member(E.get("global"),"slowmo")])),E.get("killtextscale"),E.get("killtextscale"),0]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_text_transformed",[758,10,("slowmo: " + E.call("string",[E.member(E.get("global"),"slowmo")])),E.get("killtextscale"),E.get("killtextscale"),0]);
}
else {}
}
,
"gml_Object_oSlowmo_Other_4":function(E){
E.put(E.get("global"),"killsthisroom",0);
}
,
"gml_Object_oSlowmo_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oSpawn_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oSpawn_Step_0":function(E){
if(((!E.truthy(E.call("instance_exists",[E.get("oCustoemrs3")]))) && (!E.truthy(E.call("instance_exists",[E.get("oCustoemrs")]))))){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oCustoemrs")]);
}
else {}
}
,
"gml_Object_oSpawner_CleanUp_0":function(E){
E.call("ds_list_destroy",[E.get("waves")]);
}
,
"gml_Object_oSpawner_Collision_Object1":function(E){
if((E.get("triggered") == false)){
for(const __target1 of E.targets(E.get("oDoor"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("closed",true);
}
}}
E.set("triggered",true);
E.set("total_waves",(-1));
{E.declare("i",0);
for(;(E.get("i") < E.call("ds_list_size",[E.get("waves")]));E.set("i",(E.get("i") + 1))){E.tick();{
E.declare("thisentry",E.call("ds_list_find_value",[E.get("waves"),E.get("i")]));
if((E.index(E.get("thisentry"),0) > E.get("total_waves"))){
E.set("total_waves",(E.get("total_waves") + 1));
E.putIndex(E.ensureArray("remaining"),E.get("total_waves"),0);
}
else {}
E.putIndex(E.ensureArray("remaining"),E.get("total_waves"),(E.index(E.get("remaining"),E.get("total_waves")) + 1));
}
}}
}
else {}
}
,
"gml_Object_oSpawner_Create_0":function(E){
E.set("triggered",false);
E.set("timer",0);
E.set("current_wave",0);
}
,
"gml_Object_oSpawner_Draw_64":function(E){
}
,
"gml_Object_oSpawner_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oSpawner_Step_0":function(E){
if(E.truthy(E.get("triggered"))){
{E.declare("i",0);
for(;(E.get("i") < E.call("ds_list_size",[E.get("waves")]));E.set("i",(E.get("i") + 1))){E.tick();{
E.declare("next",E.call("ds_list_find_value",[E.get("waves"),E.get("i")]));
if(((E.index(E.get("next"),0) == E.get("current_wave")) && (E.index(E.get("next"),3) == E.get("timer")))){
E.declare("spawnpoint",E.index(E.get("next"),2));
E.call("instance_create_layer",[E.index(E.index(E.get("spawn"),E.get("spawnpoint")),0),E.index(E.index(E.get("spawn"),E.get("spawnpoint")),1),"enemy",E.index(E.get("next"),1)]);
}
else {}
}
}}
E.set("timer",(E.get("timer") + 1));
if((E.index(E.get("remaining"),E.get("current_wave")) <= 0)){
if((E.get("current_wave") == E.get("total_waves"))){
for(const __target1 of E.targets(E.get("oDoor"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("closed",false);
}
}}
E.call("instance_destroy",[]);
}
else {
E.set("current_wave",(E.get("current_wave") + 1));
E.set("timer",0);
}

}
else {}
}
else {}
}
,
"gml_Object_oSpring51_Collision_Object1":function(E){
E.set("image_index",1);
}
,
"gml_Object_oSpring51_Collision_oEnemy":function(E){
E.set("image_index",1);
}
,
"gml_Object_oSpring51_Collision_oGirl163":function(E){
E.set("image_index",1);
}
,
"gml_Object_oSpring51_Create_0":function(E){
E.set("image_speed",5);
}
,
"gml_Object_oSpring51_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oSpring51_Step_0":function(E){
}
,
"gml_Object_oSpring51_Step_1":function(E){
E.set("image_index",0);
}
,
"gml_Object_oSpring_Collision_Object1":function(E){
}
,
"gml_Object_oSpring_Create_0":function(E){
}
,
"gml_Object_oSpring_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oText2_Create_0":function(E){
E.set("spd",0.3);
E.set("letters",0);
E.set("text","Hi Daniel! I really want to see\n you. I'm waiting for you in Japan\n ^_^ From Emi");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oText2_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oText2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oText2_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 355));
E.set("y",(E.member(E.get("Object1"),"y") - 120));
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((!E.truthy(E.call("instance_exists",[E.get("oSign")])))){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oText3_Create_0":function(E){
E.set("spd",0.3);
E.set("letters",0);
E.set("text","Daniel we found out where you\n live...we're coming for you! \nFrom, your haters");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oText3_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oText3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oText3_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 355));
E.set("y",(E.member(E.get("Object1"),"y") - 120));
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((!E.truthy(E.call("instance_exists",[E.get("oSign")])))){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oText4_Create_0":function(E){
E.set("spd",0.3);
E.set("letters",0);
E.set("text","Dear Mr. Daniel, here is your\nmonthly unemployment benefits\n of $500. We expect to see you\n next week for your weekly\n jobseeker's meeting with your\nadvisor, Pauline. ");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
}
,
"gml_Object_oText4_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oText4_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oText4_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 355));
E.set("y",(E.member(E.get("Object1"),"y") - 35));
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((!E.truthy(E.call("instance_exists",[E.get("oSign")])))){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oText5_Create_0":function(E){
E.set("spd",0.3);
E.set("letters",0);
E.set("text","Zzz...");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("image_alpha",1);
E.set("border",10);
}
,
"gml_Object_oText5_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign3")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oText5_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oText5_Step_0":function(E){
E.set("x",E.member(E.get("Object1"),"x"));
E.set("y",E.member(E.get("Object1"),"y"));
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign3")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
if((!E.truthy(E.call("instance_exists",[E.get("oSign")])))){
E.call("instance_destroy",[]);
}
else {}
if((E.truthy(E.call("instance_exists",[E.get("oSleepBlck119")])) && (E.member(E.get("oSleepBlck119"),"image_alpha") == 0.5))){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_oText_Create_0":function(E){
E.set("spd",0.25);
E.set("letters",0);
E.set("text","22");
E.set("length",E.call("string_length",[E.get("text")]));
E.set("text_current","");
E.set("w",0);
E.set("h",0);
E.set("border",10);
E.call("audio_play_sound",[E.get("newmailsound"),1,false]);
}
,
"gml_Object_oText_Draw_0":function(E){
E.declare("halfw",(E.get("w") * 0.5));
E.call("draw_set_colour",[E.get("c_black")]);
E.call("draw_set_alpha",[0.5]);
E.call("draw_roundrect_ext",[((E.get("x") - E.get("halfw")) - E.get("border")),((E.get("y") - E.get("h")) - (E.get("border") * 2)),((E.get("x") + E.get("halfw")) + E.get("border")),E.get("y"),15,15,false]);
E.call("draw_sprite",[E.get("sMarker"),0,E.get("x"),E.get("y")]);
E.call("draw_set_alpha",[1]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_set_font",[E.get("fsign")]);
E.call("draw_set_halign",[E.get("fa_center")]);
E.call("draw_set_valign",[E.get("fa_top")]);
E.call("draw_text",[E.get("x"),((E.get("y") - E.get("h")) - E.get("border")),E.get("text_current")]);
}
,
"gml_Object_oText_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oText_Step_0":function(E){
if((E.truthy(E.call("point_in_circle",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("x"),E.get("y"),300])) && (!E.truthy(E.call("instance_exists",[E.get("oText2")]))))){
E.set("letters",(E.get("letters") + E.get("spd")));
E.set("text_current",E.call("string_copy",[E.get("text"),0,E.get("letters")]));
E.call("draw_set_font",[E.get("fsign")]);
if((E.get("h") == 0)){
E.set("h",E.call("string_height",[E.get("text")]));
}
else {}
E.set("w",E.call("string_width",[E.get("text_current")]));
}
else {
E.call("instance_destroy",[]);
}

}
,
"gml_Object_oTransition_Create_0":function(E){
E.declare("UnknownEnum",{"Value_4": 4});
E.set("w",E.call("display_get_gui_width",[]));
E.set("h",E.call("display_get_gui_height",[]));
E.set("h_half",(E.get("h") * 0.5));
E.set("mode",E.member(E.get("UnknownEnum"),"Value_4"));
E.set("percent",1);
E.set("target",E.get("room"));
}
,
"gml_Object_oTransition_Draw_64":function(E){
E.declare("UnknownEnum",{"Value_0": 0});
if((E.get("mode") != E.member(E.get("UnknownEnum"),"Value_0"))){
E.call("draw_set_color",[E.get("c_black")]);
E.call("draw_rectangle",[0,0,E.get("w"),(E.get("percent") * E.get("h_half")),false]);
E.call("draw_rectangle",[0,E.get("h"),E.get("w"),(E.get("h") - (E.get("percent") * E.get("h_half"))),false]);
}
else {}
E.call("draw_set_color",[E.get("c_white")]);
}
,
"gml_Object_oTransition_KeyPress_27":function(E){
E.declare("UnknownEnum",{"Value_2": 2});
E.call("game_set_speed",[60,E.get("gamespeed_fps")]);
E.call("slideTransition",[E.member(E.get("UnknownEnum"),"Value_2"),4]);
}
,
"gml_Object_oTransition_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oTransition_Step_0":function(E){
E.declare("UnknownEnum",{"Value_0": 0, "Value_1": 1, "Value_2": 2, "Value_3": 3, "Value_4": 4});
if((E.get("mode") != E.member(E.get("UnknownEnum"),"Value_0"))){
if((E.get("mode") == E.member(E.get("UnknownEnum"),"Value_4"))){
E.set("percent",E.call("max",[0,(E.get("percent") - E.call("max",[(E.get("percent") / 10),0.005]))]));
}
else {
E.set("percent",E.call("min",[1.2,(E.get("percent") + E.call("max",[((1.2 - E.get("percent")) / 10),0.005]))]));
}

if(((E.get("percent") == 1.2) || (E.get("percent") == 0))){
switch(E.get("mode")){case E.member(E.get("UnknownEnum"),"Value_4"):E.set("mode",E.member(E.get("UnknownEnum"),"Value_0"));
break;
case E.member(E.get("UnknownEnum"),"Value_1"):E.set("mode",E.member(E.get("UnknownEnum"),"Value_4"));
E.call("room_goto_next",[]);
break;
case E.member(E.get("UnknownEnum"),"Value_2"):E.set("mode",E.member(E.get("UnknownEnum"),"Value_4"));
E.call("room_goto",[E.get("target")]);
break;
case E.member(E.get("UnknownEnum"),"Value_3"):E.call("game_restart",[]);
break;
}
}
else {}
}
else {}
}
,
"gml_Object_obulletsgreentimer_Create_0":function(E){
E.call("display_set_gui_size",[1024,768]);
E.put(E.get("global"),"greentimer",0);
E.put(E.get("global"),"killsthisroom",0);
E.set("killtextscale",1);
}
,
"gml_Object_obulletsgreentimer_Draw_64":function(E){
if(((E.get("room") != E.get("rMenu")) && E.truthy(E.call("instance_exists",[E.get("Object1")])))){
E.set("killtextscale",E.call("max",[(E.get("killtextscale") * 0.95),1]));
E.call("DrawSetText",[0,1,2,0]);
E.call("draw_set_colour",[E.get("c_white")]);
E.call("draw_text_transformed",[1014,10000,("green tiemr " + E.call("string",[E.member(E.get("global"),"greentimer")])),E.get("killtextscale"),E.get("killtextscale"),0]);
}
else {}
}
,
"gml_Object_obulletsgreentimer_Other_4":function(E){
E.put(E.get("global"),"killsthisroom",0);
}
,
"gml_Object_obulletsgreentimer_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_odust_Create_0":function(E){
E.set("image_index",E.call("random_range",[0.5,1]));
E.set("image_speed",E.call("random_range",[0,6]));
E.set("hsp",E.call("random_range",[(-6),6]));
E.set("vsp",E.call("random_range",[(-2),2]));
E.set("image_xscale",E.call("choose",[1,(-1)]));
E.set("image_yscale",E.call("choose",[1,(-1)]));
}
,
"gml_Object_odust_Other_7":function(E){
E.call("instance_destroy",[]);
}
,
"gml_Object_odust_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_odust_Step_0":function(E){
E.set("x",(E.get("x") + E.get("hsp")));
E.set("y",(E.get("y") + E.get("vsp")));
E.set("hsp",(E.get("hsp") * 0.9));
E.set("vsp",(E.get("vsp") * 0.9));
}
,
"gml_Object_ogirlsad_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_ogirlsad_Step_0":function(E){
if((E.member(E.get("global"),"php") == 0)){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oGirltext71")]);
}
else {}
}
,
"gml_Object_ogrenadepickup_Collision_Object1":function(E){
E.call("instance_destroy",[E.get("oGun")]);
E.put(E.get("global"),"weapon2",true);
}
,
"gml_Object_ogrenadepickup_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_ogrenadepickup_Step_0":function(E){
E.set("y",(E.get("ystart") + (E.call("sin",[(E.call("get_timer",[]) / 200000)]) * 10)));
}
,
"gml_Object_ojobbutton1_Collision_Object1":function(E){
}
,
"gml_Object_ojobbutton1_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_ojobbutton1_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.call("instance_destroy",[E.get("ojobbutton1")]);
E.call("instance_destroy",[E.get("ojobbutton2")]);
E.call("instance_destroy",[E.get("ojobmenu")]);
E.put(E.get("global"),"hascontrol",1);
E.call("petrol_shift_start",[]);
E.call("instance_create_layer",[E.get("x"),E.get("y"),"quests",E.get("oQuestObjectives3")]);
E.call("instance_destroy",[E.get("oQuestMarker2")]);
for(const __target1 of E.targets(E.get("oQuestObjectives3"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("killtextscale",2);
}
}}
E.put(E.get("global"),"dontshoot",false);
E.call("layer_set_visible",["gun",E.get("visible")]);
E.put(E.get("global"),"hasquest3",1);
}
else {}
}
,
"gml_Object_ojobbutton2_Collision_Object1":function(E){
}
,
"gml_Object_ojobbutton2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_ojobbutton2_Step_0":function(E){
if(((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom")))){
E.set("image_index",1);
}
else {
E.set("image_index",0);
}

if((E.truthy(E.call("mouse_check_button_pressed",[E.get("mb_left")])) && ((((E.get("mouse_x") >= E.get("bbox_left")) && (E.get("mouse_x") <= E.get("bbox_right"))) && (E.get("mouse_y") >= E.get("bbox_top"))) && (E.get("mouse_y") <= E.get("bbox_bottom"))))){
E.put(E.get("global"),"hascontrol",1);
E.call("layer_set_visible",["gun",E.get("visible")]);
E.call("instance_destroy",[E.get("ojobbutton1")]);
E.call("instance_destroy",[E.get("ojobbutton2")]);
E.call("instance_destroy",[E.get("ojobmenu")]);
E.put(E.get("global"),"hascontrol",1);
}
else {}
}
,
"gml_Object_ojobmenu_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oshopping2_Collision_Object1":function(E){
}
,
"gml_Object_oshopping2_Create_0":function(E){
}
,
"gml_Object_oshopping2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oshopping2_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 80));
E.set("y",(E.member(E.get("Object1"),"y") - 550));
}
,
"gml_Object_oshopping3_Collision_Object1":function(E){
}
,
"gml_Object_oshopping3_Create_0":function(E){
}
,
"gml_Object_oshopping3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oshopping3_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 80));
E.set("y",(E.member(E.get("Object1"),"y") - 550));
}
,
"gml_Object_oshoppinginbox2_Collision_Object1":function(E){
}
,
"gml_Object_oshoppinginbox2_Create_0":function(E){
}
,
"gml_Object_oshoppinginbox2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oshoppinginbox2_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 80));
E.set("y",(E.member(E.get("Object1"),"y") - 550));
}
,
"gml_Object_oshoppinginbox3_Alarm_0":function(E){
}
,
"gml_Object_oshoppinginbox3_Collision_Object1":function(E){
}
,
"gml_Object_oshoppinginbox3_Create_0":function(E){
if((E.member(E.get("global"),"takenallowance") == 0)){
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("oBulletsLeftGreen")]);
E.call("greentext",[]);
}
else {}
}
,
"gml_Object_oshoppinginbox3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oshoppinginbox3_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 80));
E.set("y",(E.member(E.get("Object1"),"y") - 550));
}
,
"gml_Object_oshoppinginbox_Collision_Object1":function(E){
}
,
"gml_Object_oshoppinginbox_Create_0":function(E){
}
,
"gml_Object_oshoppinginbox_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oshoppinginbox_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 80));
E.set("y",(E.member(E.get("Object1"),"y") - 550));
}
,
"gml_Object_oshoppingmail_Collision_Object1":function(E){
}
,
"gml_Object_oshoppingmail_Create_0":function(E){
E.set("image_index",0);
E.set("image_speed",0);
}
,
"gml_Object_oshoppingmail_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oshoppingmail_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 80));
E.set("y",(E.member(E.get("Object1"),"y") - 550));
}
,
"gml_Object_oshoppingstocks_Collision_Object1":function(E){
}
,
"gml_Object_oshoppingstocks_Create_0":function(E){
}
,
"gml_Object_oshoppingstocks_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oshoppingstocks_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 80));
E.set("y",(E.member(E.get("Object1"),"y") - 550));
}
,
"gml_Object_oshoppingyoutube_Collision_Object1":function(E){
}
,
"gml_Object_oshoppingyoutube_Create_0":function(E){
}
,
"gml_Object_oshoppingyoutube_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_oshoppingyoutube_Step_0":function(E){
E.set("x",(E.member(E.get("Object1"),"x") + 80));
E.set("y",(E.member(E.get("Object1"),"y") - 550));
}
,
"gml_Object_playerwall_Create_0":function(E){
}
,
"gml_Object_playerwall_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_playerwall_Step_0":function(E){
}
,
"gml_Object_playerwallcustomer_Create_0":function(E){
}
,
"gml_Object_playerwallcustomer_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_playerwallcustomer_Step_0":function(E){
}
,
"gml_Object_pshootable68_Draw_0":function(E){
E.call("draw_self",[]);
if((E.get("flash") > 0)){
E.set("flash",(E.get("flash") - 1));
E.call("shader_set",[E.get("shWhite")]);
E.call("draw_self",[]);
E.call("shader_reset",[]);
}
else {}
}
,
"gml_Object_pshootable68_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("hp",4);
E.set("flash",0);
}
,
"gml_Object_pshootable68_Step_1":function(E){
if((E.get("hp") <= 0)){
E.call("instance_destroy",[]);
}
else {}
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oGirl16364")]))){
E.set("hp",(E.get("hp") - 1));
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
E.call("audio_play_sound",[E.get("yamete"),3,false]);
}
else {}
}
,
"gml_Object_pshootable_Draw_0":function(E){
E.call("draw_self",[]);
if((E.get("flash") > 0)){
E.set("flash",(E.get("flash") - 1));
E.call("shader_set",[E.get("shWhite")]);
E.call("draw_self",[]);
E.call("shader_reset",[]);
}
else {}
}
,
"gml_Object_pshootable_PreCreate_0":function(E){
E.call("event_inherited",[]);
E.set("hp",4);
E.set("flash",0);
}
,
"gml_Object_pshootable_Step_1":function(E){
if((E.get("hp") <= 0)){
E.call("instance_destroy",[]);
}
else {}
}
,
"gml_Object_wall2_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_wall34344_Create_0":function(E){
}
,
"gml_Object_wall34344_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_wall34344_Step_0":function(E){
}
,
"gml_Object_wall343_Create_0":function(E){
}
,
"gml_Object_wall343_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_wall343_Step_0":function(E){
}
,
"gml_Object_wall3_Create_0":function(E){
}
,
"gml_Object_wall3_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_wall3_Step_0":function(E){
}
,
"gml_Object_wall46_Create_0":function(E){
}
,
"gml_Object_wall46_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_wall46_Step_0":function(E){
}
,
"gml_Object_wall_Create_0":function(E){
}
,
"gml_Object_wall_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_wall_Step_0":function(E){
}
,
"gml_Object_wallcustomer_Create_0":function(E){
}
,
"gml_Object_wallcustomer_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_wallcustomer_Step_0":function(E){
}
,
"gml_Object_wallend_Create_0":function(E){
}
,
"gml_Object_wallend_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_wallend_Step_0":function(E){
}
,
"gml_Object_walltop_Create_0":function(E){
}
,
"gml_Object_walltop_PreCreate_0":function(E){
E.call("event_inherited",[]);
}
,
"gml_Object_walltop_Step_0":function(E){
}
,
"gml_RoomCC_introroom2_0_Create":function(E){
E.set("target",1);
}
,
"gml_RoomCC_introroom_0_Create":function(E){
E.set("target",3);
}
,
"gml_RoomCC_petrolstationroom_0_Create":function(E){
E.set("target",7);
}
,
"gml_RoomCC_room1_0_Create":function(E){
E.set("target",2);
}
,
"gml_RoomCC_room26_0_Create":function(E){
E.set("target",7);
}
,
"gml_RoomCC_room26_10_PreCreate":function(E){
E.set("hasweapon",true);
}
,
"gml_RoomCC_room26_11_Create":function(E){
E.set("waves",E.call("ds_list_create",[]));
E.call("ds_list_add",[E.get("waves"),[0,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),0,6600);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),1,2400);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),0,6600);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),1,2400);
}
,
"gml_RoomCC_room26_12_Create":function(E){
E.set("waves",E.call("ds_list_create",[]));
E.call("ds_list_add",[E.get("waves"),[0,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),0,5100);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),1,1680);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),0,5100);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),1,1680);
}
,
"gml_RoomCC_room26_13_Create":function(E){
E.set("target",7);
}
,
"gml_RoomCC_room26_1_PreCreate":function(E){
E.set("text","1 new\nmessage");
E.set("text2","Daniel, you need to GET A JOB!\nWe are coming for you... From, Your Haters.");
}
,
"gml_RoomCC_room26_2_Create":function(E){
E.set("waves",E.call("ds_list_create",[]));
E.call("ds_list_add",[E.get("waves"),[0,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),0,3000);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),1,2200);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),0,3000);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),1,2200);
}
,
"gml_RoomCC_room26_3_PreCreate":function(E){
E.set("hasweapon",true);
}
,
"gml_RoomCC_room26_4_Create":function(E){
E.set("waves",E.call("ds_list_create",[]));
E.call("ds_list_add",[E.get("waves"),[0,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),0,9100);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),1,2200);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),0,9100);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),1,2300);
}
,
"gml_RoomCC_room26_5_PreCreate":function(E){
E.set("hasweapon",true);
}
,
"gml_RoomCC_room26_6_PreCreate":function(E){
E.set("hasweapon",true);
}
,
"gml_RoomCC_room26_7_PreCreate":function(E){
E.set("hasweapon",true);
}
,
"gml_RoomCC_room26_8_PreCreate":function(E){
E.set("hasweapon",true);
}
,
"gml_RoomCC_room26_9_PreCreate":function(E){
E.set("hasweapon",true);
}
,
"gml_RoomCC_room3_0_Create":function(E){
E.set("target",5);
}

};
export const SCRIPTS={
"DrawSetText":function(E){
E.declare("arg0",E.args[0] ?? 0);
E.declare("arg1",E.args[1] ?? 0);
E.declare("arg2",E.args[2] ?? 0);
E.declare("arg3",E.args[3] ?? 0);
{
E.call("draw_set_colour",[E.get("arg0")]);
E.call("draw_set_font",[E.get("arg1")]);
E.call("draw_set_halign",[E.get("arg2")]);
E.call("draw_set_valign",[E.get("arg3")]);
}
},
"KillPlayer":function(E){
{
if((E.truthy(E.call("cheat_enabled",["invincible"])) || E.truthy(E.call("instance_exists",[E.get("oPDead")])))){
return ;
}
else {}
E.put(E.get("global"),"php",E.call("max",[0,(E.member(E.get("global"),"php") - 1)]));
if((E.member(E.get("global"),"php") == 0)){
E.put(E.get("global"),"respawnweapon",E.get("oGun"));
if(E.truthy(E.call("instance_exists",[E.get("oGun59")]))){
E.put(E.get("global"),"respawnweapon",E.get("oGun59"));
}
else {}
for(const __target1 of E.targets(E.get("oGun"))){const E2=E.withSelf(__target1);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
for(const __target2 of E.targets(E.get("oGun59"))){const E2=E.withSelf(__target2);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
E.call("instance_create_layer",[E.get("x"),E.get("y"),"bullets",E.get("oPDead")]);
E.call("layer_set_visible",["player",(!E.truthy(E.get("visible")))]);
E.put(E.get("global"),"hascontrol",0);
E.put(E.get("Object1"),"x",E.member(E.get("oPDead"),"x"));
E.call("instance_destroy",[E.get("oBulletsLeftGreen")]);
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") - 200));
for(const __target3 of E.targets(E.get("oBulletsLeftRed"))){const E2=E.withSelf(__target3);{const E=E2;{
E.set("killtextscale",23);
}
}}
E.set("direction",E.call("point_direction",[E.member(E.get("other"),"x"),E.member(E.get("other"),"y"),E.get("x"),E.get("y")]));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
}
else {}
}
},
"KillPlayer9":function(E){
{
if((E.truthy(E.call("cheat_enabled",["invincible"])) || E.truthy(E.call("instance_exists",[E.get("oPDead")])))){
return ;
}
else {}
if(E.truthy(E.call("place_meeting",[E.member(E.get("Object1"),"x"),E.member(E.get("Object1"),"y"),E.get("oKillTrigger")]))){
E.put(E.get("global"),"php",E.call("max",[0,(E.member(E.get("global"),"php") - 1)]));
if((E.member(E.get("global"),"php") == 0)){
for(const __target1 of E.targets(E.get("oGun"))){const E2=E.withSelf(__target1);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
for(const __target2 of E.targets(E.get("oGun59"))){const E2=E.withSelf(__target2);{const E=E2;{
E.call("instance_destroy",[]);
}
}}
E.call("instance_change",[E.get("oPDead"),true]);
E.call("instance_destroy",[E.get("oSign")]);
E.call("instance_destroy",[E.get("oGirl16364")]);
E.call("instance_create_layer",[E.get("x"),E.get("y"),E.get("layer"),E.get("ogirlsad")]);
E.set("direction",E.call("point_direction",[E.member(E.get("other"),"x"),E.member(E.get("other"),"y"),E.get("x"),E.get("y")]));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
E.put(E.get("global"),"kills",(E.member(E.get("global"),"kills") - E.member(E.get("global"),"killsthisroom")));
}
else {}
}
else {}
}
},
"approach":function(E){
{
if((E.get("argument0") < E.get("argument1"))){
E.set("argument0",(E.get("argument0") + E.get("argument2")));
if((E.get("argument0") > E.get("argument1"))){
return E.get("argument1");
}
else {}
}
else {
E.set("argument0",(E.get("argument0") - E.get("argument2")));
if((E.get("argument0") < E.get("argument1"))){
return E.get("argument1");
}
else {}
}

return E.get("argument0");
}
},
"changeweapon":function(E){
{
E.set("weapon",E.get("argument0"));
E.declare("wp_map",E.index(E.get("weapons"),E.get("weapon")));
E.set("sprite",E.call("ds_map_find_value",[E.get("wp_map"),"sprite"]));
E.set("recoil",E.call("ds_map_find_value",[E.get("wp_map"),"recoil"]));
E.set("recoil_push",E.call("ds_map_find_value",[E.get("wp_map"),"recoil_push"]));
E.set("damage",E.call("ds_map_find_value",[E.get("wp_map"),"damage"]));
E.set("projectile",E.call("ds_map_find_value",[E.get("wp_map"),"projectile"]));
E.set("startup",E.call("ds_map_find_value",[E.get("wp_map"),"startup"]));
E.set("bulletspeed",E.call("ds_map_find_value",[E.get("wp_map"),"bulletspeed"]));
E.set("length",E.call("ds_map_find_value",[E.get("wp_map"),"length"]));
E.set("cooldown",E.call("ds_map_find_value",[E.get("wp_map"),"cooldown"]));
E.set("automatic",E.call("ds_map_find_value",[E.get("wp_map"),"automatic"]));
}
},
"destroycomputer":function(E){
{
if(E.truthy(E.call("place_meeting",[E.get("x"),E.get("y"),E.get("oSign")]))){
for(const __target1 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("oSign")]))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
E.set("direction",E.call("point_direction",[E.member(E.get("other"),"x"),E.member(E.get("other"),"y"),E.get("x"),E.get("y")]));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
}
}}
for(const __target2 of E.targets(E.call("instance_place",[E.get("x"),E.get("y"),E.get("oComputerDead")]))){const E2=E.withSelf(__target2);{const E=E2;{
E.set("hp",(E.get("hp") - 1));
E.set("flash",3);
E.set("hitfrom",E.member(E.get("other"),"direction"));
E.set("direction",E.call("point_direction",[E.member(E.get("other"),"x"),E.member(E.get("other"),"y"),E.get("x"),E.get("y")]));
E.set("hsp",E.call("lengthdir_x",[6,E.get("direction")]));
E.set("vsp",(E.call("lengthdir_y",[4,E.get("direction")]) - 2));
if((E.call("sign",[E.get("hsp")]) != 0)){
E.set("image_xscale",E.call("sign",[E.get("hsp")]));
}
else {}
}
}}
E.call("instance_destroy",[]);
}
else {}
}
},
"greentext":function(E){
{
E.put(E.get("global"),"greentimer",0);
for(const __target1 of E.targets(E.get("oBulletsLeftGreen"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("killtextscale",5);
}
}}
E.putIndex(E.ensureArray("alarm"),0,30);
if((E.member(E.get("global"),"greentimer") == (-2))){
E.call("instance_destroy",[E.get("oBulletsLeftGreen")]);
}
else {}
if((E.member(E.get("global"),"greentimer") == (-1))){
E.put(E.get("global"),"greentimer",0);
E.putIndex(E.ensureArray("alarm"),0,(-1));
}
else {}
}
},
"loadgame":function(E){
{
if(E.truthy(E.call("file_exists",["User.sav"]))){
E.call("ini_open",["User.sav"]);
E.put(E.get("global"),"kills",E.call("ini_read_real",["Save1","gscore",E.member(E.get("global"),"kills")]));
E.put(E.get("global"),"ammo",E.call("ini_read_real",["Save1","gammo",E.member(E.get("global"),"ammo")]));
E.put(E.get("global"),"bullets",E.call("ini_read_real",["Save1","ggrenades",E.member(E.get("global"),"bullets")]));
E.put(E.get("global"),"php",E.call("ini_read_real",["Save1","gphp",E.member(E.get("global"),"php")]));
E.put(E.get("global"),"slowmo",E.call("ini_read_real",["Save1","gslowmo",E.member(E.get("global"),"slowmo")]));
E.put(E.get("global"),"stocks",E.call("ini_read_real",["Save1","gstocks",E.member(E.get("global"),"stocks")]));
E.put(E.get("global"),"tapes",E.call("ini_read_real",["Save1","gtapes",E.member(E.get("global"),"tapes")]));
E.put(E.get("global"),"takenallowance",E.call("ini_read_real",["Save1","gallowance",E.member(E.get("global"),"takenallowance")]));
E.call("ini_close",[]);
E.put(E.get("global"),"php",E.call("clamp",[E.call("floor",[E.member(E.get("global"),"php")]),0,8]));
if((!E.truthy(E.call("instance_exists",[E.get("oPDead")])))){
E.put(E.get("global"),"php",E.call("max",[1,E.member(E.get("global"),"php")]));
}
else {}
E.put(E.get("global"),"ammo",E.call("max",[0,E.call("floor",[E.member(E.get("global"),"ammo")])]));
E.put(E.get("global"),"bullets",E.call("max",[0,E.call("floor",[E.member(E.get("global"),"bullets")])]));
E.put(E.get("global"),"tapes",E.call("max",[0,E.call("floor",[E.member(E.get("global"),"tapes")])]));
E.put(E.get("global"),"slowmo",E.call("clamp",[E.member(E.get("global"),"slowmo"),0,100]));
}
else {
}

}
},
"savegame":function(E){
{
E.call("ini_open",["User.sav"]);
E.call("ini_write_real",["Save1","gscore",E.member(E.get("global"),"kills")]);
E.call("ini_write_real",["Save1","gammo",E.member(E.get("global"),"ammo")]);
E.call("ini_write_real",["Save1","ggrenades",E.member(E.get("global"),"bullets")]);
E.call("ini_write_real",["Save1","gphp",E.member(E.get("global"),"php")]);
E.call("ini_write_real",["Save1","gslowmo",E.member(E.get("global"),"slowmo")]);
E.call("ini_write_real",["Save1","gstocks",E.member(E.get("global"),"stocks")]);
E.call("ini_write_real",["Save1","gtapes",E.member(E.get("global"),"tapes")]);
E.call("ini_write_real",["Save1","gallowance",E.member(E.get("global"),"takenallowance")]);
E.call("ini_close",[]);
}
},
"screenShake":function(E){
for(const __target1 of E.targets(E.get("oCamera"))){const E2=E.withSelf(__target1);{const E=E2;{
if((E.get("argument0") > E.get("shake_remain"))){
E.set("shake_magnitude",E.get("argument0"));
E.set("shake_remain",E.get("argument0"));
E.set("shake_length",E.get("argument1"));
}
else {}
}
}}
}
,
"slideTransition":function(E){
for(const __target1 of E.targets(E.get("oTransition"))){const E2=E.withSelf(__target1);{const E=E2;{
E.set("mode",E.index(E.get("argument"),0));
if((E.get("argument_count") > 1)){
E.set("target",E.index(E.get("argument"),1));
}
else {}
}
}}
}
,
"solidObject":function(E){
{
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oCar")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("oCar")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
if(E.truthy(E.call("place_meeting",[(E.get("x") + E.get("hsp")),E.get("y"),E.get("oDoor")]))){
while((!E.truthy(E.call("place_meeting",[(E.get("x") + E.call("sign",[E.get("hsp")])),E.get("y"),E.get("oCar")])))){E.tick();
{
E.set("x",(E.get("x") + E.call("sign",[E.get("hsp")])));
}
}
E.set("hsp",0);
}
else {}
E.set("x",(E.get("x") + E.get("hsp")));
if(E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.get("vsp")),E.get("oCar")]))){
while((!E.truthy(E.call("place_meeting",[E.get("x"),(E.get("y") + E.call("sign",[E.get("vsp")])),E.get("oCar")])))){E.tick();
{
E.set("y",(E.get("y") + E.call("sign",[E.get("vsp")])));
}
}
E.set("vsp",0);
}
else {}
}
},
"spawns":function(E){
{
E.set("waves",E.call("ds_list_create",[]));
E.call("ds_list_add",[E.get("waves"),[0,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[0,140,0,60]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,10]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,20]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,30]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,40]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,50]]);
E.call("ds_list_add",[E.get("waves"),[0,140,1,60]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,10]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,20]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,30]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,40]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,50]]);
E.call("ds_list_add",[E.get("waves"),[1,140,0,60]]);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),0,2000);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),0),1,500);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),0,1700);
E.putIndex(E.ensureIndex(E.ensureArray("spawn"),1),1,500);
}
}
};
