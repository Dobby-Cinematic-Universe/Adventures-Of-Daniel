if (global.php != 8)
{
    global.php = global.php + 3;
    instance_destroy();
    instance_create_layer(Object1.x - 53, Object1.y - 190, layer, oGirl163);
    alarm[10] = room_speed * 3;
    audio_play_sound(kissing, 1, false);
    audio_play_sound(harp, 10, false);
}
