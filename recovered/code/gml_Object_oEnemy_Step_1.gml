if (hp <= 0)
{
    with (instance_create_layer(x, y, layer, oDead) && instance_create_layer(x, y, layer, oEnemyBloodspatter))
    {
        direction = point_direction(other.x, other.y, x, y);
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
        instance_create_layer(x, y, layer, oBulletsLeftGreen);
        global.kills += 5.87;
        global.killsgreen += 5.87;
        global.killsthisroom += 0.2;
        global.greentimer = 0;
        with (oBulletsLeftGreen)
        {
            killtextscale = 3;
        }
        alarm[0] = 30;
        if (global.greentimer == -2)
        {
            instance_destroy(oBulletsLeftGreen);
        }
        if (global.greentimer == -1)
        {
            global.greentimer = 0;
            alarm[0] = -1;
        }
    }
    instance_destroy();
}
