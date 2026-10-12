letters += spd;
text = string_copy(endtext[currentline], 1, floor(letters));
if (letters >= length && keyboard_check_pressed(vk_anykey))
{
    if ((currentline + 1) == array_length_1d(endtext))
    {
        slideTransition(UnknownEnum.Value_3);
    }
    else
    {
        currentline++;
        letters = 0;
        length = string_length(endtext[currentline]);
    }
}

enum UnknownEnum
{
    Value_3 = 3
}
