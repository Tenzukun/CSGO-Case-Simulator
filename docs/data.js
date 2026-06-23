// -------------------------------------------------------
// Case Definitions
// unlockLevel: minimum player level required to open
// -------------------------------------------------------

const CASES = [
    {
        id: 'starter', name: 'Starter Case', icon: '📦', cost: 200,
        unlockLevel: 1,
        desc: 'A basic case to get you started.',
        skins: {
            'GOLD':       ['★ Flip Knife | Fade', '★ Gut Knife | Doppler'],
            'Rare (Red)': ['AK-47 | Neon Rider', 'M4A1-S | Cyrex'],
            'Pink':       ['USP-S | Caiman', 'Glock-18 | Moonrise'],
            'Purple':     ['P250 | Undertow', 'MP7 | Skulls'],
            'Blue':       ['Nova | Wood Fired', 'P2000 | Handgun', 'Tec-9 | Isaac']
        },
        prices: {
            '★ Flip Knife | Fade': 150,  '★ Gut Knife | Doppler': 120,
            'AK-47 | Neon Rider': 25,    'M4A1-S | Cyrex': 20,
            'USP-S | Caiman': 10,        'Glock-18 | Moonrise': 8,
            'P250 | Undertow': 5,        'MP7 | Skulls': 4,
            'Nova | Wood Fired': 1.50,   'P2000 | Handgun': 1.20,
            'Tec-9 | Isaac': 1.50
        }
    },
    {
        id: 'chroma', name: 'Chroma Case', icon: '🟣', cost: 500,
        unlockLevel: 1,
        desc: 'Mid-tier skins with vibrant finishes.',
        skins: {
            'GOLD':       ['★ Karambit | Doppler', '★ M9 Bayonet | Marble Fade'],
            'Rare (Red)': ['AWP | Dragon Lore', 'M4A4 | Howl'],
            'Pink':       ['AK-47 | Vulcan', 'AWP | Hyper Beast'],
            'Purple':     ['AK-47 | Redline', 'AWP | Asiimov'],
            'Blue':       ['MP9 | Hot Rod', 'P250 | Sand Dune', 'Nova | Predator']
        },
        prices: {
            '★ Karambit | Doppler': 500,  '★ M9 Bayonet | Marble Fade': 400,
            'AWP | Dragon Lore': 1500,    'M4A4 | Howl': 2000,
            'AK-47 | Vulcan': 80,         'AWP | Hyper Beast': 60,
            'AK-47 | Redline': 12,        'AWP | Asiimov': 15,
            'MP9 | Hot Rod': 4,           'P250 | Sand Dune': 3.50,
            'Nova | Predator': 3.50
        }
    },
    {
        id: 'clutch', name: 'Clutch Case', icon: '🔴', cost: 1000,
        unlockLevel: 1,
        desc: 'High-tier skins for serious collectors.',
        skins: {
            'GOLD':       ['★ Butterfly Knife | Fade', "★ Sport Gloves | Pandora's Box"],
            'Rare (Red)': ['AK-47 | Wild Lotus', 'Desert Eagle | Blaze'],
            'Pink':       ['USP-S | Kill Confirmed', 'M4A1-S | Hyper Beast'],
            'Purple':     ['Glock-18 | Water Elemental', 'P90 | Asiimov'],
            'Blue':       ['MAG-7 | Sonar', 'MP9 | Hot Rod', 'P250 | Sand Dune']
        },
        prices: {
            '★ Butterfly Knife | Fade': 700,      "★ Sport Gloves | Pandora's Box": 600,
            'AK-47 | Wild Lotus': 800,             'Desert Eagle | Blaze': 200,
            'USP-S | Kill Confirmed': 40,          'M4A1-S | Hyper Beast': 30,
            'Glock-18 | Water Elemental': 15,      'P90 | Asiimov': 20,
            'MAG-7 | Sonar': 7,                    'MP9 | Hot Rod': 7,
            'P250 | Sand Dune': 7
        }
    },
    {
        id: 'dragon', name: 'Dragon Case', icon: '🐉', cost: 2500,
        unlockLevel: 1,
        desc: 'Premium case with the rarest skins.',
        skins: {
            'GOLD':       ['★ Karambit | Doppler', '★ Butterfly Knife | Fade', '★ M9 Bayonet | Marble Fade', "★ Sport Gloves | Pandora's Box"],
            'Rare (Red)': ['AWP | Dragon Lore', 'AK-47 | Wild Lotus', 'M4A4 | Howl', 'Desert Eagle | Blaze'],
            'Pink':       ['AK-47 | Vulcan', 'USP-S | Kill Confirmed', 'AWP | Hyper Beast', 'M4A1-S | Hyper Beast'],
            'Purple':     ['AK-47 | Redline', 'AWP | Asiimov', 'Glock-18 | Water Elemental', 'P90 | Asiimov'],
            'Blue':       ['MP9 | Hot Rod', 'P250 | Sand Dune', 'Nova | Predator', 'MAG-7 | Sonar']
        },
        prices: {
            '★ Karambit | Doppler': 500,           '★ Butterfly Knife | Fade': 700,
            '★ M9 Bayonet | Marble Fade': 400,     "★ Sport Gloves | Pandora's Box": 600,
            'AWP | Dragon Lore': 1500,              'AK-47 | Wild Lotus': 800,
            'M4A4 | Howl': 2000,                    'Desert Eagle | Blaze': 200,
            'AK-47 | Vulcan': 80,                   'USP-S | Kill Confirmed': 40,
            'AWP | Hyper Beast': 60,                'M4A1-S | Hyper Beast': 30,
            'AK-47 | Redline': 15,                  'AWP | Asiimov': 20,
            'Glock-18 | Water Elemental': 18,       'P90 | Asiimov': 18,
            'MP9 | Hot Rod': 18,                    'P250 | Sand Dune': 15,
            'Nova | Predator': 15,                  'MAG-7 | Sonar': 18
        }
    },
    {
        id: 'spectrum', name: 'Spectrum Case', icon: '🌈', cost: 5000,
        unlockLevel: 5,
        desc: 'Vivid neon finishes. Unlocks at Level 5.',
        skins: {
            'GOLD':       ['★ Karambit | Case Hardened', '★ Flip Knife | Crimson Web'],
            'Rare (Red)': ['AK-47 | Bloodsport', 'M4A4 | Neo-Noir'],
            'Pink':       ['USP-S | Cortex', 'P250 | See Ya Later'],
            'Purple':     ['MAC-10 | Neon Rider', 'MP5-SD | Phosphor', 'FAMAS | Styx'],
            'Blue':       ['P2000 | Oceanic', 'Dual Berettas | Shred', 'MP7 | Abyssal Apparition', 'CZ75-Auto | Vendetta']
        },
        prices: {
            '★ Karambit | Case Hardened': 600,  '★ Flip Knife | Crimson Web': 350,
            'AK-47 | Bloodsport': 120,           'M4A4 | Neo-Noir': 90,
            'USP-S | Cortex': 50,                'P250 | See Ya Later': 25,
            'MAC-10 | Neon Rider': 20,           'MP5-SD | Phosphor': 18,
            'FAMAS | Styx': 16,                  'P2000 | Oceanic': 32,
            'Dual Berettas | Shred': 30,         'MP7 | Abyssal Apparition': 30,
            'CZ75-Auto | Vendetta': 30
        }
    },
    {
        id: 'recoil', name: 'Recoil Case', icon: '🎯', cost: 8500,
        unlockLevel: 10,
        desc: 'Precision skins for the sharpshooter. Unlocks at Level 10.',
        skins: {
            'GOLD':       ['★ Skeleton Knife | Fade', '★ Nomad Knife | Marble Fade'],
            'Rare (Red)': ['AK-47 | Calm Storm', 'M4A1-S | Restless'],
            'Pink':       ['AWP | Chromatic Aberration', 'Desert Eagle | Blue Ply'],
            'Purple':     ['USP-S | Ticket to Hell', 'Glock-18 | Winterized', 'MAC-10 | Sakkaku'],
            'Blue':       ['Five-SeveN | Berries And Cherries', 'CZ75-Auto | Emerald Quartz', 'MP7 | Guerrilla', 'Sawed-Off | Kiss♥Love']
        },
        prices: {
            '★ Skeleton Knife | Fade': 380,           '★ Nomad Knife | Marble Fade': 420,
            'AK-47 | Calm Storm': 220,                'M4A1-S | Restless': 180,
            'AWP | Chromatic Aberration': 55,         'Desert Eagle | Blue Ply': 45,
            'USP-S | Ticket to Hell': 28,             'Glock-18 | Winterized': 22,
            'MAC-10 | Sakkaku': 18,                   'Five-SeveN | Berries And Cherries': 52,
            'CZ75-Auto | Emerald Quartz': 55,         'MP7 | Guerrilla': 50,
            'Sawed-Off | Kiss♥Love': 48
        }
    },
    {
        id: 'prisma', name: 'Prisma Case', icon: '💎', cost: 15000,
        unlockLevel: 15,
        desc: 'Dark crystalline finishes. Unlocks at Level 15.',
        skins: {
            'GOLD':       ['★ Bayonet | Tiger Tooth', '★ Shadow Daggers | Doppler'],
            'Rare (Red)': ['AK-47 | Asiimov', 'M4A1-S | Welcome to the Jungle'],
            'Pink':       ['Glock-18 | Twilight Galaxy', 'Desert Eagle | Printstream'],
            'Purple':     ['AWP | Fever Dream', 'UMP-45 | Wild Child', 'R8 Revolver | Grip'],
            'Blue':       ['Five-SeveN | Angry Mob', 'XM1014 | XOXO', 'PP-Bizon | High Roller', 'SG 553 | Aloha']
        },
        prices: {
            '★ Bayonet | Tiger Tooth': 450,         '★ Shadow Daggers | Doppler': 200,
            'AK-47 | Asiimov': 180,                  'M4A1-S | Welcome to the Jungle': 150,
            'Glock-18 | Twilight Galaxy': 70,        'Desert Eagle | Printstream': 90,
            'AWP | Fever Dream': 25,                 'UMP-45 | Wild Child': 20,
            'R8 Revolver | Grip': 18,                'Five-SeveN | Angry Mob': 90,
            'XM1014 | XOXO': 85,                     'PP-Bizon | High Roller': 85,
            'SG 553 | Aloha': 80
        }
    },
    {
        id: 'phantom', name: 'Phantom Case', icon: '👻', cost: 22000,
        unlockLevel: 20,
        desc: 'Dark and mysterious skins. Unlocks at Level 20.',
        skins: {
            'GOLD':       ['★ Paracord Knife | Fade', '★ Stiletto Knife | Tiger Tooth'],
            'Rare (Red)': ['AK-47 | X-Ray', 'M4A1-S | Black Water'],
            'Pink':       ['AWP | Exoskeleton', 'Glock-18 | Clear Polymer'],
            'Purple':     ['USP-S | Monster Mashup', 'P90 | Vent Rush', "SSG 08 | Death's Head"],
            'Blue':       ['Tec-9 | Decimator', 'UMP-45 | Primal Saber', 'MP5-SD | Acid Wash', 'Five-SeveN | Flame Test']
        },
        prices: {
            '★ Paracord Knife | Fade': 550,          '★ Stiletto Knife | Tiger Tooth': 600,
            'AK-47 | X-Ray': 320,                    'M4A1-S | Black Water': 260,
            'AWP | Exoskeleton': 80,                 'Glock-18 | Clear Polymer': 65,
            'USP-S | Monster Mashup': 38,            'P90 | Vent Rush': 32,
            "SSG 08 | Death's Head": 28,             'Tec-9 | Decimator': 130,
            'UMP-45 | Primal Saber': 120,            'MP5-SD | Acid Wash': 125,
            'Five-SeveN | Flame Test': 115
        }
    },
    {
        id: 'glove', name: 'Glove Case', icon: '🥊', cost: 35000,
        unlockLevel: 25,
        desc: 'Premium glove drops. Unlocks at Level 25.',
        skins: {
            'GOLD':       ['★ Moto Gloves | Spearmint', '★ Hand Wraps | Cobalt Skulls', '★ Specialist Gloves | Crimson Kimono'],
            'Rare (Red)': ['AK-47 | Fire Serpent', 'AWP | Medusa'],
            'Pink':       ['M4A4 | Buzz Kill', 'USP-S | Orion'],
            'Purple':     ['P90 | Death Grip', 'Galil AR | Cerberus', 'AUG | Stymphalian'],
            'Blue':       ['Tec-9 | Snek-9', 'MAG-7 | Heat', 'MP9 | Hydra', 'Sawed-Off | Limelight']
        },
        prices: {
            '★ Moto Gloves | Spearmint': 800,        '★ Hand Wraps | Cobalt Skulls': 700,
            '★ Specialist Gloves | Crimson Kimono': 650,
            'AK-47 | Fire Serpent': 900,             'AWP | Medusa': 500,
            'M4A4 | Buzz Kill': 60,                  'USP-S | Orion': 80,
            'P90 | Death Grip': 30,                  'Galil AR | Cerberus': 25,
            'AUG | Stymphalian': 22,                 'Tec-9 | Snek-9': 220,
            'MAG-7 | Heat': 210,                     'MP9 | Hydra': 210,
            'Sawed-Off | Limelight': 200
        }
    },
    {
        id: 'revolution', name: 'Revolution Case', icon: '⚡', cost: 50000,
        unlockLevel: 32,
        desc: 'High-end revolution-era skins. Unlocks at Level 32.',
        skins: {
            'GOLD':       ['★ Talon Knife | Doppler', '★ Ursus Knife | Fade'],
            'Rare (Red)': ['AK-47 | Head Shot', 'M4A4 | Etch Lord'],
            'Pink':       ['AWP | Duality', 'Glock-18 | Umbral Rabbit'],
            'Purple':     ['Desert Eagle | Hard Water', 'FAMAS | Meow 36', 'SSG 08 | Blood in the Water'],
            'Blue':       ['AUG | Amber Slipstream', 'MP9 | Featherweight', 'Negev | Ultralight', 'MAC-10 | Monkeyflage']
        },
        prices: {
            '★ Talon Knife | Doppler': 850,          '★ Ursus Knife | Fade': 750,
            'AK-47 | Head Shot': 500,                'M4A4 | Etch Lord': 420,
            'AWP | Duality': 120,                    'Glock-18 | Umbral Rabbit': 90,
            'Desert Eagle | Hard Water': 55,         'FAMAS | Meow 36': 45,
            'SSG 08 | Blood in the Water': 40,       'AUG | Amber Slipstream': 300,
            'MP9 | Featherweight': 285,              'Negev | Ultralight': 290,
            'MAC-10 | Monkeyflage': 295
        }
    },
    {
        id: 'classified', name: 'Classified Case', icon: '⭐', cost: 75000,
        unlockLevel: 40,
        desc: 'The endgame case. Unlocks at Level 40.',
        skins: {
            'GOLD':       ['★ Karambit | Gamma Doppler', '★ Butterfly Knife | Tiger Tooth', '★ M9 Bayonet | Lore', '★ Talon Knife | Marble Fade'],
            'Rare (Red)': ['AK-47 | Gold Arabesque', 'AWP | The Prince', 'M4A4 | Poseidon'],
            'Pink':       ['Glock-18 | Bullet Queen', 'Desert Eagle | Ocean Drive', 'AK-47 | The Empress'],
            'Purple':     ['MP9 | Starlight Protector', 'MAC-10 | Gold Brick', 'UMP-45 | Moonrise'],
            'Blue':       ['Five-SeveN | Scrawl', 'P250 | Contaminant', 'MAG-7 | Foresight', 'Nova | Antique']
        },
        prices: {
            '★ Karambit | Gamma Doppler': 1200,      '★ Butterfly Knife | Tiger Tooth': 950,
            '★ M9 Bayonet | Lore': 800,              '★ Talon Knife | Marble Fade': 700,
            'AK-47 | Gold Arabesque': 400,            'AWP | The Prince': 350,
            'M4A4 | Poseidon': 300,                   'Glock-18 | Bullet Queen': 100,
            'Desert Eagle | Ocean Drive': 80,         'AK-47 | The Empress': 120,
            'MP9 | Starlight Protector': 50,          'MAC-10 | Gold Brick': 40,
            'UMP-45 | Moonrise': 35,                  'Five-SeveN | Scrawl': 480,
            'P250 | Contaminant': 460,                'MAG-7 | Foresight': 460,
            'Nova | Antique': 440
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
    Pistol:  ['Desert Eagle', 'USP-S', 'Glock-18', 'P250', 'P2000', 'Tec-9', 'Five-SeveN', 'CZ75-Auto', 'Dual Berettas', 'R8 Revolver'],
    SMG:     ['MP9', 'MP7', 'MP5-SD', 'P90', 'PP-Bizon', 'MAC-10', 'UMP-45'],
    Shotgun: ['Nova', 'MAG-7', 'Sawed-Off', 'XM1014', 'Negev'],
    Knife:   ['Karambit', 'Butterfly Knife', 'M9 Bayonet', 'Flip Knife', 'Gut Knife', 'Bayonet', 'Shadow Daggers', 'Talon Knife', 'Skeleton Knife', 'Nomad Knife', 'Paracord Knife', 'Stiletto Knife', 'Ursus Knife'],
    Gloves:  ['Sport Gloves', 'Specialist Gloves', 'Moto Gloves', 'Hand Wraps'],
    MachineGun: ['Negev']
};

const RARITY_ODDS = {
    'GOLD':       { label: 'Gold — Rare Special',  chance: '0.26%',  colour: '#e4ae39' },
    'Rare (Red)': { label: 'Red — Covert',         chance: '0.64%',  colour: '#eb4b4b' },
    'Pink':       { label: 'Pink — Classified',    chance: '3.20%',  colour: '#d32ce6' },
    'Purple':     { label: 'Purple — Restricted',  chance: '15.98%', colour: '#8847ff' },
    'Blue':       { label: 'Blue — Mil-Spec',      chance: '79.92%', colour: '#4b69ff' }
};

const STARTING_COINS   = 1000;
const COINS_PER_DOLLAR = 100;

// -------------------------------------------------------
// Firebase
// -------------------------------------------------------
const FIREBASE_URL = 'https://leaderboard-f47dd-default-rtdb.firebaseio.com/';