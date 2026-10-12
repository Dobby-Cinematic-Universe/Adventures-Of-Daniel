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
    instance_destroy(ojobbutton1);
    instance_destroy(ojobbutton2);
    instance_destroy(ojobmenu);
    global.hascontrol = 1;
    petrol_shift_start();
    instance_create_layer(x, y, "quests", oQuestObjectives3);
    instance_destroy(oQuestMarker2);
    with (oQuestObjectives3)
    {
        killtextscale = 2;
    }
    global.dontshoot = false;
    layer_set_visible("gun", visible);
    global.hasquest3 = 1;
}
