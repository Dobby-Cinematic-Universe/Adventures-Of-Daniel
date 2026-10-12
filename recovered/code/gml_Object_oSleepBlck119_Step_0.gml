image_alpha -= 0.005;
if (image_alpha == 0.5)
{
    global.hascontrol = 1;
}
if (image_alpha == 0)
{
    global.clickedbed = false;
}
if (image_alpha == 0.3)
{
    instance_destroy(oText5);
}
if (image_alpha == 0.3)
{
    global.gosleep = 3;
}
