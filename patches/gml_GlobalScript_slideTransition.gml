if (!instance_exists(oTransition))
{
    var transition = instance_create_layer(0, 0, -1, oTransition);
    transition.percent = 0;
}
with (oTransition)
{
    mode = argument[0];
    if (argument_count > 1)
    {
        target = argument[1];
    }
}
