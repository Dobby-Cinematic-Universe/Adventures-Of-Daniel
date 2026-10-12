instance_create_layer(Object1.x, Object1.y, layer, oGun);
instance_destroy(oGun59);
global.weapon1 = true;
if (global.ammo == 0)
{
    instance_create_layer(x, y, layer, oGun);
}
