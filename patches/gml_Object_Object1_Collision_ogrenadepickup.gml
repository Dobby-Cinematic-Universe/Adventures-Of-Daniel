instance_destroy(oGun);
instance_destroy(oGun59);
instance_create_layer(Object1.x, Object1.y, "Gun", oGun59);
instance_destroy(ogrenadepickup);
global.weapon2 = true;
global.bullets += 8;
flash = 3;
audio_play_sound(reloadSound, 1, false);
