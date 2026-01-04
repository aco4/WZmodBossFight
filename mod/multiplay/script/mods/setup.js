const enemy = (() => {
	for (let player = 0; player < maxPlayers; player++) {
		if (playerData[player].isAI && playerData[player].name === "Boss") {
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
    MAX_POWER                         : MAX_POWER(),
    FIRE_ATTACK_DELAY_MILLISECONDS    : FIRE_ATTACK_DELAY_MILLISECONDS(),
    FIRE_ATTACK_PERCENT_CHANCE        : FIRE_ATTACK_PERCENT_CHANCE(),
    FIRE_ATTACK_WEAPON                : FIRE_ATTACK_WEAPON(),
};
