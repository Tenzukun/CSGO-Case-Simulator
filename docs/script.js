// -------------------------------------------------------
// Case Definitions
// -------------------------------------------------------

const CASES = [
    {
        id: 'starter',
        name: 'Starter Case',
        icon: '📦',
        cost: 200,
        desc: 'A basic case to get you started.',
        skins: {
            'GOLD': [
                '★ Flip Knife | Fade',
                '★ Gut Knife | Doppler'
            ],
            'Rare (Red)': [
                'AK-47 | Neon Rider',
                'M4A1-S | Cyrex'
            ],
            'Pink': [
                'USP-S | Caiman',
                'Glock-18 | Moonrise'
            ],
            'Purple': [
                'P250 | Undertow',
                'MP7 | Skulls'
            ],
            'Blue': [
                'Nova | Wood Fired',
                'P2000 | Handgun',
                'Tec-9 | Isaac'
            ]
        },
        prices: {
            '★ Flip Knife | Fade':   150,
            '★ Gut Knife | Doppler': 120,
            'AK-47 | Neon Rider':    25,
            'M4A1-S | Cyrex':        20,
            'USP-S | Caiman':        10,
            'Glock-18 | Moonrise':   8,
            'P250 | Undertow':       3,
            'MP7 | Skulls':          2,
            'Nova | Wood Fired':     0.50,
            'P2000 | Handgun':       0.40,
            'Tec-9 | Isaac':         0.50
        }
    },
    {
        id: 'chroma',
        name: 'Chroma Case',
        icon: '🟣',
        cost: 500,
        desc: 'Mid-tier skins with vibrant finishes.',
        skins: {
            'GOLD': [
                '★ Karambit | Doppler',
                '★ M9 Bayonet | Marble Fade'
            ],
            'Rare (Red)': [
                'AWP | Dragon Lore',
                'M4A4 | Howl'
            ],
            'Pink': [
                'AK-47 | Vulcan',
                'AWP | Hyper Beast'
            ],
            'Purple': [
                'AK-47 | Redline',
                'AWP | Asiimov'
            ],
            'Blue': [
                'MP9 | Hot Rod',
                'P250 | Sand Dune',
                'Nova | Predator'
            ]
        },
        prices: {
            '★ Karambit | Doppler':    500,
            '★ M9 Bayonet | Marble Fade': 400,
            'AWP | Dragon Lore':       1500,
            'M4A4 | Howl':             2000,
            'AK-47 | Vulcan':          80,
            'AWP | Hyper Beast':       60,
            'AK-47 | Redline':         10,
            'AWP | Asiimov':           15,
            'MP9 | Hot Rod':           3,
            'P250 | Sand Dune':        0.50,
            'Nova | Predator':         1
        }
    },
    {
        id: 'clutch',
        name: 'Clutch Case',
        icon: '🔴',
        cost: 1000,
        desc: 'High-tier skins for serious collectors.',
        skins: {
            'GOLD': [
                '★ Butterfly Knife | Fade',
                '★ Sport Gloves | Pandora\'s Box'
            ],
            'Rare (Red)': [
                'AK-47 | Wild Lotus',
                'Desert Eagle | Blaze'
            ],
            'Pink': [
                'USP-S | Kill Confirmed',
                'M4A1-S | Hyper Beast'
            ],
            'Purple': [
                'Glock-18 | Water Elemental',
                'P90 | Asiimov'
            ],
            'Blue': [
                'MAG-7 | Sonar',
                'MP9 | Hot Rod',
                'P250 | Sand Dune'
            ]
        },
        prices: {
            '★ Butterfly Knife | Fade':        700,
            "★ Sport Gloves | Pandora's Box":  600,
            'AK-47 | Wild Lotus':              800,
            'Desert Eagle | Blaze':            200,
            'USP-S | Kill Confirmed':          40,
            'M4A1-S | Hyper Beast':            30,
            'Glock-18 | Water Elemental':      5,
            'P90 | Asiimov':                   8,
            'MAG-7 | Sonar':                   1.50,
            'MP9 | Hot Rod':                   3,
            'P250 | Sand Dune':                0.50
        }
    },
    {
        id: 'dragon',
        name: 'Dragon Case',
        icon: '🐉',
        cost: 2500,
        desc: 'Premium case with the rarest skins.',
        skins: {
            'GOLD': [
                '★ Karambit | Doppler',
                '★ Butterfly Knife | Fade',
                '★ M9 Bayonet | Marble Fade',
                "★ Sport Gloves | Pandora's Box"
            ],
            'Rare (Red)': [
                'AWP | Dragon Lore',
                'AK-47 | Wild Lotus',
                'M4A4 | Howl',
                'Desert Eagle | Blaze'
            ],
            'Pink': [
                'AK-47 | Vulcan',
                'USP-S | Kill Confirmed',
                'AWP | Hyper Beast',
                'M4A1-S | Hyper Beast'
            ],
            'Purple': [
                'AK-47 | Redline',
                'AWP | Asiimov',
                'Glock-18 | Water Elemental',
                'P90 | Asiimov'
            ],
            'Blue': [
                'MP9 | Hot Rod',
                'P250 | Sand Dune',
                'Nova | Predator',
                'MAG-7 | Sonar'
            ]
        },
        prices: {
            '★ Karambit | Doppler':            500,
            '★ Butterfly Knife | Fade':        700,
            '★ M9 Bayonet | Marble Fade':      400,
            "★ Sport Gloves | Pandora's Box":  600,
            'AWP | Dragon Lore':               1500,
            'AK-47 | Wild Lotus':              800,
            'M4A4 | Howl':                     2000,
            'Desert Eagle | Blaze':            200,
            'AK-47 | Vulcan':                  80,
            'USP-S | Kill Confirmed':          40,
            'AWP | Hyper Beast':               60,
            'M4A1-S | Hyper Beast':            30,
            'AK-47 | Redline':                 10,
            'AWP | Asiimov':                   15,
            'Glock-18 | Water Elemental':      5,
            'P90 | Asiimov':                   8,
            'MP9 | Hot Rod':                   3,
            'P250 | Sand Dune':                0.50,
            'Nova | Predator':                 1,
            'MAG-7 | Sonar':                   1.50
        }
    }
];

// -------------------------------------------------------
// Constants
// -------------------------------------------------------

const WEAR_RANGES = {
    'Factory New':   [0.000, 0.070],
    'Minimal Wear':  [0.070, 0.150],
    'Field-Tested':  [0.150, 0.380],
    'Well-Worn':     [0.380, 0.450],
    'Battle-Scarred':[0.450, 1.000]
};

const RARITY_CLASSES = {
    'GOLD':       'rarity-gold',
    'Rare (Red)': 'rarity-red',
    'Pink':       'rarity-pink',
    'Purple':     'rarity-purple',
    'Blue':       'rarity-blue'
};

const RARITY_TIERS = {
    'GOLD':       'Rare Special Item',
    'Rare (Red)': 'Covert',
    'Pink':       'Classified',
    'Purple':     'Restricted',
    'Blue':       'Mil-Spec Grade'
};

const RARITY_RANKS = {
    'GOLD': 5, 'Rare (Red)': 4, 'Pink': 3, 'Purple': 2, 'Blue': 1
};

const WEAPON_TYPES = {
    Rifle:   ['AK-47', 'M4A4', 'M4A1-S', 'AWP', 'SG 553', 'AUG', 'FAMAS', 'Galil AR'],
    Pistol:  ['Desert Eagle', 'USP-S', 'Glock-18', 'P250', 'P2000', 'Tec-9', 'Five-SeveN', 'CZ75-Auto'],
    SMG:     ['MP9', 'MP7', 'MP5-SD', 'P90', 'PP-Bizon', 'MAC-10', 'UMP-45'],
    Shotgun: ['Nova', 'MAG-7', 'Sawed-Off', 'XM1014'],
    Knife:   ['Karambit', 'Butterfly Knife', 'M9 Bayonet', 'Flip Knife', 'Gut Knife'],
    Gloves:  ['Sport Gloves', 'Specialist Gloves', 'Moto Gloves', 'Hand Wraps']
};

const STARTING_COINS   = 1000;
const DAILY_REWARD     = 500;
const COINS_PER_DOLLAR = 100;

// -------------------------------------------------------
// Firebase config — paste your Realtime Database URL here
// e.g. 'https://your-project-default-rtdb.firebaseio.com'
// -------------------------------------------------------
const FIREBASE_URL = 'https://leaderboard-f47dd-default-rtdb.firebaseio.com/';

// -------------------------------------------------------
// Currency
// -------------------------------------------------------

function getCoins() {
    return parseInt(localStorage.getItem('csgo_coins') || STARTING_COINS);
}

function setCoins(amount) {
    localStorage.setItem('csgo_coins', amount);
    updateBalanceDisplay();
}

function addCoins(amount) {
    setCoins(getCoins() + amount);
}

function spendCoins(amount) {
    const current = getCoins();
    if (current < amount) return false;
    setCoins(current - amount);
    return true;
}

function updateBalanceDisplay() {
    document.getElementById('balanceDisplay').textContent =
        getCoins().toLocaleString() + ' coins';
    renderCaseGrid();
}

// -------------------------------------------------------
// Daily Reward
// -------------------------------------------------------

function checkDailyReward() {
    const lastClaim = localStorage.getItem('csgo_daily');
    const now       = new Date();
    const today     = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const dailyBtn  = document.getElementById('dailyBtn');

    if (lastClaim === today) {
        dailyBtn.disabled    = true;
        dailyBtn.textContent = '🎁 Come back tomorrow!';
        startDailyCountdown();
    } else {
        dailyBtn.disabled    = false;
        dailyBtn.textContent = '🎁 Daily Reward';
        clearDailyCountdown();
    }
}

let dailyCountdownInterval = null;

function clearDailyCountdown() {
    if (dailyCountdownInterval) clearInterval(dailyCountdownInterval);
    const el = document.getElementById('dailyCountdown');
    if (el) el.textContent = '';
}

function startDailyCountdown() {
    let el = document.getElementById('dailyCountdown');
    if (!el) {
        el = document.createElement('div');
        el.id = 'dailyCountdown';
        el.className = 'daily-countdown';
        document.getElementById('dailyBtn').after(el);
    }

    const tick = () => {
        const now        = new Date();
        const midnight   = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff       = midnight - now;
        const h          = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m          = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s          = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        el.textContent   = `Next reward in: ${h}:${m}:${s}`;
    };

    tick();
    if (dailyCountdownInterval) clearInterval(dailyCountdownInterval);
    dailyCountdownInterval = setInterval(tick, 1000);
}

document.getElementById('dailyBtn').addEventListener('click', () => {
    const now   = new Date();
    const today = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    localStorage.setItem('csgo_daily', today);
    addCoins(DAILY_REWARD);
    addLbCoins(DAILY_REWARD);
    checkDailyReward();
    alert(`You claimed your daily reward of ${DAILY_REWARD.toLocaleString()} coins!`);
});

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

    const confirm = () => {
        const val = input.value.trim();
        if (!val) { input.focus(); return; }
        setUsername(val);
        modal.classList.add('hidden');
        updateLbUsernameDisplay();
        pushLeaderboard();
    };

    submit.addEventListener('click', confirm);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') confirm(); });
}

function updateLbUsernameDisplay() {
    const el = document.getElementById('lbUsernameDisplay');
    if (el) el.innerHTML = `Playing as <b>${getUsername() || '—'}</b>`;
}

// -------------------------------------------------------
// Leaderboard Stats (persistent)
// -------------------------------------------------------

function getLbStats() {
    return JSON.parse(localStorage.getItem('csgo_lb_stats') || '{"coins":0,"cases":0,"bestItem":"None","bestRarity":"","bestRank":0}');
}

function saveLbStats(stats) {
    localStorage.setItem('csgo_lb_stats', JSON.stringify(stats));
}

function addLbCoins(amount) {
    const stats = getLbStats();
    stats.coins += amount;
    saveLbStats(stats);
    pushLeaderboard();
}

function addLbCase(result) {
    const stats = getLbStats();
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
// Leaderboard Firebase
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
        if (lbActiveTab === 'coins') return (b.coins || 0) - (a.coins || 0);
        if (lbActiveTab === 'cases') return (b.cases || 0) - (a.cases || 0);
        if (lbActiveTab === 'item')  return (b.bestRank || 0) - (a.bestRank || 0);
        return 0;
    });

    const rankLabels = ['🥇', '🥈', '🥉'];
    const rankClasses = ['gold', 'silver', 'bronze'];
    const me = getUsername();

    listEl.innerHTML = sorted.map((entry, i) => {
        const rankHtml  = i < 3
            ? `<span class="lb-rank ${rankClasses[i]}">${rankLabels[i]}</span>`
            : `<span class="lb-rank">#${i + 1}</span>`;

        let valueHtml = '';
        if (lbActiveTab === 'coins') {
            valueHtml = `<span class="lb-value">${(entry.coins || 0).toLocaleString()} coins</span>`;
        } else if (lbActiveTab === 'cases') {
            valueHtml = `<span class="lb-value">${(entry.cases || 0).toLocaleString()} cases</span>`;
        } else {
            const rarityColour = { GOLD: '#e4ae39', 'Rare (Red)': '#eb4b4b', Pink: '#d32ce6', Purple: '#8847ff' }[entry.bestRarity] || '#8f98a0';
            valueHtml = `<span class="lb-value" style="color:${rarityColour}">${entry.bestItem || 'None'}</span>`;
        }

        return `
            <div class="lb-entry ${entry.username === me ? 'is-me' : ''}">
                ${rankHtml}
                <span class="lb-name">${entry.username}</span>
                ${valueHtml}
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------
// Case Selection
// -------------------------------------------------------

let selectedCase = null;

function renderCaseGrid() {
    const grid    = document.getElementById('caseGrid');
    const balance = getCoins();

    grid.innerHTML = CASES.map(c => `
        <div class="case-card ${balance < c.cost ? 'locked' : ''}"
             data-id="${c.id}"
             onclick="selectCase('${c.id}')">
            <div class="case-card-icon">${c.icon}</div>
            <div class="case-card-name">${c.name}</div>
            <div class="case-card-cost">💰 ${c.cost.toLocaleString()} coins</div>
            <div class="case-card-desc">${c.desc}</div>
        </div>
    `).join('');
}

function selectCase(id) {
    const c       = CASES.find(c => c.id === id);
    const balance = getCoins();

    if (balance < c.cost) {
        alert(`You need ${c.cost.toLocaleString()} coins to open this case. You have ${balance.toLocaleString()} coins.`);
        return;
    }

    selectedCase = c;

    document.getElementById('caseSelectScreen').classList.add('hidden');
    document.getElementById('caseOpenScreen').classList.remove('hidden');
    document.getElementById('caseInfo').innerHTML =
        `${c.icon} ${c.name} — <span>💰 ${c.cost.toLocaleString()} coins per open</span>`;

    document.getElementById('itemCard').classList.remove('visible');
    document.getElementById('multiResults').innerHTML = '';
    document.getElementById('multiResults').classList.remove('visible');
    document.getElementById('rollingText').textContent = '';

    // Reset contents panel
    const contentsEl = document.getElementById('caseContents');
    contentsEl.classList.remove('visible');
    document.getElementById('caseContentsToggle').textContent = '📋 View Case Contents ▾';
    renderCaseContents(c);
}

const RARITY_ODDS = {
    'GOLD':       { label: 'Gold — Rare Special',  chance: '0.26%',  colour: '#e4ae39' },
    'Rare (Red)': { label: 'Red — Covert',         chance: '0.64%',  colour: '#eb4b4b' },
    'Pink':       { label: 'Pink — Classified',    chance: '3.20%',  colour: '#d32ce6' },
    'Purple':     { label: 'Purple — Restricted',  chance: '15.98%', colour: '#8847ff' },
    'Blue':       { label: 'Blue — Mil-Spec',      chance: '79.92%', colour: '#4b69ff' }
};

function renderCaseContents(c) {
    const contentsEl = document.getElementById('caseContents');
    contentsEl.innerHTML = Object.entries(c.skins).map(([rarity, skins]) => {
        const info = RARITY_ODDS[rarity];
        return `
            <div class="case-rarity-group">
                <div class="case-rarity-label" style="background:${info.colour}22; color:${info.colour}">
                    <span>${info.label}</span>
                    <span>${info.chance}</span>
                </div>
                <div class="case-skin-list">
                    ${skins.map(s => `<div class="case-skin-item">• ${s}</div>`).join('')}
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('caseContentsToggle').addEventListener('click', () => {
    const contentsEl = document.getElementById('caseContents');
    const toggle     = document.getElementById('caseContentsToggle');
    const isOpen     = contentsEl.classList.contains('visible');
    contentsEl.classList.toggle('visible', !isOpen);
    toggle.textContent = isOpen ? '📋 View Case Contents ▾' : '📋 Hide Case Contents ▴';
});

document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('caseOpenScreen').classList.add('hidden');
    document.getElementById('caseSelectScreen').classList.remove('hidden');
    selectedCase = null;
});

// -------------------------------------------------------
// Roll functions
// -------------------------------------------------------

function rand()    { return Math.random() * 100; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function rollRarity() {
    const r = rand();
    if (r < 0.26)       return 'GOLD';
    else if (r < 0.90)  return 'Rare (Red)';
    else if (r < 4.10)  return 'Pink';
    else if (r < 20.08) return 'Purple';
    else                return 'Blue';
}

function rollWear() {
    const r = rand();
    if (r < 3)       return 'Factory New';
    else if (r < 18) return 'Minimal Wear';
    else if (r < 58) return 'Field-Tested';
    else if (r < 76) return 'Well-Worn';
    else             return 'Battle-Scarred';
}

function rollPrefix() {
    const r = rand();
    if (r < 10)      return 'StatTrak™';
    else if (r < 12) return 'Souvenir';
    else             return '';
}

function rollFloat(wear) {
    const [min, max] = WEAR_RANGES[wear];
    return (min + Math.random() * (max - min)).toFixed(4);
}

function getPrice(skin, wear, prefix) {
    const base       = selectedCase.prices[skin] || 1;
    const wearMult   = { 'Factory New': 1.50, 'Minimal Wear': 1.20, 'Field-Tested': 1.00, 'Well-Worn': 0.70, 'Battle-Scarred': 0.50 }[wear] || 1;
    const prefixMult = prefix === 'StatTrak™' ? 1.5 : prefix === 'Souvenir' ? 1.3 : 1.0;
    return (base * wearMult * prefixMult).toFixed(2);
}

function getWeaponType(skin) {
    const clean  = skin.replace('★ ', '');
    const weapon = clean.includes(' | ') ? clean.split(' | ')[0] : clean;
    for (const [type, weapons] of Object.entries(WEAPON_TYPES)) {
        if (weapons.includes(weapon)) return type;
    }
    return 'Unknown';
}

function openCrate() {
    const rarity   = rollRarity();
    const pool     = selectedCase.skins[rarity];
    const skin     = pick(pool);
    const wear     = rollWear();
    const prefix   = rollPrefix();
    const floatVal = rollFloat(wear);
    const seed     = Math.floor(Math.random() * 1000) + 1;
    const price    = getPrice(skin, wear, prefix);
    const type     = getWeaponType(skin);
    const tier     = RARITY_TIERS[rarity];
    const fullName = prefix ? `${prefix} ${skin}` : skin;
    const fullItem = `${fullName} (${wear})`;
    const coins    = Math.round(parseFloat(price) * COINS_PER_DOLLAR);
    return { rarity, skin, wear, prefix, floatVal, seed, price, type, tier, fullName, fullItem, coins };
}

// -------------------------------------------------------
// DOM references
// -------------------------------------------------------

const openBtn      = document.getElementById('openBtn');
const open5Btn     = document.getElementById('open5Btn');
const open10Btn    = document.getElementById('open10Btn');
const quickToggle  = document.getElementById('quickToggle');
const rollingText  = document.getElementById('rollingText');
const itemCard     = document.getElementById('itemCard');
const itemHeader   = document.getElementById('itemHeader');
const itemName     = document.getElementById('itemName');
const itemSubtitle = document.getElementById('itemSubtitle');
const floatMarker  = document.getElementById('floatMarker');
const iType        = document.getElementById('iType');
const iRarity      = document.getElementById('iRarity');
const iExterior    = document.getElementById('iExterior');
const iFloat       = document.getElementById('iFloat');
const iSeed        = document.getElementById('iSeed');
const iPrice       = document.getElementById('iPrice');
const stRow        = document.getElementById('stRow');
const iKills       = document.getElementById('iKills');
const multiResults = document.getElementById('multiResults');
const invPanel     = document.getElementById('invPanel');
const statsPanel   = document.getElementById('statsPanel');
const invBtn       = document.getElementById('invBtn');
const statsBtn     = document.getElementById('statsBtn');
const resetBtn     = document.getElementById('resetBtn');

// -------------------------------------------------------
// Rolling animation
// -------------------------------------------------------

function animateRolling() {
    return new Promise(resolve => {
        let dots  = 0;
        let ticks = 0;
        rollingText.textContent = 'Rolling';
        const interval = setInterval(() => {
            dots = (dots % 6) + 1;
            ticks++;
            rollingText.textContent = 'Rolling' + '.'.repeat(dots);
            if (ticks >= 12) {
                clearInterval(interval);
                rollingText.textContent = '';
                resolve();
            }
        }, 200);
    });
}

// -------------------------------------------------------
// Display item card
// -------------------------------------------------------

function getRarityMessage(rarity) {
    const messages = {
        'GOLD':       '🌟 UNBELIEVABLE! A legendary GOLD drop!',
        'Rare (Red)': '🔥 INSANE! An ultra rare Covert drop!',
        'Pink':       '😎 Sick! A Classified skin!',
        'Purple':     '👍 Not bad! A Restricted skin.',
        'Blue':       '🎲 A Mil-Spec drop. Try your luck again!'
    };
    return messages[rarity] || '';
}

function displayItem(result) {
    itemHeader.className = 'item-header';
    itemHeader.classList.add(RARITY_CLASSES[result.rarity]);
    itemName.textContent     = result.fullName;
    itemSubtitle.textContent = `${result.tier} · ${result.wear}`;
    iType.textContent        = result.type;
    iRarity.textContent      = `${result.tier} (${result.rarity})`;
    iExterior.textContent    = result.wear;
    iFloat.textContent       = result.floatVal;
    iSeed.textContent        = result.seed;
    iPrice.textContent       = `~$${result.price} (${result.coins.toLocaleString()} coins)`;
    floatMarker.style.left   = `${(parseFloat(result.floatVal) * 100).toFixed(2)}%`;

    if (result.prefix === 'StatTrak™') {
        const kills = Math.floor(Math.random() * 100000).toLocaleString();
        iKills.textContent  = `${kills} Confirmed Kills`;
        stRow.style.display = 'flex';
    } else {
        stRow.style.display = 'none';
    }

    itemCard.classList.add('visible');
}

// -------------------------------------------------------
// Open logic
// -------------------------------------------------------

let quickOpen = false;
quickToggle.addEventListener('change', () => { quickOpen = quickToggle.checked; });

function setButtons(disabled) {
    openBtn.disabled   = disabled;
    open5Btn.disabled  = disabled;
    open10Btn.disabled = disabled;
}

async function doOpen(count = 1) {
    if (!selectedCase) return;

    const totalCost = selectedCase.cost * count;
    if (!spendCoins(totalCost)) {
        alert(`You need ${totalCost.toLocaleString()} coins to open ${count} case${count > 1 ? 's' : ''}. You have ${getCoins().toLocaleString()} coins.`);
        return;
    }

    setButtons(true);
    itemCard.classList.remove('visible');
    multiResults.classList.remove('visible');
    multiResults.innerHTML = '';

    if (!quickOpen) await animateRolling();

    if (count === 1) {
        const result = openCrate();
        displayItem(result);
        saveItem(result);
        updateStats(result);
        addLbCase(result);
        rollingText.textContent = getRarityMessage(result.rarity);
    } else {
        const results = Array.from({ length: count }, () => openCrate());
        let best      = results[0];
        let bestRank  = RARITY_RANKS[results[0].rarity];

        for (const r of results) {
            const rank = RARITY_RANKS[r.rarity];
            if (rank > bestRank) { bestRank = rank; best = r; }
        }

        displayItem(best);
        rollingText.textContent = `Best of ${count}: ${getRarityMessage(best.rarity)}`;
        results.forEach(r => { saveItem(r); updateStats(r); addLbCase(r); });

        multiResults.classList.add('visible');
        multiResults.innerHTML = results.map(r => `
            <div class="multi-result-card ${r === best ? 'highlight' : ''}">
                <div class="multi-result-header ${RARITY_CLASSES[r.rarity]}">${r.fullName}</div>
                <div class="multi-result-body">
                    <div>Exterior: <span>${r.wear}</span></div>
                    <div>Float: <span>${r.floatVal}</span></div>
                    <div>Value: <span>${r.coins.toLocaleString()} coins</span></div>
                </div>
            </div>
        `).join('');
    }

    setButtons(false);
}

openBtn.addEventListener('click',   () => doOpen(1));
open5Btn.addEventListener('click',  () => doOpen(5));
open10Btn.addEventListener('click', () => doOpen(10));

// -------------------------------------------------------
// Inventory
// -------------------------------------------------------

function getInventory() {
    return JSON.parse(localStorage.getItem('csgo_inventory') || '[]');
}

function saveItem(result) {
    const inv = getInventory();
    inv.push({
        fullItem: result.fullItem,
        rarity:   result.rarity,
        tier:     result.tier,
        type:     result.type,
        float:    result.floatVal,
        seed:     result.seed,
        price:    result.price,
        coins:    result.coins
    });
    localStorage.setItem('csgo_inventory', JSON.stringify(inv));
    // Auto-update inventory panel if it's open
    if (document.getElementById('invPanel').classList.contains('visible')) {
        renderInventory();
    }
}

function sellItem(index) {
    const inv  = getInventory();
    const item = inv[index];
    if (!item) return;

    if (!confirm(`Sell ${item.fullItem} for ${item.coins.toLocaleString()} coins?`)) return;

    inv.splice(index, 1);
    localStorage.setItem('csgo_inventory', JSON.stringify(inv));
    addCoins(item.coins);
    renderInventory();
}

function sellAll() {
    const inv = getInventory();
    if (inv.length === 0) return;
    const total = inv.reduce((sum, item) => sum + (item.coins || 0), 0);
    if (!confirm(`Sell all ${inv.length} items for ${total.toLocaleString()} coins?`)) return;
    localStorage.removeItem('csgo_inventory');
    addCoins(total);
    renderInventory();
}

function renderInventory() {
    const inv     = getInventory();
    const invList = document.getElementById('invList');

    if (inv.length === 0) {
        invList.innerHTML = '<p class="empty-msg">No items yet. Open a case first!</p>';
        return;
    }

    invList.innerHTML = inv.slice().reverse().map((item, i) => {
        const realIndex = inv.length - 1 - i;
        return `
            <div class="inventory-item">
                <div class="inventory-item-info">
                    <div class="inventory-item-name">#${inv.length - i} ${item.fullItem}</div>
                    <div class="inventory-item-detail">
                        ${item.tier} · ${item.type} · Float: ${item.float} · ~$${item.price}
                    </div>
                </div>
                <button class="sell-btn" onclick="sellItem(${realIndex})">
                    Sell<br>${item.coins.toLocaleString()} coins
                </button>
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------
// Session stats
// -------------------------------------------------------

const sessionStats = {
    total: 0, gold: 0, red: 0, pink: 0, purple: 0, blue: 0,
    bestItem: 'None yet', bestRank: 0, coinsSpent: 0, coinsEarned: 0
};

function updateStats(result) {
    sessionStats.total++;
    sessionStats.coinsSpent += selectedCase ? selectedCase.cost : 0;
    const key = { 'GOLD': 'gold', 'Rare (Red)': 'red', 'Pink': 'pink', 'Purple': 'purple', 'Blue': 'blue' }[result.rarity];
    sessionStats[key]++;
    const rank = RARITY_RANKS[result.rarity];
    if (rank > sessionStats.bestRank) {
        sessionStats.bestRank = rank;
        sessionStats.bestItem = result.fullItem;
    }
}

function renderStats() {
    const grid = document.getElementById('statsGrid');
    grid.innerHTML = `
        <div class="stat-box"><div class="stat-label">Total Opened</div><div class="stat-value">${sessionStats.total}</div></div>
        <div class="stat-box"><div class="stat-label">Coins Spent</div><div class="stat-value">${sessionStats.coinsSpent.toLocaleString()}</div></div>
        <div class="stat-box"><div class="stat-label">🟡 Gold</div><div class="stat-value">${sessionStats.gold}</div></div>
        <div class="stat-box"><div class="stat-label">🔴 Red</div><div class="stat-value">${sessionStats.red}</div></div>
        <div class="stat-box"><div class="stat-label">🩷 Pink</div><div class="stat-value">${sessionStats.pink}</div></div>
        <div class="stat-box"><div class="stat-label">🟣 Purple</div><div class="stat-value">${sessionStats.purple}</div></div>
        <div class="stat-box"><div class="stat-label">🔵 Blue</div><div class="stat-value">${sessionStats.blue}</div></div>
        <div class="stat-box"><div class="stat-label">Balance</div><div class="stat-value">${getCoins().toLocaleString()}</div></div>
    `;
    document.getElementById('bestRoll').textContent = sessionStats.bestItem;
}

// -------------------------------------------------------
// Panel toggles
// -------------------------------------------------------

invBtn.addEventListener('click', () => {
    const isOpen = invPanel.classList.contains('visible');
    invPanel.classList.toggle('visible', !isOpen);
    statsPanel.classList.remove('visible');
    if (!isOpen) renderInventory();
});

statsBtn.addEventListener('click', () => {
    const isOpen = statsPanel.classList.contains('visible');
    statsPanel.classList.toggle('visible', !isOpen);
    invPanel.classList.remove('visible');
    if (!isOpen) renderStats();
});

resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your entire inventory?')) {
        localStorage.removeItem('csgo_inventory');
        renderInventory();
    }
});

document.getElementById('sellAllBtn').addEventListener('click', sellAll);

document.getElementById('supportBtn').addEventListener('click', () => {
    window.open('https://ko-fi.com/nthn_mp4', '_blank');
});

// -------------------------------------------------------
// Fishing
// -------------------------------------------------------

const JUNK_ITEMS = [
    'Old Boot', 'Rusty Hook', 'Empty Can', 'Seaweed',
    'Broken Rod', 'Soggy Glove', 'Plastic Bag', 'Bent Coin'
];

const RARE_JUNK_ITEMS = [
    'Antique Lure', 'Waterlogged Wallet', 'Mysterious Box',
    'Vintage Flask', 'Silver Coin', 'Encrypted Chip'
];

const ALL_SKINS = [...new Set(CASES.flatMap(c => Object.values(c.skins).flat()))];

function rollFishCatch() {
    const roll = Math.random() * 100;

    if (roll < 50) {
        const coins = Math.floor(Math.random() * 151) + 50;
        return { type: 'coins', name: '💰 Found some coins', value: coins, cssClass: 'catch-coins' };
    } else if (roll < 75) {
        const coins = Math.floor(Math.random() * 301) + 200;
        return { type: 'coins', name: '💰 Nice haul!', value: coins, cssClass: 'catch-coins' };
    } else if (roll < 90) {
        const item  = JUNK_ITEMS[Math.floor(Math.random() * JUNK_ITEMS.length)];
        const coins = Math.floor(Math.random() * 101) + 50;
        return { type: 'junk', name: `🪣 ${item}`, value: coins, cssClass: 'catch-junk' };
    } else if (roll < 98) {
        const item  = RARE_JUNK_ITEMS[Math.floor(Math.random() * RARE_JUNK_ITEMS.length)];
        const coins = Math.floor(Math.random() * 301) + 200;
        return { type: 'rare', name: `✨ ${item}`, value: coins, cssClass: 'catch-rare' };
    } else {
        // Pick a random case and roll a real skin from it
        const casePool  = CASES[Math.floor(Math.random() * CASES.length)];
        const rarity    = rollRarity();
        const pool      = casePool.skins[rarity] || casePool.skins['Blue'];
        const skin      = pool[Math.floor(Math.random() * pool.length)];
        const wear      = rollWear();
        const prefix    = rollPrefix();
        const floatVal  = rollFloat(wear);
        const seed      = Math.floor(Math.random() * 1000) + 1;
        const basePrice = casePool.prices[skin] || 1;
        const wearMult  = { 'Factory New': 1.50, 'Minimal Wear': 1.20, 'Field-Tested': 1.00, 'Well-Worn': 0.70, 'Battle-Scarred': 0.50 }[wear] || 1;
        const pfxMult   = prefix === 'StatTrak™' ? 1.5 : prefix === 'Souvenir' ? 1.3 : 1.0;
        const price     = (basePrice * wearMult * pfxMult).toFixed(2);
        const coins     = Math.round(parseFloat(price) * COINS_PER_DOLLAR);
        const type      = getWeaponType(skin);
        const tier      = RARITY_TIERS[rarity];
        const fullName  = prefix ? `${prefix} ${skin}` : skin;
        const fullItem  = `${fullName} (${wear})`;

        return {
            type: 'skin', name: `🔫 ${fullItem}`, value: coins, cssClass: 'catch-skin',
            skinItem: { fullItem, rarity, tier, type, float: floatVal, seed, price, coins }
        };
    }
}

const fishLog = [];

function renderFishLog() {
    const logEl = document.getElementById('fishLog');
    if (!logEl) return;
    if (fishLog.length === 0) {
        logEl.innerHTML = '<p class="empty-msg">Nothing caught yet. Cast your line!</p>';
        return;
    }
    logEl.innerHTML = fishLog.slice().reverse().map(c => `
        <div class="fish-catch ${c.cssClass}">
            <span class="fish-catch-name">${c.name}</span>
            <span class="fish-catch-value">+${c.value.toLocaleString()} coins</span>
        </div>
    `).join('');
}

document.getElementById('fishBtn').addEventListener('click', () => {
    const isOpen = fishPanel.classList.contains('visible');
    fishPanel.classList.toggle('visible', !isOpen);
    invPanel.classList.remove('visible');
    statsPanel.classList.remove('visible');
    lbPanel.classList.remove('visible');
    if (!isOpen) renderFishLog();
});

document.getElementById('fishClearBtn').addEventListener('click', () => {
    fishLog.length = 0;
    renderFishLog();
});

const fishPanel  = document.getElementById('fishPanel');
const castBtn    = document.getElementById('castBtn');
const fishStatus = document.getElementById('fishStatus');

castBtn.addEventListener('click', () => {
    castBtn.disabled = true;
    fishStatus.textContent = '🎣 Line cast...';

    const waitMs = Math.floor(Math.random() * 2001) + 1000;

    setTimeout(() => {
        fishStatus.textContent = '⚡ Something bit!';
        setTimeout(() => {
            const result = rollFishCatch();
            fishLog.push(result);
            if (fishLog.length > 20) fishLog.shift();

            addCoins(result.value);
            addLbCoins(result.value);

            // If it's a skin, save it to inventory
            if (result.type === 'skin' && result.skinItem) {
                const inv = getInventory();
                inv.push(result.skinItem);
                localStorage.setItem('csgo_inventory', JSON.stringify(inv));
                if (document.getElementById('invPanel').classList.contains('visible')) {
                    renderInventory();
                }
            }

            renderFishLog();
            fishStatus.textContent = `${result.name} — +${result.value.toLocaleString()} coins!`;
            castBtn.disabled = false;
        }, 600);
    }, waitMs);
});

document.getElementById('lbBtn').addEventListener('click', () => {
    const isOpen = lbPanel.classList.contains('visible');
    lbPanel.classList.toggle('visible', !isOpen);
    invPanel.classList.remove('visible');
    statsPanel.classList.remove('visible');
    fishPanel.classList.remove('visible');
    if (!isOpen) {
        updateLbUsernameDisplay();
        renderLeaderboard();
    }
});

document.getElementById('lbRefreshBtn').addEventListener('click', () => {
    renderLeaderboard();
});

document.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        lbActiveTab = tab.dataset.tab;
        renderLeaderboard();
    });
});

const lbPanel = document.getElementById('lbPanel');

// -------------------------------------------------------
// Init
// -------------------------------------------------------

updateBalanceDisplay();
checkDailyReward();
renderCaseGrid();
initUsernameModal();