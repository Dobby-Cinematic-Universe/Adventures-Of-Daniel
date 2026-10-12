function loadgame()
{
    if (file_exists("User.sav"))
    {
        ini_open("User.sav");
        global.kills = ini_read_real("Save1", "gscore", 0);
        global.ammo = ini_read_real("Save1", "gammo", 0);
        global.bullets = ini_read_real("Save1", "ggrenades", 0);
        global.php = ini_read_real("Save1", "gphp", 0);
        global.slowmo = ini_read_real("Save1", "gslowmo", 0);
        global.stocks = ini_read_real("Save1", "gstocks", 0);
        global.tapes = ini_read_real("Save1", "gtapes", 0);
        global.takenallowance = ini_read_real("Save1", "gallowance", 0);
        ini_close();
    }
    else
    {
    }
}
