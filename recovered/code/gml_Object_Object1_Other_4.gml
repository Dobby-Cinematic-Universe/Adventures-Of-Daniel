if (file_exists("Save.sav"))
{
    file_delete("Save.sav");
}
var file = file_text_open_write("Save.sav");
file_text_write_real(file, room);
file_text_write_real(file, global.kills);
file_text_close(file);
if (global.stocks > 1)
{
    instance_create_layer(x, y, layer, oButton1Stock);
}
loadgame();
global.greentimer = 0;
layer_set_visible("specialbutton", !visible);
