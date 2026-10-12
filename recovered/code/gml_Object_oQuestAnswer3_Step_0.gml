x = oMum.x + 280;
y = oMum.y + 170;
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
    instance_destroy(oQuestBox);
    instance_destroy(oQuestAnswer1);
    instance_destroy(oQuestAnswer2);
    instance_destroy(oQuestAnswer3);
    layer_set_visible("gun", visible);
    global.hascontrol = 1;
    instance_destroy(oMumText);
    if (!instance_exists(oMumText2))
    {
        instance_create_layer(x, y, layer, oMumText2);
    }
}
