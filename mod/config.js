
function START_TIMER_SECONDS() {
    switch (botDifficulty) {
        case SUPEREASY : return 180;
        case EASY      : return 120;
        case MEDIUM    : return 60;
        case HARD      : return 30;
        case INSANE    : return 0;
    }
}

function SPAWN_BOSS() {
    if (botDifficulty == SUPEREASY) {
        return (x, y) => {
            addDroid(enemy, x, y, "Boss", "boss3x_tiger", "boss3x_tracks", "", "", "boss3x_plasma_cannon");
        };
    }
    if (botDifficulty == EASY) {
        return (x, y) => {
            addDroid(enemy, x, y, "Boss", "boss3x_tiger", "boss3x_tracks", "", "", "boss3x_plasma_cannon");
        };
    }
    if (botDifficulty == MEDIUM) {
        return (x, y) => {
            addDroid(enemy, x, y, "Boss", "boss9x_tiger", "boss9x_tracks", "", "", "boss9x_plasma_cannon");
        };
    }
    if (botDifficulty == HARD) {
        return (x, y) => {
            addDroid(enemy, x, y, "Boss", "boss9x_wyvern", "boss9x_tracks", "", "", "boss9x_plasma_cannon");
        };
    }
    if (botDifficulty == INSANE) {
        return (x, y) => {
            addDroid(enemy, x, y, "Boss", "boss9x_wyvern", "boss9x_tracks", "", "", "boss9x_plasma_cannon");
            addDroid(enemy, x, y, "Boss", "boss9x_wyvern", "boss9x_tracks", "", "", "boss9x_plasma_cannon");
        };
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

function MAX_POWER() {
    return false;
}

function FIRE_ATTACK_DELAY_MILLISECONDS() {
    return 7000;
}

function FIRE_ATTACK_PERCENT_CHANCE() {
    switch (botDifficulty) {
        case SUPEREASY : return 0;
        case EASY      : return 0;
        case MEDIUM    : return 1;
        case HARD      : return 2;
        case INSANE    : return 3;
    }
}

function FIRE_ATTACK_WEAPON() {
    switch (botDifficulty) {
        case SUPEREASY : return "Bomb1-VTOL-LtHE";
        case EASY      : return "Bomb1-VTOL-LtHE";
        case MEDIUM    : return "Bomb3-VTOL-LtINC";
        case HARD      : return "Bomb4-VTOL-HvyINC";
        case INSANE    : return "Bomb5-VTOL-Plasmite";
    }
}
