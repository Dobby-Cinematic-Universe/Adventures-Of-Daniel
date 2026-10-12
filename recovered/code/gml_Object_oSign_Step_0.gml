if (point_in_circle(Object1.x, Object1.y, x, y, 120) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && instance_exists(Object1))
{
    image_index = 1;
    global.dontshoot = false;
}
else
{
    image_index = 0;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && point_in_circle(Object1.x, Object1.y, x, y, 120) && place_meeting(Object1.x, Object1.y, wall))
{
    if (point_in_circle(oSign.x, oSign.y, x, y, 100) && !instance_exists(oButtongoback) && instance_exists(Object1))
    {
        audio_play_sound(clicks, 4, false);
        instance_create_layer(Object1.x + 80, Object1.y - 550, "computerbackgrounds", oshopping2);
        instance_create_layer(Object1.x + 455, Object1.y - 154, "buttons", oButtonAmazon);
        instance_create_layer(Object1.x + 255, Object1.y - 7, "buttons", oButton3rd);
        instance_create_layer(Object1.x + 255, Object1.y - 154, "buttons", oButton4th);
        instance_create_layer(Object1.x - 70, Object1.y - 55, "gobackbutton", computerbottom);
        instance_create_layer(Object1.x + 455, Object1.y - 7, "buttons", oButtonMail);
        instance_create_layer(Object1.x + 700, Object1.y + 66, "gobackbutton2", oButtonOff);
        global.hascontrol = 0;
        layer_set_visible("Gun", !visible);
        if (global.messageread == 1)
        {
            instance_create_layer(x, y, "gobackbutton", oMessageRead);
        }
        layer_set_visible("quests", !visible);
    }
}
