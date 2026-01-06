var scrollLimits = getScrollLimits();

function eventStartLevel()
{
	queue("tickOrders", 5000);
	setTimer("tickCyborgs", 6000);
}

function tickOrders()
{
	enumDroid(me, DROID_WEAPON).forEach(droid =>
	{
		if (droid.order === DORDER_ATTACK && Math.random() < 0.80)
		{
			return;
		}

		const targets = enumTargets();
		if (targets.length > 0)
		{
			const target = sortNearest(targets, droid.x, droid.y)[0];
			if (Math.random() * 85 > droid.health)
			{
				orderDroidObj(droid, DORDER_ATTACK, target);
			}
			else
			{
				orderDroidLoc(droid, DORDER_SCOUT, target.x, target.y);
			}
		}
	});

	queue("tickOrders", updateDelay());
}

function tickCyborgs()
{
	updateScrollLimits();
	enumDroid(me, DROID_WEAPON).forEach(droid =>
	{
		enumRange(droid.x, droid.y, 8, me, false).forEach(object =>
		{
			if (object.type === DROID && object.droidType === DROID_REPAIR)
			{
				// repel(object, droid.x, droid.y, 6);
				guard(object, droid.x, droid.y, 10);
			}
		});
	});
}


// Make the droid move away from ax, ay
function repel(droid, ax, ay, strength)
{
	const dx = droid.x - ax;
	const dy = droid.y - ay;
	const D = Math.abs(dx) + Math.abs(dy);
	if (D === 0)
	{
		return;
	}

	const K = strength / D;
	const x = droid.x + K*dx;
	const y = droid.y + K*dy;
	if (inScrollLimits(x, y))
	{
		orderDroidLoc(droid, DORDER_MOVE, x, y);
	}
}

// Make the droid form a circle around ax, ay
function guard(droid, ax, ay, radius)
{
	const dx = droid.x - ax;
	const dy = droid.y - ay;
	const D = dx*dx + dy*dy;
	if (D === 0)
	{
		return;
	}

	const K = radius / Math.sqrt(D);
	const x = ax + K*dx;
	const y = ay + K*dy;
	if (inScrollLimits(x, y))
	{
		orderDroidLoc(droid, DORDER_MOVE, x, y);
	}
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
			enumStruct(player, POWER_GEN),
		);
	}
	return targets;
}

// Generate a random number between 1000 and 11000, with step size 100
// e.g. 1000, 1100, 1200, 1300, ...
function updateDelay()
{
	const a = Math.random() * 100; // 0.00, 1.23, ..., 67.89, ..., 99.99
	const b = Math.ceil(a);        // 0, 1, ..., 67, ..., 100
	const c = b * 100;             // 0, 100, ..., 6700, ..., 10000
	const d = 1000 + c;            // 1000, 1100, ..., 7700, ..., 11000
	return d;
}

function updateScrollLimits()
{
	scrollLimits = getScrollLimits();
}

function inScrollLimits(x, y)
{
	return x > scrollLimits.x
		&& y > scrollLimits.y
		&& x < scrollLimits.x2 - 1
		&& y < scrollLimits.y2 - 1;
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
