const skins = {
    "GOLD": [
        "★ Karambit | Doppler",
        "★ Butterfly Knife | Fade",
        "★ M9 Bayonet | Marble Fade",
        "★ Sport Gloves | Pandora's Box"
    ],
    "Rare (Red)": [
        "AWP | Dragon Lore",
        "AK-47 | Wild Lotus",
        "M4A4 | Howl",
        "Desert Eagle | Blaze"
    ],
    "Pink": [
        "AK-47 | Vulcan",
        "USP-S | Kill Confirmed",
        "AWP | Hyper Beast",
        "M4A1-S | Hyper Beast"
    ],
    "Purple": [
        "AK-47 | Redline",
        "AWP | Asiimov",
        "Glock-18 | Water Elemental",
        "P90 | Asiimov"
    ],
    "Blue": [
        "MP9 | Hot Rod",
        "P250 | Sand Dune",
        "Nova | Predator",
        "MAG-7 | Sonar"
    ]
};

const basePrices = {
    "★ Karambit | Doppler":           500,
    "★ Butterfly Knife | Fade":       700,
    "★ M9 Bayonet | Marble Fade":     400,
    "★ Sport Gloves | Pandora's Box": 600,
    "AWP | Dragon Lore":              1500,
    "AK-47 | Wild Lotus":             800,
    "M4A4 | Howl":                    2000,
    "Desert Eagle | Blaze":           200,
    "AK-47 | Vulcan":                 80,
    "USP-S | Kill Confirmed":         40,
    "AWP | Hyper Beast":              60,
    "M4A1-S | Hyper Beast":           30,
    "AK-47 | Redline":                10,
    "AWP | Asiimov":                  15,
    "Glock-18 | Water Elemental":     5,
    "P90 | Asiimov":                  8,
    "MP9 | Hot Rod":                  3,
    "P250 | Sand Dune":               0.50,
    "Nova | Predator":                1,
    "MAG-7 | Sonar":                  1.50
};

function rollRarity() {
    const roll = Math.random() * 100;
    if (roll < 0.26)       return "GOLD";
    else if (roll < 0.90)  return "Rare (Red)";
    else if (roll < 4.10)  return "Pink";
    else if (roll < 20.08) return "Purple";
    else                   return "Blue";
}

function rollSkin(rarity) {
    const pool = skins[rarity];
    return pool[Math.floor(Math.random() * pool.length)];
}

function rollWear() {
    const roll = Math.random() * 100;
    if (roll < 3)       return "Factory New";
    else if (roll < 18) return "Minimal Wear";
    else if (roll < 58) return "Field-Tested";
    else if (roll < 76) return "Well-Worn";
    else                return "Battle-Scarred";
}

function rollPrefix() {
    const roll = Math.random() * 100;
    if (roll < 10)      return "StatTrak™";
    else if (roll < 12) return "Souvenir";
    else                return "";
}

function rollFloat(wear) {
    const ranges = {
        "Factory New":  [0.000, 0.070],
        "Minimal Wear": [0.070, 0.150],
        "Field-Tested": [0.150, 0.380],
        "Well-Worn":    [0.380, 0.450],
        "Battle-Scarred":[0.450, 1.000]
    };
    const [min, max] = ranges[wear];
    return (min + Math.random() * (max - min)).toFixed(4);
}

function getPrice(skin, wear, prefix) {
    const base = basePrices[skin] || 1;
    const wearMult = {
        "Factory New":   1.50,
        "Minimal Wear":  1.20,
        "Field-Tested":  1.00,
        "Well-Worn":     0.70,
        "Battle-Scarred":0.50
    }[wear] || 1;
    const prefixMult = prefix === "StatTrak™" ? 1.5
                     : prefix === "Souvenir"  ? 1.3
                     : 1.0;
    return (base * wearMult * prefixMult).toFixed(2);
}

function getRarityTier(rarity) {
    const tiers = {
        "GOLD":       "Rare Special Item",
        "Rare (Red)": "Covert",
        "Pink":       "Classified",
        "Purple":     "Restricted",
        "Blue":       "Mil-Spec Grade"
    };
    return tiers[rarity];
}

function getRarityColour(rarity) {
    const colours = {
        "GOLD":       0xFFD700,
        "Rare (Red)": 0xFF4444,
        "Pink":       0xFF69B4,
        "Purple":     0x9B59B6,
        "Blue":       0x3498DB
    };
    return colours[rarity];
}

function getRarityRank(rarity) {
    const ranks = {
        "GOLD": 5, "Rare (Red)": 4, "Pink": 3, "Purple": 2, "Blue": 1
    };
    return ranks[rarity] || 0;
}

function getWeaponType(skin) {
    const cleanSkin = skin.replace("★ ", "");
    const weapon = cleanSkin.includes(" | ") ? cleanSkin.split(" | ")[0] : cleanSkin;

    const types = {
        Rifle:      ["AK-47", "M4A4", "M4A1-S", "AWP", "SG 553", "AUG", "FAMAS", "Galil AR"],
        Pistol:     ["Desert Eagle", "USP-S", "Glock-18", "P250", "P2000", "Tec-9", "Five-SeveN", "CZ75-Auto"],
        SMG:        ["MP9", "MP7", "MP5-SD", "P90", "PP-Bizon", "MAC-10", "UMP-45"],
        Shotgun:    ["Nova", "MAG-7", "Sawed-Off", "XM1014"],
        Knife:      ["Karambit", "Butterfly Knife", "M9 Bayonet", "Flip Knife", "Gut Knife"],
        Gloves:     ["Sport Gloves", "Specialist Gloves", "Moto Gloves", "Hand Wraps"]
    };

    for (const [type, weapons] of Object.entries(types)) {
        if (weapons.includes(weapon)) return type;
    }
    return "Unknown";
}

function openCrate() {
    const rarity   = rollRarity();
    const skin     = rollSkin(rarity);
    const wear     = rollWear();
    const prefix   = rollPrefix();
    const floatVal = rollFloat(wear);
    const seed     = Math.floor(Math.random() * 1000) + 1;
    const price    = getPrice(skin, wear, prefix);
    const tier     = getRarityTier(rarity);
    const colour   = getRarityColour(rarity);
    const type     = getWeaponType(skin);

    const fullName = prefix ? `${prefix} ${skin}` : skin;
    const fullItem = `${fullName} (${wear})`;

    return { rarity, skin, wear, prefix, floatVal, seed, price, tier, colour, type, fullName, fullItem };
}

module.exports = { openCrate, getRarityRank };