if (hsp != 0)
{
    image_xscale = sign(hsp) * size;
}
image_yscale = size;
if (done == 0)
{
    vsp += grv;
    if (place_meeting(x + hsp, y, wall))
    {
        while (!place_meeting(x + sign(hsp), y, wall))
        {
            x += sign(hsp);
        }
        hsp = 0;
    }
    x -= hsp;
    if (place_meeting(x, y + vsp, wall))
    {
        if (vsp > 0)
        {
            done = 1;
            image_index = 1;
        }
        while (!place_meeting(x, y + sign(vsp), wall))
        {
            y += sign(vsp);
        }
        vsp = 0;
    }
    y += vsp;
}
