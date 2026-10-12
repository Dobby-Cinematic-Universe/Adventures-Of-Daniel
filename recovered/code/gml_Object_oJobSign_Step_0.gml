if (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom)
{
    image_index = 1;
    global.dontshoot = false;
}
else
{
    image_index = 0;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && point_in_circle(Object1.x, Object1.y, x, y, 100) && instance_exists(oQuestMarker2))
{
    layer_set_visible("Gun", !visible);
    global.hascontrol = 0;
    instance_create_layer(oJobSign.x - 122, oJobSign.y + 122, "gobackbutton", ojobmenu);
    instance_create_layer(oJobSign.x - 350, oJobSign.y - 93, "gobackbutton2", ojobbutton1);
    instance_create_layer(oJobSign.x - 55, oJobSign.y - 93, "gobackbutton2", ojobbutton2);
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && point_in_circle(Object1.x, Object1.y, x, y, 100) && !instance_exists(oQuestMarker2))
{
    instance_create_layer(oJobSign.x + 30, oJobSign.y - 30, layer, oDanielText8);
}
if (global.hasslept == true)
{
    instance_create_layer(oJobSign.x + 60, oJobSign.y - 60, layer, oQuestMarker2);
    global.hasslept = false;
}
