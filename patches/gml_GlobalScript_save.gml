function savegame()
{
    ini_open("User.sav");
    ini_write_real("Save1", "gscore", global.kills);
    ini_write_real("Save1", "gammo", global.ammo);
    ini_write_real("Save1", "ggrenades", global.bullets);
    ini_write_real("Save1", "gphp", global.php);
    ini_write_real("Save1", "gslowmo", global.slowmo);
    ini_write_real("Save1", "gstocks", global.stocks);
    ini_write_real("Save1", "gtapes", global.tapes);
    ini_write_real("Save1", "gallowance", global.takenallowance);
    ini_close();
}
