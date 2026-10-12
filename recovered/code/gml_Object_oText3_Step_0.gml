x = Object1.x + 355;
y = Object1.y - 120;
letters += spd;
text_current = string_copy(text, 0, letters);
draw_set_font(fsign);
if (h == 0)
{
    h = string_height(text);
}
w = string_width(text_current);
if (!instance_exists(oSign))
{
    instance_destroy();
}
