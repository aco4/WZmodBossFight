namespace("bossfight_");

function bossfight_eventStartLevel()
{
	if (enemy === null)
	{
		return;
	}

	hackNetOff();

	// Remove enemy objects
	enumStruct(enemy).forEach(s => removeObject(s));
	enumDroid(enemy).forEach(s => removeObject(s));

	// Infinite oil
	if (CONFIG.MAX_POWER)
	{
		for (let player = 0; player < maxPlayers; player++)
		{
			setPower(1000000, player);
		}
	}

	// Complete all research for the enemy
	if (playerData[enemy].difficulty !== SUPEREASY)
	{
		completeAllResearch(enemy);
	}

	// Set enemy experience modifier
	setExperienceModifier(enemy, CONFIG.EXPERIENCE_MODIFIER);

	// Set start delay timer
	if (CONFIG.START_TIMER_SECONDS > 0)
	{
		setMissionTime(CONFIG.START_TIMER_SECONDS);
	}

	// Multiply the range of all weapons and sensors
	if (CONFIG.RANGE_MULTIPLIER !== 1)
	{
		for (let player = 0; player < maxPlayers; player++)
		{
			Object.keys(Upgrades[player].Weapon).forEach(key => {
				Upgrades[player].Weapon[key].MinRange *= CONFIG.RANGE_MULTIPLIER;
				Upgrades[player].Weapon[key].MaxRange *= CONFIG.RANGE_MULTIPLIER;
			});
			Object.keys(Upgrades[player].Sensor).forEach(key => {
				Upgrades[player].Sensor[key].Range *= CONFIG.RANGE_MULTIPLIER;
			});
		}
	}

	// Fully reveal the map (like satellite uplink)
	if (CONFIG.FULL_MAP_REVEAL)
	{
		for (let player = 0; player < maxPlayers; player++)
		{
			addSpotter(0, 0, player, 45255, false, 0);
		}
	}

	hackNetOn();

	queue("start", CONFIG.START_TIMER_SECONDS * 1000);
}

function start()
{
	playSound("nmedeted.ogg");
	playSound("beacon.ogg");
	setMissionTime(-1);
	spawn(mapWidth >> 1, mapHeight >> 1);
	setTimer("updateFireAttack", 1000);
	setTimer("explodeAll", 1000);
}

function spawn(x, y)
{
	hackNetOff();
	CONFIG.SPAWN_BOSS(x, y);
	hackNetOn();
}

function updateFireAttack()
{
	enumDroid(enemy).forEach(droid =>
	{
		if (syncRandom(droid.health) < CONFIG.FIRE_ATTACK_PERCENT_CHANCE) {
			warning(droid.x, droid.y);
		}
	});
}

function warning(x, y)
{
	if (!getObject(x, y)) {
		playSound("lasstrk.ogg");
		addStructure("warning", enemy, x * 128, y * 128);
	}
}

function explodeAll()
{
	enumStruct(enemy, REARM_PAD).forEach(structure =>
	{
		if (gameTime - structure.born > CONFIG.FIRE_ATTACK_DELAY_MILLISECONDS)
		{
			removeObject(structure);
			explode(structure.x, structure.y);
		}
	});
}

function explode(x, y)
{
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x + 1, y - 5, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x + 3, y - 4, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x + 4, y - 3, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x + 5, y - 1, enemy, true);

	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x + 5, y + 1, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x + 4, y + 3, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x + 3, y + 4, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x + 1, y + 5, enemy, true);

	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x - 1, y - 5, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x - 3, y - 4, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x - 4, y - 3, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x - 5, y - 1, enemy, true);

	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x - 5, y + 1, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x - 4, y + 3, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x - 3, y + 4, enemy, true);
	fireWeaponAtLoc(CONFIG.FIRE_ATTACK_WEAPON, x - 1, y + 5, enemy, true);
}
