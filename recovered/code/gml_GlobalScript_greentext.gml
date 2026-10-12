function greentext()
{
    global.greentimer = 0;
    with (oBulletsLeftGreen)
    {
        killtextscale = 5;
    }
    alarm[0] = 30;
    if (global.greentimer == -2)
    {
        instance_destroy(oBulletsLeftGreen);
    }
    if (global.greentimer == -1)
    {
        global.greentimer = 0;
        alarm[0] = -1;
    }
}
