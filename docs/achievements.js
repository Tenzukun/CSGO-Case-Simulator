// -------------------------------------------------------
// Achievement Definitions
// -------------------------------------------------------

const ACHIEVEMENTS = [
    // Cases
    { id: 'first_case',   icon: '🎰', name: 'First Blood',       desc: 'Open your first case',           category: 'Cases'    },
    { id: 'cases_10',     icon: '📦', name: 'On a Roll',         desc: 'Open 10 cases',                  category: 'Cases'    },
    { id: 'cases_50',     icon: '📦', name: 'Addicted',          desc: 'Open 50 cases',                  category: 'Cases'    },
    { id: 'cases_100',    icon: '📦', name: 'Case Maniac',       desc: 'Open 100 cases',                 category: 'Cases'    },
    { id: 'cases_250',    icon: '📦', name: 'Case Veteran',      desc: 'Open 250 cases',                 category: 'Cases'    },
    { id: 'cases_500',    icon: '🏆', name: 'Case Legend',       desc: 'Open 500 cases',                 category: 'Cases'    },

    // Rarities
    { id: 'first_blue',   icon: '🔵', name: 'Blue Collar',       desc: 'Roll your first Blue',           category: 'Rarities' },
    { id: 'first_purple', icon: '🟣', name: 'Purple Rain',       desc: 'Roll your first Purple',         category: 'Rarities' },
    { id: 'first_pink',   icon: '🩷', name: 'Pretty in Pink',    desc: 'Roll your first Pink',           category: 'Rarities' },
    { id: 'first_red',    icon: '🔴', name: 'Seeing Red',        desc: 'Roll your first Red',            category: 'Rarities' },
    { id: 'first_gold',   icon: '🟡', name: 'Gold Rush',         desc: 'Roll your first Gold',           category: 'Rarities' },
    { id: 'gold_5',       icon: '⭐', name: 'Golden God',        desc: 'Roll 5 Golds',                   category: 'Rarities' },
    { id: 'gold_10',      icon: '🌟', name: 'Gold Obsessed',     desc: 'Roll 10 Golds',                  category: 'Rarities' },
    { id: 'stattrak',     icon: '☠️', name: 'StatTrak!',         desc: 'Roll a StatTrak item',           category: 'Rarities' },
    { id: 'souvenir',     icon: '🎁', name: 'Souvenir Edition',  desc: 'Roll a Souvenir item',           category: 'Rarities' },
    { id: 'knife',        icon: '🔪', name: 'Blade Runner',      desc: 'Roll a knife skin',              category: 'Rarities' },
    { id: 'gloves',       icon: '🥊', name: 'Hands Full',        desc: 'Roll a glove skin',              category: 'Rarities' },

    // Fishing
    { id: 'first_fish',   icon: '🎣', name: 'Gone Fishing',      desc: 'Cast your first line',           category: 'Fishing'  },
    { id: 'fish_10',      icon: '🐟', name: 'Small Catch',       desc: 'Catch 10 fish',                  category: 'Fishing'  },
    { id: 'fish_50',      icon: '🐠', name: 'Reel Deal',         desc: 'Catch 50 fish',                  category: 'Fishing'  },
    { id: 'fish_100',     icon: '🦈', name: 'Master Angler',     desc: 'Catch 100 fish',                 category: 'Fishing'  },
    { id: 'fish_skin',    icon: '💎', name: 'Lucky Hook',        desc: 'Catch a skin while fishing',     category: 'Fishing'  },
    { id: 'fish_junk_10', icon: '🪣', name: 'Junk Collector',    desc: 'Catch 10 junk items',            category: 'Fishing'  },
    { id: 'fish_rare',    icon: '✨', name: 'Rare Find',         desc: 'Catch a rare junk item',         category: 'Fishing'  },

    // Levels
    { id: 'level_5',      icon: '⚡', name: 'Getting Started',   desc: 'Reach Level 5',                  category: 'Levels'   },
    { id: 'level_15',     icon: '🔥', name: 'Mid Game',          desc: 'Reach Level 15',                 category: 'Levels'   },
    { id: 'level_25',     icon: '💪', name: 'Veteran',           desc: 'Reach Level 25',                 category: 'Levels'   },
    { id: 'level_40',     icon: '👑', name: 'Legend',            desc: 'Reach Level 40',                 category: 'Levels'   },
    { id: 'level_50',     icon: '🌌', name: 'Mythic',            desc: 'Reach Level 50',                 category: 'Levels'   },

    // Coins
    { id: 'coins_10k',    icon: '💰', name: 'Pocket Change',     desc: 'Earn 10,000 coins total',        category: 'Coins'    },
    { id: 'coins_100k',   icon: '💰', name: 'High Roller',       desc: 'Earn 100,000 coins total',       category: 'Coins'    },
    { id: 'coins_500k',   icon: '💎', name: 'Fortune',           desc: 'Earn 500,000 coins total',       category: 'Coins'    },
    { id: 'coins_1m',     icon: '🤑', name: 'Millionaire',       desc: 'Earn 1,000,000 coins total',     category: 'Coins'    },

    // Daily
    { id: 'daily_7',      icon: '📅', name: 'Consistent',        desc: 'Claim your daily reward 7 days in a row', category: 'Daily' },
    { id: 'daily_30',     icon: '🗓️', name: 'Devoted',           desc: 'Claim your daily reward 30 times total',  category: 'Daily' },
];

// -------------------------------------------------------
// Achievement Storage
// -------------------------------------------------------

function getUnlockedAchievements() {
    return JSON.parse(localStorage.getItem('csgo_achievements') || '[]');
}

function isUnlocked(id) {
    return getUnlockedAchievements().includes(id);
}

function unlockAchievement(id) {
    if (isUnlocked(id)) return;
    const unlocked = getUnlockedAchievements();
    unlocked.push(id);
    localStorage.setItem('csgo_achievements', JSON.stringify(unlocked));
    queueAchievementPopup(id);
}

// -------------------------------------------------------
// Achievement Stats (separate from leaderboard stats)
// -------------------------------------------------------

function getAchStats() {
    const defaults = {
        fishCount: 0, junkCount: 0, rareJunkCount: 0,
        fishSkin: false, goldCount: 0, statTrak: false,
        souvenir: false, knife: false, gloves: false,
        dailyStreak: 0, dailyTotal: 0, lastDailyDate: '',
        blueRolled: false, purpleRolled: false,
        pinkRolled: false, redRolled: false
    };
    return Object.assign(defaults, JSON.parse(localStorage.getItem('csgo_ach_stats') || '{}'));
}

function saveAchStats(stats) {
    localStorage.setItem('csgo_ach_stats', JSON.stringify(stats));
}

// -------------------------------------------------------
// Achievement Checks
// -------------------------------------------------------

function checkCoinAchievements() {
    const coins = getLbStats().coins;
    if (coins >= 10000)    unlockAchievement('coins_10k');
    if (coins >= 100000)   unlockAchievement('coins_100k');
    if (coins >= 500000)   unlockAchievement('coins_500k');
    if (coins >= 1000000)  unlockAchievement('coins_1m');
}

function checkCaseAchievements(result) {
    const stats    = getLbStats();
    const achStats = getAchStats();

    // Cases opened milestones
    if (stats.cases >= 1)   unlockAchievement('first_case');
    if (stats.cases >= 10)  unlockAchievement('cases_10');
    if (stats.cases >= 50)  unlockAchievement('cases_50');
    if (stats.cases >= 100) unlockAchievement('cases_100');
    if (stats.cases >= 250) unlockAchievement('cases_250');
    if (stats.cases >= 500) unlockAchievement('cases_500');

    // Rarity
    if (result.rarity === 'Blue')       { achStats.blueRolled   = true; unlockAchievement('first_blue');   }
    if (result.rarity === 'Purple')     { achStats.purpleRolled = true; unlockAchievement('first_purple'); }
    if (result.rarity === 'Pink')       { achStats.pinkRolled   = true; unlockAchievement('first_pink');   }
    if (result.rarity === 'Rare (Red)') { achStats.redRolled    = true; unlockAchievement('first_red');    }
    if (result.rarity === 'GOLD') {
        achStats.goldCount++;
        unlockAchievement('first_gold');
        if (achStats.goldCount >= 5)  unlockAchievement('gold_5');
        if (achStats.goldCount >= 10) unlockAchievement('gold_10');
    }

    // Prefix
    if (result.prefix === 'StatTrak™') unlockAchievement('stattrak');
    if (result.prefix === 'Souvenir')  unlockAchievement('souvenir');

    // Weapon type
    if (result.type === 'Knife')  unlockAchievement('knife');
    if (result.type === 'Gloves') unlockAchievement('gloves');

    saveAchStats(achStats);
    checkCoinAchievements();
}

function checkFishAchievements(result) {
    const achStats = getAchStats();

    achStats.fishCount++;
    if (achStats.fishCount >= 1)   unlockAchievement('first_fish');
    if (achStats.fishCount >= 10)  unlockAchievement('fish_10');
    if (achStats.fishCount >= 50)  unlockAchievement('fish_50');
    if (achStats.fishCount >= 100) unlockAchievement('fish_100');

    if (result.type === 'junk' || result.type === 'rare') {
        achStats.junkCount++;
        if (achStats.junkCount >= 10) unlockAchievement('fish_junk_10');
    }
    if (result.type === 'rare') {
        unlockAchievement('fish_rare');
    }
    if (result.type === 'skin') {
        unlockAchievement('fish_skin');
    }

    saveAchStats(achStats);
    checkCoinAchievements();
}

function checkLevelAchievements(level) {
    if (level >= 5)  unlockAchievement('level_5');
    if (level >= 15) unlockAchievement('level_15');
    if (level >= 25) unlockAchievement('level_25');
    if (level >= 40) unlockAchievement('level_40');
    if (level >= 50) unlockAchievement('level_50');
}

function checkDailyAchievements() {
    const achStats  = getAchStats();
    const now       = new Date();
    const today     = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const prev      = new Date(now);
    prev.setDate(prev.getDate() - 1);
    const yesterday = `${prev.getFullYear()}-${prev.getMonth()}-${prev.getDate()}`;

    achStats.dailyTotal++;
    achStats.dailyStreak = achStats.lastDailyDate === yesterday ? achStats.dailyStreak + 1 : 1;
    achStats.lastDailyDate = today;

    if (achStats.dailyStreak >= 7)  unlockAchievement('daily_7');
    if (achStats.dailyTotal >= 30)  unlockAchievement('daily_30');

    saveAchStats(achStats);
    checkCoinAchievements();
}

// -------------------------------------------------------
// Achievement Popup Queue
// -------------------------------------------------------

const achQueue = [];
let achShowing = false;

function queueAchievementPopup(id) {
    achQueue.push(id);
    if (!achShowing) showNextAchievement();
}

function showNextAchievement() {
    if (achQueue.length === 0) { achShowing = false; return; }
    achShowing    = true;
    const id      = achQueue.shift();
    const ach     = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach)     { showNextAchievement(); return; }

    document.getElementById('achPopupIcon').textContent = ach.icon;
    document.getElementById('achPopupName').textContent = ach.name;
    document.getElementById('achPopupDesc').textContent = ach.desc;
    document.getElementById('achievementPopup').classList.remove('hidden');

    // Refresh the achievements page if it is open
    if (typeof renderAchievements === 'function') {
        const page = document.getElementById('page-achievements');
        if (page && !page.classList.contains('hidden')) renderAchievements();
    }
}

document.getElementById('achPopupClose').addEventListener('click', () => {
    document.getElementById('achievementPopup').classList.add('hidden');
    achShowing = false;
    showNextAchievement();
});

// -------------------------------------------------------
// Achievements Page Rendering
// -------------------------------------------------------

function renderAchievements() {
    const unlocked   = getUnlockedAchievements();
    const categories = [...new Set(ACHIEVEMENTS.map(a => a.category))];
    const grid       = document.getElementById('achievementsGrid');
    const countEl    = document.getElementById('achCount');

    if (countEl) countEl.textContent = `${unlocked.length} / ${ACHIEVEMENTS.length} unlocked`;

    grid.innerHTML = categories.map(cat => {
        const achs = ACHIEVEMENTS.filter(a => a.category === cat);
        return `
            <div class="ach-category">
                <div class="ach-category-label">${cat}</div>
                <div class="ach-grid">
                    ${achs.map(a => {
                        const done = unlocked.includes(a.id);
                        return `
                            <div class="ach-badge ${done ? 'unlocked' : 'locked'}" title="${a.desc}">
                                <div class="ach-icon">${done ? a.icon : '🔒'}</div>
                                <div class="ach-name">${a.name}</div>
                                <div class="ach-desc">${a.desc}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}