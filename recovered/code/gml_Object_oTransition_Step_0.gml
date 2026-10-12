if (mode != UnknownEnum.Value_0)
{
    if (mode == UnknownEnum.Value_4)
    {
        percent = max(0, percent - max(percent / 10, 0.005));
    }
    else
    {
        percent = min(1.2, percent + max((1.2 - percent) / 10, 0.005));
    }
    if (percent == 1.2 || percent == 0)
    {
        switch (mode)
        {
            case UnknownEnum.Value_4:
                mode = UnknownEnum.Value_0;
                break;
            case UnknownEnum.Value_1:
                mode = UnknownEnum.Value_4;
                room_goto_next();
                break;
            case UnknownEnum.Value_2:
                mode = UnknownEnum.Value_4;
                room_goto(target);
                break;
            case UnknownEnum.Value_3:
                game_restart();
                break;
        }
    }
}

enum UnknownEnum
{
    Value_0,
    Value_1,
    Value_2,
    Value_3,
    Value_4
}
