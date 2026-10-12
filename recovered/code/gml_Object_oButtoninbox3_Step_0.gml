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
    instance_create_layer(Object1.x + 80, Object1.y - 550, "mailinboxopen", oshoppinginbox3);
    instance_create_layer(Object1.x + 455, Object1.y - 7, "gobackbutton2", oButtongoback2);
    instance_create_layer(x, Object1.y - 200, "gobackbutton", oText4);
    global.newmail = 0;
    instance_destroy(oButtoninbox1);
    instance_destroy(oButtoninbox2);
    instance_destroy(oButtoninbox3);
    instance_destroy(oButton1);
    instance_destroy(oButton2);
    instance_destroy(oButton3);
    if (global.takenallowance == 0)
    {
        instance_create_layer(x, y, layer, oBulletsLeftGreen);
        global.greentimer = 0;
        global.kills += 500;
        global.killsgreen += 500;
        with (oBulletsLeftGreen)
        {
            killtextscale = 23;
        }
        audio_play_sound(chaching, 1, false);
        global.takenallowance = 1;
    }
    instance_destroy();
}
x = Object1.x + 360;
y = Object1.y - 120;
