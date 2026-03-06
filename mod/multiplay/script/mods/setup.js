const enemy = (() =>
{
	for (let player = 0; player < maxPlayers; player++)
	{
		if (playerData[player].isAI && playerData[player].name.toLowerCase().includes("boss"))
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
	SPAWN_MINION                      : SPAWN_MINION(),
	MINION_SPAWN_CHANCE               : MINION_SPAWN_CHANCE(),
	MINION_LIFE_TIME_MILLISECONDS     : MINION_LIFE_TIME_MILLISECONDS(),
	BOSS_ENGINE_SPEED_MULTIPLIER      : BOSS_ENGINE_SPEED_MULTIPLIER(),
	BOSS_RELOAD_RATE_MULTIPLIER       : BOSS_RELOAD_RATE_MULTIPLIER(),
};

const GROUP_BOSS = 0;
const GROUP_WARNING_RED = 1;
const GROUP_WARNING_BLUE = 2;

// Use var to persist through save-loads
var initialFirePause = {};

const mapSize = Math.max(mapWidth, mapHeight);
const mapRadius = mapSize >> 1;
