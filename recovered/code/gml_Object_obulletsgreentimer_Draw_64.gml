if (room != rMenu && instance_exists(Object1))
{
    killtextscale = max(killtextscale * 0.95, 1);
    DrawSetText(0, 1, 2, 0);
    draw_set_colour(c_white);
    draw_text_transformed(1014, 10000, "green tiemr " + string(global.greentimer), killtextscale, killtextscale, 0);
}
