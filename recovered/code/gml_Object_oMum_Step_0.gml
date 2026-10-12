if ((mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && point_in_circle(Object1.x, Object1.y, x, y, 120))
{
    sprite_index = mum2;
    global.dontshoot = false;
}
else
{
    sprite_index = mum1;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.quest1 == 0 && point_in_circle(Object1.x, Object1.y, x, y, 120) && global.acceptedquest == false)
{
    instance_create_layer(x + 27, y - 266, "bullets", oQuestBox);
    instance_create_layer(x + 280, y - 10, "buttons", oQuestAnswer1);
    instance_create_layer(x + 280, y + 80, "buttons", oQuestAnswer2);
    instance_create_layer(x + 280, y + 170, "buttons", oQuestAnswer3);
    global.hascontrol = 0;
    audio_play_sound(clicks, 3, false);
    layer_set_visible("gun", !visible);
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.quest1 == 1 && !instance_exists(oMumText) && instance_exists(oQuestObjectives))
{
    instance_create_layer(x, y, layer, oMumTextCompletequest);
    audio_play_sound(choose(chaching), 2, false);
    instance_create_layer(x, y, layer, oBulletsLeftGreen);
    global.kills += 50;
    global.killsgreen += 50;
    greentext();
    instance_destroy(oQuestObjectives);
}
else if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.acceptedquest == true && global.quest1 == 0 && !instance_exists(oMumText3))
{
    instance_create_layer(x, y, layer, oMumText3);
}
