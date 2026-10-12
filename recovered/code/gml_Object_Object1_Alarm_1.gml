global.stocks = global.stocks + -random_range(-10, 10);
if (global.stocksdown == 1)
{
    alarm_set(1, 22);
}
else
{
    alarm_set(1, -1);
}
