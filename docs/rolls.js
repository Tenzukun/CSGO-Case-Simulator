// -------------------------------------------------------
// Roll Functions
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
    const rarity    = rollRarity();
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