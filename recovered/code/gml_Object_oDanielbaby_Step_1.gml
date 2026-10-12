if (place_meeting(x, y, pshootable))
{
    with (instance_place(x, y, pshootable))
    {
        hp--;
        flash = 7;
        hitfrom = other.direction;
    }
}
