if (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom)
{
    image_index = 1;
}
else
{
    image_index = 0;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && point_in_circle(Object1.x, Object1.y, x, y, 200) && global.quest3 == 1)
{
    audio_play_sound(doorclosesound, 4, false);
    Object1.x = oJobSign.x;
    Object1.y = oJobSign.y - 100;
    instance_destroy(oQuestObjectives3);
    global.hasquest3 = 0;
    global.hasslept = false;
    instance_destroy(oGun);
    instance_destroy(oGun59);
    if (global.petrolweapon == oGun59 && global.weapon2)
    {
        instance_create_layer(Object1.x, Object1.y, "Gun", oGun59);
    }
    else
    {
        instance_create_layer(Object1.x, Object1.y, "Gun", oGun);
    }
    layer_set_visible("Gun", true);
}
