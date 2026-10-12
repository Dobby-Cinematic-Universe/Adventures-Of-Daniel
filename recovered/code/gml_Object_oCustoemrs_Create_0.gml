size = random_range(0.6, 1);
global.customer1spd = -2;
global.customer1done = false;
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
