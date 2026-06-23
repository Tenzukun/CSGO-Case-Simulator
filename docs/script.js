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

let dailyCountdownInterval = null;

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
        dailyBtn.textContent = `🎁 Daily (${getDailyRewardAmount().toLocaleString()} coins)`;
        clearDailyCountdown();
    }
}

function clearDailyCountdown() {
    if (dailyCountdownInterval) clearInterval(dailyCountdownInterval);
    const el = document.getElementById('dailyCountdown');
    if (el) el.textContent = '';
}

function startDailyCountdown() {
    let el = document.getElementById('dailyCountdown');
    if (!el) {
        el = document.createElement('div');
        el.id        = 'dailyCountdown';
        el.className = 'daily-countdown';
        document.getElementById('dailyBtn').after(el);
    }

    const tick = () => {
        const now      = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight - now;
        const h    = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m    = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s    = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        el.textContent = `Next reward in: ${h}:${m}:${s}`;
    };

    tick();
    if (dailyCountdownInterval) clearInterval(dailyCountdownInterval);
    dailyCountdownInterval = setInterval(tick, 1000);
}

document.getElementById('dailyBtn').addEventListener('click', () => {
    const now   = new Date();
    const today = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const reward = getDailyRewardAmount();
    localStorage.setItem('csgo_daily', today);
    addCoins(reward);
    addLbCoins(reward);
    addXP(XP_DAILY);
    checkDailyReward();
    alert(`You claimed your daily reward of ${reward.toLocaleString()} coins!`);
});

// -------------------------------------------------------
// Case Selection
// -------------------------------------------------------

let selectedCase = null;

function renderCaseGrid() {
    const grid    = document.getElementById('caseGrid');
    const balance = getCoins();
    const level   = getLevel();

    grid.innerHTML = CASES.map(c => {
        const locked     = balance < c.cost;
        const levelLock  = level < c.unlockLevel;
        const cardClass  = (locked || levelLock) ? 'locked' : '';
        const costHtml   = levelLock
            ? `<div class="case-card-lock">🔒 Unlocks at Level ${c.unlockLevel}</div>`
            : `<div class="case-card-cost">💰 ${c.cost.toLocaleString()} coins</div>`;

        return `
            <div class="case-card ${cardClass}"
                 data-id="${c.id}"
                 onclick="selectCase('${c.id}')">
                <div class="case-card-icon">${c.icon}</div>
                <div class="case-card-name">${c.name}</div>
                ${costHtml}
                <div class="case-card-desc">${c.desc}</div>
            </div>
        `;
    }).join('');
}

function selectCase(id) {
    const c     = CASES.find(c => c.id === id);
    const level = getLevel();

    if (level < c.unlockLevel) {
        alert(`This case unlocks at Level ${c.unlockLevel}. You are Level ${level}.`);
        return;
    }
    if (getCoins() < c.cost) {
        alert(`You need ${c.cost.toLocaleString()} coins. You have ${getCoins().toLocaleString()} coins.`);
        return;
    }

    selectedCase = c;

    document.getElementById('caseSelectScreen').classList.add('hidden');
    document.getElementById('caseOpenScreen').classList.remove('hidden');
    document.getElementById('caseInfo').innerHTML =
        `${c.icon} ${c.name} <span>💰 ${c.cost.toLocaleString()} coins per open</span>`;

    document.getElementById('itemCard').classList.remove('visible');
    document.getElementById('multiResults').innerHTML = '';
    document.getElementById('multiResults').classList.remove('visible');
    document.getElementById('rollingText').textContent = '';

    const contentsEl = document.getElementById('caseContents');
    contentsEl.classList.remove('visible');
    document.getElementById('caseContentsToggle').textContent = '📋 View Case Contents ▾';
    renderCaseContents(c);
}

function renderCaseContents(c) {
    const contentsEl  = document.getElementById('caseContents');
    contentsEl.innerHTML = Object.entries(c.skins).map(([rarity, skins]) => {
        const info = RARITY_ODDS[rarity];
        return `
            <div class="case-rarity-group">
                <div class="case-rarity-label" style="background:${info.colour}22; color:${info.colour}">
                    <span>${info.label}</span><span>${info.chance}</span>
                </div>
                <div class="case-skin-list">
                    ${skins.map(s => `<div class="case-skin-item">• ${s}</div>`).join('')}
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('caseContentsToggle').addEventListener('click', () => {
    const el     = document.getElementById('caseContents');
    const toggle = document.getElementById('caseContentsToggle');
    const isOpen = el.classList.contains('visible');
    el.classList.toggle('visible', !isOpen);
    toggle.textContent = isOpen ? '📋 View Case Contents ▾' : '📋 Hide Case Contents ▴';
});

document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('caseOpenScreen').classList.add('hidden');
    document.getElementById('caseSelectScreen').classList.remove('hidden');
    selectedCase = null;
});

// -------------------------------------------------------
// DOM References
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
// Rolling Animation
// -------------------------------------------------------

function animateRolling() {
    return new Promise(resolve => {
        let dots = 0, ticks = 0;
        rollingText.textContent = 'Rolling';
        const interval = setInterval(() => {
            dots = (dots % 6) + 1;
            ticks++;
            rollingText.textContent = 'Rolling' + '.'.repeat(dots);
            if (ticks >= 12) { clearInterval(interval); rollingText.textContent = ''; resolve(); }
        }, 200);
    });
}

// -------------------------------------------------------
// Display Item Card
// -------------------------------------------------------

function getRarityMessage(rarity) {
    return {
        'GOLD':       '🌟 UNBELIEVABLE! A legendary GOLD drop!',
        'Rare (Red)': '🔥 INSANE! An ultra rare Covert drop!',
        'Pink':       '😎 Sick! A Classified skin!',
        'Purple':     '👍 Not bad! A Restricted skin.',
        'Blue':       '🎲 A Mil-Spec drop. Try your luck again!'
    }[rarity] || '';
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
        iKills.textContent  = `${Math.floor(Math.random() * 100000).toLocaleString()} Confirmed Kills`;
        stRow.style.display = 'flex';
    } else {
        stRow.style.display = 'none';
    }

    // Rarity animation
    const animClass = {
        'GOLD':       'rarity-gold-anim',
        'Rare (Red)': 'rarity-red-anim',
        'Pink':       'rarity-pink-anim'
    }[result.rarity] || '';

    itemCard.classList.remove('visible', 'rarity-gold-anim', 'rarity-red-anim', 'rarity-pink-anim');
    void itemCard.offsetWidth;
    itemCard.classList.add('visible');
    if (animClass) itemCard.classList.add(animClass);

    itemHeader.classList.remove('animate');
    void itemHeader.offsetWidth;
    itemHeader.classList.add('animate');
}

// -------------------------------------------------------
// Open Logic
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
        const result = openCrate(selectedCase);
        displayItem(result);
        saveItem(result);
        updateStats(result);
        addLbCase(result);
        addXP(XP_PER_RARITY[result.rarity] || 10);
        rollingText.textContent = getRarityMessage(result.rarity);
    } else {
        const results = Array.from({ length: count }, () => openCrate(selectedCase));
        let best      = results[0];
        let bestRank  = RARITY_RANKS[results[0].rarity];

        for (const r of results) {
            if (RARITY_RANKS[r.rarity] > bestRank) { bestRank = RARITY_RANKS[r.rarity]; best = r; }
        }

        displayItem(best);
        rollingText.textContent = `Best of ${count}: ${getRarityMessage(best.rarity)}`;
        results.forEach(r => {
            saveItem(r);
            updateStats(r);
            addLbCase(r);
            addXP(XP_PER_RARITY[r.rarity] || 10);
        });

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
        fullItem: result.fullItem, rarity: result.rarity, tier: result.tier,
        type: result.type, float: result.floatVal, seed: result.seed,
        price: result.price, coins: result.coins
    });
    localStorage.setItem('csgo_inventory', JSON.stringify(inv));
    if (document.getElementById('invPanel').classList.contains('visible')) renderInventory();
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
                    <div class="inventory-item-detail">${item.tier} · ${item.type} · Float: ${item.float} · ~$${item.price}</div>
                </div>
                <button class="sell-btn" onclick="sellItem(${realIndex})">
                    Sell<br>${item.coins.toLocaleString()} coins
                </button>
            </div>
        `;
    }).join('');
}

// -------------------------------------------------------
// Session Stats
// -------------------------------------------------------

const sessionStats = {
    total: 0, gold: 0, red: 0, pink: 0, purple: 0, blue: 0,
    bestItem: 'None yet', bestRank: 0, coinsSpent: 0
};

function updateStats(result) {
    sessionStats.total++;
    sessionStats.coinsSpent += selectedCase ? selectedCase.cost : 0;
    const key = { 'GOLD': 'gold', 'Rare (Red)': 'red', 'Pink': 'pink', 'Purple': 'purple', 'Blue': 'blue' }[result.rarity];
    sessionStats[key]++;
    const rank = RARITY_RANKS[result.rarity];
    if (rank > sessionStats.bestRank) { sessionStats.bestRank = rank; sessionStats.bestItem = result.fullItem; }
}

function renderStats() {
    document.getElementById('statsGrid').innerHTML = `
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
// Page Navigation
// -------------------------------------------------------

const PAGES = ['page-cases', 'page-fishing', 'page-howtoplay'];

function switchPage(pageId) {
    PAGES.forEach(id => {
        document.getElementById(id).classList.toggle('hidden', id !== pageId);
    });
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.page === pageId.replace('page-', ''));
    });
    // Close any open panels when switching pages
    ALL_PANELS.forEach(id => document.getElementById(id).classList.remove('visible'));
}

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => switchPage(`page-${tab.dataset.page}`));
});

// -------------------------------------------------------
// Panel Toggles
// -------------------------------------------------------

const ALL_PANELS = ['invPanel', 'statsPanel', 'lbPanel'];

function openPanel(panelId, onOpen) {
    const isOpen = document.getElementById(panelId).classList.contains('visible');
    ALL_PANELS.forEach(id => document.getElementById(id).classList.remove('visible'));
    if (!isOpen) {
        document.getElementById(panelId).classList.add('visible');
        if (onOpen) onOpen();
    }
}

invBtn.addEventListener('click',   () => openPanel('invPanel',   renderInventory));
statsBtn.addEventListener('click', () => openPanel('statsPanel', renderStats));

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
// Init
// -------------------------------------------------------

updateBalanceDisplay();
updateLevelDisplay();
checkDailyReward();
renderCaseGrid();
initUsernameModal();