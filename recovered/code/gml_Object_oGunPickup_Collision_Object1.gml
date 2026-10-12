instance_create_layer(Object1.x, Object1.y, "Gun", oGun);
instance_destroy(oGunPickup);
global.weapon1 = true;
flash = 3;
instance_destroy(oGun59);
audio_play_sound(reloadSound, 1, false);
global.ammo = global.ammo + 100;
