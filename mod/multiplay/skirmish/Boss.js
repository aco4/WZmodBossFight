function eventStartLevel()
{
	updateOrders();
}

function updateOrders()
{
	enumDroid(me).forEach(droid =>
	{
		if (droid.order === DORDER_ATTACK && Math.random() < 0.8)
		{
			return;
		}

		const targets = enumTargets();
		if (targets.length > 0)
		{
			const target = sortNearest(targets, droid.x, droid.y)[0];
			if (Math.random() < 0.26)
			{
				orderDroidObj(droid, DORDER_ATTACK, target);
			}
			else
			{
				orderDroidLoc(droid, DORDER_SCOUT, target.x, target.y);
			}
		}
	});
	queue("updateOrders", updateDelay());
}

function enumTargets()
{
	let targets = [];
	for (const player of iterEnemies())
	{
		targets = targets.concat(
			enumStruct(player, FACTORY),
			enumStruct(player, CYBORG_FACTORY),
			enumStruct(player, VTOL_FACTORY),
			enumStruct(player, RESEARCH_LAB),
		);
	}
	return targets;
}

// Generate a random number between 2000 and 12000, with step size 100
// e.g. 2000, 2100, 2200, 2300, ...
function updateDelay()
{
	const a = Math.random() * 100; // 0.00, 1.23, ..., 67.89, ..., 99.99
	const b = Math.ceil(a);        // 0, 1, ..., 67, ..., 100
	const c = b * 100;             // 0, 100, ..., 6700, ..., 10000
	const d = 2000 + c;            // 2000, 2100, ..., 8700, ..., 12000
	return d;
}

function *iterEnemies()
{
	for (let player = 0; player < maxPlayers; player++)
	{
		if (player !== me && !allianceExistsBetween(me, player))
		{
			yield player;
		}
	}
}

function sortNearest(targets, x, y)
{
	return targets.sort((a, b) =>
		distBetweenTwoPoints(x, y, a.x, a.y) - distBetweenTwoPoints(x, y, b.x, b.y)
	);
}
