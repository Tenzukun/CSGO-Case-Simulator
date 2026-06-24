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

let instantFish = localStorage.getItem('csgo_instant_fish') === 'true';

// -------------------------------------------------------
// Dynamic odds display (reflects active fishing skills)
// -------------------------------------------------------

function renderFishOdds() {
    const el = document.getElementById('fishOddsList');
    if (!el) return;

    const bonus = (typeof getFishingBonus === 'function') ? getFishingBonus() : {};
    const mult  = getFishMultiplier() * (bonus.coinMult || 1);
    const rvm   = bonus.rareValueMult || 1;

    const skinChance    = 2  + (bonus.skinChanceBonus  || 0);
    const rareChance    = 8  + (bonus.rareChanceBonus  || 0);
    const junkChance    = Math.max(5, 15 - (bonus.rareChanceBonus || 0));
    const bigCoinChance = 25 + (bonus.bigCoinBonus     || 0);
    const smallChance   = Math.max(0, 100 - skinChance - rareChance - junkChance - bigCoinChance);

    const fmt = (min, max, m) =>
        `${Math.round(min * m)}–${Math.round(max * m)}`;

    const hasMystery = bonus.mysteryCatch;

    el.innerHTML = `
        <div class="fish-odds-row">
            <span>💰 Small coins (${fmt(15, 60, mult)})</span>
            <span>${smallChance.toFixed(0)}%</span>
        </div>
        <div class="fish-odds-row">
            <span>💰 Big coins (${fmt(60, 175, mult)})</span>
            <span>${bigCoinChance.toFixed(0)}%</span>
        </div>
        <div class="fish-odds-row">
            <span>🪣 Junk (${fmt(15, 60, mult)} coins)</span>
            <span>${junkChance.toFixed(0)}%</span>
        </div>
        ${hasMystery ? `
        <div class="fish-odds-row">
            <span>📦 Mystery Chest (${fmt(150, 600, mult)} coins)</span>
            <span>5%</span>
        </div>` : ''}
        <div class="fish-odds-row">
            <span>✨ Rare junk (${fmt(90 * rvm, 250 * rvm, mult)} coins)</span>
            <span>${(hasMystery ? rareChance - 5 : rareChance).toFixed(0)}%</span>
        </div>
        <div class="fish-odds-row highlight">
            <span>🔫 Random skin</span>
            <span>${skinChance.toFixed(0)}%</span>
        </div>
    `;
}

// -------------------------------------------------------
// Roll a single catch (skill bonuses applied)
// -------------------------------------------------------

function rollFishCatch() {
    const roll       = Math.random() * 100;
    const levelMult  = getFishMultiplier();
    const bonus      = (typeof getFishingBonus === 'function') ? getFishingBonus() : {};

    const coinMult      = (bonus.coinMult      || 1) * levelMult;
    const rareValueMult = bonus.rareValueMult  || 1;
    const bigCoinBonus  = bonus.bigCoinBonus   || 0;
    const rareBonus     = bonus.rareChanceBonus || 0;
    const skinBonus     = bonus.skinChanceBonus || 0;

    // Compute dynamic thresholds
    const skinChance     = 2 + skinBonus;
    const rareChance     = 8 + rareBonus;
    const junkChance     = Math.max(5, 15 - rareBonus);
    const bigCoinChance  = 25 + bigCoinBonus;
    // small coins fill the rest

    const t1 = skinChance;
    const t2 = t1 + rareChance;
    const t3 = t2 + junkChance;
    const t4 = t3 + bigCoinChance;

    // Mystery Chest (mastery_3) — replaces 5% of rare junk threshold
    if (bonus.mysteryCatch && roll >= t1 && roll < t1 + 5) {
        const coins = Math.round((Math.floor(Math.random() * 451) + 150) * coinMult);
        return { type: 'rare', name: '📦 Mystery Chest', value: coins, cssClass: 'catch-rare', xpType: 'rare' };
    }

    if (roll < t1) {
        // Skin drop
        const casePool  = CASES[Math.floor(Math.random() * CASES.length)];
        const rarity    = rollRarity(casePool);
        const pool      = casePool.skins[rarity] || casePool.skins['Blue'];
        const skin      = pool[Math.floor(Math.random() * pool.length)];
        const wear      = rollWear();
        const prefix    = rollPrefix();
        const floatVal  = rollFloat(wear);
        const seed      = Math.floor(Math.random() * 1000) + 1;
        const basePrice = casePool.prices[skin] || 1;
        const price     = calcPrice(basePrice, wear, prefix);
        const coins     = Math.round(parseFloat(price) * COINS_PER_DOLLAR * coinMult);
        const type      = getWeaponType(skin);
        const tier      = RARITY_TIERS[rarity];
        const fullName  = prefix ? `${prefix} ${skin}` : skin;
        const fullItem  = `${fullName} (${wear})`;

        return {
            type: 'skin', name: `🔫 ${fullItem}`, value: coins,
            cssClass: 'catch-skin', xpType: 'skin',
            skinItem: { fullItem, rarity, tier, type, float: floatVal, seed, price, coins }
        };

    } else if (roll < t2) {
        // Rare junk
        const item  = RARE_JUNK_ITEMS[Math.floor(Math.random() * RARE_JUNK_ITEMS.length)];
        const coins = Math.round((Math.floor(Math.random() * 161) + 90) * coinMult * rareValueMult);
        return { type: 'rare', name: `✨ ${item}`, value: coins, cssClass: 'catch-rare', xpType: 'rare' };

    } else if (roll < t3) {
        // Junk
        const item  = JUNK_ITEMS[Math.floor(Math.random() * JUNK_ITEMS.length)];
        const coins = Math.round((Math.floor(Math.random() * 46) + 15) * coinMult);
        return { type: 'junk', name: `🪣 ${item}`, value: coins, cssClass: 'catch-junk', xpType: 'junk' };

    } else if (roll < t4) {
        // Big coins
        const coins = Math.round((Math.floor(Math.random() * 116) + 60) * coinMult);
        return { type: 'coins', name: '💰 Nice haul!', value: coins, cssClass: 'catch-coins', xpType: 'coins-big' };

    } else {
        // Small coins
        const coins = Math.round((Math.floor(Math.random() * 46) + 15) * coinMult);
        return { type: 'coins', name: '💰 Found some coins', value: coins, cssClass: 'catch-coins', xpType: 'coins' };
    }
}

// Simple bonus catch for Double Dip (no recursion risk)
function rollBonusCatch() {
    const mult  = getFishMultiplier() * ((typeof getFishingBonus === 'function' ? getFishingBonus().coinMult : null) || 1);
    const roll  = Math.random();
    if (roll < 0.55) {
        const coins = Math.round((Math.random() * 46 + 15) * mult);
        return { type: 'coins', name: '🎲 Bonus: coins', value: coins, cssClass: 'catch-coins', xpType: 'coins' };
    } else if (roll < 0.80) {
        const coins = Math.round((Math.random() * 116 + 60) * mult);
        return { type: 'coins', name: '🎲 Bonus: big haul', value: coins, cssClass: 'catch-coins', xpType: 'coins-big' };
    } else {
        const item  = JUNK_ITEMS[Math.floor(Math.random() * JUNK_ITEMS.length)];
        const coins = Math.round((Math.random() * 46 + 15) * mult);
        return { type: 'junk', name: `🎲 Bonus: ${item}`, value: coins, cssClass: 'catch-junk', xpType: 'junk' };
    }
}

// -------------------------------------------------------
// Fish log
// -------------------------------------------------------

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
// Process a catch result (add coins, XP, inventory)
// -------------------------------------------------------

function processCatch(result) {
    const bonus  = (typeof getFishingBonus === 'function') ? getFishingBonus() : {};
    const xpAmt  = Math.round(getFishXP(result.xpType) * (bonus.xpMult || 1));

    addCoins(result.value);
    addLbCoins(result.value);
    addXP(xpAmt);
    checkFishAchievements(result);

    if (result.type === 'skin' && result.skinItem) {
        const inv = getInventory();
        inv.push({
            id: Date.now() + '-' + Math.floor(Math.random() * 10000),
            ...result.skinItem
        });
        localStorage.setItem('csgo_inventory', JSON.stringify(inv));
        const invPage = document.getElementById('page-inventory');
        if (invPage && !invPage.classList.contains('hidden')) renderInventory();
    }

    fishLog.push(result);
    if (fishLog.length > 25) fishLog.shift();
}

// -------------------------------------------------------
// Event listeners
// -------------------------------------------------------

document.getElementById('fishClearBtn').addEventListener('click', () => {
    fishLog.length = 0;
    renderFishLog();
});

// Instant Fishing toggle
const instantFishToggle = document.getElementById('instantFishToggle');
if (instantFishToggle) {
    instantFishToggle.checked = instantFish;
    instantFishToggle.addEventListener('change', e => {
        instantFish = e.target.checked;
        localStorage.setItem('csgo_instant_fish', instantFish);
    });
}

const castBtn    = document.getElementById('castBtn');
const fishStatus = document.getElementById('fishStatus');

castBtn.addEventListener('click', () => {
    castBtn.disabled       = true;
    fishStatus.textContent = '🎣 Line cast...';
    SFX.cast();

    const waitMs = instantFish ? 0 : Math.floor(Math.random() * 1001) + 500;

    setTimeout(() => {
        fishStatus.textContent = '⚡ Something bit!';
        if (!instantFish) SFX.bite();

        setTimeout(() => {
            const bonus  = (typeof getFishingBonus === 'function') ? getFishingBonus() : {};
            const result = rollFishCatch();
            processCatch(result);
            SFX.catchFish(result.type);

            // Double Dip (mastery_2 / mastery_4)
            if (bonus.doubleDip && Math.random() < bonus.doubleDip) {
                const extra = rollBonusCatch();
                processCatch(extra);
                SFX.coin();
                renderFishLog();
                fishStatus.textContent = `${result.name}  +${result.value.toLocaleString()} coins  🎲 +${extra.value.toLocaleString()} bonus!`;
            } else {
                renderFishLog();
                fishStatus.textContent = `${result.name}  +${result.value.toLocaleString()} coins!`;
            }

            // 1.5s cooldown before next cast
            setTimeout(() => { castBtn.disabled = false; }, 1500);
        }, instantFish ? 0 : 600);
    }, waitMs);
});

// Render odds on init
renderFishOdds();
