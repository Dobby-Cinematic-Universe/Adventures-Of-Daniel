vsp += grv;
if (grounded && afraidofheights && !place_meeting(x + hsp, y + 1, wall))
{
    hsp = -hsp;
}
if (place_meeting(x + hsp, y, wall))
{
    while (!place_meeting(x + sign(hsp), y, wall))
    {
        x += sign(hsp);
    }
    hsp = -hsp;
}
if (place_meeting(x + hsp, y, oDoor))
{
    while (!place_meeting(x + sign(hsp), y, oDoor))
    {
        x += sign(hsp);
    }
    hsp = -hsp;
}
x += hsp;
if (place_meeting(x, y + vsp, wall))
{
    while (!place_meeting(x, y + sign(vsp), wall))
    {
        y += sign(vsp);
        screenShake(6, 25);
        audio_play_sound(choose(fatguyfal), 4, false);
    }
    vsp = 0;
}
if (place_meeting(x, y + vsp, wall))
{
    while (!place_meeting(x, y + sign(vsp), wall))
    {
        y += sign(vsp);
    }
    vsp = 0;
}
y += vsp;
if (!place_meeting(x, y + 1, wall))
{
    grounded = false;
    sprite_index = fatguy;
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
    grounded = true;
    image_speed = 1;
    if (hsp == 0)
    {
        sprite_index = fatguy;
    }
    else
    {
        sprite_index = fatguy;
    }
}
if (hsp != 0)
{
    image_xscale = sign(hsp) * size;
}
image_yscale = size;
