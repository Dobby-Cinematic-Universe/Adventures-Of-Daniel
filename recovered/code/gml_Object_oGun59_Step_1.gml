x = Object1.x - 20;
y = Object1.y + 10;
image_angle = point_direction(x, y, mouse_x, mouse_y);
firingdelay -= 1;
recoil = max(0, recoil - 1);
if (keyboard_check_pressed(ord("F")) && global.bullets == 0)
{
    audio_play_sound(gunempty, 5, false);
}
if (keyboard_check(ord("F")) && firingdelay < 0 && global.bullets > 0)
{
    recoil = 15;
    firingdelay = 3;
    global.bullets -= 1;
    audio_play_sound(gunshot, 5, false);
    with (instance_create_layer(x + 5, y, "bullets", oBulletBomb))
    {
        spd = 25;
        direction = other.image_angle + random_range(-3, 3);
        image_angle = direction;
    }
    with (Object1)
    {
        gunkickx = lengthdir_x(1.5, other.image_angle - 180);
        gunkicky = lengthdir_y(1, other.image_angle - 180);
    }
}
x -= lengthdir_x(recoil, image_angle);
y -= lengthdir_y(recoil, image_angle);
if (image_angle > 90 && image_angle < 270)
{
    image_yscale = -1;
    x += 25;
}
else
{
    image_yscale = 1;
}
if (mouse_check_button(mb_left) && !instance_exists(oGunPickup) && global.ammo == 0)
{
    instance_create_layer(x, y, layer, oGun);
    instance_destroy(oGun59);
}
if (mouse_check_button(mb_left) && !instance_exists(oGunPickup) && global.ammo > 0)
{
    instance_create_layer(x, y, layer, oGun);
    instance_destroy(oGun59);
}
if (mouse_check_button(mb_left) && firingdelay < 0 && !instance_exists(oGunPickup) && global.weapon1 == true)
{
    recoil = 15;
    firingdelay = 3;
    instance_create_layer(x, y, layer, oGun);
    instance_destroy(oGun59);
    audio_play_sound(gunshot, 5, false);
    with (instance_create_layer(x + 5, y, "bullets", oBullet))
    {
        spd = 25;
        direction = other.image_angle + random_range(-3, 3);
        image_angle = direction;
    }
    with (Object1)
    {
        gunkickx = lengthdir_x(1.5, other.image_angle - 180);
        gunkicky = lengthdir_y(1, other.image_angle - 180);
    }
}
x -= lengthdir_x(recoil, image_angle);
y -= lengthdir_y(recoil, image_angle);
if (image_angle > 90 && image_angle < 270)
{
    image_yscale = -1;
    x += 25;
}
else
{
    image_yscale = 1;
}
