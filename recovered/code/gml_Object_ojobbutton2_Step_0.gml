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
    global.hascontrol = 1;
    layer_set_visible("gun", visible);
    instance_destroy(ojobbutton1);
    instance_destroy(ojobbutton2);
    instance_destroy(ojobmenu);
    global.hascontrol = 1;
}
