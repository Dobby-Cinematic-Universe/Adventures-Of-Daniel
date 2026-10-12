if (hp <= 0)
{
    var remains = instance_create_layer(x, y, layer, oDoorDead);
    instance_create_layer(x, y, layer, oExplosion65);
    with (remains)
    {
        direction = other.hitfrom;
        hsp = lengthdir_x(6, direction);
        vsp = lengthdir_y(4, direction) - 2;
        if (sign(hsp) != 0)
        {
            image_xscale = sign(hsp);
        }
    }
    instance_destroy();
}
if (instance_exists(Object1) && point_in_circle(Object1.x, Object1.y, x, y, 100) && keyboard_check_pressed(ord("E")))
{
    instance_create_layer(x, y, layer, oDoorOpen);
    audio_play_sound(dooropensound, 1, false);
    instance_destroy();
}
