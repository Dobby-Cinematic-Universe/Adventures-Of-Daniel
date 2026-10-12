if (place_meeting(x, y, oSign))
{
    with (instance_place(x, y, oSign))
    {
        hp -= 1;
        flash = 3;
        hitfrom = other.direction;
    }
    instance_destroy();
}
if (place_meeting(x, y, oDoor))
{
    with (instance_place(x, y, oDoor))
    {
        hp -= 1;
        flash = 3;
        hitfrom = other.direction;
    }
    instance_destroy();
}
if (place_meeting(x, y, oEnemy))
{
    with (instance_place(x, y, oEnemy))
    {
        hp -= 1;
        flash = 3;
        hitfrom = other.direction;
    }
    instance_destroy();
}
