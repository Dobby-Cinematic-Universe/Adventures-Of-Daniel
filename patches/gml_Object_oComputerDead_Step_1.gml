vspeed += grv;
if (place_meeting(x + hspeed, y, wall))
{
    while (!place_meeting(x + sign(hspeed), y, wall))
    {
        x += sign(hspeed);
    }
    hspeed = -hspeed;
}
if (place_meeting(x + hspeed, y, oDoor))
{
    while (!place_meeting(x + sign(hspeed), y, oDoor))
    {
        x += sign(hspeed);
    }
    hspeed = -hspeed;
}
if (place_meeting(x, y + vspeed, wall))
{
    while (!place_meeting(x, y + sign(vspeed), wall))
    {
        y += sign(vspeed);
    }
    vspeed = 0;
}
