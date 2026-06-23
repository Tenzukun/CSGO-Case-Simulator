// -------------------------------------------------------
// Username
// -------------------------------------------------------

function getUsername() {
    return localStorage.getItem('csgo_username') || '';
}

function setUsername(name) {
    localStorage.setItem('csgo_username', name.trim());
}

function updateLbUsernameDisplay() {
    const el = document.getElementById('lbUsernameDisplay');
    if (!el) return;
    if (typeof isGuest === 'function' && isGuest()) {
        el.innerHTML = `Playing as <b>Guest</b>`;
    } else {
        el.innerHTML = `Playing as <b>${getUsername() || '?'}</b>`;
    }
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
    if (typeof isGuest === 'function' && isGuest()) return;

    const stats = getLbStats();

    const lbData = {
        username,
        coins:      stats.coins,
        cases:      stats.cases,
        bestItem:   stats.bestItem,
        bestRarity: stats.bestRarity,
        bestValue:  stats.bestValue || 0,
        level:      getLevel(),
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
        favourites:   JSON.stringify(getFavourites ? getFavourites() : [])
    };

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
            const rankDiff = (b.bestRank || 0) - (a.bestRank || 0);
            if (rankDiff !== 0) return rankDiff;
            return (b.bestValue || 0) - (a.bestValue || 0);
        }
        return 0;
    });

    const medals     = ['🥇', '🥈', '🥉'];
    const medalClass = ['gold', 'silver', 'bronze'];
    const me         = getUsername();

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
        } else if (lbActiveTab === 'item') {
            const col = { GOLD: '#e4ae39', 'Rare (Red)': '#eb4b4b', Pink: '#d32ce6', Purple: '#8847ff' }[entry.bestRarity] || '#8f98a0';
            const val = entry.bestValue ? `${entry.bestValue.toLocaleString()} coins` : '';
            valueHtml = `<span class="lb-value" style="color:${col}" title="${val}">${entry.bestItem || 'None'}</span>`;
        } else if (lbActiveTab === 'level') {
            valueHtml = `<span class="lb-value">Level ${entry.level || 1}</span>`;
        }

        return `
            <div class="lb-entry ${entry.username === me ? 'is-me' : ''}">
                ${rankHtml}
                <span class="lb-name">${lvBadge} ${entry.username}</span>
                ${valueHtml}
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------
// Leaderboard Event Listeners
// -------------------------------------------------------

document.getElementById('lbBtn').addEventListener('click', () => openPanel('lbPanel', () => {
    updateLbUsernameDisplay();
    renderLeaderboard();
}));

document.getElementById('lbRefreshBtn').addEventListener('click', renderLeaderboard);

document.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        lbActiveTab = tab.dataset.tab;
        renderLeaderboard();
    });
});