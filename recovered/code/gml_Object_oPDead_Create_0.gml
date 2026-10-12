global.hascontrol = 0;
hsp = 3;
vsp = -4;
grv = 0.2;
done = 0;
screenShake(6, 25);
image_speed = 0;
image_index = 0;
screenShake(6, 60);
audio_play_sound(bigdeath, 10, false);
game_set_speed(30, gamespeed_fps);
with (oCamera)
{
    follow = other.id;
}
instance_create_layer(x, y, layer, obulletsgreentimer);
instance_create_layer(x, y, layer, oBulletsLeftRed);
global.killsred -= 200;
with (oBulletsLeftGreen)
{
    killtextscale = 17;
}
