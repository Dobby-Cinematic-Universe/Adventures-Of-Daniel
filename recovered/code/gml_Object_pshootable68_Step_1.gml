if (hp <= 0)
{
    instance_destroy();
}
if (place_meeting(x, y, oGirl16364))
{
    hp--;
    flash = 3;
    hitfrom = other.direction;
    audio_play_sound(yamete, 3, false);
}
