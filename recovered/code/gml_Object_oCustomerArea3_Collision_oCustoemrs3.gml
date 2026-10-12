instance_create_layer(x + 20, y - 30, "stuff", oCrate3);
instance_destroy();
if (instance_exists(oCrate3))
{
    global.customer3spd = 0;
}
