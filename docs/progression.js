// -------------------------------------------------------
// Progression: XP and Level System
// -------------------------------------------------------

const XP_PER_RARITY = {
    'GOLD':       500,
    'Rare (Red)': 200,
    'Pink':       75,
    'Purple':     25,
    'Blue':       10
};

const XP_PER_FISH = {
    'coins': 5,
    'coins-big': 10,
    'junk': 15,
    'rare': 30,
    'skin': 100
};

const XP_DAILY = 100;

// XP needed to go from level N to N+1
function xpForLevel(level) {
    return Math.floor(200 * Math.pow(1.3, level - 1));
}

// Total XP needed to reach a given level from scratch
function totalXPForLevel(level) {
    let total = 0;
    for (let i = 1; i < level; i++) total += xpForLevel(i);
    return total;
}

function getXP() {
    return parseInt(localStorage.getItem('csgo_xp') || '0');
}

function getLevel() {
    return parseInt(localStorage.getItem('csgo_level') || '1');
}

function addXP(amount) {
    let xp    = getXP() + amount;
    let level = getLevel();

    localStorage.setItem('csgo_xp', xp);
    showXPGain(amount);

    // Check for level ups
    let xpIntoLevel = xp - totalXPForLevel(level);
    while (xpIntoLevel >= xpForLevel(level)) {
        xpIntoLevel -= xpForLevel(level);
        level++;
        localStorage.setItem('csgo_level', level);
        showLevelUp(level);
        if (typeof checkLevelAchievements === 'function') checkLevelAchievements(level);
    }

    updateLevelDisplay();
}

// Daily reward scales with level: +50 coins per level
function getDailyRewardAmount() {
    return DAILY_REWARD + (getLevel() - 1) * 50;
}

// Fishing payout multiplier scales with level: +5% per level
function getFishMultiplier() {
    return 1 + (getLevel() - 1) * 0.05;
}

function updateLevelDisplay() {
    const level      = getLevel();
    const xp         = getXP();
    const needed     = xpForLevel(level);
    const xpInto     = xp - totalXPForLevel(level);
    const pct        = Math.min((xpInto / needed) * 100, 100).toFixed(1);

    const labelEl = document.getElementById('levelLabel');
    const fillEl  = document.getElementById('xpBarFill');
    const textEl  = document.getElementById('xpText');

    if (labelEl) labelEl.textContent = `Lv.${level}`;
    if (fillEl)  fillEl.style.width  = `${pct}%`;
    if (textEl)  textEl.textContent  = `${xpInto.toLocaleString()} / ${needed.toLocaleString()} XP`;
}

function getLevelPerkText(level) {
    const dailyNow = DAILY_REWARD + (level - 1) * 50;
    const fishPct  = Math.round((getFishMultiplier() - 1) * 100);

    if (level % 10 === 0) return `Daily reward now ${dailyNow.toLocaleString()} coins!`;
    if (level % 5  === 0) return `Fishing payouts are now ${fishPct}% better!`;

    // Case unlocks
    const unlocked = CASES.find(c => c.unlockLevel === level);
    if (unlocked)  return `${unlocked.icon} ${unlocked.name} unlocked!`;

    return `Keep grinding, more rewards ahead!`;
}

function showLevelUp(level) {
    const overlay = document.getElementById('levelUpOverlay');
    const numEl   = document.getElementById('levelUpNumber');
    const perkEl  = document.getElementById('levelUpPerk');
    if (!overlay) return;

    numEl.textContent  = `Level ${level}`;
    perkEl.textContent = getLevelPerkText(level);

    overlay.classList.remove('hidden');

    // Re-render case grid in case a new case just unlocked
    if (typeof renderCaseGrid === 'function') renderCaseGrid();
}

document.getElementById('levelUpClose').addEventListener('click', () => {
    document.getElementById('levelUpOverlay').classList.add('hidden');
});

function showXPGain(amount) {
    const el       = document.createElement('div');
    el.className   = 'xp-gain-popup';
    el.textContent = `+${amount} XP`;
    document.body.appendChild(el);

    // Position near the XP bar
    const bar = document.getElementById('xpBarFill');
    if (bar) {
        const rect  = bar.getBoundingClientRect();
        el.style.left = `${rect.left + rect.width / 2}px`;
        el.style.top  = `${rect.top + window.scrollY - 10}px`;
    }

    setTimeout(() => el.remove(), 1200);
}