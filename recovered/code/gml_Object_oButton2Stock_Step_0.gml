x = Object1.x + 350;
y = Object1.y - 100;
if (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom)
{
    image_index = 1;
}
else
{
    image_index = 0;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.stocks != 0)
{
    audio_play_sound(chaching, 4, false);
    global.kills = global.kills + global.stocks;
    global.stocks = 0;
    global.stocks = max(0);
    global.stocksdown = 0;
    instance_destroy(oButton1Stock);
    instance_create_layer(Object1.x + 200, Object1.y - 100, layer, oButton1Stock);
}
