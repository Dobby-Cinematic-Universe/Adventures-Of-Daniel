function KillPlayer(force)
{
    if ((!force && cheat_enabled("invincible")) || instance_exists(oPDead))
    {
        return;
    }
    if (force)
    {
        global.php = 0;
    }
    else
    {
        global.php = max(0, global.php - 1);
    }
    if (global.php == 0)
    {
        global.respawnweapon = oGun;
        if (instance_exists(oGun59))
        {
            global.respawnweapon = oGun59;
        }
        with (oGun)
        {
            instance_destroy();
        }
        with (oGun59)
        {
            instance_destroy();
        }
        instance_create_layer(x, y, "bullets", oPDead);
        layer_set_visible("player", !visible);
        global.hascontrol = 0;
        Object1.x = oPDead.x;
        instance_destroy(oBulletsLeftGreen);
        global.kills -= 200;
        with (oBulletsLeftRed)
        {
            killtextscale = 23;
        }
        direction = point_direction(other.x, other.y, x, y);
        hsp = lengthdir_x(6, direction);
        vsp = lengthdir_y(4, direction) - 2;
        if (sign(hsp) != 0)
        {
            image_xscale = sign(hsp);
        }
    }
}
