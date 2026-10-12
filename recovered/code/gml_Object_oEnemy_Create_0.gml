size = random_range(0.6, 1);
hsp = random_range(3, 8);
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
