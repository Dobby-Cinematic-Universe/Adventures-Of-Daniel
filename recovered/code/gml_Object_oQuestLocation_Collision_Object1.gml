if (instance_exists(oQuestObjectives))
{
    global.quest1++;
    with (oQuestObjectives)
    {
        killtextscale = 2;
    }
    instance_destroy();
    audio_play_sound(choose(powerup, powerup23), 2, false);
}
