function loadgame()
{
    if (argument_count > 0 && argument[0] && global.skipstatsautoload)
    {
        return;
    }
    if (file_exists("User.sav"))
    {
        ini_open("User.sav");
        global.kills = ini_read_real("Save1", "gscore", global.kills);
        global.ammo = ini_read_real("Save1", "gammo", global.ammo);
        global.bullets = ini_read_real("Save1", "ggrenades", global.bullets);
        global.php = ini_read_real("Save1", "gphp", global.php);
        global.slowmo = ini_read_real("Save1", "gslowmo", global.slowmo);
        global.stocks = ini_read_real("Save1", "gstocks", global.stocks);
        global.tapes = ini_read_real("Save1", "gtapes", global.tapes);
        global.takenallowance = ini_read_real("Save1", "gallowance", global.takenallowance);
        ini_close();
        global.php = clamp(floor(global.php), 0, 8);
        if (!instance_exists(oPDead))
        {
            global.php = max(1, global.php);
        }
        global.ammo = max(0, floor(global.ammo));
        global.bullets = max(0, floor(global.bullets));
        global.tapes = max(0, floor(global.tapes));
        global.slowmo = clamp(global.slowmo, 0, 100);
    }
    else
    {
    }
}
