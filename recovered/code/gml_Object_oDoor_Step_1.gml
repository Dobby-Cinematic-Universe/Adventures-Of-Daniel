if (point_in_circle(Object1.x, Object1.y, x, y, 80) && instance_exists(Object1) && keyboard_check_pressed(ord("E")) && instance_exists(oDoor))
{
    instance_create_layer(x + 30, y, layer, oDoorOpen);
    instance_destroy(oDoor);
    audio_play_sound(dooropensound, 1, false);
}
