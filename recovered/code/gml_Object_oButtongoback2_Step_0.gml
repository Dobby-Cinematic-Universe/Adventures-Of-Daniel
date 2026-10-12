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
    if (global.messageread == 1)
    {
        instance_create_layer(x, y, "gobackbutton", oMessageRead);
    }
    instance_destroy(oshoppinginbox);
    instance_destroy(oshoppinginbox2);
    instance_destroy(oshoppinginbox3);
    instance_destroy(oButton1);
    instance_destroy(oButton2);
    instance_destroy(oButton3);
    instance_destroy(oButtongoback2);
    instance_destroy(oText2);
    instance_destroy(oText3);
    instance_destroy(oText4);
    instance_destroy(oDanielText2);
    instance_create_layer(Object1.x + 455, Object1.y - 7, "gobackbutton", oButtongoback);
    instance_create_layer(Object1.x + 80, Object1.y - 550, "mailinbox", oshoppingmail);
    instance_create_layer(Object1.x + 380, Object1.y - 220, "mailboxbuttons", oButtoninbox1);
    instance_create_layer(Object1.x + 380, Object1.y - 170, "mailboxbuttons", oButtoninbox2);
    instance_create_layer(Object1.x + 380, Object1.y - 120, "mailboxbuttons", oButtoninbox3);
}
x = Object1.x + 255;
y = Object1.y - 7;
