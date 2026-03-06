let scrollLimits;

function eventStartLevel()
{
	// setTimer("tickCyborgs", 6000);
}

function tickCyborgs()
{
	scrollLimits = getScrollLimits();
	enumDroid(me, DROID_WEAPON).forEach(droid =>
	{
		enumRange(droid.x, droid.y, 8, me, false).forEach(object =>
		{
			if (object.type === DROID && object.droidType === DROID_REPAIR)
			{
				guard(object, droid.x, droid.y, 10);
			}
		});
	});
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
	if (x > scrollLimits.x &&
		y > scrollLimits.y &&
		x < scrollLimits.x2 - 1 &&
		y < scrollLimits.y2 - 1)
	{
		orderDroidLoc(droid, DORDER_MOVE, x, y);
	}
}
