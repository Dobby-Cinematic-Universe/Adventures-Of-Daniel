x = oGirl16364.x;
y = oGirl16364.y - 85;
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
