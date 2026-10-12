x = Object1.x;
y = Object1.y;
letters += spd;
text_current = string_copy(text, 0, letters);
draw_set_font(fsign3);
if (h == 0)
{
    h = string_height(text);
}
w = string_width(text_current);
if (!instance_exists(oSign))
{
    instance_destroy();
}
if (instance_exists(oSleepBlck119) && oSleepBlck119.image_alpha == 0.5)
{
    instance_destroy();
}
