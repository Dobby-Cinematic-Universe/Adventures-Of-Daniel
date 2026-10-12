instance_create_layer(x + 20, y - 30, "stuff", oCrate);
instance_destroy();
if (instance_exists(oCrate))
{
    global.customer1spd = 0;
}
global.customer1done = true;
