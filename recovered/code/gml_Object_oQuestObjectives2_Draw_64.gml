if (room != rMenu && instance_exists(Object1))
{
    killtextscale = max(killtextscale * 0.95, 1);
    DrawSetText(0, 0, 2, 0);
    draw_set_colour(c_white);
    draw_text_transformed(1013, 150, "Buy Plane Ticket to Japan " + string(global.quest2) + " /1", killtextscale, killtextscale, 0);
}
