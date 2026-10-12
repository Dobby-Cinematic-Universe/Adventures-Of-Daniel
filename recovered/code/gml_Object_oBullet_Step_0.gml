x += lengthdir_x(spd, direction);
y += lengthdir_y(spd, direction);
layer_add_instance("floor", id);
depth += 1;
if (place_meeting(x, y, pshootable))
{
    with (instance_place(x, y, pshootable))
    {
        hp--;
        flash = 7;
        hitfrom = other.direction;
    }
    instance_destroy();
}
if (place_meeting(x, y, oCar))
{
    with (instance_place(x, y, oCar))
    {
        hp--;
        flash = 3;
        hitfrom = other.direction;
    }
    instance_destroy();
}
if (place_meeting(x, y, oCar49))
{
    with (instance_place(x, y, oCar49))
    {
        hp--;
        flash = 3;
        hitfrom = other.direction;
    }
    if (place_meeting(x, y, oEnemyBig))
    {
        with (instance_place(x, y, oEnemyBig))
        {
            hp--;
            flash = 3;
            hitfrom = other.direction;
        }
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
    layer_add_instance("floor", id);
    depth += 1;
}
