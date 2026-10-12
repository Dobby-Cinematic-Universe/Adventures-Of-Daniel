if (!instance_exists(oCustoemrs) && !instance_exists(oCustoemrs2) && !instance_exists(oCustoemrs3) && instance_exists(oQuestObjectives3))
{
    global.quest3 = 1;
    if (!instance_exists(oNepalguytext))
    {
        instance_create_layer(x, y, layer, oNepalguytext);
    }
}
