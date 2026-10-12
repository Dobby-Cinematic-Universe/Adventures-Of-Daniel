size = random_range(0.1, 0.8);
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
