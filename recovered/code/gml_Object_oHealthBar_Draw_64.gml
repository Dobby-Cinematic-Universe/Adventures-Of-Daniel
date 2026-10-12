heartheight = 10;
horizontalhearts = -60;
if (room != rMenu && instance_exists(Object1))
{
    killtextscale = max(killtextscale * 0.95, 1);
    if (place_meeting(Object1.x, Object1.y, oGirl1) && global.php < 8)
    {
        global.php++;
    }
    if (global.php == 8)
    {
        draw_sprite(hearts, 58, 198 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 228 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 258 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 288 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 318 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 348 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 378 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 408 - horizontalhearts, heartheight);
    }
    if (global.php == 7)
    {
        draw_sprite(hearts, 58, 198 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 228 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 258 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 288 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 318 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 348 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 378 - horizontalhearts, heartheight);
    }
    if (global.php == 6)
    {
        draw_sprite(hearts, 58, 198 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 228 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 258 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 288 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 318 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 348 - horizontalhearts, heartheight);
    }
    if (global.php == 5)
    {
        draw_sprite(hearts, 58, 198 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 228 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 258 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 288 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 318 - horizontalhearts, heartheight);
    }
    if (global.php == 4)
    {
        draw_sprite(hearts, 58, 198 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 228 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 258 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 288 - horizontalhearts, heartheight);
    }
    if (global.php == 3)
    {
        draw_sprite(hearts, 58, 198 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 228 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 258 - horizontalhearts, heartheight);
    }
    if (global.php == 2)
    {
        draw_sprite(hearts, 58, 198 - horizontalhearts, heartheight);
        draw_sprite(hearts, 58, 228 - horizontalhearts, heartheight);
    }
    if (global.php == 1)
    {
        draw_sprite(hearts, 58, 198 - horizontalhearts, heartheight);
    }
}
if (global.php > 8)
{
    global.php = 8;
}
