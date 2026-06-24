// -------------------------------------------------------
// Service Worker — CS:GO Case Simulator PWA
// Bump CACHE_VERSION whenever you push an update so
// users get the latest files instead of stale cache.
// -------------------------------------------------------

const CACHE_VERSION = 'v1';
const CACHE_NAME    = `csgo-case-sim-${CACHE_VERSION}`;
const BASE          = '/CSGO-Case-Simulator';

const STATIC_ASSETS = [
    `${BASE}/`,
    `${BASE}/index.html`,
    `${BASE}/manifest.json`,
    // CSS
    `${BASE}/base.css`,
    `${BASE}/layout.css`,
    `${BASE}/cases.css`,
    `${BASE}/inventory.css`,
    `${BASE}/fishing.css`,
    `${BASE}/leaderboard.css`,
    `${BASE}/progression.css`,
    `${BASE}/achievements.css`,
    `${BASE}/weekly.css`,
    `${BASE}/alerts.css`,
    `${BASE}/auth.css`,
    `${BASE}/fishing-skills.css`,
    `${BASE}/prestige.css`,
    `${BASE}/feedback.css`,
    `${BASE}/changelog.css`,
    `${BASE}/mobile.css`,
    // JS
    `${BASE}/data.js`,
    `${BASE}/rolls.js`,
    `${BASE}/progression.js`,
    `${BASE}/leaderboard.js`,
    `${BASE}/auth.js`,
    `${BASE}/sounds.js`,
    `${BASE}/fishing.js`,
    `${BASE}/fishing-skills.js`,
    `${BASE}/case-skills.js`,
    `${BASE}/upgrades.js`,
    `${BASE}/feedback.js`,
    `${BASE}/changelog.js`,
    `${BASE}/prestige.js`,
    `${BASE}/achievements.js`,
    `${BASE}/weekly.js`,
    `${BASE}/alerts.js`,
    `${BASE}/script.js`,
    // Icons
    `${BASE}/icons/icon-192.png`,
    `${BASE}/icons/icon-512.png`,
    `${BASE}/csgo-case.png`,
];

// -------------------------------------------------------
// Install — cache all static assets
// -------------------------------------------------------
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// -------------------------------------------------------
// Activate — remove old caches
// -------------------------------------------------------
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key.startsWith('csgo-case-sim-') && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// -------------------------------------------------------
// Fetch — cache-first for static assets,
//          network-only for Firebase requests
// -------------------------------------------------------
self.addEventListener('fetch', event => {
    const url = event.request.url;

    // Always go to network for Firebase (Realtime DB, Auth)
    if (url.includes('firebaseio.com') ||
        url.includes('identitytoolkit.googleapis.com') ||
        url.includes('securetoken.googleapis.com')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Cache-first for everything else
    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request).then(response => {
                // Cache valid GET responses
                if (event.request.method === 'GET' && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            });
        }).catch(() => caches.match(`${BASE}/index.html`))
    );
});
