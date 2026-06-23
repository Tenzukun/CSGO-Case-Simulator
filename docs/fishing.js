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

function rollFishCatch() {
    const roll       = Math.random() * 100;
    const multiplier = getFishMultiplier();

    if (roll < 50) {
        const coins = Math.round((Math.floor(Math.random() * 201) + 100) * multiplier);
        return { type: 'coins', name: '💰 Found some coins', value: coins, cssClass: 'catch-coins', xpType: 'coins' };
    } else if (roll < 75) {
        const coins = Math.round((Math.floor(Math.random() * 351) + 350) * multiplier);
        return { type: 'coins', name: '💰 Nice haul!', value: coins, cssClass: 'catch-coins', xpType: 'coins-big' };
    } else if (roll < 90) {
        const item  = JUNK_ITEMS[Math.floor(Math.random() * JUNK_ITEMS.length)];
        const coins = Math.round((Math.floor(Math.random() * 151) + 100) * multiplier);
        return { type: 'junk', name: `🪣 ${item}`, value: coins, cssClass: 'catch-junk', xpType: 'junk' };
    } else if (roll < 98) {
        const item  = RARE_JUNK_ITEMS[Math.floor(Math.random() * RARE_JUNK_ITEMS.length)];
        const coins = Math.round((Math.floor(Math.random() * 401) + 400) * multiplier);
        return { type: 'rare', name: `✨ ${item}`, value: coins, cssClass: 'catch-rare', xpType: 'rare' };
    } else {
        const casePool  = CASES[Math.floor(Math.random() * CASES.length)];
        const rarity    = rollRarity();
        const pool      = casePool.skins[rarity] || casePool.skins['Blue'];
        const skin      = pool[Math.floor(Math.random() * pool.length)];
        const wear      = rollWear();
        const prefix    = rollPrefix();
        const floatVal  = rollFloat(wear);
        const seed      = Math.floor(Math.random() * 1000) + 1;
        const basePrice = casePool.prices[skin] || 1;
        const price     = calcPrice(basePrice, wear, prefix);
        const coins     = Math.round(parseFloat(price) * COINS_PER_DOLLAR * multiplier);
        const type      = getWeaponType(skin);
        const tier      = RARITY_TIERS[rarity];
        const fullName  = prefix ? `${prefix} ${skin}` : skin;
        const fullItem  = `${fullName} (${wear})`;

        return {
            type: 'skin', name: `🔫 ${fullItem}`, value: coins, cssClass: 'catch-skin', xpType: 'skin',
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

// -------------------------------------------------------
// Fishing Event Listeners
// -------------------------------------------------------

document.getElementById('fishClearBtn').addEventListener('click', () => {
    fishLog.length = 0;
    renderFishLog();
});

const castBtn    = document.getElementById('castBtn');
const fishStatus = document.getElementById('fishStatus');

castBtn.addEventListener('click', () => {
    castBtn.disabled       = true;
    fishStatus.textContent = '🎣 Line cast...';

    const waitMs = Math.floor(Math.random() * 1001) + 500;

    setTimeout(() => {
        fishStatus.textContent = '⚡ Something bit!';
        setTimeout(() => {
            const result = rollFishCatch();
            fishLog.push(result);
            if (fishLog.length > 20) fishLog.shift();

            addCoins(result.value);
            addLbCoins(result.value);
            addXP(getFishXP(result.xpType)); // level-scaled XP
            checkFishAchievements(result);

            if (result.type === 'skin' && result.skinItem) {
                const inv = getInventory();
                inv.push({
                    id:       Date.now() + '-' + Math.floor(Math.random() * 10000),
                    ...result.skinItem
                });
                localStorage.setItem('csgo_inventory', JSON.stringify(inv));
                if (document.getElementById('invPanel').classList.contains('visible')) {
                    renderInventory();
                }
            }

            renderFishLog();
            fishStatus.textContent = `${result.name}  +${result.value.toLocaleString()} coins!`;
            castBtn.disabled = false;
        }, 600);
    }, waitMs);
});