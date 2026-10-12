if (room != rMenu && instance_exists(Object1))
{
    killtextscale = max(killtextscale * 0.95, 1);
    DrawSetText(0, 1, 2, 0);
    draw_text_transformed(759, 12, "slowmo: " + string(global.slowmo), killtextscale, killtextscale, 0);
    draw_set_colour(c_white);
    draw_text_transformed(758, 10, "slowmo: " + string(global.slowmo), killtextscale, killtextscale, 0);
}
