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
// Case Selection
// -------------------------------------------------------

let selectedCase = null;

function renderCaseGrid() {
    const grid    = document.getElementById('caseGrid');
    const balance = getCoins();
    const level   = getLevel();

    grid.innerHTML = CASES.map(c => {
        const locked        = balance < c.cost;
        const levelLock     = level < c.unlockLevel;
        const prestigeLock  = c.prestigeOnly && !(typeof isShopItemUnlocked === 'function' && isShopItemUnlocked(c.shopItemId));
        const cardClass     = (locked || levelLock || prestigeLock) ? 'locked' : '';
        const costHtml      = prestigeLock
            ? `<div class="case-card-lock">🔒 Prestige Shop unlock required</div>`
            : levelLock
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
    if (c.prestigeOnly && !(typeof isShopItemUnlocked === 'function' && isShopItemUnlocked(c.shopItemId))) {
        alert('This case requires a Prestige Shop unlock. Visit the Upgrades page.');
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
    const contentsEl = document.getElementById('caseContents');
    const odds       = getCaseOdds(c);
    contentsEl.innerHTML = Object.entries(c.skins).map(([rarity, skins]) => {
        const info = RARITY_ODDS[rarity];
        return `
            <div class="case-rarity-group">
                <div class="case-rarity-label" style="background:${info.colour}22; color:${info.colour}">
                    <span>${info.label}</span><span>${odds[rarity]}</span>
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

// -------------------------------------------------------
// Rolling Animation
// -------------------------------------------------------

function animateRolling() {
    return new Promise(resolve => {
        SFX.roll();
        let dots = 0, ticks = 0;
        rollingText.textContent = 'Rolling';
        const interval = setInterval(() => {
            dots = (dots % 6) + 1;
            ticks++;
            rollingText.textContent = 'Rolling' + '.'.repeat(dots);
            if (ticks >= 6) { clearInterval(interval); rollingText.textContent = ''; resolve(); }
        }, 120);
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

    const cb        = (typeof getCaseBonus === 'function') ? getCaseBonus() : {};
    const discount  = cb.costDiscount || 0;
    const totalCost = Math.floor(selectedCase.cost * count * (1 - discount));
    if (!spendCoins(totalCost)) {
        alert(`You need ${totalCost.toLocaleString()} coins to open ${count} case${count > 1 ? 's' : ''}. You have ${getCoins().toLocaleString()} coins.`);
        return;
    }

    setButtons(true);
    itemCard.classList.remove('visible');
    multiResults.classList.remove('visible');
    multiResults.innerHTML = '';

    try {
        if (!quickOpen) await animateRolling();

        // Badge: mass opener (10x open)
        if (count === 10 && typeof earnBadge === 'function') earnBadge('badge_mass_opener');
        // Badge: beyond the vault (prestige case open)
        if (selectedCase.prestigeOnly && typeof earnBadge === 'function') earnBadge('badge_vault');

        if (count === 1) {
            // Single open — show full item card
            let result = openCrate(selectedCase);
            // Lucky Break: Blue drops have 15% chance to re-roll for a higher rarity
            if (typeof isShopItemUnlocked === 'function' && isShopItemUnlocked('perk_lucky_break') && result.rarity === 'Blue') {
                if (Math.random() < 0.15) {
                    const reroll = openCrate(selectedCase);
                    if ((RARITY_RANKS[reroll.rarity] || 0) > (RARITY_RANKS[result.rarity] || 0)) result = reroll;
                }
            }
            displayItem(result);
            SFX.reveal(result.rarity);
            saveItem(result);
            updateStats(result);
            addLbCase(result);
            if (typeof updateBestEver === 'function') updateBestEver(result);
            const prevLevel = getLevel();
            addXP(Math.round((XP_PER_RARITY[result.rarity] || 10) * (cb.xpMult || 1)));
            if (getLevel() > prevLevel) SFX.levelUp();
            checkCaseAchievements(result);
            if (result.rarity === 'GOLD') pushGoldAlert(result.fullItem, selectedCase.name);
            rollingText.textContent = getRarityMessage(result.rarity);

        } else {
            // Multi open — roll all, save all, show full grid
            const results = Array.from({ length: count }, () => {
                let r = openCrate(selectedCase);
                if (typeof isShopItemUnlocked === 'function' && isShopItemUnlocked('perk_lucky_break') && r.rarity === 'Blue') {
                    if (Math.random() < 0.15) {
                        const reroll = openCrate(selectedCase);
                        if ((RARITY_RANKS[reroll.rarity] || 0) > (RARITY_RANKS[r.rarity] || 0)) r = reroll;
                    }
                }
                return r;
            });

            // Save every item to inventory and update stats
            results.forEach(r => {
                saveItem(r);
                updateStats(r);
                addLbCase(r);
                if (typeof updateBestEver === 'function') updateBestEver(r);
                const prevLv = getLevel();
                addXP(Math.round((XP_PER_RARITY[r.rarity] || 10) * (cb.xpMult || 1)));
                if (getLevel() > prevLv) SFX.levelUp();
                checkCaseAchievements(r);
                if (r.rarity === 'GOLD') pushGoldAlert(r.fullItem, selectedCase.name);
            });

            // Show rarity message and sound for the best roll
            const best = results.reduce((b, r) =>
                (RARITY_RANKS[r.rarity] || 0) > (RARITY_RANKS[b.rarity] || 0) ? r : b
            , results[0]);
            rollingText.textContent = getRarityMessage(best.rarity);
            SFX.reveal(best.rarity);

            // Build the full grid — all items, 5 per row
            multiResults.innerHTML = results.map(r => {
                const rarityColor = (RARITY_ODDS[r.rarity] || {}).colour || '#c6d4df';
                return `
                    <div class="multi-result-card">
                        <div class="multi-result-header ${RARITY_CLASSES[r.rarity]}">${r.fullName}</div>
                        <div class="multi-result-body">
                            <div>${r.wear}</div>
                            <div>Float: ${r.floatVal}</div>
                            <div class="result-value" style="color:${rarityColor}">${r.coins.toLocaleString()} coins</div>
                        </div>
                    </div>
                `;
            }).join('');
            multiResults.classList.add('visible');
        }
    } finally {
        setButtons(false);
    }
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

function getFavourites() {
    return JSON.parse(localStorage.getItem('csgo_favourites') || '[]');
}

function toggleFavourite(itemId) {
    if (!itemId) return;
    const favs = getFavourites();
    const idx  = favs.indexOf(itemId);
    if (idx === -1) favs.push(itemId);
    else favs.splice(idx, 1);
    localStorage.setItem('csgo_favourites', JSON.stringify(favs));
    renderInventory();
    schedulePush();
}

function saveItem(result) {
    const inv = getInventory();
    inv.push({
        id:       Date.now() + '-' + Math.floor(Math.random() * 10000),
        fullItem: result.fullItem, rarity: result.rarity, tier: result.tier,
        type:     result.type,     float:  result.floatVal, seed: result.seed,
        price:    result.price,    coins:  result.coins
    });
    localStorage.setItem('csgo_inventory', JSON.stringify(inv));
    if (document.getElementById('page-inventory') && !document.getElementById('page-inventory').classList.contains('hidden')) renderInventory();
}

// Returns combined sell multiplier from prestige shop perks
function getSellMultiplier() {
    let mult = 1;
    if (typeof isShopItemUnlocked === 'function') {
        if (isShopItemUnlocked('perk_coin_surge'))    mult += 0.10;
        if (isShopItemUnlocked('perk_fortunes_edge')) mult += 0.20;
    }
    return mult;
}

function sellItem(index) {
    const inv  = getInventory();
    const favs = getFavourites();
    const item = inv[index];
    if (!item) return;
    if (item.id && favs.includes(item.id)) {
        alert('This item is favourited. Unfavourite it first to sell it.');
        return;
    }
    const mult  = getSellMultiplier();
    const coins = Math.round((item.coins || 0) * mult);
    const label = mult > 1 ? ` (x${mult.toFixed(2)} perk bonus)` : '';
    if (!confirm(`Sell ${item.fullItem} for ${coins.toLocaleString()} coins?${label}`)) return;
    inv.splice(index, 1);
    localStorage.setItem('csgo_inventory', JSON.stringify(inv));
    addCoins(coins);
    SFX.sell();
    renderInventory();
}

function sellAll() {
    const inv  = getInventory();
    const favs = getFavourites();
    if (inv.length === 0) return;

    const toSell   = inv.filter(item => !item.id || !favs.includes(item.id));
    const favCount = inv.length - toSell.length;

    if (toSell.length === 0) {
        alert('All items are favourited. Unfavourite some items to sell them.');
        return;
    }

    const mult  = getSellMultiplier();
    const total = toSell.reduce((sum, item) => sum + Math.round((item.coins || 0) * mult), 0);
    const bonusNote = mult > 1 ? ` (includes x${mult.toFixed(2)} perk bonus)` : '';
    const msg   = favCount > 0
        ? `Sell ${toSell.length} items for ${total.toLocaleString()} coins?${bonusNote} (${favCount} favourited item${favCount > 1 ? 's' : ''} will be kept)`
        : `Sell all ${inv.length} items for ${total.toLocaleString()} coins?${bonusNote}`;

    if (!confirm(msg)) return;

    const kept = inv.filter(item => item.id && favs.includes(item.id));
    localStorage.setItem('csgo_inventory', JSON.stringify(kept));
    addCoins(total);
    if (typeof earnBadge === 'function') earnBadge('badge_clear_out');
    if (total > 0) SFX.sell();
    renderInventory();
}

// -------------------------------------------------------
// Inventory Sort / Filter / Pagination State
// -------------------------------------------------------

let invSortBy       = 'newest';
let invFilterRarity = 'all';
let invPage         = 0;
const INV_PER_PAGE  = 9;

function invChangePage(dir) {
    invPage += dir;
    renderInventory();
}

function ensureInvControls() {
    if (document.getElementById('invControls')) return;

    const controls = document.createElement('div');
    controls.id        = 'invControls';
    controls.className = 'inv-controls';
    controls.innerHTML = `
        <select id="invSort" class="inv-control-select" title="Sort">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="value-desc">Value: High → Low</option>
            <option value="value-asc">Value: Low → High</option>
            <option value="rarity-desc">Rarity: Best First</option>
            <option value="rarity-asc">Rarity: Worst First</option>
        </select>
        <select id="invFilter" class="inv-control-select" title="Filter by rarity">
            <option value="all">All Rarities</option>
            <option value="GOLD">🟡 Gold</option>
            <option value="Rare (Red)">🔴 Red</option>
            <option value="Pink">🩷 Pink</option>
            <option value="Purple">🟣 Purple</option>
            <option value="Blue">🔵 Blue</option>
        </select>
    `;

    const invList = document.getElementById('invList');
    invList.parentNode.insertBefore(controls, invList);

    document.getElementById('invSort').addEventListener('change', e => {
        invSortBy = e.target.value;
        invPage   = 0;
        renderInventory();
    });
    document.getElementById('invFilter').addEventListener('change', e => {
        invFilterRarity = e.target.value;
        invPage         = 0;
        renderInventory();
    });
}

function ensureInvPagination() {
    if (document.getElementById('invPagination')) return;
    const pag   = document.createElement('div');
    pag.id        = 'invPagination';
    pag.className = 'inv-pagination';
    const invList = document.getElementById('invList');
    invList.parentNode.insertBefore(pag, invList.nextSibling);
}

function renderInventory() {
    ensureInvControls();
    ensureInvPagination();

    const inv     = getInventory();
    const favs    = getFavourites();
    const invList = document.getElementById('invList');
    const pagEl   = document.getElementById('invPagination');

    const sortEl   = document.getElementById('invSort');
    const filterEl = document.getElementById('invFilter');
    if (sortEl)   sortEl.value   = invSortBy;
    if (filterEl) filterEl.value = invFilterRarity;

    if (inv.length === 0) {
        invList.innerHTML = '<p class="empty-msg">No items yet. Open a case first!</p>';
        if (pagEl) pagEl.innerHTML = '';
        return;
    }

    // Tag each item with its original index for sellItem()
    let items = inv.map((item, i) => ({ ...item, _origIndex: i }));

    // Filter
    if (invFilterRarity !== 'all') {
        items = items.filter(item => item.rarity === invFilterRarity);
    }

    // Sort
    switch (invSortBy) {
        case 'newest':     items.reverse(); break;
        case 'oldest':     break;
        case 'value-desc': items.sort((a, b) => (b.coins || 0) - (a.coins || 0)); break;
        case 'value-asc':  items.sort((a, b) => (a.coins || 0) - (b.coins || 0)); break;
        case 'rarity-desc': items.sort((a, b) => (RARITY_RANKS[b.rarity] || 0) - (RARITY_RANKS[a.rarity] || 0)); break;
        case 'rarity-asc':  items.sort((a, b) => (RARITY_RANKS[a.rarity] || 0) - (RARITY_RANKS[b.rarity] || 0)); break;
    }

    if (items.length === 0) {
        invList.innerHTML = '<p class="empty-msg">No items match this filter.</p>';
        if (pagEl) pagEl.innerHTML = '';
        return;
    }

    // Pagination
    const totalPages = Math.ceil(items.length / INV_PER_PAGE);
    if (invPage >= totalPages) invPage = totalPages - 1;
    if (invPage < 0)           invPage = 0;

    const pageItems = items.slice(invPage * INV_PER_PAGE, (invPage + 1) * INV_PER_PAGE);

    invList.innerHTML = pageItems.map(item => {
        const isFav       = item.id && favs.includes(item.id);
        const rarityColor = (RARITY_ODDS[item.rarity] || {}).colour || '#c6d4df';
        const sellMult    = getSellMultiplier();
        const sellCoins   = Math.round((item.coins || 0) * sellMult);
        const bonusMark   = sellMult > 1 ? ' ✦' : '';
        return `
            <div class="inventory-item ${isFav ? 'is-favourite' : ''}">
                <button class="fav-btn ${isFav ? 'faved' : ''}"
                        onclick="toggleFavourite('${item.id || ''}')"
                        title="${isFav ? 'Unfavourite' : 'Favourite'}">
                    ${isFav ? '⭐' : '☆'}
                </button>
                <div class="inventory-item-info">
                    <div class="inventory-item-name" style="color:${rarityColor}">${item.fullItem}</div>
                    <div class="inventory-item-detail">${item.tier} · ${item.type} · Float: ${item.float} · ~$${item.price}</div>
                </div>
                <button class="sell-btn" onclick="sellItem(${item._origIndex})">
                    Sell<br>${sellCoins.toLocaleString()} coins${bonusMark}
                </button>
            </div>
        `;
    }).join('');

    // Pagination controls
    if (pagEl) {
        if (totalPages <= 1) {
            pagEl.innerHTML = '';
        } else {
            pagEl.innerHTML = `
                <button class="inv-page-btn" onclick="invChangePage(-1)" ${invPage === 0 ? 'disabled' : ''}>← Prev</button>
                <span class="inv-page-info">Page ${invPage + 1} of ${totalPages} · ${items.length} items</span>
                <button class="inv-page-btn" onclick="invChangePage(1)" ${invPage >= totalPages - 1 ? 'disabled' : ''}>Next →</button>
            `;
        }
    }
}

// -------------------------------------------------------
// All-time Stats (persistent)
// -------------------------------------------------------

function getAllTimeStats() {
    return JSON.parse(localStorage.getItem('csgo_alltime_stats') || JSON.stringify({
        total: 0, gold: 0, red: 0, pink: 0, purple: 0, blue: 0,
        bestItem: 'None yet', bestRank: 0, coinsSpent: 0
    }));
}

function saveAllTimeStats(s) {
    localStorage.setItem('csgo_alltime_stats', JSON.stringify(s));
}

function updateStats(result) {
    const s   = getAllTimeStats();
    s.total++;
    s.coinsSpent += selectedCase ? selectedCase.cost : 0;
    const key = { 'GOLD': 'gold', 'Rare (Red)': 'red', 'Pink': 'pink', 'Purple': 'purple', 'Blue': 'blue' }[result.rarity];
    if (key) s[key]++;
    const rank = RARITY_RANKS[result.rarity];
    if (rank > s.bestRank) { s.bestRank = rank; s.bestItem = result.fullItem; }
    saveAllTimeStats(s);
}

function renderStats() {
    const s = getAllTimeStats();
    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-box"><div class="stat-label">Total Opened</div><div class="stat-value">${s.total.toLocaleString()}</div></div>
        <div class="stat-box"><div class="stat-label">Coins Spent</div><div class="stat-value">${s.coinsSpent.toLocaleString()}</div></div>
        <div class="stat-box"><div class="stat-label">🟡 Gold</div><div class="stat-value">${s.gold}</div></div>
        <div class="stat-box"><div class="stat-label">🔴 Red</div><div class="stat-value">${s.red}</div></div>
        <div class="stat-box"><div class="stat-label">🩷 Pink</div><div class="stat-value">${s.pink}</div></div>
        <div class="stat-box"><div class="stat-label">🟣 Purple</div><div class="stat-value">${s.purple}</div></div>
        <div class="stat-box"><div class="stat-label">🔵 Blue</div><div class="stat-value">${s.blue}</div></div>
        <div class="stat-box"><div class="stat-label">Balance</div><div class="stat-value">${getCoins().toLocaleString()}</div></div>
    `;

}

// -------------------------------------------------------
// Page Navigation (Sidebar)
// -------------------------------------------------------

const PAGES = [
    'page-cases', 'page-inventory', 'page-fishing',
    'page-achievements', 'page-weekly', 'page-howtoplay',
    'page-leaderboard', 'page-upgrades', 'page-feedback', 'page-changelog'
];

function switchPage(pageId) {
    PAGES.forEach(id => {
        document.getElementById(id)?.classList.toggle('hidden', id !== pageId);
    });
    document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId.replace('page-', ''));
    });
    if (pageId === 'page-achievements') renderAchievements();
    if (pageId === 'page-weekly')       renderWeeklyPage();
    if (pageId === 'page-inventory')    renderInventory();
    if (pageId === 'page-upgrades')     renderUpgradesPage();
    if (pageId === 'page-feedback')     renderFeedbackPage();
    if (pageId === 'page-changelog')    renderChangelogPage();
    if (pageId === 'page-fishing')      renderFishOdds();
    if (pageId === 'page-leaderboard') {
        if (typeof updateLbUsernameDisplay === 'function') updateLbUsernameDisplay();
        if (typeof renderLeaderboard      === 'function') renderLeaderboard();
    }
    closeSidebar();
}

document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
    item.addEventListener('click', () => switchPage(`page-${item.dataset.page}`));
});

// -------------------------------------------------------
// Sidebar (mobile open/close)
// -------------------------------------------------------

function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('visible');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('visible');
}

document.getElementById('hamburgerBtn').addEventListener('click', openSidebar);
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

// -------------------------------------------------------
// Account Panel
// -------------------------------------------------------

function openAccountPanel(defaultTab = 'stats') {
    document.getElementById('accountPanel').classList.add('open');
    document.getElementById('accountPanelOverlay').classList.add('visible');
    switchAccountTab(defaultTab);
    updateAcctPanelName();
}

function closeAccountPanel() {
    document.getElementById('accountPanel').classList.remove('open');
    document.getElementById('accountPanelOverlay').classList.remove('visible');
}

function switchAccountTab(tabId) {
    document.querySelectorAll('.acct-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.atab === tabId);
    });
    document.querySelectorAll('.acct-tab-content').forEach(c => {
        c.classList.toggle('active', c.id === `accountTab-${tabId}`);
    });
    if (tabId === 'stats')  renderStats();
    if (tabId === 'levels') renderLevelDetails();
    if (tabId === 'badges') renderBadgesTab();
}

function updateAcctPanelName() {
    const el = document.getElementById('acctPanelName');
    if (!el) return;
    if (typeof isGuest === 'function' && isGuest()) {
        el.textContent = 'Guest';
    } else {
        el.textContent = getUsername() || 'Account';
    }
}

function updateAccountBtn() {
    const el = document.getElementById('accountBtnName');
    if (!el) return;
    if (typeof isGuest === 'function' && isGuest()) {
        el.textContent = 'Guest';
    } else {
        const title         = (typeof getActiveTitle  === 'function') ? getActiveTitle()  : null;
        const activeBadgeId = (typeof getActiveBadge  === 'function') ? getActiveBadge()  : null;
        const badge         = activeBadgeId && typeof BADGES !== 'undefined' ? BADGES.find(b => b.id === activeBadgeId) : null;
        const badgePrefix   = badge ? `${badge.icon} ` : '';
        el.textContent = title
            ? `${badgePrefix}[${title}] ${getUsername() || 'Account'}`
            : `${badgePrefix}${getUsername() || 'Account'}`;
    }
}

function renderBadgesTab() {
    const el = document.getElementById('accountTab-badges');
    if (!el) return;

    if (typeof BADGES === 'undefined' || typeof getEarnedBadges === 'undefined') {
        el.innerHTML = '<p class="badges-empty">Loading...</p>';
        return;
    }

    const earned      = getEarnedBadges();
    const activeBadge = (typeof getActiveBadge === 'function') ? getActiveBadge() : null;

    if (earned.length === 0) {
        el.innerHTML = `<p class="badges-empty">No badges earned yet. Prestige, explore the prestige shop, reach the leaderboard top 10, and play to earn badges here.</p>`;
        return;
    }

    const categories = [
        { label: 'Prestige',    ids: ['badge_first_prestige', 'badge_prestige_5', 'badge_prestige_10'] },
        { label: 'Shop',        ids: ['badge_first_purchase', 'badge_title_collector', 'badge_power_user'] },
        { label: 'Leaderboard', ids: ['badge_top_10', 'badge_podium', 'badge_number_one'] },
        { label: 'Playstyle',   ids: ['badge_mass_opener', 'badge_clear_out', 'badge_vault'] },
        { label: 'Special',     ids: ['badge_developer', 'badge_beta_tester', 'badge_founder'] },
    ];

    let html = `<div class="badges-equipped-note">Equip a badge to show it next to your name on the leaderboard.</div>`;

    categories.forEach(cat => {
        const catEarned = cat.ids.filter(id => earned.includes(id));
        if (catEarned.length === 0) return;

        html += `<div class="badges-section-label">${cat.label}</div><div class="badges-grid">`;
        catEarned.forEach(id => {
            const badge    = BADGES.find(b => b.id === id);
            if (!badge) return;
            const isActive = activeBadge === id;
            html += `
                <div class="badge-card ${isActive ? 'badge-card-active' : ''}">
                    <span class="lb-equipped-badge" style="background:${badge.color}18;color:${badge.color};border-color:${badge.color}55;font-size:0.8rem;padding:3px 8px;">${badge.display}</span>
                    <div class="badge-card-name">${badge.name}</div>
                    <div class="badge-card-desc">${badge.desc}</div>
                    <button class="badge-equip-btn ${isActive ? 'badge-equip-active' : ''}"
                            onclick="setActiveBadge('${id}')">
                        ${isActive ? '✓ Equipped' : 'Equip'}
                    </button>
                </div>`;
        });
        html += `</div>`;
    });

    el.innerHTML = html;
}

function initAccountPanel() {
    document.getElementById('accountBtn').addEventListener('click', () => openAccountPanel());
    document.getElementById('accountPanelClose').addEventListener('click', closeAccountPanel);
    document.getElementById('accountPanelOverlay').addEventListener('click', closeAccountPanel);

    document.querySelectorAll('.acct-tab').forEach(tab => {
        tab.addEventListener('click', () => switchAccountTab(tab.dataset.atab));
    });

    // Gold alert toggle
    const goldToggle = document.getElementById('settingGoldAlerts');
    if (goldToggle) {
        goldToggle.checked = localStorage.getItem('csgo_block_gold_alerts') !== 'true';
        goldToggle.addEventListener('change', () => {
            localStorage.setItem('csgo_block_gold_alerts', goldToggle.checked ? 'false' : 'true');
        });
    }

    updateAccountBtn();
}

document.getElementById('sellAllBtn').addEventListener('click', sellAll);

// -------------------------------------------------------
// Init
// -------------------------------------------------------

updateBalanceDisplay();
updateLevelDisplay();
renderCaseGrid();
initWeekly();
initAuth();
initAccountPanel();
initFishingSkillTree();
initUpgradesPage();
initFeedbackPage();
initPrestige();
startCrossDeviceSync();