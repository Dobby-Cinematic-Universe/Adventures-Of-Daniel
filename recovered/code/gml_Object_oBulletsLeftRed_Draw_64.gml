if (room != rMenu && instance_exists(Object1))
{
    killtextscale = max(killtextscale * 0.95, 1);
    DrawSetText(0, 1, 2, 0);
    draw_set_colour(c_red);
    draw_text_transformed(1014, 50, string(global.killsred), killtextscale, killtextscale, 0);
}
