if (hp <= 0)
{
    var remains = instance_create_layer(x, y, "housematerials", oCarDead);
    instance_create_layer(x, y, layer, oExplosion);
    with (remains)
    {
        direction = other.hitfrom;
        hsp = lengthdir_x(3, direction);
        vsp = lengthdir_y(3, direction) - 2;
        if (sign(hsp) != 0)
        {
            image_xscale = sign(hsp);
        }
    }
    instance_destroy();
}
