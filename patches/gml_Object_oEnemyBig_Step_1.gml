if (hp <= 0)
{
    var remains = instance_create_layer(x, y, layer, oDeadBig);
    instance_create_layer(x, y, layer, oEnemyBloodspatter);
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
    with (mygun)
    {
        instance_destroy();
    }
    if (instance_exists(Object1))
    {
        global.kills += random_range(2.22, 5.71);
        global.killsthisroom += 0.2;
        with (oBulletsLeft)
        {
            killtextscale = 2;
        }
    }
    instance_destroy();
}
if (hsp != 0)
{
    image_xscale = sign(hsp) * size;
}
image_yscale = size;
