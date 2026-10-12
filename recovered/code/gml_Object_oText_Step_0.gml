if (point_in_circle(Object1.x, Object1.y, x, y, 300) && !instance_exists(oText2))
{
    letters += spd;
    text_current = string_copy(text, 0, letters);
    draw_set_font(fsign);
    if (h == 0)
    {
        h = string_height(text);
    }
    w = string_width(text_current);
}
else
{
    instance_destroy();
}
