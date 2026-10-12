vsp += grv;
if (grounded && afraidofheights && !place_meeting(x + global.customer1spd, y + 1, wall))
{
    global.customer1spd = -global.customer1spd;
}
if (place_meeting(x + global.customer1spd, y, wall))
{
    while (!place_meeting(x + sign(global.customer1spd), y, wall))
    {
        x += sign(global.customer1spd);
    }
    global.customer1spd = -global.customer1spd;
}
if (place_meeting(x + global.customer1spd, y, playerwallcustomer))
{
    while (!place_meeting(x + sign(global.customer1spd), y, playerwallcustomer))
    {
        x += sign(global.customer1spd);
    }
    global.customer1spd = 0;
}
if (place_meeting(x + global.customer1spd, y, playerwall))
{
    while (!place_meeting(x + sign(global.customer1spd), y, playerwall))
    {
        x += sign(global.customer1spd);
    }
    global.customer1spd = -global.customer1spd;
}
if (place_meeting(x + global.customer1spd, y, oDoor))
{
    while (!place_meeting(x + sign(global.customer1spd), y, oDoor))
    {
        x += sign(global.customer1spd);
    }
    global.customer1spd = -global.customer1spd;
}
x += global.customer1spd;
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
    if (global.customer1spd == 0)
    {
        sprite_index = customerstand;
    }
    else
    {
        sprite_index = custoemrun;
    }
}
if (global.customer1spd != 0)
{
    image_xscale = sign(global.customer1spd) * size;
}
image_yscale = size;
if (!instance_exists(oCrate) && !instance_exists(oCustomerArea))
{
    global.customer1spd = 10;
}
if (place_meeting(x, y, oPetrolstationDoor153) && !instance_exists(oCustomerArea))
{
    instance_destroy();
}
