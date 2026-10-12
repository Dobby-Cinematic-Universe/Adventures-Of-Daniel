hspeed = 0 + random_range(-5, 3);
vspeed = -3 + random_range(-6, 1);
grv = 0.8;
done = 0;
friction = 0.1;
hitfrom = 0;
image_speed = 0;
screenShake(6, 60);
audio_play_sound(explode, 2, false);
