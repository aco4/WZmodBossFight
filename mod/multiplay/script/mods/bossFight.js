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
	enumDroid(enemy).forEach(d => removeObject(d));

	// Complete all research for the enemy
	if (playerData[enemy].difficulty !== SUPEREASY)
	{
		completeAllResearch(enemy);
	}

	// Set enemy experience modifier
	setExperienceModifier(enemy, CONFIG.ENEMY_EXPERIENCE_MODIFIER_PERCENT);

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

	setAlliance(enemy, scavengerPlayer, true);
	for (let player = 0; player < maxPlayers; player++)
	{
		setAlliance(player, scavengerPlayer, true);
	}

	hackNetOn();

	queue("start", CONFIG.START_TIMER_SECONDS * 1000);
}

function start()
{
	playSound("nmedeted.ogg");
	playSound("beacon.ogg");

	// Hide the mission timer
	setMissionTime(-1);

	const { x, y } = findSpawnTile();

	hackNetOff();
	CONFIG.SPAWN_BOSS(x, y);
	hackNetOn();

	setTimer("tickRed", 6000);
	setTimer("tickBlue", 4000);
	setTimer("tickStructs", 1000);
	setTimer("tickComponents", 2000);
	setTimer("tickGameOver", 3000);
	setTimer("tickExpire", 3000);
}

function tickRed()
{
	enumDroid(enemy, DROID_WEAPON).forEach(droid =>
	{
		if (syncRandom(75) > droid.health)
		{
			const targets = enumRange(droid.x, droid.y, 15, ALL_PLAYERS, false).filter(object =>
			{
				return object.type === DROID
					&& (object.droidType === DROID_WEAPON || object.droidType === DROID_CYBORG)
					&& !allianceExistsBetween(enemy, object.player)
					&& !getObject(object.x, object.y);
			});

			if (targets.length > 0)
			{
				const target = targets[syncRandom(targets.length)];
				warningRed(target.x, target.y);
			}
		}
	});
}

function tickBlue()
{
	enumDroid(enemy, DROID_WEAPON).forEach(droid =>
	{
		if (syncRandom(50) > droid.health)
		{
			warningBlue(droid.x + 1, droid.y - 5);
			warningBlue(droid.x + 3, droid.y - 4);
			warningBlue(droid.x + 4, droid.y - 3);
			warningBlue(droid.x + 5, droid.y - 1);

			warningBlue(droid.x + 5, droid.y + 1);
			warningBlue(droid.x + 4, droid.y + 3);
			warningBlue(droid.x + 3, droid.y + 4);
			warningBlue(droid.x + 1, droid.y + 5);

			warningBlue(droid.x - 1, droid.y - 5);
			warningBlue(droid.x - 3, droid.y - 4);
			warningBlue(droid.x - 4, droid.y - 3);
			warningBlue(droid.x - 5, droid.y - 1);

			warningBlue(droid.x - 5, droid.y + 1);
			warningBlue(droid.x - 4, droid.y + 3);
			warningBlue(droid.x - 3, droid.y + 4);
			warningBlue(droid.x - 1, droid.y + 5);
		}
	});
}

function tickComponents()
{
	const health = Math.max(...enumDroid(enemy, DROID_WEAPON).map(d => d.health));

	// The multiplier starts at 1 and increases to M as health approaches 0
	const M = CONFIG.BOSS_TURN_SPEED_MULTIPLIER;
	const multiplier = 1 + (M-1)*(1 - health/100);

	Upgrades[enemy].Body["Boss Tiger 3x"].Power = Stats.Body["Boss Tiger 3x"].Power * multiplier;
	Upgrades[enemy].Body["Boss Tiger 9x"].Power = Stats.Body["Boss Tiger 9x"].Power * multiplier;
	Upgrades[enemy].Body["Boss Wyvern 9x"].Power = Stats.Body["Boss Wyvern 9x"].Power * multiplier;
}

function tickStructs()
{
	enumStruct(scavengerPlayer, REARM_PAD).forEach(structure =>
	{
		if (structure.name === "Blue Warning")
		{
			if (gameTime - structure.born > 2000)
			{
				removeObject(structure);
				blueAttack(structure.x, structure.y);
			}
		}
		else if (structure.name === "Red Warning")
		{
			if (gameTime - structure.born > 4000)
			{
				removeObject(structure);
				redAttack(structure.x, structure.y);
			}
		}
	});
}

function tickExpire()
{
	enumDroid(enemy, DROID_REPAIR).forEach(droid =>
	{
		if (gameTime - droid.born > 60000)
		{
			removeObject(droid, true);
		}
	});
}

function warningRed(x, y)
{
	const structure = addStructure("warning_red", scavengerPlayer, x * 128, y * 128);
	setObjectFlag(structure, OBJECT_FLAG_UNSELECTABLE, true);
}

function warningBlue(x, y)
{
	if (!getObject(x, y))
	{
		const structure = addStructure("warning_blue", scavengerPlayer, x * 128, y * 128);
		setObjectFlag(structure, OBJECT_FLAG_UNSELECTABLE, true);
	}
}

function redAttack(x, y)
{
	fireWeaponAtLoc("CannonSuper", x, y, enemy, true);
}

function blueAttack(x, y)
{
	const terrain = terrainType(x, y);
	if (terrain !== TER_CLIFFFACE && terrain !== TER_WATER)
	{
		addDroid(enemy, x, y, "Minion", "CyborgLightBody", "CyborgLegs", "", "", "CyborgRepair");
	}
}

function tickGameOver()
{
	if (enumDroid(enemy, DROID_WEAPON).length === 0)
	{
		hackNetOff();
		enumStruct(enemy).forEach(s => removeObject(s, false));
		enumDroid(enemy).forEach(d => removeObject(d, true));
		enumStruct(scavengerPlayer).forEach(s => removeObject(s, false));
		enumDroid(scavengerPlayer).forEach(d => removeObject(d, true));
		hackNetOn();
	}
}

function findSpawnTile()
{
	const playerContinents = getPlayerContinents();

	// Map center
	const cx = mapWidth >> 1;
	const cy = mapHeight >> 1;

	for (const [x, y] of iterateSpiral(cx, cy))
	{
		if (playerContinents.has(MapTiles[y][x].limitedContinent))
		{
			return { x, y };
		}
	}

	return { cx, cy }; // Fallback
}

function getPlayerContinents()
{
	const continents = new Set();
	for (const { x, y } of startPositions)
	{
		continents.add(MapTiles[y][x].limitedContinent);
	}
	return continents;
}

function *iterateSpiral(x, y)
{
	let step = 1;
	while (true)
	{
		for (let i = 0; i < step; i++)
		{
			yield [x++, y];
			if (x >= mapWidth) return;
		}
		for (let i = 0; i < step; i++)
		{
			yield [x, y++]; // down
			if (y >= mapHeight) return;
		}
		step++;
		for (let i = 0; i < step; i++)
		{
			yield [x--, y]; // left
			if (x < 0) return;
		}
		for (let i = 0; i < step; i++)
		{
			yield [x, y--]; // up
			if (y < 0) return;
		}
		step++;
	}
}
