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

// Base XP values for fishing — scale with level in fishing.js
const XP_PER_FISH = {
    'coins':      10,
    'coins-big':  20,
    'junk':       5,
    'rare':       25,
    'skin':       100
};

const XP_WEEKLY = 150; // XP per weekly reward claim

// XP needed to go from level N to N+1
function xpForLevel(level) {
    return Math.floor(300 * Math.pow(1.18, level - 1));
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
    // Apply XP Overdrive perk if unlocked (+15% XP from all sources)
    if (typeof isShopItemUnlocked === 'function' && isShopItemUnlocked('perk_xp_overdrive')) {
        amount = Math.round(amount * 1.15);
    }

    const maxLv = (typeof getMaxLevel === 'function') ? getMaxLevel() : 50;

    // Already at cap — no more XP
    if (getLevel() >= maxLv) {
        updateLevelDisplay();
        if (typeof updatePrestigeButton === 'function') updatePrestigeButton();
        return;
    }

    let xp    = getXP() + amount;
    let level = getLevel();

    localStorage.setItem('csgo_xp', xp);
    showXPGain(amount);

    let xpIntoLevel = xp - totalXPForLevel(level);
    while (xpIntoLevel >= xpForLevel(level) && level < maxLv) {
        xpIntoLevel -= xpForLevel(level);
        level++;
        localStorage.setItem('csgo_level', level);
        if (level >= maxLv) {
            showMaxLevel(level);
        } else {
            showLevelUp(level);
        }
        if (typeof checkLevelAchievements === 'function') checkLevelAchievements(level);
    }

    updateLevelDisplay();
    if (typeof updatePrestigeButton === 'function') updatePrestigeButton();
}

// Weekly reward multiplier — 3% per level (was 5%)
function getWeeklyMultiplier() {
    return 1 + (getLevel() - 1) * 0.03;
}

// Fishing payout multiplier — capped at 1.25× regardless of level
function getFishMultiplier() {
    return Math.min(1.25, 1 + (getLevel() - 1) * 0.05);
}

// Fishing XP scales with level, capped at 2x to prevent runaway gains
function getFishXP(xpType) {
    const base = XP_PER_FISH[xpType] || 5;
    const mult = Math.min(2, 1 + (getLevel() - 1) * 0.1);
    return Math.round(base * mult);
}

function updateLevelDisplay() {
    const level  = getLevel();
    const maxLv  = (typeof getMaxLevel === 'function') ? getMaxLevel() : 50;
    const atMax  = level >= maxLv;
    const xp     = getXP();
    const needed = xpForLevel(level);
    const xpInto = xp - totalXPForLevel(level);
    const pct    = atMax ? 100 : Math.min((xpInto / needed) * 100, 100).toFixed(1);

    const labelEl = document.getElementById('levelLabel');
    const fillEl  = document.getElementById('xpBarFill');
    const textEl  = document.getElementById('xpText');

    if (labelEl) labelEl.textContent = `Lv.${level}`;
    if (fillEl)  { fillEl.style.width = `${pct}%`; fillEl.style.background = atMax ? '#e4ae39' : ''; }
    if (textEl)  textEl.textContent  = atMax ? '✦ MAX LEVEL — Prestige Ready!' : `${xpInto.toLocaleString()} / ${needed.toLocaleString()} XP`;
}

function showMaxLevel(level) {
    const overlay = document.getElementById('levelUpOverlay');
    const numEl   = document.getElementById('levelUpNumber');
    const perkEl  = document.getElementById('levelUpPerk');
    if (!overlay) return;
    numEl.textContent  = `Level ${level} — MAX!`;
    perkEl.textContent = 'You\'ve hit the level cap. Open your account panel to Prestige!';
    overlay.classList.remove('hidden');
    if (typeof renderCaseGrid === 'function') renderCaseGrid();
}

function getLevelPerkText(level) {
    const mult    = (1 + (level - 1) * 0.05).toFixed(2);
    const fishPct = Math.round((getWeeklyMultiplier() - 1) * 100);

    if (level % 10 === 0) return `Weekly rewards now ${mult}x stronger!`;
    if (level % 5  === 0) return `Fishing payouts are now ${fishPct}% better!`;

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

    if (typeof renderCaseGrid === 'function') renderCaseGrid();
}

document.getElementById('levelUpClose').addEventListener('click', () => {
    document.getElementById('levelUpOverlay').classList.add('hidden');
});

function showXPGain(amount) {
    const el     = document.createElement('div');
    el.className = 'xp-gain-popup';
    el.textContent = `+${amount} XP`;
    document.body.appendChild(el);

    const bar = document.getElementById('xpBarFill');
    if (bar) {
        const rect  = bar.getBoundingClientRect();
        el.style.left = `${rect.left + rect.width / 2}px`;
        el.style.top  = `${rect.top + window.scrollY - 10}px`;
    }

    setTimeout(() => el.remove(), 1200);
}

// -------------------------------------------------------
// Level Details Panel
// -------------------------------------------------------

function renderLevelDetails() {
    const el = document.getElementById('levelDetailsContent');
    if (!el) return;

    const currentLevel = getLevel();
    const xp       = getXP();
    const xpInto   = xp - totalXPForLevel(currentLevel);
    const needed   = xpForLevel(currentLevel);
    const remaining = needed - xpInto;

    // Build display list: milestones + always include currentLevel
    const milestones = [1, 5, 10, 15, 20, 25, 30, 35, 40, 50];
    const displayLevels = milestones.includes(currentLevel)
        ? milestones
        : [...milestones, currentLevel].sort((a, b) => a - b);

    let rows = displayLevels.map(lvl => {
        const mult      = 1 + (lvl - 1) * 0.05;
        const fishPct   = Math.round((mult - 1) * 100);
        const multLabel = mult.toFixed(2);
        const caseUnlock = CASES.find(c => c.unlockLevel === lvl);

        let perks = [];
        if (caseUnlock) perks.push(`${caseUnlock.icon} ${caseUnlock.name} unlocked`);
        perks.push(`Weekly ${multLabel}x`);
        perks.push(`Fishing +${fishPct}%`);

        const stateClass = lvl < currentLevel ? 'is-past'
                         : lvl === currentLevel ? 'is-current'
                         : 'is-future';

        return `
            <div class="level-details-row ${stateClass}">
                <span class="level-details-lv">Lv.${lvl}</span>
                <span class="level-details-perks">${perks.join(' · ')}</span>
            </div>
        `;
    }).join('');

    el.innerHTML = `
        <div class="level-details-current">
            You are <strong>Level ${currentLevel}</strong> — ${remaining.toLocaleString()} XP to Level ${currentLevel + 1}
        </div>
        <div class="level-details-table">${rows}</div>
        <div class="level-details-xp-note">
            XP per case: Blue 10 · Purple 25 · Pink 75 · Red 200 · Gold 500<br>
            XP per fish scales with level (base: Coins 10 · Junk 5 · Rare 25 · Skin 100)
        </div>
    `;
}