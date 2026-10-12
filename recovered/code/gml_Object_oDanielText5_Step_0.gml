if (instance_exists(Object1))
{
    x = Object1.x;
    y = Object1.y - 85;
}
else
{
    instance_destroy();
}
letters += spd;
text_current = string_copy(text, 0, letters);
draw_set_font(fsign);
if (h == 0)
{
    h = string_height(text);
}
w = string_width(text_current);
if (letters >= (length + 35))
{
    instance_destroy();
    with (oCamera)
    {
        follow = 136;
    }
}
