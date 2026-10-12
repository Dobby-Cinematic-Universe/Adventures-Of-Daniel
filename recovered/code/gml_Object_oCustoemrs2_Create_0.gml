size = random_range(0.6, 1);
global.customer2spd = -2;
global.customer2done = false;
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
