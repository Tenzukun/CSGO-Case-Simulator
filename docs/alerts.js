// -------------------------------------------------------
// Gold Drop Alert System
// Polls Firebase every 5 seconds for new gold alerts
// and shows a notification on every connected screen.
// -------------------------------------------------------

const ALERT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
let   lastAlertTime    = Date.now();

let alertQueue   = [];
let alertShowing = false;

// -------------------------------------------------------
// Write alert to Firebase (called on this user's gold roll)
// -------------------------------------------------------

async function pushGoldAlert(itemName, caseName) {
    const username = getUsername();
    if (!FIREBASE_URL || !username) return;

    const key   = Date.now();
    const entry = { username, item: itemName, caseName, timestamp: key };

    try {
        await fetch(`${FIREBASE_URL}/gold_alerts/${key}.json`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(entry)
        });
        pruneOldAlerts();
    } catch (e) {
        console.warn('Gold alert write failed:', e);
    }
}

async function pruneOldAlerts() {
    try {
        const res  = await fetch(`${FIREBASE_URL}/gold_alerts.json`);
        const data = await res.json();
        if (!data) return;
        const cutoff = Date.now() - ALERT_MAX_AGE_MS;
        for (const [key, val] of Object.entries(data)) {
            if (val && val.timestamp < cutoff) {
                fetch(`${FIREBASE_URL}/gold_alerts/${key}.json`, { method: 'DELETE' });
            }
        }
    } catch (e) { /* silent */ }
}

// -------------------------------------------------------
// Poll Firebase for new alerts
// -------------------------------------------------------

async function pollGoldAlerts() {
    if (!FIREBASE_URL) return;
    try {
        const res  = await fetch(`${FIREBASE_URL}/gold_alerts.json`);
        const data = await res.json();
        if (!data) return;

        for (const val of Object.values(data)) {
            if (val && val.timestamp > lastAlertTime) {
                lastAlertTime = val.timestamp;
                queueAlert(val);
            }
        }
    } catch (e) { /* silent */ }
}

function initGoldAlerts() {
    if (!FIREBASE_URL) return;
    setInterval(pollGoldAlerts, 5000);
}

// -------------------------------------------------------
// Notification queue
// -------------------------------------------------------

function queueAlert(alert) {
    // Respect the user's gold alert setting
    if (localStorage.getItem('csgo_block_gold_alerts') === 'true') return;
    alertQueue.push(alert);
    if (!alertShowing) showNextAlert();
}

function showNextAlert() {
    if (alertQueue.length === 0) { alertShowing = false; return; }
    alertShowing = true;

    const data = alertQueue.shift();
    const el   = document.getElementById('goldAlert');
    if (!el) { alertShowing = false; return; }

    document.getElementById('goldAlertUser').innerHTML =
        `<strong>${data.username}</strong> just rolled`;
    document.getElementById('goldAlertItem').textContent = data.item;
    document.getElementById('goldAlertCase').textContent = data.caseName;

    el.classList.remove('hidden', 'slide-out');
    el.classList.add('slide-in');

    setTimeout(() => {
        el.classList.remove('slide-in');
        el.classList.add('slide-out');
        setTimeout(() => {
            el.classList.add('hidden');
            el.classList.remove('slide-out');
            alertShowing = false;
            showNextAlert();
        }, 400);
    }, 5000);
}

// -------------------------------------------------------
// Init
// -------------------------------------------------------

initGoldAlerts();