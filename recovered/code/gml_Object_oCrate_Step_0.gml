vsp += grv;
if (place_meeting(x, y + vsp, wall))
{
    while (!place_meeting(x, y + sign(vsp), wall))
    {
        y += sign(vsp);
    }
    vsp = 0;
}
if (place_meeting(x, y + vsp, wallcustomer))
{
    while (!place_meeting(x, y + sign(vsp), wallcustomer))
    {
        y += sign(vsp);
    }
    vsp = 0;
}
y += vsp;
if (keyboard_check_pressed(ord("E")) && point_in_circle(Object1.x, Object1.y, x, y, 100))
{
    global.killsgreen = 0;
    audio_play_sound(chaching, 4, false);
    instance_destroy();
    if (instance_exists(oDanielText7))
    {
        instance_destroy(oDanielText7);
    }
    instance_create_layer(Object1.x, Object1.y - 80, layer, oDanielText7);
    global.customer3spd -= 2;
}
