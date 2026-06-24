// -------------------------------------------------------
// Username
// -------------------------------------------------------

function getUsername() {
    return localStorage.getItem('csgo_username') || '';
}

function setUsername(name) {
    localStorage.setItem('csgo_username', name.trim());
}

function initUsernameModal() {
    const modal  = document.getElementById('usernameModal');
    const input  = document.getElementById('usernameInput');
    const submit = document.getElementById('usernameSubmit');

    if (getUsername()) {
        modal.classList.add('hidden');
        return;
    }

    modal.classList.remove('hidden');

    const doConfirm = async () => {
        const val = input.value.trim();
        if (!val) { input.focus(); return; }

        submit.disabled    = true;
        submit.textContent = 'Checking...';

        // Check Firebase for existing save data
        const existing = await loadPlayerFromCloud(val);

        if (existing && existing.level && existing.level > 1) {
            // Show the load-data prompt
            document.getElementById('modalStateEnter').classList.add('hidden');
            document.getElementById('modalStateLoad').classList.remove('hidden');
            document.getElementById('modalLoadDesc').textContent =
                `Found saved data for "${val}" (Level ${existing.level}, ${(existing.cases || 0).toLocaleString()} cases opened). Load it?`;

            document.getElementById('loadDataBtn').onclick = () => {
                applyCloudData(val, existing);
                modal.classList.add('hidden');
                location.reload();
            };

            document.getElementById('startFreshBtn').onclick = () => {
                setUsername(val);
                modal.classList.add('hidden');
                updateLbUsernameDisplay();
                schedulePush();
            };
        } else {
            setUsername(val);
            modal.classList.add('hidden');
            updateLbUsernameDisplay();
            schedulePush();
        }
    };

    submit.addEventListener('click', doConfirm);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doConfirm(); });
}

function updateLbUsernameDisplay() {
    const el = document.getElementById('lbUsernameDisplay');
    if (el) el.innerHTML = `Playing as <b>${getUsername() || '?'}</b>`;
}

// -------------------------------------------------------
// Leaderboard Stats
// -------------------------------------------------------

function getLbStats() {
    return JSON.parse(localStorage.getItem('csgo_lb_stats') ||
        '{"coins":0,"cases":0,"bestItem":"None","bestRarity":"","bestRank":0,"bestValue":0}');
}

function saveLbStats(stats) {
    localStorage.setItem('csgo_lb_stats', JSON.stringify(stats));
}

function addLbCoins(amount) {
    const stats  = getLbStats();
    stats.coins += amount;
    saveLbStats(stats);
    schedulePush();
}

function addLbCase(result) {
    const stats = getLbStats();
    stats.cases++;
    stats.coins += result.coins;
    const rank = RARITY_RANKS[result.rarity] || 0;

    // Fix: rank first, then coin value as tiebreaker
    if (rank > stats.bestRank || (rank === stats.bestRank && result.coins > (stats.bestValue || 0))) {
        stats.bestRank   = rank;
        stats.bestRarity = result.rarity;
        stats.bestItem   = result.fullItem;
        stats.bestValue  = result.coins;
    }

    saveLbStats(stats);
    schedulePush();
}

// -------------------------------------------------------
// Cloud Save / Load
// -------------------------------------------------------

let pushTimer = null;

function schedulePush() {
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(pushLeaderboard, 3000);
}

async function pushLeaderboard() {
    const username = getUsername();
    if (!username || !FIREBASE_URL) return;

    const stats = getLbStats();

    const lbData = {
        username,
        coins:      stats.coins,
        cases:      stats.cases,
        bestItem:   stats.bestItem   || 'None',
        bestRarity: stats.bestRarity || '',
        bestRank:   stats.bestRank   || 0,
        bestValue:  stats.bestValue  || 0,
        level:      getLevel(),
        prestige:   (typeof getPrestigeLevel === 'function') ? getPrestigeLevel() : 0,
        title:      (typeof getActiveTitle   === 'function') ? getActiveTitle()   : null,
        betaTester: localStorage.getItem('csgo_beta_tester') === 'true',
        developer:  localStorage.getItem('csgo_developer')   === 'true',
        founder:    localStorage.getItem('csgo_founder')     === 'true',
        activeBadge: localStorage.getItem('csgo_active_badge') || null,
        updated:    Date.now()
    };

    const playerData = {
        ...lbData,
        xp:           getXP(),
        balance:      getCoins(),
        inventory:    JSON.stringify(getInventory()),
        achievements: JSON.stringify(getUnlockedAchievements()),
        achStats:     JSON.stringify(getAchStats()),
        alltimeStats: JSON.stringify(getAllTimeStats()),
        weeklyState:  JSON.stringify(getWeeklyState ? getWeeklyState() : {}),
        favourites:   JSON.stringify(getFavourites ? getFavourites() : []),
        shopData:     localStorage.getItem('csgo_prestige_shop') || '{"unlocked":[],"activeTitle":null}',
        earnedBadges: localStorage.getItem('csgo_earned_badges') || '[]'
    };

    // Set timestamp BEFORE push so the SSE echo from Firebase is ignored
    localStorage.setItem('csgo_last_push_time', lbData.updated.toString());

    try {
        await Promise.all([
            fetch(`${FIREBASE_URL}/leaderboard/${encodeURIComponent(username)}.json`, {
                method: 'PUT', body: JSON.stringify(lbData)
            }),
            fetch(`${FIREBASE_URL}/players/${encodeURIComponent(username)}.json`, {
                method: 'PUT', body: JSON.stringify(playerData)
            })
        ]);
    } catch (e) {
        console.warn('Cloud save failed:', e);
    }
}

async function loadPlayerFromCloud(username) {
    if (!FIREBASE_URL) return null;
    try {
        const res  = await fetch(`${FIREBASE_URL}/players/${encodeURIComponent(username)}.json`);
        const data = await res.json();
        return data || null;
    } catch (e) {
        return null;
    }
}

function applyCloudData(username, data) {
    if (!data) return;
    localStorage.setItem('csgo_username',     username);
    if (data.balance      !== undefined) localStorage.setItem('csgo_coins',         data.balance);
    if (data.xp           !== undefined) localStorage.setItem('csgo_xp',            data.xp);
    if (data.level        !== undefined) localStorage.setItem('csgo_level',         data.level);
    if (data.inventory    !== undefined) localStorage.setItem('csgo_inventory',     data.inventory);
    if (data.achievements !== undefined) localStorage.setItem('csgo_achievements',  data.achievements);
    if (data.achStats     !== undefined) localStorage.setItem('csgo_ach_stats',     data.achStats);
    if (data.alltimeStats !== undefined) localStorage.setItem('csgo_alltime_stats', data.alltimeStats);
    if (data.weeklyState  !== undefined) localStorage.setItem('csgo_weekly',        data.weeklyState);
    if (data.favourites   !== undefined) localStorage.setItem('csgo_favourites',    data.favourites);
    if (data.shopData     !== undefined) localStorage.setItem('csgo_prestige_shop', data.shopData);
    if (data.betaTester   === true)      localStorage.setItem('csgo_beta_tester',   'true');
    if (data.developer    === true)      localStorage.setItem('csgo_developer',      'true');
    if (data.founder      === true)      localStorage.setItem('csgo_founder',        'true');
    if (data.earnedBadges !== undefined) localStorage.setItem('csgo_earned_badges',  data.earnedBadges);
    if (data.activeBadge  != null)       localStorage.setItem('csgo_active_badge',   data.activeBadge);

    // Rebuild lb_stats
    const lb = {
        coins:      data.coins      || 0,
        cases:      data.cases      || 0,
        bestItem:   data.bestItem   || 'None',
        bestRarity: data.bestRarity || '',
        bestRank:   data.bestRank   || 0,
        bestValue:  data.bestValue  || 0
    };
    localStorage.setItem('csgo_lb_stats', JSON.stringify(lb));
}

// -------------------------------------------------------
// Firebase: Fetch Leaderboard
// -------------------------------------------------------

async function fetchLeaderboard() {
    if (!FIREBASE_URL) return [];
    try {
        const res  = await fetch(`${FIREBASE_URL}/leaderboard.json`);
        const data = await res.json();
        if (!data) return [];
        return Object.values(data);
    } catch (e) {
        console.warn('Leaderboard fetch failed:', e);
        return [];
    }
}

// -------------------------------------------------------
// Leaderboard Rendering
// -------------------------------------------------------

let lbActiveTab = 'coins';

async function renderLeaderboard() {
    const listEl = document.getElementById('lbList');
    listEl.innerHTML = '<p class="empty-msg">Loading...</p>';

    if (!FIREBASE_URL) {
        listEl.innerHTML = '<p class="empty-msg">Firebase not configured yet.</p>';
        return;
    }

    const entries = await fetchLeaderboard();

    if (entries.length === 0) {
        listEl.innerHTML = '<p class="empty-msg">No entries yet. Open some cases!</p>';
        return;
    }

    const sorted = [...entries].sort((a, b) => {
        if (lbActiveTab === 'coins') return (b.coins || 0) - (a.coins || 0);
        if (lbActiveTab === 'cases') return (b.cases || 0) - (a.cases || 0);
        if (lbActiveTab === 'level') return (b.level || 1) - (a.level || 1);
        if (lbActiveTab === 'item') {
            return (b.bestValue || 0) - (a.bestValue || 0);
        }
        return 0;
    });

    const medals     = ['🥇', '🥈', '🥉'];
    const medalClass = ['gold', 'silver', 'bronze'];
    const me         = getUsername();

    // Helper: build equipped badge HTML from a badge ID
    function getBadgeDisplayHtml(badgeId) {
        if (!badgeId || typeof BADGES === 'undefined') return '';
        const badge = BADGES.find(b => b.id === badgeId);
        if (!badge) return '';
        return `<span class="lb-equipped-badge" style="background:${badge.color}18;color:${badge.color};border-color:${badge.color}55">${badge.display}</span>`;
    }

    // Check leaderboard rank badges for the current user
    const myRank = sorted.findIndex(e => e.username === me);
    if (myRank !== -1 && typeof earnBadge === 'function') {
        if (myRank < 10) earnBadge('badge_top_10');
        if (myRank < 3)  earnBadge('badge_podium');
        if (myRank === 0) earnBadge('badge_number_one');
    }

    listEl.innerHTML = sorted.map((entry, i) => {
        const rankHtml = i < 3
            ? `<span class="lb-rank ${medalClass[i]}">${medals[i]}</span>`
            : `<span class="lb-rank">#${i + 1}</span>`;

        const lvBadge = `<span class="lb-level-badge">Lv.${entry.level || 1}</span>`;

        let valueHtml = '';
        if (lbActiveTab === 'coins') {
            valueHtml = `<span class="lb-value">${(entry.coins || 0).toLocaleString()} coins</span>`;
        } else if (lbActiveTab === 'cases') {
            valueHtml = `<span class="lb-value">${(entry.cases || 0).toLocaleString()} cases</span>`;
        } else if (lbActiveTab === 'level') {
            valueHtml = `<span class="lb-value">Level ${entry.level || 1}</span>`;
        } else if (lbActiveTab === 'item') {
            const item  = entry.bestItem || 'None';
            const color = (RARITY_ODDS[entry.bestRarity] || {}).colour || '#8f98a0';
            const val   = entry.bestValue ? `${entry.bestValue.toLocaleString()} coins` : '';
            valueHtml = `
                <span class="lb-value lb-best-item">
                    <span style="color:${color}">${item}</span>
                    ${val ? `<span class="lb-best-value">${val}</span>` : ''}
                </span>`;
        }

        const p          = entry.prestige || 0;
        const tier       = p >= 10 ? 'diamond' : p >= 6 ? 'gold' : p >= 3 ? 'silver' : 'bronze';
        const prestigeHtml = p > 0
            ? `<span class="lb-prestige-badge prestige-badge prestige-badge-${tier}" title="Prestige ${p}">✦ P${p}</span>`
            : '';

        const titleHtml = entry.title
            ? `<span class="lb-player-title">${entry.title}</span>`
            : '';

        const betaHtml = entry.betaTester
            ? `<span class="lb-beta-badge">🧪 BETA</span>`
            : '';

        const devHtml = entry.developer
            ? `<span class="lb-dev-badge">⚙️ DEV</span>`
            : '';

        const equippedBadgeHtml = getBadgeDisplayHtml(entry.activeBadge);

        return `
            <div class="lb-entry ${entry.username === me ? 'is-me' : ''}">
                ${rankHtml}
                <span class="lb-name">${lvBadge} ${prestigeHtml}${equippedBadgeHtml}${titleHtml}${entry.username}</span>
                ${valueHtml}
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------
// Leaderboard Event Listeners
// -------------------------------------------------------

document.getElementById('lbRefreshBtn').addEventListener('click', renderLeaderboard);

document.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        lbActiveTab = tab.dataset.tab;
        renderLeaderboard();
    });
});
// -------------------------------------------------------
// Cross-Device Sync — Firebase Server-Sent Events (SSE)
// Firebase pushes changes instantly over a persistent
// connection; no polling needed.
// -------------------------------------------------------

let _syncSource = null;

function applySyncData(data) {
    if (!data) return;

    if (data.balance      != null) localStorage.setItem('csgo_coins',         String(data.balance));
    if (data.xp           != null) localStorage.setItem('csgo_xp',            String(data.xp));
    if (data.level        != null) localStorage.setItem('csgo_level',         String(data.level));
    if (data.inventory    != null) localStorage.setItem('csgo_inventory',     data.inventory);
    if (data.achievements != null) localStorage.setItem('csgo_achievements',  data.achievements);
    if (data.achStats     != null) localStorage.setItem('csgo_ach_stats',     data.achStats);
    if (data.alltimeStats != null) localStorage.setItem('csgo_alltime_stats', data.alltimeStats);
    if (data.weeklyState  != null) localStorage.setItem('csgo_weekly',        data.weeklyState);
    if (data.favourites   != null) localStorage.setItem('csgo_favourites',    data.favourites);
    if (data.shopData     != null) localStorage.setItem('csgo_prestige_shop', data.shopData);
    if (data.betaTester   === true) localStorage.setItem('csgo_beta_tester',  'true');
    if (data.developer    === true) localStorage.setItem('csgo_developer',    'true');
    if (data.founder      === true) localStorage.setItem('csgo_founder',      'true');
    if (data.earnedBadges != null)  localStorage.setItem('csgo_earned_badges', data.earnedBadges);
    if (data.activeBadge  != null)  localStorage.setItem('csgo_active_badge',  data.activeBadge);

    const lb = getLbStats();
    if (data.coins      != null) lb.coins      = data.coins;
    if (data.cases      != null) lb.cases      = data.cases;
    if (data.bestItem   != null) lb.bestItem   = data.bestItem;
    if (data.bestRarity != null) lb.bestRarity = data.bestRarity;
    if (data.bestRank   != null) lb.bestRank   = data.bestRank;
    if (data.bestValue  != null) lb.bestValue  = data.bestValue;
    saveLbStats(lb);

    if (typeof updateBalanceDisplay === 'function') updateBalanceDisplay();
    if (typeof updateLevelDisplay   === 'function') updateLevelDisplay();
    if (typeof updatePrestigeButton === 'function') updatePrestigeButton();
    if (typeof renderBestEver       === 'function') renderBestEver();

    showSyncIndicator();
}

function showSyncIndicator() {
    const el = document.getElementById('syncIndicator');
    if (!el) return;
    el.classList.remove('hidden', 'sync-fade');
    void el.offsetWidth; // force reflow
    el.classList.add('sync-fade');
}

function startCrossDeviceSync() {
    const username = getUsername();
    if (!username || (typeof isGuest === 'function' && isGuest())) return;
    if (!FIREBASE_URL) return;

    // Close any existing connection
    if (_syncSource) { _syncSource.close(); _syncSource = null; }

    const url = `${FIREBASE_URL}/players/${encodeURIComponent(username)}.json`;
    _syncSource = new EventSource(url);

    _syncSource.addEventListener('put', e => {
        try {
            const payload = JSON.parse(e.data);
            const data    = payload.data;
            if (!data || !data.updated) return;

            const lastPush = parseInt(localStorage.getItem('csgo_last_push_time') || '0');

            // Skip if this is our own push echoed back
            if (data.updated <= lastPush) return;

            localStorage.setItem('csgo_last_push_time', String(data.updated));
            applySyncData(data);
        } catch (_) {}
    });

    // patch events carry partial updates
    _syncSource.addEventListener('patch', e => {
        try {
            const payload = JSON.parse(e.data);
            if (payload.data) applySyncData(payload.data);
        } catch (_) {}
    });

    // EventSource auto-reconnects on error — no manual handling needed
}