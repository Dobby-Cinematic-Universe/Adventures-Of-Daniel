x += lengthdir_x(spd, direction);
y += lengthdir_y(spd, direction);
if (place_meeting(x, y, pshootable))
{
    with (instance_place(x, y, pshootable))
    {
        instance_create_layer(x, y, layer, oExplosion);
        flash = 3;
        hitfrom = other.direction;
    }
    instance_destroy();
}
if (place_meeting(x, y, wall) && image_index != 0)
{
    while (place_meeting(x, y, wall))
    {
        x -= lengthdir_x(1, direction);
        y -= lengthdir_y(1, direction);
    }
    spd = 0;
    instance_change(oHitspark, true);
    instance_change(oExplosion, true);
    layer_add_instance("player", id);
    depth += 1;
}
