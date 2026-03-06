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
	enumStruct(scavengerPlayer).forEach(s => removeObject(s));
	enumDroid(scavengerPlayer).forEach(d => removeObject(d));

	// Complete all research for the enemy
	if (playerData[enemy].difficulty !== SUPEREASY)
	{
		completeAllResearch(enemy);
	}

	// Set the baseline FirePause after all research is completed
	initialFirePause["Boss Plasma Cannon 3x"] = Upgrades[enemy].Weapon["Boss Plasma Cannon 3x"].FirePause;
	initialFirePause["Boss Plasma Cannon 9x"] = Upgrades[enemy].Weapon["Boss Plasma Cannon 9x"].FirePause;

	// Set enemy experience modifier
	setExperienceModifier(enemy, CONFIG.ENEMY_EXPERIENCE_MODIFIER_PERCENT);

	// Multiply the range of all weapons and sensors
	if (CONFIG.RANGE_MULTIPLIER !== 1)
	{
		for (let player = 0; player < maxPlayers; player++)
		{
			if (player === enemy)
			{
				continue;
			}
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

	// Use scavengerPlayer as a proxy
	for (let player = 0; player < maxPlayers; player++)
	{
		setAlliance(player, scavengerPlayer, true);
	}

	hackNetOn();

	setMissionTime(CONFIG.START_TIMER_SECONDS);
}

function bossfight_eventMissionTimeout()
{
	playSound("nmedeted.ogg");
	playSound("beacon.ogg");

	// Hide the mission timer
	setMissionTime(-1);

	const { x, y } = findSpawnTile();

	hackNetOff();
	CONFIG.SPAWN_BOSS(x, y).forEach(boss => groupAdd(GROUP_BOSS, boss));
	hackNetOn();

	queue("tickRed", 100);
	// setTimer("tickBlue", 5000);
	setTimer("tickCrush", 4000);
	// setTimer("tickMinions", 1000);
	setTimer("tickComponents", 2000);
	// setTimer("tickExpire", 3000);
}

function eventDestroyed(object)
{
	if (groupSize(GROUP_BOSS) === 0)
	{
		// Game over
		hackNetOff();
		enumStruct(enemy).forEach(s => removeObject(s, false));
		enumDroid(enemy).forEach(d => removeObject(d, true));
		enumStruct(scavengerPlayer).forEach(s => removeObject(s, false));
		enumDroid(scavengerPlayer).forEach(d => removeObject(d, true));
		hackNetOn();
	}

	if (groupSize(GROUP_WARNING_RED) === 0)
	{
		tickRed();
	}

	// Check that the boss did not lose its target (structure was destroyed but warning was not)
	enumGroup(GROUP_BOSS).forEach(boss =>
	{
		if (boss.order !== DORDER_ATTACK)
		{
			const targets = enumGroup(GROUP_WARNING_RED);
			if (targets.length > 0)
			{
				const target = targets[syncRandom(targets.length)];
				orderDroidObj(boss, DORDER_ATTACK, target);
			}
		}
	});
}

function tickRed()
{
	hackNetOff();
	enumGroup(GROUP_BOSS).forEach(boss =>
	{
		// let R = 100 - boss.health;
		const R = 8;

		const target = getTarget(boss.x, boss.y, R);
		if (!target)
		{
			return;
		}

		const warning = addWarningRed(target.x, target.y);
		if (!warning)
		{
			return;
		}

		if (target.type === STRUCTURE)
		{
			orderDroidObj(boss, DORDER_ATTACK, target);
		}
		else
		{
			orderDroidObj(boss, DORDER_ATTACK, warning);
		}
	});
	hackNetOn();
}

function tickBlue()
{
	hackNetOff();
	enumGroup(GROUP_BOSS).forEach(boss =>
	{
		if (syncRandom(CONFIG.MINION_SPAWN_CHANCE) > boss.health)
		{
			tryAddWarningBlue(boss.x + 1, boss.y - 5);
			tryAddWarningBlue(boss.x + 3, boss.y - 4);
			tryAddWarningBlue(boss.x + 4, boss.y - 3);
			tryAddWarningBlue(boss.x + 5, boss.y - 1);

			tryAddWarningBlue(boss.x + 5, boss.y + 1);
			tryAddWarningBlue(boss.x + 4, boss.y + 3);
			tryAddWarningBlue(boss.x + 3, boss.y + 4);
			tryAddWarningBlue(boss.x + 1, boss.y + 5);

			tryAddWarningBlue(boss.x - 1, boss.y - 5);
			tryAddWarningBlue(boss.x - 3, boss.y - 4);
			tryAddWarningBlue(boss.x - 4, boss.y - 3);
			tryAddWarningBlue(boss.x - 5, boss.y - 1);

			tryAddWarningBlue(boss.x - 5, boss.y + 1);
			tryAddWarningBlue(boss.x - 4, boss.y + 3);
			tryAddWarningBlue(boss.x - 3, boss.y + 4);
			tryAddWarningBlue(boss.x - 1, boss.y + 5);
		}
	});
	hackNetOn();
}

function tickCrush()
{
	hackNetOff();
	enumGroup(GROUP_BOSS).forEach(boss =>
	{
		enumRange(boss.x, boss.y, 3, ALL_PLAYERS, false).forEach(object =>
		{
			if (object.damageable !== false && object.player !== enemy && object.player !== scavengerPlayer)
			{
				removeObject(object, true);
			}
		});
	});
	hackNetOn();
}

function tickMinions()
{
	hackNetOff();
	enumGroup(GROUP_WARNING_BLUE).forEach(object =>
	{
		if (gameTime - object.born > 2000)
		{
			CONFIG.SPAWN_MINION(object.x, object.y);
			removeObject(object);
		}
	});
	hackNetOn();
}

function tickComponents()
{
	hackNetOff();
	enumGroup(GROUP_BOSS).forEach(boss =>
	{
		{
			// The multiplier starts at 1 and increases to M as health approaches 0%
			const M = CONFIG.BOSS_ENGINE_SPEED_MULTIPLIER;
			const multiplier = 1 + (M-1)*(1 - boss.health/100);
			Upgrades[enemy].Body["Boss Tiger 3x"].Power = Stats.Body["Boss Tiger 3x"].Power * multiplier;
			Upgrades[enemy].Body["Boss Tiger 9x"].Power = Stats.Body["Boss Tiger 9x"].Power * multiplier;
			Upgrades[enemy].Body["Boss Wyvern 9x"].Power = Stats.Body["Boss Wyvern 9x"].Power * multiplier;
		}
		{
			// The multiplier starts at 1 and increases to M as health approaches 0%
			const M = CONFIG.BOSS_RELOAD_RATE_MULTIPLIER;
			const multiplier = 1 + (M-1)*(1 - boss.health/100);
			Upgrades[enemy].Weapon["Boss Plasma Cannon 3x"].FirePause = initialFirePause["Boss Plasma Cannon 3x"] / multiplier;
			Upgrades[enemy].Weapon["Boss Plasma Cannon 9x"].FirePause = initialFirePause["Boss Plasma Cannon 9x"] / multiplier;
		}
	});
	hackNetOn();
}

function tickExpire()
{
	hackNetOff();
	enumDroid(enemy, DROID_REPAIR).forEach(droid =>
	{
		if (gameTime - droid.born > CONFIG.MINION_LIFE_TIME_MILLISECONDS)
		{
			removeObject(droid, true);
		}
	});
	hackNetOn();
}

function tryAddWarningBlue(x, y)
{
	if (x > 0 && y > 0 && x < mapWidth && y < mapWidth)
	{
		const t = terrainType(x, y);
		if (t !== TER_CLIFFFACE && t !== TER_WATER)
		{
			addWarningBlue(x, y);
		}
	}
}

function getTarget(x, y, initialRadius)
{
	let radius = initialRadius;
	let targets = searchTargets(x, y, radius);

	while (targets.length === 0 && radius < mapRadius)
	{
		radius += 3;
		targets = searchTargets(x, y, radius);
	}

	return targets[syncRandom(targets.length)];
}

function searchTargets(x, y, radius)
{
	return enumRange(x, y, radius, ALL_PLAYERS, false).filter(object =>
	{
		return object.type !== FEATURE
			&& object.player !== scavengerPlayer
			&& object.player !== enemy
			&& !allianceExistsBetween(enemy, object.player)
			&& object.isFlying !== true;
	});
}

function anyVTOL()
{
	for (let player = 0; player < maxPlayers; player++)
	{
		if (enumDroid(player, DROID_WEAPON).some(a => a.isVTOL))
		{
			return true;
		}
	}
	return false;
}

function addWarningRed(x, y)
{
	let object = null;

	if (getObject(x, y) || anyVTOL())
	{
		object = addDroid(scavengerPlayer, x, y, "Red Warning", "body_warning_red", "propulsion_warning", "", "", "weapon_warning");
	}
	else
	{
		object = addStructure("warning_red", scavengerPlayer, x * 128, y * 128);
	}

	if (!object)
	{
		return null;
	}

	groupAdd(GROUP_WARNING_RED, object);
	setObjectFlag(object, OBJECT_FLAG_UNSELECTABLE, true);
	return object;
}

function addWarningBlue(x, y)
{
	let object = null;

	if (getObject(x, y) || anyVTOL())
	{
		object = addDroid(scavengerPlayer, x, y, "Blue Warning", "body_warning_blue", "propulsion_warning", "", "", "weapon_warning");
	}
	else
	{
		object = addStructure("warning_blue", scavengerPlayer, x * 128, y * 128);
	}

	if (!object)
	{
		return null;
	}

	groupAdd(GROUP_WARNING_BLUE, object);
	setObjectFlag(object, OBJECT_FLAG_UNSELECTABLE, true);
	return object;
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
