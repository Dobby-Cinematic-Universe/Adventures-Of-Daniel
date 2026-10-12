vsp += grv;
if (place_meeting(x + hsp, y, wall))
{
    while (!place_meeting(x + sign(hsp), y, wall))
    {
        x += sign(hsp);
    }
    hsp = -hsp;
}
if (place_meeting(x + hsp, y, oDoor))
{
    while (!place_meeting(x + sign(hsp), y, oDoor))
    {
        x += sign(hsp);
    }
    hsp = -hsp;
}
x += hsp;
if (place_meeting(x, y + vsp, wall))
{
    while (!place_meeting(x, y + sign(vsp), wall))
    {
        y += sign(vsp);
    }
    vsp = 0;
}
y += vsp;
