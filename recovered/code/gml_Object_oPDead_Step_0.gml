if (done == 0)
{
    vsp += grv;
    if (place_meeting(x + hsp, y, wall))
    {
        while (!place_meeting(x + sign(hsp), y, wall))
        {
            x += sign(hsp);
        }
        hsp = 0;
    }
    x += hsp;
    if (place_meeting(x, y + vsp, wall))
    {
        if (vsp > 0)
        {
            audio_play_sound(splash, 2, false);
            instance_create_layer(oPDead.x, oPDead.y - 80, layer, oDanielText6);
            audio_play_sound(choose(fatguyfal), 4, false);
            screenShake(6, 25);
            done = 1;
            image_index = 1;
            alarm[0] = 60;
            Object1.x = oPDead.x;
            Object1.y = oPDead.y + 2.5;
        }
        while (!place_meeting(x, y + sign(vsp), wall))
        {
            y += sign(vsp);
        }
        vsp = 0;
    }
    y += vsp;
}
if (hspeed == 0)
{
    instance_create_layer(oPDead.x, oPDead.y + 500, "player", oDanielText6);
}
if (keyboard_check_pressed(vk_space) && vsp == 0)
{
    instance_destroy();
    global.hascontrol = 1;
    layer_set_visible("player", visible);
    Object1.x = oBedSleep.x;
    Object1.y = oBedSleep.y - 90;
    global.php = 8;
    instance_destroy(oBulletsLeftRed);
    if (!instance_exists(oGunPickup))
    {
        instance_create_layer(Object1.x, Object1.y, "Gun", oGun);
    }
    if (!instance_exists(ogrenadepickup))
    {
        instance_create_layer(Object1.x, Object1.y, "Gun", oGun59);
    }
}
if (global.greentimer == -5)
{
    instance_destroy(oBulletsLeftRed);
}
