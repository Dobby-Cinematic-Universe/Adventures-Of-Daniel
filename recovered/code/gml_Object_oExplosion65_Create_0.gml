sprite_index = computerbroken;
layer_add_instance("floor", id);
depth += 1;
screenShake(6, 60);
audio_play_sound(explode, 2, false);
hitfrom = 0;
