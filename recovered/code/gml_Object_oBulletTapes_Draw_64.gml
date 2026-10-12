if (room != rMenu && instance_exists(Object1))
{
    killtextscale = max(killtextscale * 0.95, 1);
    DrawSetText(0, 1, 2, 0);
    draw_set_colour(c_white);
    draw_text_transformed(188, 80, string(global.tapes) + " tapes", killtextscale, killtextscale, 0);
    if (global.tapes == 0)
    {
        draw_text(Object1.x, Object1.y, "no more bullets");
    }
}
