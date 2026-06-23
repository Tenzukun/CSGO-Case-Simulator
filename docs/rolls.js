// -------------------------------------------------------
// Roll Functions
// -------------------------------------------------------

function rand()    { return Math.random() * 100; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Rarity odds scale with case cost.
// Cheapest case (200 coins) = base odds.
// Most expensive case (75,000 coins) = ~3x better gold odds.
// Scaling is logarithmic so mid-tier cases feel meaningfully better
// without premium cases feeling broken.
//
// Odds at base (luck = 0) → max (luck = 1):
//   Gold:   0.26% → 0.75%
//   Red:    0.64% → 1.50%
//   Pink:   3.20% → 6.00%
//   Purple: 15.98% → 22.00%
//   Blue:   remainder

function rollRarity(caseData) {
    const cost = caseData ? caseData.cost : 200;

    // luck: 0 at 200 coins, 1 at 75,000 coins (log scale)
    const luck = Math.log(cost / 200) / Math.log(375);

    const gold   = 0.26  + luck * 0.49;
    const red    = 0.64  + luck * 0.86;
    const pink   = 3.20  + luck * 2.80;
    const purple = 15.98 + luck * 6.02;

    const r = rand();
    if (r < gold)                       return 'GOLD';
    if (r < gold + red)                 return 'Rare (Red)';
    if (r < gold + red + pink)          return 'Pink';
    if (r < gold + red + pink + purple) return 'Purple';
    return 'Blue';
}

// Returns the actual displayed odds for a given case (matches rollRarity)
function getCaseOdds(caseData) {
    const cost = caseData ? caseData.cost : 200;
    const luck = Math.log(cost / 200) / Math.log(375);

    const gold   = 0.26  + luck * 0.49;
    const red    = 0.64  + luck * 0.86;
    const pink   = 3.20  + luck * 2.80;
    const purple = 15.98 + luck * 6.02;
    const blue   = 100 - gold - red - pink - purple;

    return {
        'GOLD':       gold.toFixed(2)   + '%',
        'Rare (Red)': red.toFixed(2)    + '%',
        'Pink':       pink.toFixed(2)   + '%',
        'Purple':     purple.toFixed(2) + '%',
        'Blue':       blue.toFixed(2)   + '%'
    };
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

function calcPrice(basePrice, wear, prefix) {
    const wearMult = {
        'Factory New': 1.50, 'Minimal Wear': 1.20, 'Field-Tested': 1.00,
        'Well-Worn': 0.70, 'Battle-Scarred': 0.50
    }[wear] || 1;
    const prefixMult = prefix === 'StatTrak™' ? 1.5 : prefix === 'Souvenir' ? 1.3 : 1.0;
    return (basePrice * wearMult * prefixMult).toFixed(2);
}

function getWeaponType(skin) {
    const clean  = skin.replace('★ ', '');
    const weapon = clean.includes(' | ') ? clean.split(' | ')[0] : clean;
    for (const [type, weapons] of Object.entries(WEAPON_TYPES)) {
        if (weapons.includes(weapon)) return type;
    }
    return 'Unknown';
}

function openCrate(caseData) {
    const rarity    = rollRarity(caseData);
    const pool      = caseData.skins[rarity];
    const skin      = pick(pool);
    const wear      = rollWear();
    const prefix    = rollPrefix();
    const floatVal  = rollFloat(wear);
    const seed      = Math.floor(Math.random() * 1000) + 1;
    const basePrice = caseData.prices[skin] || 1;
    const price     = calcPrice(basePrice, wear, prefix);
    const type      = getWeaponType(skin);
    const tier      = RARITY_TIERS[rarity];
    const fullName  = prefix ? `${prefix} ${skin}` : skin;
    const fullItem  = `${fullName} (${wear})`;
    const coins     = Math.round(parseFloat(price) * COINS_PER_DOLLAR);
    return { rarity, skin, wear, prefix, floatVal, seed, price, type, tier, fullName, fullItem, coins };
}