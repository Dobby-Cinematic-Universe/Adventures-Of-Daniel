function spawns()
{
    waves = ds_list_create();
    ds_list_add(waves, [0, 140, 0, 10]);
    ds_list_add(waves, [0, 140, 0, 20]);
    ds_list_add(waves, [0, 140, 0, 30]);
    ds_list_add(waves, [0, 140, 0, 40]);
    ds_list_add(waves, [0, 140, 0, 50]);
    ds_list_add(waves, [0, 140, 0, 60]);
    ds_list_add(waves, [0, 140, 1, 10]);
    ds_list_add(waves, [0, 140, 1, 20]);
    ds_list_add(waves, [0, 140, 1, 30]);
    ds_list_add(waves, [0, 140, 1, 40]);
    ds_list_add(waves, [0, 140, 1, 50]);
    ds_list_add(waves, [0, 140, 1, 60]);
    ds_list_add(waves, [1, 140, 0, 10]);
    ds_list_add(waves, [1, 140, 0, 20]);
    ds_list_add(waves, [1, 140, 0, 30]);
    ds_list_add(waves, [1, 140, 0, 40]);
    ds_list_add(waves, [1, 140, 0, 50]);
    ds_list_add(waves, [1, 140, 0, 60]);
    spawn[0][0] = 2000;
    spawn[0][1] = 500;
    spawn[1][0] = 1700;
    spawn[1][1] = 500;
}
