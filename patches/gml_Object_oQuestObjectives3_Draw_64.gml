if (room != rMenu && instance_exists(Object1))
{
    killtextscale = max(killtextscale * 0.95, 1);
    DrawSetText(0, 0, 2, 0);
    draw_set_colour(c_white);
    draw_text_transformed(1013, 190, "Complete 1 shift at petrol station " + string(global.quest3) + " /1", killtextscale, killtextscale, 0);
}
