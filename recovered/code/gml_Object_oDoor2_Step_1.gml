if (hp <= 0)
{
    with (instance_create_layer(x, y, layer, oDoorDead) && instance_create_layer(x, y, layer, oExplosion65))
    {
        direction = point_direction(other.x, other.y, x, y);
        hsp = lengthdir_x(6, direction);
        vsp = lengthdir_y(4, direction) - 2;
        if (sign(hsp) != 0)
        {
            image_xscale = sign(hsp);
        }
    }
    instance_destroy();
}
if (point_in_circle(Object1.x, Object1.y, x, y, 100) && keyboard_check(ord("E")) && instance_exists(oDoor))
{
    instance_create_layer(x, y, layer, oDoorOpen);
    instance_destroy(oDoor);
}
