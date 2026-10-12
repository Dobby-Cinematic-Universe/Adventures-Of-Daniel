flash = 0;
hitfrom = 0;
vsp = 0;
grv = 0.15;
hsp = 0;
walksp = 3;
friction = 0.25;
if (point_in_circle(Object1.x, Object1.y, x, y, 800) && !instance_exists(oGirltext2) && !instance_exists(oGirltext71) && !instance_exists(oPDead))
{
    instance_create_layer(x, y, "Gun", oGirltext2);
}
if (point_in_circle(Object1.x, Object1.y, x, y, 200))
{
    instance_destroy(oGirltext2);
}
if (instance_exists(oPDead) && !instance_exists(oGirltext71))
{
    instance_create_layer(x, y, "Gun", oGirltext71);
}
instance_destroy(oGirltext2);
