function destroycomputer()
{
    if (place_meeting(x, y, oSign))
    {
        with (instance_place(x, y, oSign))
        {
            hp--;
            flash = 3;
            hitfrom = other.direction;
            direction = point_direction(other.x, other.y, x, y);
            hsp = lengthdir_x(6, direction);
            vsp = lengthdir_y(4, direction) - 2;
            if (sign(hsp) != 0)
            {
                image_xscale = sign(hsp);
            }
        }
        with (instance_place(x, y, oComputerDead))
        {
            hp--;
            flash = 3;
            hitfrom = other.direction;
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
}
