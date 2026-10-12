if (point_in_circle(Object1.x, Object1.y, x, y, 120) && keyboard_check_pressed(ord("Q")))
{
    instance_create_layer(x - 30, y, layer, oDoor);
    instance_destroy(oDoorOpen);
    audio_play_sound(doorclosesound, 1, false);
}
