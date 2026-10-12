if (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom)
{
    image_index = 1;
    global.dontshoot = false;
}
else
{
    image_index = 0;
}
if (mouse_check_button_pressed(mb_left) && (mouse_x >= bbox_left && mouse_x <= bbox_right && mouse_y >= bbox_top && mouse_y <= bbox_bottom) && point_in_circle(Object1.x, Object1.y, x, y, 200) && instance_exists(oQuestObjectives3))
{
    Object1.x = wallcustomer.x - 60;
    Object1.y = wallcustomer.y - 100;
    instance_destroy(playerwallcustomer);
    audio_play_sound(dooropensound, 3, false);
    global.customer1spd = -2;
    global.customer2spd = -2;
    global.customer3spd = -2;
    instance_destroy(oGun);
}
