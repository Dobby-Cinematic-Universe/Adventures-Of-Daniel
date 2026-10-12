if (global.bullets == 0 && !cheat_enabled("infiniteAmmo") && !instance_exists(oDanielText1))
{
    instance_create_layer(Object1.x, Object1.y, layer, oDanielText1);
}
