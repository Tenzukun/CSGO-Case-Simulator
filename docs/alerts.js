// -------------------------------------------------------
// Gold Drop Alert System
// Uses Firebase SSE to push live notifications to all
// connected users whenever anyone rolls a Gold item.
// -------------------------------------------------------

const ALERT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
const pageLoadTime     = Date.now();

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

// Delete alerts older than 24 hours to keep the DB tidy
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
// Firebase SSE listener — receive alerts from all users
// -------------------------------------------------------

function initGoldAlerts() {
    if (!FIREBASE_URL) return;

    try {
        const source = new EventSource(`${FIREBASE_URL}/gold_alerts.json`);

        // Initial snapshot — ignore (old alerts already in DB)
        source.addEventListener('put', () => {});

        // Incremental update — a new alert was written by someone
        source.addEventListener('patch', e => {
            try {
                const payload = JSON.parse(e.data);
                const entries = payload.data;
                if (!entries) return;
                for (const val of Object.values(entries)) {
                    if (val && val.timestamp > pageLoadTime) {
                        queueAlert(val);
                    }
                }
            } catch (err) {
                console.warn('Gold alert parse error:', err);
            }
        });

    } catch (e) {
        console.warn('Gold alert SSE failed:', e);
    }
}

// -------------------------------------------------------
// Notification queue
// -------------------------------------------------------

function queueAlert(alert) {
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

    // Hold for 5 s then slide out
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