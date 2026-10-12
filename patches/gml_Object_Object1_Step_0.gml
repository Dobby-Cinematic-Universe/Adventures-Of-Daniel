// World-anchored choices must stay in reach after a launch or a midair click.
if (!global.hascontrol && (instance_exists(ojobmenu) || instance_exists(oQuestBox) || instance_exists(oButtonOff)))
{
    hsp = 0;
    vsp = 0;
    gunkickx = 0;
    gunkicky = 0;
    game_set_speed(60, gamespeed_fps);
    return;
}
if (player_unstick())
{
    gunkickx = 0;
    gunkicky = 0;
    return;
}
if (global.hascontrol)
{
    key_left = keyboard_check_pressed(vk_left) || keyboard_check(ord("A"));
    key_right = keyboard_check(vk_right) || keyboard_check(ord("D"));
    key_jump = keyboard_check_pressed(vk_space) || keyboard_check(ord("W"));
}
else
{
    key_right = 0;
    key_left = 0;
    key_jump = 0;
}
var move = key_right - key_left;
hsp = (move * walksp) + gunkickx;
gunkickx = 0;
vsp = vsp + grv + gunkicky;
gunkicky = 0;
if (place_meeting(x, y + 1, wall) || place_meeting(x, y + 1, oSign))
{
    jumps = 2;
}
if (key_jump && jumps > 0)
{
    jumps -= 1;
    vsp = -9;
}
if (mouse_check_button(mb_right) && (global.slowmo > 0 || cheat_enabled("infiniteSlowmo")))
{
    game_set_speed(30, gamespeed_fps);
    if (!cheat_enabled("infiniteSlowmo"))
    {
        global.slowmo--;
    }
}
else
{
    game_set_speed(60, gamespeed_fps);
}
if (place_meeting(x + hsp, y, wall))
{
    while (!place_meeting(x + sign(hsp), y, wall))
    {
        x += sign(hsp);
    }
    hsp = -hsp;
}
if (place_meeting(x + hsp, y, Object1))
{
    while (!place_meeting(x + sign(hsp), y, Object1))
    {
        x += sign(hsp);
    }
    hsp = 0;
}
if (place_meeting(x + hsp, y, oDoor))
{
    while (!place_meeting(x + sign(hsp), y, oDoor))
    {
        x += sign(hsp);
    }
    hsp = 0;
}
x += hsp;
if (abs(vsp) > 32)
{
    player_move_vertical(vsp);
}
else
{
    if (place_meeting(x, y + vsp, wall))
    {
        while (!place_meeting(x, y + sign(vsp), wall))
        {
            y += sign(vsp);
        }
        vsp = 0;
    }
    y += vsp;
}
var aimside = sign(mouse_x - x);
if (aimside != 0)
{
    image_xscale = aimside;
}
if (!place_meeting(x, y + 1, wall))
{
    sprite_index = danielJump;
    image_speed = 0;
    if (sign(vsp) > 0)
    {
        image_index = 1;
    }
    else
    {
        image_index = 0;
    }
}
else
{
    canjump = 10;
    if (sprite_index == danielJump)
    {
        audio_play_sound(groundland, 4, false);
        repeat (5)
        {
            with (instance_create_layer(x, bbox_bottom, "bullets", odust))
            {
                vsp = 0;
            }
        }
    }
    image_speed = 1;
    if (hsp == 0)
    {
        sprite_index = daniel;
    }
    else
    {
        sprite_index = runningSprite;
        if (aimside != sign(hsp))
        {
            sprite_index = runningSprite;
        }
    }
}
if (keyboard_check_pressed(ord("S")))
{
    savegame();
    if (!instance_exists(oDanielText5))
    {
        instance_create_layer(x, y, layer, oDanielText5);
    }
}
if (keyboard_check_pressed(ord("L")))
{
    loadgame();
}
if (keyboard_check_pressed(ord("A")) || (keyboard_check_pressed(ord("D")) && !instance_exists(oButtonOff)))
{
    global.dontshoot = true;
}
if (point_in_circle(oGirl16364.x, oGirl16364.y, x, y, 800) && !instance_exists(oGirltext2) && !instance_exists(oGirltext71) && !instance_exists(oPDead) && instance_exists(oGirl16364))
{
    instance_create_layer(x, y, "Gun", oGirltext2);
}
if (point_in_circle(oGirl16364.x, oGirl16364.y, x, y, 200))
{
    instance_destroy(oGirltext2);
}
if (instance_exists(oPDead) && !instance_exists(oGirltext71))
{
    instance_create_layer(x, y, "Gun", oGirltext71);
}
