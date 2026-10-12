if (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom)
{
    image_index = 1;
    global.dontshoot = false;
}
else
{
    image_index = 0;
}
if (point_in_circle(Object1.x, Object1.y, x, y, 100) && mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && global.clickedbed == false)
{
    global.clickedbed = true;
    instance_create_layer(x, y, "gosleepzzz", oText5);
    alarm[1] = 30;
    instance_create_layer(x, y, "gobackbutton2", oSleepBlck);
    global.slowmo = 100;
    global.php = 8;
    global.hascontrol = 0;
    global.hasslept = true;
    global.quest3 = 0;
}
if (global.gosleep == -15)
{
    global.gosleep = 0;
    alarm[1] = -1;
}
