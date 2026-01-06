const enemy = (() =>
{
	for (let player = 0; player < maxPlayers; player++)
	{
		if (playerData[player].isAI && playerData[player].name === "Boss")
		{
			return player;
		}
	}
	return null;
})();

const botDifficulty = enemy === null ? MEDIUM : playerData[enemy].difficulty;

const CONFIG = {
	START_TIMER_SECONDS               : START_TIMER_SECONDS(),
	SPAWN_BOSS                        : SPAWN_BOSS(),
	RANGE_MULTIPLIER                  : RANGE_MULTIPLIER(),
	ENEMY_EXPERIENCE_MODIFIER_PERCENT : ENEMY_EXPERIENCE_MODIFIER_PERCENT(),
	FULL_MAP_REVEAL                   : FULL_MAP_REVEAL(),
	HALO_ATTACK_DELAY_MILLISECONDS    : HALO_ATTACK_DELAY_MILLISECONDS(),
	HALO_ATTACK_WEAPON                : HALO_ATTACK_WEAPON(),
	CYBORG_ATTACK_DELAY_MILLISECONDS  : CYBORG_ATTACK_DELAY_MILLISECONDS(),
	BOSS_TURN_SPEED_MULTIPLIER        : BOSS_TURN_SPEED_MULTIPLIER(),
};
