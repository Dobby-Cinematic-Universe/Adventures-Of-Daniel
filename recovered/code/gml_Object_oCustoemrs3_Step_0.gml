vsp += grv;
if (grounded && afraidofheights && !place_meeting(x + global.customer3spd, y + 1, wall))
{
    global.customer3spd = -global.customer3spd;
}
if (place_meeting(x + global.customer3spd, y, wall))
{
    while (!place_meeting(x + sign(global.customer3spd), y, wall))
    {
        x += sign(global.customer3spd);
    }
    global.customer3spd = -global.customer3spd;
}
if (place_meeting(x + global.customer3spd, y, oCustoemrs2))
{
    global.customer3spd = 0;
}
if (place_meeting(x + global.customer3spd, y, playerwall))
{
    while (!place_meeting(x + sign(global.customer3spd), y, playerwall))
    {
        x += sign(global.customer3spd);
    }
    global.customer3spd = -global.customer3spd;
}
x += global.customer3spd;
if (place_meeting(x, y + vsp, wall))
{
    while (!place_meeting(x, y + sign(vsp), wall))
    {
        y += sign(vsp);
    }
    vsp = 0;
}
if (place_meeting(x, y + vsp, playerwall))
{
    while (!place_meeting(x, y + sign(vsp), playerwall))
    {
        y += sign(vsp);
    }
    vsp = 0;
}
y += vsp;
if (!place_meeting(x, y + 1, wall))
{
    grounded = false;
    sprite_index = enemyJump;
    image_speed = 0;
    if (sign(vsp) > 0)
    {
        image_index = 1;
    }
    else
    {
        image_index = 0;
    }
}
else
{
    grounded = true;
    image_speed = 1;
    if (global.customer3spd == 0)
    {
        sprite_index = customerstand;
    }
    else
    {
        sprite_index = custoemrun;
    }
}
if (global.customer3spd != 0)
{
    image_xscale = sign(global.customer3spd) * size;
}
image_yscale = size;
if (place_meeting(x, y, oPetrolstationDoor153) && !instance_exists(oCustomerArea))
{
    instance_destroy();
}
if (global.customer3done == true)
{
    global.customer3spd = 2;
}
if (!place_meeting(x, y, oCustomerArea3))
{
    global.customer3spd = -2;
}
else
{
    global.customer3spd = 0;
}
if (place_meeting(x, y, oCustomerArea3))
{
    global.customer3spd = 0;
}
if (instance_exists(oCrate3))
{
    global.customer3spd = 0;
}
if (global.customer3done == true)
{
    global.customer3spd = 2;
}
