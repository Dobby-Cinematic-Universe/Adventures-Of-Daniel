if (triggered)
{
    for (var i = 0; i < ds_list_size(waves); i++)
    {
        var next = ds_list_find_value(waves, i);
        if (next[0] == current_wave && next[3] == timer)
        {
            var spawnpoint = next[2];
            instance_create_layer(spawn[spawnpoint][0], spawn[spawnpoint][1], "enemy", next[1]);
        }
    }
    timer++;
    if (remaining[current_wave] <= 0)
    {
        if (current_wave == total_waves)
        {
            with (oDoor)
            {
                closed = false;
            }
            instance_destroy();
        }
        else
        {
            current_wave++;
            timer = 0;
        }
    }
}
