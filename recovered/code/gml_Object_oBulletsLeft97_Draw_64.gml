if (room != rMenu && instance_exists(Object1))
{
    killtextscale = max(killtextscale * 0.95, 1);
    DrawSetText(0, 1, 2, 0);
    draw_set_colour(c_black);
    draw_text_transformed(868, 155, "stocks " + string(global.stocks), killtextscale, killtextscale, 0);
}
x = Object1.x - 100;
