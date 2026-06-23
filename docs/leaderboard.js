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

    const doConfirm = () => {
        const val = input.value.trim();
        if (!val) { input.focus(); return; }
        setUsername(val);
        modal.classList.add('hidden');
        updateLbUsernameDisplay();
        pushLeaderboard();
    };

    submit.addEventListener('click', doConfirm);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doConfirm(); });
}

function updateLbUsernameDisplay() {
    const el = document.getElementById('lbUsernameDisplay');
    if (el) el.innerHTML = `Playing as <b>${getUsername() || '—'}</b>`;
}

// -------------------------------------------------------
// Leaderboard Stats (persistent localStorage)
// -------------------------------------------------------

function getLbStats() {
    return JSON.parse(localStorage.getItem('csgo_lb_stats') || '{"coins":0,"cases":0,"bestItem":"None","bestRarity":"","bestRank":0}');
}

function saveLbStats(stats) {
    localStorage.setItem('csgo_lb_stats', JSON.stringify(stats));
}

function addLbCoins(amount) {
    const stats  = getLbStats();
    stats.coins += amount;
    saveLbStats(stats);
    pushLeaderboard();
}

function addLbCase(result) {
    const stats  = getLbStats();
    stats.cases++;
    stats.coins += result.coins;
    const rank = RARITY_RANKS[result.rarity] || 0;
    if (rank > stats.bestRank) {
        stats.bestRank   = rank;
        stats.bestRarity = result.rarity;
        stats.bestItem   = result.fullItem;
    }
    saveLbStats(stats);
    pushLeaderboard();
}

// -------------------------------------------------------
// Firebase
// -------------------------------------------------------

async function pushLeaderboard() {
    const username = getUsername();
    if (!username || !FIREBASE_URL) return;

    const stats = getLbStats();
    const data  = {
        username,
        coins:      stats.coins,
        cases:      stats.cases,
        bestItem:   stats.bestItem,
        bestRarity: stats.bestRarity,
        level:      getLevel(),
        updated:    Date.now()
    };

    try {
        await fetch(`${FIREBASE_URL}/leaderboard/${encodeURIComponent(username)}.json`, {
            method: 'PUT',
            body:   JSON.stringify(data)
        });
    } catch (e) {
        console.warn('Leaderboard push failed:', e);
    }
}

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
        listEl.innerHTML = '<p class="empty-msg">Firebase not configured yet. Add your database URL to script.js.</p>';
        return;
    }

    const entries = await fetchLeaderboard();

    if (entries.length === 0) {
        listEl.innerHTML = '<p class="empty-msg">No entries yet. Open some cases!</p>';
        return;
    }

    const sorted = [...entries].sort((a, b) => {
        if (lbActiveTab === 'coins') return (b.coins  || 0) - (a.coins  || 0);
        if (lbActiveTab === 'cases') return (b.cases  || 0) - (a.cases  || 0);
        if (lbActiveTab === 'item')  return (b.bestRank || 0) - (a.bestRank || 0);
        if (lbActiveTab === 'level') return (b.level  || 1) - (a.level  || 1);
        return 0;
    });

    const medals      = ['🥇', '🥈', '🥉'];
    const medalClass  = ['gold', 'silver', 'bronze'];
    const me          = getUsername();

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
            valueHtml = `<span class="lb-value" style="color:${col}">${entry.bestItem || 'None'}</span>`;
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