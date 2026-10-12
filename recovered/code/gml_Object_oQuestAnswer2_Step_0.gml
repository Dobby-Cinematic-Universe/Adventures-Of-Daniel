x = oMum.x + 280;
y = oMum.y + 80;
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
    audio_play_sound(clicks, 3, false);
    layer_set_visible("gun", visible);
    instance_destroy(oQuestBox);
    oQuestMarker.image_alpha -= 0.008;
    instance_destroy(oQuestAnswer1);
    instance_destroy(oQuestAnswer2);
    instance_destroy(oQuestAnswer3);
    global.hascontrol = 1;
    if (instance_exists(oMumText2))
    {
        instance_destroy(oMumText2);
    }
    if (!instance_exists(oMumText2))
    {
        instance_create_layer(x, y, layer, oMumText);
    }
    if (!instance_exists(oMumText))
    {
        instance_create_layer(x, y, layer, oMumText);
    }
    if (!instance_exists(oQuestObjectives))
    {
        instance_create_layer(x, y, "quests", oQuestObjectives);
        with (oQuestObjectives)
        {
            killtextscale = 2;
        }
        global.acceptedquest = true;
        global.hasquest2 = 1;
    }
}
