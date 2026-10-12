size = random_range(0.4, 1);
hsp = 0 + random_range(-5, 3);
vsp = -3 + random_range(-6, 1);
grv = 0.3;
done = 0;
screenShake(6, 25);
image_speed = 0;
audio_play_sound(choose(bigdeath, death), 4, false);
