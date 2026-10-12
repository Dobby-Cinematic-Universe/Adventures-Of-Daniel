y = ystart + (sin(get_timer() / 200000) * 10);
if (place_meeting(x, y, Object1))
{
    with (instance_place(x, y, Object1))
    {
        flash = 3;
        hitfrom = other.direction;
    }
}
