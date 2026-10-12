// Keep the stock-price alarms alive without leaking the parked button into the world.
visible = instance_exists(oshoppingstocks);
if (!visible)
{
    return;
}
x = oshoppingstocks.x + 120;
y = oshoppingstocks.y + 450;
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
    global.kills -= 100;
    global.stocks += 100;
    alarm[1] = 30;
}
else if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.kills < 100 && !instance_exists(oDanielText2))
{
    instance_create_layer(Object1.x, Object1.y - 85, layer, oDanielText2);
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.stocks > 100)
{
    alarm[2] = 30;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.stocks > 200)
{
    alarm[3] = 30;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.stocks > 300)
{
    alarm[4] = 30;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.stocks > 400)
{
    alarm[5] = 30;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.stocks > 500)
{
    alarm[6] = 30;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.stocks > 600)
{
    alarm[7] = 30;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.stocks > 700)
{
    alarm[8] = 30;
}
