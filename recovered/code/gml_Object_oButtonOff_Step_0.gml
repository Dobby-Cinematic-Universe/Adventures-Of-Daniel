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
    if (global.hascontrol == 0)
    {
        layer_set_visible("quests", visible);
        instance_destroy(oshopping2);
        instance_destroy(oButton1);
        instance_destroy(oButton2);
        instance_destroy(oButton3);
        instance_destroy(oButtonMail);
        instance_destroy(oText2);
        global.hascontrol = 1;
        layer_set_visible("gun", visible);
        instance_destroy(oMessageRead);
        instance_destroy(oButtonAmazon);
        instance_destroy(oshopping3);
        instance_destroy(oshoppinginbox);
        instance_destroy(oButtoninbox1);
        instance_destroy(oButtoninbox2);
        instance_destroy(oButtoninbox3);
        instance_destroy(computerbottom);
        instance_destroy(oButtonOff);
        instance_destroy(oButtongoback2);
        instance_destroy(oButtongoback);
        instance_destroy(oshoppingmail);
        instance_destroy(oButton3rd);
        instance_destroy(oButton4th);
        instance_destroy(oshoppingyoutube);
        instance_destroy(oButtonYoutube);
        if (instance_exists(oButton1Stock))
        {
            oButton1Stock.y = Object1.y - 1000;
        }
        oBulletsLeft97.y = Object1.y - 1000;
        if (!instance_exists(oshopping2))
        {
            instance_destroy();
        }
        instance_destroy(oButton2Stock);
        instance_destroy(oButton3Stock);
        instance_destroy(oshoppingstocks);
        layer_set_visible("specialbutton", !visible);
        instance_destroy(oshoppinginbox);
        instance_destroy(oshoppinginbox2);
        instance_destroy(oshoppinginbox3);
        instance_destroy(oDanielText2);
        instance_destroy(oText2);
        instance_destroy(oText3);
        instance_destroy(oText4);
        instance_destroy();
    }
}
x = Object1.x + 489;
y = Object1.y + 190;
