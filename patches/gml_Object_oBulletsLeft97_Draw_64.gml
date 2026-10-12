if (instance_exists(oshoppingstocks))
{
    var cam = view_camera[0];
    var sx = display_get_gui_width() / camera_get_view_width(cam);
    var sy = display_get_gui_height() / camera_get_view_height(cam);
    DrawSetText(c_black, fsign, fa_center, fa_top);
    draw_text((oshoppingstocks.x + 277 - camera_get_view_x(cam)) * sx, (oshoppingstocks.y + 335 - camera_get_view_y(cam)) * sy, "Stocks: $ " + string(global.stocks));
}
