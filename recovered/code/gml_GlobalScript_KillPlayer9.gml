function KillPlayer9()
{
    if (place_meeting(Object1.x, Object1.y, oKillTrigger))
    {
        global.php--;
        if (global.php == 0)
        {
            with (oGun)
            {
                instance_destroy();
            }
            with (oGun59)
            {
                instance_destroy();
            }
            instance_change(oPDead, true);
            instance_destroy(oSign);
            instance_destroy(oGirl16364);
            instance_create_layer(x, y, layer, ogirlsad);
            direction = point_direction(other.x, other.y, x, y);
            hsp = lengthdir_x(6, direction);
            vsp = lengthdir_y(4, direction) - 2;
            if (sign(hsp) != 0)
            {
                image_xscale = sign(hsp);
            }
            global.kills -= global.killsthisroom;
        }
    }
}
