
function START_TIMER_SECONDS() {
    switch (botDifficulty) {
        case SUPEREASY : return 180;
        case EASY      : return 150;
        case MEDIUM    : return 120;
        case HARD      : return 90;
        case INSANE    : return 60;
    }
}

function SPAWN_BOSS() {
    if (botDifficulty == SUPEREASY) {
        return (x, y) => [
            addDroid(enemy, x, y, "Boss", "boss3x_tiger", "boss3x_tracks", "", "", "boss3x_plasma_cannon"),
        ];
    }
    if (botDifficulty == EASY) {
        return (x, y) => [
            addDroid(enemy, x, y, "Boss", "boss3x_tiger", "boss3x_tracks", "", "", "boss3x_plasma_cannon"),
        ];
    }
    if (botDifficulty == MEDIUM) {
        return (x, y) => [
            addDroid(enemy, x, y, "Boss", "boss9x_tiger", "boss9x_tracks", "", "", "boss9x_plasma_cannon"),
        ];
    }
    if (botDifficulty == HARD) {
        return (x, y) => [
            addDroid(enemy, x, y, "Boss", "boss9x_wyvern", "boss9x_tracks", "", "", "boss9x_plasma_cannon"),
        ];
    }
    if (botDifficulty == INSANE) {
        return (x, y) => [
            addDroid(enemy, x, y, "Boss", "boss3x_tiger", "boss3x_tracks", "", "", "boss3x_plasma_cannon"),
            addDroid(enemy, x, y, "Boss", "boss9x_wyvern", "boss9x_tracks", "", "", "boss9x_plasma_cannon"),
        ];
    }
}

function RANGE_MULTIPLIER() {
    return 2;
}

function ENEMY_EXPERIENCE_MODIFIER_PERCENT() {
    switch (botDifficulty) {
        case SUPEREASY : return 0;
        case EASY      : return 0;
        case MEDIUM    : return 0;
        case HARD      : return 0;
        case INSANE    : return 100;
    }
}

function FULL_MAP_REVEAL() {
    return true;
}

function BOSS_ENGINE_SPEED_MULTIPLIER() {
    switch (botDifficulty) {
        case SUPEREASY : return 2;
        case EASY      : return 3;
        case MEDIUM    : return 4;
        case HARD      : return 5;
        case INSANE    : return 6;
    }
}

function BOSS_RELOAD_RATE_MULTIPLIER() {
    switch (botDifficulty) {
        case SUPEREASY : return 1;
        case EASY      : return 1;
        case MEDIUM    : return 2;
        case HARD      : return 3;
        case INSANE    : return 4;
    }
}
