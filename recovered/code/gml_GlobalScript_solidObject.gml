function solidObject()
{
    if (place_meeting(x + hsp, y, oCar))
    {
        while (!place_meeting(x + sign(hsp), y, oCar))
        {
            x += sign(hsp);
        }
        hsp = 0;
    }
    if (place_meeting(x + hsp, y, oDoor))
    {
        while (!place_meeting(x + sign(hsp), y, oCar))
        {
            x += sign(hsp);
        }
        hsp = 0;
    }
    x += hsp;
    if (place_meeting(x, y + vsp, oCar))
    {
        while (!place_meeting(x, y + sign(vsp), oCar))
        {
            y += sign(vsp);
        }
        vsp = 0;
    }
}
