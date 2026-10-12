if (!instance_exists(oCustoemrs) && !instance_exists(oCustoemrs2) && !instance_exists(oCustoemrs3))
{
    audio_play_sound(powerup, 4, false);
    instance_destroy();
    instance_create_layer(x, y, layer, oBulletsLeftGreen);
    global.kills = 300;
    global.killsgreen = 300;
    greentext();
}
