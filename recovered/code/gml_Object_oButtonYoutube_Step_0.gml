if (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom)
{
    image_index = 1;
}
else
{
    image_index = 0;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.tapes > 0)
{
    audio_play_sound(clicks, 4, false);
    global.tapes--;
    global.kills += random_range(25, 100);
    instance_destroy(oButtongoback2);
    audio_play_sound(chaching, 4, false);
}
x = Object1.x + 255;
y = Object1.y - 7;
