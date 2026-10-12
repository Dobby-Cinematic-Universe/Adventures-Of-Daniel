if (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom)
{
    image_index = 1;
}
else
{
    image_index = 0;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom))
{
    audio_play_sound(clicks, 4, false);
    instance_create_layer(Object1.x + 200, Object1.y - 100, "buttons", oButton1);
    instance_create_layer(Object1.x + 300, Object1.y - 100, "buttons", oButton2);
    instance_create_layer(Object1.x + 333, Object1.y - 100, "buttons", oButton3);
    instance_create_layer(Object1.x + 455, Object1.y, "mailboxbuttons", oButtongoback);
    instance_destroy(oButtonAmazon);
    instance_destroy(oButtonMail);
    instance_create_layer(Object1.x + 80, Object1.y - 550, "computerbackgrounds", oshopping3);
    instance_destroy(oshopping2);
    instance_destroy(oButton3rd);
    instance_destroy(oButton4th);
}
x = Object1.x + 455;
y = Object1.y - 154;
