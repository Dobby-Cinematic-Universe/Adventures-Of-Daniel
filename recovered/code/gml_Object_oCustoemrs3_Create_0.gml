size = 0.5;
global.customer3spd = -2;
global.customer3done = false;
if (hasweapon)
{
    mygun = instance_create_layer(x, y, "Gun", oEgun);
    with (mygun)
    {
        owner = other.id;
    }
}
else
{
    mygun = -4;
}
