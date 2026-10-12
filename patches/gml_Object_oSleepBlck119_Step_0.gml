image_alpha = max(0, image_alpha - 0.005);
if (!woken && image_alpha <= 0.5)
{
    woken = true;
    global.hascontrol = 1;
}
if (!messagecleared && image_alpha <= 0.3)
{
    messagecleared = true;
    instance_destroy(oText5);
}
if (image_alpha <= 0)
{
    global.hascontrol = 1;
    global.clickedbed = false;
    global.gosleep = 0;
    instance_destroy(oText5);
    with (oBedSleep)
    {
        alarm[1] = -1;
    }
    instance_destroy();
}
x = Object1.x;
y = Object1.y;
