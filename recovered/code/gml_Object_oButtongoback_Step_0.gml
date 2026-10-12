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
    instance_create_layer(Object1.x + 80, Object1.y - 550, "computerbackgrounds", oshopping2);
    instance_create_layer(Object1.x + 455, Object1.y, "buttons", oButtonMail);
    instance_destroy(oshoppingmail);
    instance_destroy(oButtongoback);
    instance_destroy(oButtongoback2);
    instance_destroy(oButton1);
    instance_destroy(oButton2);
    instance_destroy(oButton3);
    instance_destroy();
    instance_destroy(oButton2Stock);
    instance_destroy(oButton3Stock);
    instance_destroy(oButton1);
    instance_destroy(oButton2);
    instance_destroy(oButton3);
    instance_destroy(oButtoninbox1);
    instance_destroy(oButtoninbox2);
    instance_destroy(oButtoninbox3);
    if (instance_exists(oMessageRead))
    {
        instance_destroy(oMessageRead);
    }
    instance_destroy(oshoppinginbox);
    instance_destroy(oshoppinginbox2);
    instance_destroy(oshoppinginbox3);
    instance_create_layer(Object1.x + 455, Object1.y - 147, "buttons", oButtonAmazon);
    instance_create_layer(Object1.x + 255, Object1.y, "buttons", oButton3rd);
    instance_create_layer(Object1.x + 255, Object1.y - 147, "buttons", oButton4th);
    instance_destroy(oshopping3);
    instance_destroy(oButtonYoutube);
    instance_destroy(oshoppingstocks);
    instance_destroy(oshoppingyoutube);
    instance_destroy(oText2);
    instance_destroy(oText3);
    instance_destroy(oText4);
    instance_destroy(oDanielText2);
    if (instance_exists(oButton1Stock))
    {
        oButton1Stock.y = Object1.y - 1000;
    }
    layer_set_visible("specialbutton", !visible);
}
x = Object1.x + 455;
y = Object1.y - 7;
