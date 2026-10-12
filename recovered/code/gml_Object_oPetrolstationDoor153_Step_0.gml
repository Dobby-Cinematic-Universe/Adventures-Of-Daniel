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
    if (global.quest3 == 1)
    {
        instance_destroy(oQuestObjectives3);
    }
    if (global.hasquest2 == 1)
    {
        instance_create_layer(x, y, layer, oQuestObjectives3);
    }
    global.hasslept = false;
    instance_create_layer(x, y, "Gun", oGun);
}
