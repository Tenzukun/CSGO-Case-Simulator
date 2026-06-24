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
