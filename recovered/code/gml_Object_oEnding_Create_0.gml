if (global.kills > 0)
{
    endtext[0] = "And on this dau our hero had slain " + string(global.kills) + " people.";
    endtext[1] = "but some of those people had guns too so...";
    endtext[2] = "he was probably saving the world of somethign.";
    endtext[3] = "regardless, he was arrested two days later and spent the rest of his life in prison";
    endtext[4] = "the defense team tried to argue that the sexy recoil effects and hit flashes were to blame,\nbutto no avail";
    endtext[5] = "the park ranger would later state she was no angry";
    endtext[6] = "the end";
    endtext[7] = "";
}
else
{
    endtext[0] = "on this day we walked through a park and had a nice day";
}
spd = 0.5;
letters = 0;
currentline = 0;
length = string_length(endtext[currentline]);
text = "";
