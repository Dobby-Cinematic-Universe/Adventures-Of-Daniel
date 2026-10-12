if (instance_exists(Object1))
{
    x = oGirl16364.x - 53;
    y = oGirl16364.y - 190;
    image_alpha -= 0.008;
}
if (image_alpha <= 0)
{
    instance_destroy();
}
