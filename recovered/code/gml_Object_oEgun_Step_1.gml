x = owner.x;
y = owner.y + 10;
image_xscale = abs(owner.image_xscale);
image_yscale = abs(owner.image_yscale);
if (instance_exists(Object1))
{
    if (Object1.x < x)
    {
        image_yscale = -image_yscale;
    }
    if (point_distance(Object1.x, Object1.y, x, y) < 600)
    {
        image_angle = point_direction(x, y, Object1.x, Object1.y);
        countdown--;
        if (countdown <= 0)
        {
            countdown = countdownrate;
            if (!collision_line(x, y, Object1.x, Object1.y, wall, false, false) && !collision_line(x, y, Object1.x, Object1.y, oDoor, false, false))
            {
                audio_play_sound(gunshot, 5, false);
                with (instance_create_layer(x, y, "bullets", eEbullet))
                {
                    spd = 18;
                    direction = other.image_angle + random_range(-45, 45);
                    image_angle = direction;
                }
            }
        }
    }
}
