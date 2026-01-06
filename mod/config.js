
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
            addDroid(enemy, x, y, "Boss", "boss3x_tiger", "boss3x_tracks", "", "", "boss3x_plasma_cannon");
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

function HALO_ATTACK_DELAY_MILLISECONDS() {
    return 5000;
}

function HALO_ATTACK_WEAPON() {
    switch (botDifficulty) {
        case SUPEREASY : return "Bomb1-VTOL-LtHE";
        case EASY      : return "Bomb1-VTOL-LtHE";
        case MEDIUM    : return "Bomb2-VTOL-HvHE";
        case HARD      : return "Bomb2-VTOL-HvHE";
        case INSANE    : return "Bomb2-VTOL-HvHE";
    }
}

function CYBORG_ATTACK_DELAY_MILLISECONDS() {
    return 2000;
}

function BOSS_TURN_SPEED_MULTIPLIER() {
    switch (botDifficulty) {
        case SUPEREASY : return 2;
        case EASY      : return 3;
        case MEDIUM    : return 4;
        case HARD      : return 5;
        case INSANE    : return 6;
    }
}

function HALO_ATTACK_PERCENT_CHANCE() {
    switch (botDifficulty) {
        case SUPEREASY : return 0;
        case EASY      : return 45;
        case MEDIUM    : return 55;
        case HARD      : return 65;
        case INSANE    : return 75;
    }
}

function BOMB_ATTACK_PERCENT_CHANCE() {
    switch (botDifficulty) {
        case SUPEREASY : return 110;
        case EASY      : return 120;
        case MEDIUM    : return 130;
        case HARD      : return 140;
        case INSANE    : return 150;
    }
}

function CYBORG_ATTACK_PERCENT_CHANCE() {
    switch (botDifficulty) {
        case SUPEREASY : return 10;
        case EASY      : return 20;
        case MEDIUM    : return 30;
        case HARD      : return 40;
        case INSANE    : return 50;
    }
}
