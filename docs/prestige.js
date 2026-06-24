// -------------------------------------------------------
// Prestige System
// -------------------------------------------------------

const PRESTIGE_BASE_MAX = 50;
const PRESTIGE_LV_STEP  = 10;

// -------------------------------------------------------
// Storage
// -------------------------------------------------------

function getPrestigeData() {
    return JSON.parse(localStorage.getItem('csgo_prestige') || JSON.stringify({
        level: 0, points: 0
    }));
}

function savePrestigeData(data) {
    localStorage.setItem('csgo_prestige', JSON.stringify(data));
}

function getPrestigeLevel()  { return getPrestigeData().level; }
function getPrestigePoints() { return getPrestigeData().points; }
function getMaxLevel()       { return PRESTIGE_BASE_MAX + getPrestigeLevel() * PRESTIGE_LV_STEP; }

function spendPrestigePoint() {
    const data = getPrestigeData();
    if ((data.points || 0) <= 0) return false;
    data.points--;
    savePrestigeData(data);
    return true;
}

// -------------------------------------------------------
// All-time best skin (survives every prestige)
// -------------------------------------------------------

function getBestEver() {
    const raw = localStorage.getItem('csgo_best_ever');
    return raw ? JSON.parse(raw) : null;
}

function updateBestEver(result) {
    if (!result || !result.rarity) return;
    const current = getBestEver();
    const newRank  = RARITY_RANKS[result.rarity] || 0;
    const curRank  = current ? (RARITY_RANKS[current.rarity] || 0) : -1;

    if (!current
        || newRank > curRank
        || (newRank === curRank && (result.coins || 0) > (current.coins || 0))) {
        localStorage.setItem('csgo_best_ever', JSON.stringify({
            fullItem: result.fullItem,
            rarity:   result.rarity,
            tier:     result.tier    || result.rarity,
            type:     result.type    || '',
            float:    result.floatVal || result.float || '',
            price:    result.price   || '',
            coins:    result.coins   || 0
        }));
    }
}

// -------------------------------------------------------
// Best-ever skin display (shown in Stats tab)
// -------------------------------------------------------

function renderBestEver() {
    const el = document.getElementById('bestEverContainer');
    if (!el) return;

    const best = getBestEver();
    const pLv  = getPrestigeLevel();

    if (!best) {
        el.innerHTML = `<div class="best-ever-empty">No skin rolled yet — open some cases!</div>`;
        return;
    }

    const color = (RARITY_ODDS[best.rarity] || {}).colour || '#c6d4df';

    el.innerHTML = `
        <div class="best-ever-label">🏆 All-Time Best Skin</div>
        <div class="best-ever-card" style="border-color:${color}33">
            <div class="best-ever-name" style="color:${color}">${best.fullItem}</div>
            <div class="best-ever-tier">${best.tier}</div>
            <div class="best-ever-stats">
                <span>Float: ${best.float || '—'}</span>
                <span>~$${best.price || '—'}</span>
                <span style="color:${color};font-weight:bold">${(best.coins || 0).toLocaleString()} coins</span>
            </div>
        </div>
        ${pLv > 0 ? `<div class="prestige-level-display">
            <span class="prestige-badge prestige-badge-${getBadgeTier(pLv)}">✦ Prestige ${pLv}</span>
        </div>` : ''}
    `;
}

// -------------------------------------------------------
// Prestige badge tier helper
// -------------------------------------------------------

function getBadgeTier(p) {
    if (p >= 10) return 'diamond';
    if (p >= 6)  return 'gold';
    if (p >= 3)  return 'silver';
    return 'bronze';
}

// -------------------------------------------------------
// Prestige button visibility
// -------------------------------------------------------

function updatePrestigeButton() {
    const atMax  = getLevel() >= getMaxLevel();
    const btn    = document.getElementById('prestigeBtn');
    const notice = document.getElementById('prestigeNotice');
    if (btn)    btn.classList.toggle('hidden', !atMax);
    if (notice) notice.classList.toggle('hidden', !atMax);
}

// -------------------------------------------------------
// Execute prestige
// -------------------------------------------------------

function doPrestige() {
    const data = getPrestigeData();
    data.level  = (data.level  || 0) + 1;
    data.points = (data.points || 0) + 1;
    savePrestigeData(data);

    // Award prestige badges
    checkPrestigeBadges();

    // Reset progress (best_ever and lb_stats intentionally kept)
    localStorage.setItem('csgo_xp',             '0');
    localStorage.setItem('csgo_level',          '1');
    localStorage.setItem('csgo_coins',          '2500');
    localStorage.setItem('csgo_inventory',      '[]');
    localStorage.setItem('csgo_case_skills',    JSON.stringify(['case_novice']));
    localStorage.setItem('csgo_fishing_skills', JSON.stringify(['fisher_novice']));
    localStorage.setItem('csgo_achievements',   '[]');
    localStorage.setItem('csgo_ach_stats',      '{}');
    localStorage.setItem('csgo_alltime_stats',  '{}');
    localStorage.setItem('csgo_weekly',         '{}');
    localStorage.setItem('csgo_favourites',     '[]');

    if (typeof schedulePush === 'function') schedulePush();

    location.reload();
}

// -------------------------------------------------------
// Init
// -------------------------------------------------------

function initPrestige() {
    const openBtn    = document.getElementById('prestigeBtn');
    const modal      = document.getElementById('prestigeModal');
    const cancelBtn  = document.getElementById('prestigeCancelBtn');
    const confirmBtn = document.getElementById('prestigeConfirmBtn');

    openBtn?.addEventListener('click', () => {
        const newPLv   = getPrestigeLevel() + 1;
        const newMaxLv = PRESTIGE_BASE_MAX + newPLv * PRESTIGE_LV_STEP;
        const pts      = getPrestigePoints() + 1;

        const el = document.getElementById('prestigeModalInfo');
        if (el) el.innerHTML = `
            <div class="pm-reward">You will become <strong class="prestige-badge prestige-badge-${getBadgeTier(newPLv)}">✦ Prestige ${newPLv}</strong></div>
            <div class="pm-reward">New max level: <strong>Level ${newMaxLv}</strong></div>
            <div class="pm-reward">Prestige points after: <strong>${pts}</strong> (spend in Upgrades to unlock any skill free)</div>
        `;
        modal?.classList.remove('hidden');
    });

    cancelBtn?.addEventListener('click',  () => modal?.classList.add('hidden'));
    confirmBtn?.addEventListener('click', () => { modal?.classList.add('hidden'); doPrestige(); });

    updatePrestigeButton();
    renderBestEver();
}

// -------------------------------------------------------
// Prestige Shop
// -------------------------------------------------------

const PRESTIGE_SHOP = [
    // Titles
    { id: 'title_veteran',      category: 'title', name: 'Veteran',          cost: 1, minPrestige: 1, desc: 'A seasoned player who knows the grind.' },
    { id: 'title_high_roller',  category: 'title', name: 'High Roller',      cost: 1, minPrestige: 1, desc: 'Big spender, bigger returns.' },
    { id: 'title_shadow_op',    category: 'title', name: 'Shadow Operative', cost: 2, minPrestige: 3, desc: 'Operating in the shadows since Prestige 3.' },
    { id: 'title_untouchable',  category: 'title', name: 'The Untouchable',  cost: 2, minPrestige: 5, desc: 'Five prestiges in and still going.' },
    { id: 'title_apex',         category: 'title', name: 'Apex Predator',    cost: 3, minPrestige: 7, desc: 'The pinnacle of case opening mastery.' },
    // Cases
    { id: 'case_obsidian',      category: 'case',  name: 'Obsidian Case',    cost: 2, minPrestige: 1, desc: 'Dark ultra-rare finishes with a generous rarity boost. Unlocks in the Cases page.' },
    { id: 'case_phantom_proto', category: 'case',  name: 'Phantom Protocol', cost: 3, minPrestige: 1, desc: 'Spy-themed skins with the highest gold drop rate in the game. Unlocks in the Cases page.' },
    // Perks
    { id: 'perk_coin_surge',    category: 'perk',  name: 'Coin Surge',       cost: 1, minPrestige: 1, desc: '+10% coins when selling any case drop.' },
    { id: 'perk_lucky_break',   category: 'perk',  name: 'Lucky Break',      cost: 2, minPrestige: 1, desc: 'Blue drops have a 15% chance to automatically re-roll for a higher rarity.' },
    { id: 'perk_xp_overdrive',  category: 'perk',  name: 'XP Overdrive',     cost: 1, minPrestige: 1, desc: '+15% XP from all sources.' },
    { id: 'perk_fortunes_edge', category: 'perk',  name: "Fortune's Edge",   cost: 3, minPrestige: 1, desc: '+20% coins when selling any item.' },
];

const SHOP_CATEGORY_META = {
    title: { label: 'Titles',          icon: '🏷️', desc: 'Equip a title to show it next to your name on the leaderboard, nav, and account panel.' },
    case:  { label: 'Exclusive Cases', icon: '📦', desc: 'Prestige-only cases with premium loot. Appear in the Cases page once unlocked.' },
    perk:  { label: 'Passive Perks',   icon: '⚡', desc: 'Permanent bonuses that apply automatically while owned. Perks stack with each other.' },
};

// -------------------------------------------------------
// Shop storage
// -------------------------------------------------------

function getPrestigeShopData() {
    return JSON.parse(localStorage.getItem('csgo_prestige_shop') || '{"unlocked":[],"activeTitle":null}');
}

function savePrestigeShopData(data) {
    localStorage.setItem('csgo_prestige_shop', JSON.stringify(data));
}

function isShopItemUnlocked(id) {
    return getPrestigeShopData().unlocked.includes(id);
}

function getActiveTitle() {
    const data = getPrestigeShopData();
    if (!data.activeTitle) return null;
    const item = PRESTIGE_SHOP.find(i => i.id === data.activeTitle && i.category === 'title');
    return item ? item.name : null;
}

// -------------------------------------------------------
// Shop actions
// -------------------------------------------------------

function setActiveTitle(id) {
    const data = getPrestigeShopData();
    data.activeTitle = (data.activeTitle === id) ? null : id; // toggle off if already equipped
    savePrestigeShopData(data);
    renderPrestigeShop('prestigeShopContainer');
    if (typeof updateAcctPanelName === 'function') updateAcctPanelName();
    if (typeof updateAccountBtn    === 'function') updateAccountBtn();
    if (typeof schedulePush        === 'function') schedulePush();
}

function unlockShopItem(id) {
    const item = PRESTIGE_SHOP.find(i => i.id === id);
    if (!item) return;

    const shopData = getPrestigeShopData();
    if (shopData.unlocked.includes(id)) return;

    const pData = getPrestigeData();
    if ((pData.points || 0) < item.cost) {
        alert('Not enough prestige points.');
        return;
    }
    if (getPrestigeLevel() < item.minPrestige) {
        alert(`This item requires Prestige ${item.minPrestige}.`);
        return;
    }
    if (!confirm(`Unlock "${item.name}" for ${item.cost} prestige point${item.cost !== 1 ? 's' : ''}?`)) return;

    pData.points -= item.cost;
    savePrestigeData(pData);

    shopData.unlocked.push(id);
    savePrestigeShopData(shopData);

    checkShopBadges();
    renderPrestigeShop('prestigeShopContainer');
    if (typeof schedulePush   === 'function') schedulePush();
    if (item.category === 'case' && typeof renderCaseGrid === 'function') renderCaseGrid();
}

// -------------------------------------------------------
// Shop rendering
// -------------------------------------------------------

function renderPrestigeShop(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const pData    = getPrestigeData();
    const shopData = getPrestigeShopData();
    const pLevel   = getPrestigeLevel();
    const points   = pData.points || 0;

    const sections = ['title', 'case', 'perk'].map(cat => {
        const meta  = SHOP_CATEGORY_META[cat];
        const items = PRESTIGE_SHOP.filter(i => i.category === cat);

        const cards = items.map(item => {
            const owned         = shopData.unlocked.includes(item.id);
            const meetsPrestige = pLevel >= item.minPrestige;
            const canAfford     = points >= item.cost;
            const isActive      = shopData.activeTitle === item.id;

            let statusHtml = '';
            let cardClass  = 'shop-card';

            if (owned) {
                cardClass += ' shop-card-owned';
                if (item.category === 'title') {
                    statusHtml = `
                        <button class="shop-equip-btn ${isActive ? 'shop-equip-active' : ''}"
                                onclick="setActiveTitle('${item.id}')">
                            ${isActive ? '✓ Equipped' : 'Equip'}
                        </button>`;
                } else {
                    statusHtml = `<div class="shop-owned-badge">✓ Active</div>`;
                }
            } else if (!meetsPrestige) {
                cardClass += ' shop-card-locked';
                statusHtml = `<div class="shop-req-badge">🔒 Requires Prestige ${item.minPrestige}</div>`;
            } else {
                cardClass += canAfford ? ' shop-card-available' : ' shop-card-cant-afford';
                statusHtml = `
                    <button class="shop-unlock-btn ${!canAfford ? 'shop-unlock-disabled' : ''}"
                            onclick="unlockShopItem('${item.id}')" ${!canAfford ? 'disabled' : ''}>
                        Unlock — ${item.cost} pt${item.cost !== 1 ? 's' : ''}
                    </button>`;
            }

            const costPips = Array.from({ length: item.cost }, (_, i) =>
                `<span class="shop-cost-pip ${i < points || owned ? 'pip-have' : 'pip-need'}">✦</span>`
            ).join('');

            return `
                <div class="${cardClass}">
                    <div class="shop-card-top">
                        <span class="shop-card-name">${item.name}</span>
                        <span class="shop-card-cost">${costPips}</span>
                    </div>
                    <div class="shop-card-desc">${item.desc}</div>
                    <div class="shop-card-action">${statusHtml}</div>
                </div>`;
        }).join('');

        return `
            <div class="shop-section">
                <div class="shop-section-header">
                    <span class="shop-section-icon">${meta.icon}</span>
                    <span class="shop-section-label">${meta.label}</span>
                </div>
                <div class="shop-section-desc">${meta.desc}</div>
                <div class="shop-cards">${cards}</div>
            </div>`;
    }).join('');

    el.innerHTML = `
        <div class="shop-balance">
            <span class="shop-balance-label">Prestige Points Available</span>
            <span class="shop-balance-pts">✦ ${points} pt${points !== 1 ? 's' : ''}</span>
        </div>
        ${pLevel === 0 ? '<div class="shop-no-prestige">Reach max level and prestige to earn points and unlock shop items.</div>' : ''}
        ${sections}`;
}

// -------------------------------------------------------
// Badge System
// -------------------------------------------------------

const BADGES = [
    // Prestige
    { id: 'badge_first_prestige',  icon: '🌟', name: 'Ascended',        display: '🌟 Ascended',    desc: 'Prestige for the first time.',               color: '#e4ae39' },
    { id: 'badge_prestige_5',      icon: '💫', name: 'Legend',           display: '💫 Legend',      desc: 'Reach Prestige 5.',                          color: '#e4ae39' },
    { id: 'badge_prestige_10',     icon: '✨', name: 'Immortal',         display: '✨ Immortal',    desc: 'Reach Prestige 10.',                         color: '#7a9bff' },
    // Shop
    { id: 'badge_first_purchase',  icon: '🛒', name: 'Shopkeeper',       display: '🛒 Shopper',     desc: 'Make your first prestige shop purchase.',    color: '#4ec78c' },
    { id: 'badge_title_collector', icon: '🏷️', name: 'Title Collector',  display: '🏷️ Collector',  desc: 'Unlock all 5 titles in the prestige shop.',  color: '#4b69ff' },
    { id: 'badge_power_user',      icon: '⚡', name: 'Power User',       display: '⚡ Power User',  desc: 'Unlock all 4 passive perks.',                color: '#4b69ff' },
    // Leaderboard
    { id: 'badge_top_10',          icon: '📊', name: 'Rising Star',      display: '📊 Top 10',      desc: 'Reach top 10 on any leaderboard tab.',       color: '#8847ff' },
    { id: 'badge_podium',          icon: '🥉', name: 'On the Podium',    display: '🥉 Podium',      desc: 'Reach top 3 on any leaderboard tab.',        color: '#cd7f32' },
    { id: 'badge_number_one',      icon: '🥇', name: 'The Best',         display: '🥇 #1',          desc: 'Reach #1 on any leaderboard tab.',           color: '#e4ae39' },
    // Playstyle
    { id: 'badge_mass_opener',     icon: '💥', name: 'Mass Opener',      display: '💥 Mass Opener', desc: 'Open 10 cases at once.',                     color: '#eb4b4b' },
    { id: 'badge_clear_out',       icon: '🗑️', name: 'Clear Out',        display: '🗑️ Clear Out',  desc: 'Use Sell All to clear your inventory.',      color: '#8f98a0' },
    { id: 'badge_vault',           icon: '🖤', name: 'Beyond the Vault', display: '🖤 Vault',       desc: 'Open a prestige-exclusive case.',            color: '#c6d4df' },
    // Special
    { id: 'badge_developer',       icon: '⚙️', name: 'Developer',        display: '⚙️ DEV',         desc: 'The person behind the simulator.',           color: '#c084fc' },
    { id: 'badge_beta_tester',     icon: '🧪', name: 'Beta Tester',      display: '🧪 BETA',        desc: 'Helped shape the game during early access.', color: '#00d2c8' },
    { id: 'badge_founder',         icon: '🌱', name: 'Founder',          display: '🌱 Founder',     desc: 'Joined during the early access period.',     color: '#4ec78c' },
];

// -------------------------------------------------------
// Badge storage
// -------------------------------------------------------

function getEarnedBadges() {
    const stored  = JSON.parse(localStorage.getItem('csgo_earned_badges') || '[]');
    const special = [];
    if (localStorage.getItem('csgo_developer')   === 'true') special.push('badge_developer');
    if (localStorage.getItem('csgo_beta_tester') === 'true') special.push('badge_beta_tester');
    if (localStorage.getItem('csgo_founder')     === 'true') special.push('badge_founder');
    return [...new Set([...stored, ...special])];
}

function earnBadge(id) {
    if (getEarnedBadges().includes(id)) return;
    const stored = JSON.parse(localStorage.getItem('csgo_earned_badges') || '[]');
    stored.push(id);
    localStorage.setItem('csgo_earned_badges', JSON.stringify(stored));
    if (typeof schedulePush === 'function') schedulePush();
    // Refresh badges tab if it's currently open
    const badgesTab = document.getElementById('accountTab-badges');
    if (badgesTab && badgesTab.classList.contains('active') && typeof renderBadgesTab === 'function') {
        renderBadgesTab();
    }
}

function getActiveBadge() {
    return localStorage.getItem('csgo_active_badge') || null;
}

function setActiveBadge(id) {
    const current = getActiveBadge();
    if (current === id) {
        localStorage.removeItem('csgo_active_badge'); // toggle off
    } else {
        localStorage.setItem('csgo_active_badge', id);
    }
    if (typeof renderBadgesTab  === 'function') renderBadgesTab();
    if (typeof updateAccountBtn === 'function') updateAccountBtn();
    if (typeof renderLeaderboard === 'function') renderLeaderboard();
    if (typeof schedulePush     === 'function') schedulePush();
}

// -------------------------------------------------------
// Badge checks
// -------------------------------------------------------

function checkPrestigeBadges() {
    const p = getPrestigeLevel();
    if (p >= 1)  earnBadge('badge_first_prestige');
    if (p >= 5)  earnBadge('badge_prestige_5');
    if (p >= 10) earnBadge('badge_prestige_10');
}

function checkShopBadges() {
    const shopData = getPrestigeShopData();
    const unlocked = shopData.unlocked || [];
    if (unlocked.length >= 1) earnBadge('badge_first_purchase');
    const titleIds = ['title_veteran', 'title_high_roller', 'title_shadow_op', 'title_untouchable', 'title_apex'];
    if (titleIds.every(id => unlocked.includes(id))) earnBadge('badge_title_collector');
    const perkIds  = ['perk_coin_surge', 'perk_lucky_break', 'perk_xp_overdrive', 'perk_fortunes_edge'];
    if (perkIds.every(id => unlocked.includes(id)))  earnBadge('badge_power_user');
}