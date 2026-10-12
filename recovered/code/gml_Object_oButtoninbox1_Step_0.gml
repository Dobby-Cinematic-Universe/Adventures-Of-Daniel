global.messageread = 0;
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
    instance_create_layer(Object1.x + 80, Object1.y - 550, "mailinboxopen", oshoppinginbox);
    instance_create_layer(Object1.x + 455, Object1.y - 7, "gobackbutton2", oButtongoback2);
    instance_create_layer(x, Object1.y - 200, "gobackbutton", oText2);
    global.newmail = 0;
    instance_destroy(oButtoninbox1);
    instance_destroy(oButtoninbox2);
    instance_destroy(oButtoninbox3);
    instance_destroy(oButton1);
    instance_destroy(oButton2);
    instance_destroy(oButton3);
    global.messageread = 1;
    if (!instance_exists(oQuestObjectives2))
    {
        instance_create_layer(x, y, "quests", oQuestObjectives2);
        with (oQuestObjectives2)
        {
            killtextscale = 2;
        }
        global.pcclickedon = true;
        global.hasquest1 = 1;
    }
}
x = Object1.x + 360;
y = Object1.y - 220;
