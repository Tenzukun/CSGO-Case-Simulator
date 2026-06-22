const fs   = require('fs');
const path = require('path');

const DATA_DIR  = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'inventory.json');

// Make sure the data folder exists when the bot starts
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Make sure inventory.json exists when the bot starts
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

function loadData() {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function addItem(userId, item) {
    const data = loadData();
    if (!data[userId]) {
        data[userId] = { items: [], stats: { total: 0, gold: 0, red: 0, pink: 0, purple: 0, blue: 0 } };
    }
    data[userId].items.push(item);

    // Update stats
    data[userId].stats.total++;
    const rarityKey = {
        "GOLD":       "gold",
        "Rare (Red)": "red",
        "Pink":       "pink",
        "Purple":     "purple",
        "Blue":       "blue"
    }[item.rarity] || "blue";
    data[userId].stats[rarityKey]++;

    saveData(data);
}

function getItems(userId) {
    const data = loadData();
    return data[userId]?.items || [];
}

function getStats(userId) {
    const data = loadData();
    return data[userId]?.stats || { total: 0, gold: 0, red: 0, pink: 0, purple: 0, blue: 0 };
}

function resetUser(userId) {
    const data = loadData();
    if (data[userId]) {
        delete data[userId];
        saveData(data);
        return true;
    }
    return false;
}

module.exports = { addItem, getItems, getStats, resetUser };