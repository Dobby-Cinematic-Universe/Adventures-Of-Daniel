if (global.php == 0)
{
    instance_create_layer(x, y, layer, oGirltext71);
}
if (place_meeting(x, y + vsp, wall))
{
    while (!place_meeting(x, y + sign(vsp), wall))
    {
        y += sign(vsp);
        audio_play_sound(choose(fatguyfal), 4, false);
        screenShake(6, 25);
        audio_play_sound(groundland, 4, false);
        instance_create_layer(x, bbox_bottom, "bullets", odust);
    }
    vsp = 0;
    image_speed = 1;
    sprite_index = daniel113;
    gravity = 0;
}
y += vsp;
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
vspeed = 0;
