if (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom)
{
    image_index = 1;
}
else
{
    image_index = 0;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.kills >= 100)
{
    audio_play_sound(clicks, 4, false);
    global.kills -= 50;
    global.bullets++;
}
if (mouse_check_button_pressed(mb_left) && global.kills < 99 && !instance_exists(oDanielText2))
{
    instance_create_layer(Object1.x, Object1.y - 85, layer, oDanielText2);
}
x = Object1.x + 130;
y = Object1.y - 100;
