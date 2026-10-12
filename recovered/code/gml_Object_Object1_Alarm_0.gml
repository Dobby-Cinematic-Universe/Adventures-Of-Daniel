global.greentimer--;
alarm_set(0, 30);
if (global.greentimer == -10)
{
    global.greentimer = 0;
}
