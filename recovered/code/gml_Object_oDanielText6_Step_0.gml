letters += spd;
text_current = string_copy(text, 0, letters);
draw_set_font(fsign);
if (h == 0)
{
    h = string_height(text);
}
w = string_width(text_current);
if (keyboard_check_pressed(vk_space))
{
    instance_destroy();
    with (oCamera)
    {
        follow = 136;
    }
}
