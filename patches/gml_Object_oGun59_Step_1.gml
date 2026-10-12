x = Object1.x - 20;
y = Object1.y + 10;
image_angle = point_direction(x, y, mouse_x, mouse_y);
firingdelay -= 1;
recoil = max(0, recoil - 1);
// Original controls: F fires grenades; primary fire returns to the acquired gun.
if ((mouse_check_button(mb_left) || mouse_check_button_pressed(mb_left)) && !keyboard_check(ord("F")) && !keyboard_check_pressed(ord("F")) && global.hascontrol && global.dontshoot && global.weapon1)
{
    instance_change(oGun, true);
    event_perform(3, 1);
    return;
}
if ((keyboard_check(ord("F")) || keyboard_check_pressed(ord("F")) || ((mouse_check_button(mb_left) || mouse_check_button_pressed(mb_left)) && !global.weapon1)) && firingdelay < 0 && (global.bullets > 0 || cheat_enabled("infiniteAmmo")) && global.hascontrol && global.dontshoot)
{
    if (!cheat_enabled("infiniteAmmo"))
    {
        global.bullets--;
    }
    recoil = 15;
    firingdelay = 3;
    audio_play_sound(grenadeshot, 5, false);
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
if ((keyboard_check_pressed(ord("F")) || mouse_check_button_pressed(mb_left)) && global.bullets == 0 && !cheat_enabled("infiniteAmmo") && global.hascontrol)
{
    audio_play_sound(gunempty, 2, false);
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
