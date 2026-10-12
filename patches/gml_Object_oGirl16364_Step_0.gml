if (hsp > 2)
{
    hsp = -2;
}
else
{
}
vsp += grv;
if (point_in_circle(Object1.x, Object1.y, x, y, 111) && keyboard_check_pressed(ord("Q")) && Object1.x < oGirl16364.x && instance_exists(Object1))
{
    instance_create_layer(x, y, layer, oDanielbaby);
    audio_play_sound(kissing, 3, false);
    instance_create_layer(Object1.x - 53, Object1.y - 190, layer, oGirl163);
    instance_create_layer(oGirl16364.x - 53, oGirl16364.y - 190, layer, oGirl16378);
}
hspeed = 0;
if (point_in_circle(Object1.x, Object1.y, x, y, 111) && keyboard_check(ord("E")) && instance_exists(Object1) && global.hascontrol)
{
    if (keyboard_check(ord("D")))
    {
        x = Object1.x - 67;
        sprite_index = girlrunning;
    }
    else if (keyboard_check(ord("A")))
    {
        x = Object1.x + 67;
        sprite_index = girlrunning;
    }
    else if (Object1.x < x)
    {
        x = Object1.x + 67;
    }
    else
    {
        x = Object1.x - 67;
    }
    y = Object1.y;
    var aimside = sign(mouse_x - x);
    if (aimside != 0)
    {
        image_xscale = aimside;
    }
    if (keyboard_check_pressed(vk_space))
    {
        vsp = -9;
        sprite_index = girljump2;
    }
}
if (!place_meeting(x, y + 1, wall))
{
    sprite_index = girljump2;
    image_speed = 1;
    if (sign(vsp) > 0)
    {
        sprite_index = girljump;
    }
}
else if (sprite_index == girljump)
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
if (place_meeting(x, y, wall) && vsp < 0 && sprite_index != daniel113 && hsp == 0)
{
    audio_play_sound(groundland, 4, false);
    repeat (5)
    {
        with (instance_create_layer(x, bbox_bottom, "bullets", odust))
        {
            vspeed = 0;
            vsp = 0;
        }
    }
}
