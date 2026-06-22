// --- Data ---
const SKINS = {
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
};

const BASE_PRICES = {
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
};

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

function rollSkin(rarity) { return pick(SKINS[rarity]); }

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
    const base = BASE_PRICES[skin] || 1;
    const wearMult = {
        'Factory New':   1.50,
        'Minimal Wear':  1.20,
        'Field-Tested':  1.00,
        'Well-Worn':     0.70,
        'Battle-Scarred':0.50
    }[wear] || 1;
    const prefixMult = prefix === 'StatTrak™' ? 1.5
                     : prefix === 'Souvenir'  ? 1.3 : 1.0;
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
    const skin     = rollSkin(rarity);
    const wear     = rollWear();
    const prefix   = rollPrefix();
    const floatVal = rollFloat(wear);
    const seed     = Math.floor(Math.random() * 1000) + 1;
    const price    = getPrice(skin, wear, prefix);
    const type     = getWeaponType(skin);
    const tier     = RARITY_TIERS[rarity];
    const fullName = prefix ? `${prefix} ${skin}` : skin;
    const fullItem = `${fullName} (${wear})`;
    return { rarity, skin, wear, prefix, floatVal, seed, price, type, tier, fullName, fullItem };
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
    iPrice.textContent       = `~$${result.price}`;

    floatMarker.style.left = `${(parseFloat(result.floatVal) * 100).toFixed(2)}%`;

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
        rollingText.textContent = getRarityMessage(result.rarity);
    } else {
        const results = Array.from({ length: count }, () => openCrate());

        let best     = results[0];
        let bestRank = RARITY_RANKS[results[0].rarity];
        for (const r of results) {
            const rank = RARITY_RANKS[r.rarity];
            if (rank > bestRank) { bestRank = rank; best = r; }
        }

        displayItem(best);
        rollingText.textContent = `Best of ${count}: ${getRarityMessage(best.rarity)}`;

        results.forEach(r => { saveItem(r); updateStats(r); });

        multiResults.classList.add('visible');
        multiResults.innerHTML = results.map(r => `
            <div class="multi-result-card ${r === best ? 'highlight' : ''}">
                <div class="multi-result-header ${RARITY_CLASSES[r.rarity]}">
                    ${r.fullName}
                </div>
                <div class="multi-result-body">
                    <div>Exterior: <span>${r.wear}</span></div>
                    <div>Float: <span>${r.floatVal}</span></div>
                    <div>Price: <span>~$${r.price}</span></div>
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
// Inventory (localStorage)
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
        price:    result.price
    });
    localStorage.setItem('csgo_inventory', JSON.stringify(inv));
}

function renderInventory() {
    const inv     = getInventory();
    const invList = document.getElementById('invList');

    if (inv.length === 0) {
        invList.innerHTML = '<p class="empty-msg">No items yet. Open a case first!</p>';
        return;
    }

    invList.innerHTML = inv.slice().reverse().map((item, i) => `
        <div class="inventory-item">
            <div class="inventory-item-name">#${inv.length - i} ${item.fullItem}</div>
            <div class="inventory-item-detail">
                ${item.tier} · ${item.type} · Float: ${item.float} · ~$${item.price}
            </div>
        </div>
    `).join('');
}

// -------------------------------------------------------
// Session stats
// -------------------------------------------------------

const sessionStats = {
    total: 0, gold: 0, red: 0, pink: 0, purple: 0, blue: 0,
    bestItem: 'None yet', bestRank: 0
};

function updateStats(result) {
    sessionStats.total++;
    const key = {
        'GOLD':       'gold',
        'Rare (Red)': 'red',
        'Pink':       'pink',
        'Purple':     'purple',
        'Blue':       'blue'
    }[result.rarity];
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
        <div class="stat-box">
            <div class="stat-label">Total Opened</div>
            <div class="stat-value">${sessionStats.total}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">🟡 Gold</div>
            <div class="stat-value">${sessionStats.gold}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">🔴 Red</div>
            <div class="stat-value">${sessionStats.red}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">🩷 Pink</div>
            <div class="stat-value">${sessionStats.pink}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">🟣 Purple</div>
            <div class="stat-value">${sessionStats.purple}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">🔵 Blue</div>
            <div class="stat-value">${sessionStats.blue}</div>
        </div>
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