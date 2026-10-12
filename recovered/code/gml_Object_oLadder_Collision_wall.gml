gravity = 0;
vspeed += gravity;
if (place_meeting(x, y + vspeed, wall))
{
    while (!place_meeting(x, y + sign(vspeed), wall))
    {
        y += sign(vspeed);
    }
    vspeed = 0;
}
y += vspeed;
