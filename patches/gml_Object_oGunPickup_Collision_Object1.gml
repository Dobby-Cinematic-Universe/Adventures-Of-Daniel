instance_destroy(oGun);
instance_destroy(oGun59);
instance_create_layer(Object1.x, Object1.y, "Gun", oGun);
instance_destroy(oGunPickup);
global.weapon1 = true;
flash = 3;
audio_play_sound(reloadSound, 1, false);
global.ammo += 100;
