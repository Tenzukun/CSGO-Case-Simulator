// -------------------------------------------------------
// Achievement Definitions
// -------------------------------------------------------

const ACHIEVEMENTS = [
    // Cases
    { id: 'first_case',   icon: '🎰', name: 'First Blood',       desc: 'Open your first case',                       category: 'Cases'    },
    { id: 'cases_10',     icon: '📦', name: 'On a Roll',         desc: 'Open 10 cases',                              category: 'Cases'    },
    { id: 'cases_50',     icon: '📦', name: 'Addicted',          desc: 'Open 50 cases',                              category: 'Cases'    },
    { id: 'cases_100',    icon: '📦', name: 'Case Maniac',       desc: 'Open 100 cases',                             category: 'Cases'    },
    { id: 'cases_250',    icon: '📦', name: 'Case Veteran',      desc: 'Open 250 cases',                             category: 'Cases'    },
    { id: 'cases_500',    icon: '🏆', name: 'Case Legend',       desc: 'Open 500 cases',                             category: 'Cases'    },
    { id: 'cases_1000',   icon: '🎰', name: 'Case Obsessed',     desc: 'Open 1,000 cases',                           category: 'Cases'    },
    { id: 'cases_2500',   icon: '💀', name: 'No Life',           desc: 'Open 2,500 cases',                           category: 'Cases'    },

    // Rarities
    { id: 'first_blue',   icon: '🔵', name: 'Blue Collar',       desc: 'Roll your first Blue',                       category: 'Rarities' },
    { id: 'first_purple', icon: '🟣', name: 'Purple Rain',       desc: 'Roll your first Purple',                     category: 'Rarities' },
    { id: 'first_pink',   icon: '🩷', name: 'Pretty in Pink',    desc: 'Roll your first Pink',                       category: 'Rarities' },
    { id: 'first_red',    icon: '🔴', name: 'Seeing Red',        desc: 'Roll your first Red',                        category: 'Rarities' },
    { id: 'first_gold',   icon: '🟡', name: 'Gold Rush',         desc: 'Roll your first Gold',                       category: 'Rarities' },
    { id: 'gold_5',       icon: '⭐', name: 'Golden God',        desc: 'Roll 5 Golds',                               category: 'Rarities' },
    { id: 'gold_10',      icon: '🌟', name: 'Gold Obsessed',     desc: 'Roll 10 Golds',                              category: 'Rarities' },
    { id: 'gold_25',      icon: '💛', name: 'Gold Hoarder',      desc: 'Roll 25 Golds',                              category: 'Rarities' },
    { id: 'gold_50',      icon: '👑', name: 'Midas Touch',       desc: 'Roll 50 Golds',                              category: 'Rarities' },
    { id: 'stattrak',     icon: '☠️', name: 'StatTrak!',         desc: 'Roll a StatTrak item',                       category: 'Rarities' },
    { id: 'souvenir',     icon: '🎁', name: 'Souvenir Edition',  desc: 'Roll a Souvenir item',                       category: 'Rarities' },
    { id: 'knife',        icon: '🔪', name: 'Blade Runner',      desc: 'Roll a knife skin',                          category: 'Rarities' },
    { id: 'gloves',       icon: '🥊', name: 'Hands Full',        desc: 'Roll a glove skin',                          category: 'Rarities' },
    { id: 'fn_item',      icon: '✨', name: 'Fresh Off the Line', desc: 'Roll a Factory New item',                   category: 'Rarities' },
    { id: 'all_rarities', icon: '🌈', name: 'Full Spectrum',     desc: 'Roll all 5 rarities at least once',          category: 'Rarities' },

    // Fishing
    { id: 'first_fish',   icon: '🎣', name: 'Gone Fishing',      desc: 'Cast your first line',                       category: 'Fishing'  },
    { id: 'fish_10',      icon: '🐟', name: 'Small Catch',       desc: 'Catch 10 fish',                              category: 'Fishing'  },
    { id: 'fish_50',      icon: '🐠', name: 'Reel Deal',         desc: 'Catch 50 fish',                              category: 'Fishing'  },
    { id: 'fish_100',     icon: '🦈', name: 'Master Angler',     desc: 'Catch 100 fish',                             category: 'Fishing'  },
    { id: 'fish_200',     icon: '🌊', name: 'Deep Sea Fisher',   desc: 'Catch 200 fish',                             category: 'Fishing'  },
    { id: 'fish_500',     icon: '🐋', name: 'The Ocean Is Yours', desc: 'Catch 500 fish',                            category: 'Fishing'  },
    { id: 'fish_skin',    icon: '💎', name: 'Lucky Hook',        desc: 'Catch a skin while fishing',                 category: 'Fishing'  },
    { id: 'fish_skin_5',  icon: '🍀', name: 'Lucky Lure',        desc: 'Catch 5 skins while fishing',               category: 'Fishing'  },
    { id: 'fish_junk_10', icon: '🪣', name: 'Junk Collector',    desc: 'Catch 10 junk items',                        category: 'Fishing'  },
    { id: 'fish_junk_50', icon: '🗑️', name: "One Man's Trash",   desc: 'Catch 50 junk items',                        category: 'Fishing'  },
    { id: 'fish_rare',    icon: '✨', name: 'Rare Find',         desc: 'Catch a rare junk item',                     category: 'Fishing'  },

    // Levels
    { id: 'level_5',      icon: '⚡', name: 'Getting Started',   desc: 'Reach Level 5',                              category: 'Levels'   },
    { id: 'level_10',     icon: '🐾', name: 'Finding Your Footing', desc: 'Reach Level 10',                          category: 'Levels'   },
    { id: 'level_15',     icon: '🔥', name: 'Mid Game',          desc: 'Reach Level 15',                             category: 'Levels'   },
    { id: 'level_20',     icon: '🎖️', name: 'Seasoned',          desc: 'Reach Level 20',                             category: 'Levels'   },
    { id: 'level_25',     icon: '💪', name: 'Veteran',           desc: 'Reach Level 25',                             category: 'Levels'   },
    { id: 'level_32',     icon: '💫', name: 'Elite',             desc: 'Reach Level 32',                             category: 'Levels'   },
    { id: 'level_40',     icon: '👑', name: 'Legend',            desc: 'Reach Level 40',                             category: 'Levels'   },
    { id: 'level_50',     icon: '🌌', name: 'Mythic',            desc: 'Reach Level 50',                             category: 'Levels'   },

    // Coins
    { id: 'coins_10k',    icon: '💰', name: 'Pocket Change',     desc: 'Earn 10,000 coins total',                    category: 'Coins'    },
    { id: 'coins_50k',    icon: '💵', name: 'Getting Rich',      desc: 'Earn 50,000 coins total',                    category: 'Coins'    },
    { id: 'coins_100k',   icon: '💰', name: 'High Roller',       desc: 'Earn 100,000 coins total',                   category: 'Coins'    },
    { id: 'coins_500k',   icon: '💎', name: 'Fortune',           desc: 'Earn 500,000 coins total',                   category: 'Coins'    },
    { id: 'coins_1m',     icon: '🤑', name: 'Millionaire',       desc: 'Earn 1,000,000 coins total',                 category: 'Coins'    },

    // Weekly
    { id: 'daily_7',      icon: '📅', name: 'Weekly Champion',   desc: 'Claim all 7 days in a single week',          category: 'Weekly'   },
    { id: 'daily_30',     icon: '🗓️', name: 'Devoted',           desc: 'Claim 30 weekly rewards total',              category: 'Weekly'   },
    { id: 'daily_100',    icon: '📆', name: 'Committed',         desc: 'Claim 100 weekly rewards total',             category: 'Weekly'   },

    // Spender
    { id: 'spend_10k',    icon: '💸', name: 'Big Spender',       desc: 'Spend 10,000 coins on cases',                category: 'Spender'  },
    { id: 'spend_100k',   icon: '🔥', name: 'Money Burner',      desc: 'Spend 100,000 coins on cases',               category: 'Spender'  },
    { id: 'spend_1m',     icon: '🐋', name: 'Whale',             desc: 'Spend 1,000,000 coins on cases',             category: 'Spender'  },
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
// Achievement Stats
// -------------------------------------------------------

function getAchStats() {
    const defaults = {
        fishCount: 0, junkCount: 0, rareJunkCount: 0,
        fishSkin: false, fishSkinCount: 0, goldCount: 0,
        statTrak: false, souvenir: false, knife: false, gloves: false,
        blueRolled: false, purpleRolled: false,
        pinkRolled: false, redRolled: false, fnRolled: false,
        weeklyClaimTotal: 0, weeksCompleted: 0
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
    if (coins >= 50000)    unlockAchievement('coins_50k');
    if (coins >= 100000)   unlockAchievement('coins_100k');
    if (coins >= 500000)   unlockAchievement('coins_500k');
    if (coins >= 1000000)  unlockAchievement('coins_1m');
}

function checkCaseAchievements(result) {
    const stats    = getLbStats();
    const achStats = getAchStats();

    if (stats.cases >= 1)    unlockAchievement('first_case');
    if (stats.cases >= 10)   unlockAchievement('cases_10');
    if (stats.cases >= 50)   unlockAchievement('cases_50');
    if (stats.cases >= 100)  unlockAchievement('cases_100');
    if (stats.cases >= 250)  unlockAchievement('cases_250');
    if (stats.cases >= 500)  unlockAchievement('cases_500');
    if (stats.cases >= 1000) unlockAchievement('cases_1000');
    if (stats.cases >= 2500) unlockAchievement('cases_2500');

    if (result.rarity === 'Blue')       { achStats.blueRolled   = true; unlockAchievement('first_blue');   }
    if (result.rarity === 'Purple')     { achStats.purpleRolled = true; unlockAchievement('first_purple'); }
    if (result.rarity === 'Pink')       { achStats.pinkRolled   = true; unlockAchievement('first_pink');   }
    if (result.rarity === 'Rare (Red)') { achStats.redRolled    = true; unlockAchievement('first_red');    }
    if (result.rarity === 'GOLD') {
        achStats.goldCount++;
        unlockAchievement('first_gold');
        if (achStats.goldCount >= 5)  unlockAchievement('gold_5');
        if (achStats.goldCount >= 10) unlockAchievement('gold_10');
        if (achStats.goldCount >= 25) unlockAchievement('gold_25');
        if (achStats.goldCount >= 50) unlockAchievement('gold_50');
    }

    if (result.wear   === 'Factory New') { achStats.fnRolled = true; unlockAchievement('fn_item'); }
    if (result.prefix === 'StatTrak™')   unlockAchievement('stattrak');
    if (result.prefix === 'Souvenir')    unlockAchievement('souvenir');
    if (result.type   === 'Knife')       unlockAchievement('knife');
    if (result.type   === 'Gloves')      unlockAchievement('gloves');

    // All rarities rolled
    if (achStats.blueRolled && achStats.purpleRolled && achStats.pinkRolled &&
        achStats.redRolled  && achStats.goldCount >= 1) {
        unlockAchievement('all_rarities');
    }

    // Spender — uses coinsSpent from all-time stats
    const spent = getAllTimeStats().coinsSpent;
    if (spent >= 10000)    unlockAchievement('spend_10k');
    if (spent >= 100000)   unlockAchievement('spend_100k');
    if (spent >= 1000000)  unlockAchievement('spend_1m');

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
    if (achStats.fishCount >= 200) unlockAchievement('fish_200');
    if (achStats.fishCount >= 500) unlockAchievement('fish_500');

    if (result.type === 'junk' || result.type === 'rare') {
        achStats.junkCount++;
        if (achStats.junkCount >= 10) unlockAchievement('fish_junk_10');
        if (achStats.junkCount >= 50) unlockAchievement('fish_junk_50');
    }
    if (result.type === 'rare') unlockAchievement('fish_rare');
    if (result.type === 'skin') {
        achStats.fishSkinCount = (achStats.fishSkinCount || 0) + 1;
        unlockAchievement('fish_skin');
        if (achStats.fishSkinCount >= 5) unlockAchievement('fish_skin_5');
    }

    saveAchStats(achStats);
    checkCoinAchievements();
}

function checkLevelAchievements(level) {
    if (level >= 5)  unlockAchievement('level_5');
    if (level >= 10) unlockAchievement('level_10');
    if (level >= 15) unlockAchievement('level_15');
    if (level >= 20) unlockAchievement('level_20');
    if (level >= 25) unlockAchievement('level_25');
    if (level >= 32) unlockAchievement('level_32');
    if (level >= 40) unlockAchievement('level_40');
    if (level >= 50) unlockAchievement('level_50');
}

function checkWeeklyAchievements() {
    const achStats = getAchStats();
    achStats.weeklyClaimTotal++;

    const state = getWeeklyState();
    if (state.claimed.length >= 7) {
        achStats.weeksCompleted++;
        unlockAchievement('daily_7');
    }
    if (achStats.weeklyClaimTotal >= 30)  unlockAchievement('daily_30');
    if (achStats.weeklyClaimTotal >= 100) unlockAchievement('daily_100');

    saveAchStats(achStats);
    checkCoinAchievements();
}

// -------------------------------------------------------
// Achievement Popup Queue
// -------------------------------------------------------

const achQueue  = [];
let   achShowing = false;
let   achDismissTimer = null;

function queueAchievementPopup(id) {
    achQueue.push(id);
    if (!achShowing) showNextAchievement();
}

function showNextAchievement() {
    if (achQueue.length === 0) { achShowing = false; return; }
    achShowing    = true;
    const id      = achQueue.shift();
    const ach     = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) { showNextAchievement(); return; }

    document.getElementById('achPopupIcon').textContent = ach.icon;
    document.getElementById('achPopupName').textContent = ach.name;
    document.getElementById('achPopupDesc').textContent = ach.desc;
    document.getElementById('achievementPopup').classList.remove('hidden');

    if (typeof renderAchievements === 'function') {
        const page = document.getElementById('page-achievements');
        if (page && !page.classList.contains('hidden')) renderAchievements();
    }

    // Auto-dismiss after 5 seconds
    if (achDismissTimer) clearTimeout(achDismissTimer);
    achDismissTimer = setTimeout(() => {
        document.getElementById('achievementPopup').classList.add('hidden');
        achShowing = false;
        showNextAchievement();
    }, 5000);
}

document.getElementById('achPopupClose').addEventListener('click', () => {
    if (achDismissTimer) clearTimeout(achDismissTimer);
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