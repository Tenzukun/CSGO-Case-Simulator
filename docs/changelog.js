// -------------------------------------------------------
// Changelog
// -------------------------------------------------------

const CHANGELOG = [
    {
        version: 'v0.11',
        title: 'Leaderboard Fix',
        date: 'June 2026',
        changes: [
            { type: 'fix', text: 'Best Item leaderboard tab now correctly shows and sorts entries — bestRank was never being pushed to Firebase so all comparisons were equal.' },
            { type: 'fix', text: 'Best Item tab sort now ranks by rarity first, then coin value as a tiebreaker.' },
            { type: 'fix', text: 'Item name on the Best Item tab is now coloured by rarity with the coin value shown underneath.' },
        ]
    },
    {
        version: 'v0.10',
        title: 'Balance Pass',
        date: 'June 2026',
        changes: [
            { type: 'balance', text: 'Fishing coin payouts reduced ~60% — small coins 100–300 → 30–100, big coins 350–700 → 100–300, rare junk 400–800 → 150–400.' },
            { type: 'balance', text: 'XP curve growth factor lowered from 1.3 → 1.18. Level 40 now requires ~705k XP instead of 18.5 million.' },
            { type: 'balance', text: 'Fishing XP multiplier capped at 2× (previously uncapped — hit 4.9× at level 40).' },
            { type: 'balance', text: 'Mystery Chest payout reduced from 500–3,000 → 200–1,000 coins.' },
            { type: 'improved', text: 'Starting coins increased from 1,000 → 2,500, giving new players 12 Starter Case opens right away.' },
            { type: 'new',     text: 'Changelog page added.' },
        ]
    },
    {
        version: 'v0.9',
        title: 'Sound Effects',
        date: 'June 2026',
        changes: [
            { type: 'new',     text: 'Full sound system added via Web Audio API — no audio files, all synthesized in JS.' },
            { type: 'new',     text: 'Per-rarity reveal sounds that escalate with rarity: soft ding (Blue) up to a full 8-note fanfare (Gold).' },
            { type: 'new',     text: 'Rolling tick sequence plays during the case open animation.' },
            { type: 'new',     text: 'Fishing sounds: cast whoosh + splash, bite click, and catch sounds that vary by catch type.' },
            { type: 'new',     text: 'Level-up chime, skill unlock tone, and sell chime.' },
            { type: 'new',     text: 'Sound Effects toggle in account panel → Settings. Preference persists across sessions.' },
        ]
    },
    {
        version: 'v0.8',
        title: 'Upgrade Skill Trees',
        date: 'June 2026',
        changes: [
            { type: 'new',     text: 'Upgrades page added to the sidebar with two tabs: Case Upgrades and Fishing Upgrades.' },
            { type: 'new',     text: 'Case skill tree — 13 skills across three branches: Fortune (rarity odds), Value (coin returns), Efficiency (cost discounts + XP boost).' },
            { type: 'new',     text: 'Fishing skill tree — 13 skills across three branches: Wealth (coin income), Precision (catch odds), Mastery (XP, Double Dip, Mystery Chest).' },
            { type: 'new',     text: 'Case upgrades affect live rarity rolls, item coin values, open costs, and XP gains.' },
            { type: 'new',     text: 'Fishing upgrades affect coin multipliers, catch probabilities, and unlock new mechanics.' },
            { type: 'improved', text: 'Active Bonuses summary bar shows all current bonuses at a glance on each skill tree.' },
            { type: 'improved', text: 'All skill unlocks persist to localStorage.' },
        ]
    },
    {
        version: 'v0.7',
        title: 'Fishing',
        date: 'June 2026',
        changes: [
            { type: 'new',     text: 'Fishing page with cast mechanic and 25-entry catch log.' },
            { type: 'new',     text: 'Five catch types: small coins, big coins, junk item, rare junk, and random skin (2% chance).' },
            { type: 'new',     text: 'Fishing XP and coin payouts scale with player level.' },
            { type: 'new',     text: 'Skin catches go directly to inventory.' },
            { type: 'new',     text: 'Catch odds panel on the fishing page.' },
        ]
    },
    {
        version: 'v0.6',
        title: 'Weekly Rewards',
        date: 'June 2026',
        changes: [
            { type: 'new',     text: 'Seven-day weekly reward calendar (Mon–Sun).' },
            { type: 'new',     text: 'Thursday reward: free Chroma Case open. Sunday reward: free Dragon Case open.' },
            { type: 'new',     text: 'Coin rewards scale with player level (+5% per level).' },
            { type: 'new',     text: 'Week resets every Monday at midnight with a live countdown timer.' },
            { type: 'new',     text: 'Missed days are tracked and shown on the calendar.' },
        ]
    },
    {
        version: 'v0.5',
        title: 'Achievements',
        date: 'June 2026',
        changes: [
            { type: 'new',     text: '53 achievements across 7 categories: Cases, Rarities, Fishing, Levels, Coins, Weekly, and Spender.' },
            { type: 'new',     text: 'Achievement unlock popup slides in from the bottom-right with the badge and name.' },
            { type: 'new',     text: 'Achievements page with full badge grid showing locked and unlocked states.' },
            { type: 'new',     text: 'Achievement stats tracked in localStorage: gold count, fish count, weekly claims, spending total, and more.' },
        ]
    },
    {
        version: 'v0.4',
        title: 'Multi-Opens, Inventory Overhaul & Feedback',
        date: 'June 2026',
        changes: [
            { type: 'new',     text: '5× and 10× multi-open: all items displayed in a strict 5-per-row grid.' },
            { type: 'new',     text: 'Inventory pagination: 9 items per page with Prev / Next controls and total item count.' },
            { type: 'new',     text: 'Inventory sort: Newest, Oldest, Value High–Low, Value Low–High, Rarity Best–Worst.' },
            { type: 'new',     text: 'Inventory filter by rarity (All, Gold, Red, Pink, Purple, Blue).' },
            { type: 'new',     text: 'Favourite items (⭐) protected from Sell All.' },
            { type: 'new',     text: 'Feedback page with 1–5 star rating, category dropdown, and Firebase submission.' },
            { type: 'improved', text: 'Sort and filter dropdowns styled to match the site theme.' },
            { type: 'fix',     text: 'Multi-open items now correctly appear in inventory.' },
            { type: 'fix',     text: 'Open buttons no longer stay disabled after the first roll.' },
        ]
    },
    {
        version: 'v0.3',
        title: 'Leaderboard, Progression & Alerts',
        date: 'June 2026',
        changes: [
            { type: 'new',     text: 'Firebase-backed leaderboard with four tabs: Total Earned, Cases Opened, Best Item, Level.' },
            { type: 'new',     text: 'XP and levelling system with level-up popup and floating XP indicators.' },
            { type: 'new',     text: 'XP per rarity: Blue 10 · Purple 25 · Pink 75 · Red 200 · Gold 500.' },
            { type: 'new',     text: 'Rarity odds scale logarithmically with case cost — higher cases have better odds.' },
            { type: 'new',     text: 'Gold drop announcements: global toast notification when any player rolls a Gold item.' },
            { type: 'new',     text: 'Daily coin reward with live countdown to next claim.' },
            { type: 'new',     text: 'Account panel (slide-in from top-right) with Stats, Levels, and Settings tabs.' },
        ]
    },
    {
        version: 'v0.2',
        title: 'Layout Redesign & Authentication',
        date: 'June 2026',
        changes: [
            { type: 'new',     text: 'Full app layout redesign: fixed 56px top nav, 220px left sidebar, scrollable main content area.' },
            { type: 'new',     text: 'Account system: sign in, create account, and play as guest modes.' },
            { type: 'new',     text: 'Password hashing via SHA-256 (Web Crypto API). Credentials stored in Firebase.' },
            { type: 'new',     text: 'Cloud save: inventory, coins, XP, level, achievements, and stats sync to Firebase on login.' },
            { type: 'new',     text: 'Mobile layout with hamburger menu and slide-in sidebar drawer.' },
            { type: 'new',     text: '11 cases with level-gated unlocks (Spectrum L5, Recoil L10, Prisma L15, Phantom L20, Glove L25, Revolution L32, Classified L40).' },
            { type: 'new',     text: 'Quick Open toggle to skip the rolling animation.' },
            { type: 'improved', text: 'Inventory moved to its own sidebar page with full sort, filter, and sell controls.' },
        ]
    },
    {
        version: 'v0.1',
        title: 'Initial Release',
        date: 'June 2026',
        changes: [
            { type: 'new', text: 'CS:GO-style case opening simulator.' },
            { type: 'new', text: 'Starter, Chroma, Clutch, and Dragon cases with real skin names and market prices.' },
            { type: 'new', text: 'Rarity system: Blue, Purple, Pink, Red, Gold with weighted probabilities.' },
            { type: 'new', text: 'Float values, wear tiers (FN / MW / FT / WW / BS), StatTrak™ and Souvenir prefixes.' },
            { type: 'new', text: 'Coin economy: spend coins to open cases, sell drops from inventory.' },
            { type: 'new', text: 'Float bar visualisation on each item card.' },
        ]
    },
];

// -------------------------------------------------------
// Render
// -------------------------------------------------------

const CL_BADGE = {
    new:      { label: 'NEW',      cls: 'cl-badge-new'      },
    improved: { label: 'IMPROVED', cls: 'cl-badge-improved' },
    fix:      { label: 'FIX',      cls: 'cl-badge-fix'      },
    balance:  { label: 'BALANCE',  cls: 'cl-badge-balance'  },
    removed:  { label: 'REMOVED',  cls: 'cl-badge-removed'  },
};

function renderChangelogPage() {
    const container = document.getElementById('changelogList');
    if (!container) return;

    container.innerHTML = CHANGELOG.map((entry, idx) => `
        <div class="cl-entry ${idx === 0 ? 'cl-latest' : ''}">
            <div class="cl-entry-header">
                <div class="cl-entry-left">
                    <span class="cl-version">${entry.version}</span>
                    ${idx === 0 ? '<span class="cl-latest-badge">LATEST</span>' : ''}
                </div>
                <div class="cl-entry-right">
                    <span class="cl-title">${entry.title}</span>
                    <span class="cl-date">${entry.date}</span>
                </div>
            </div>
            <ul class="cl-changes">
                ${entry.changes.map(c => {
                    const badge = CL_BADGE[c.type] || CL_BADGE.new;
                    return `<li class="cl-change">
                        <span class="cl-badge ${badge.cls}">${badge.label}</span>
                        <span class="cl-change-text">${c.text}</span>
                    </li>`;
                }).join('')}
            </ul>
        </div>
    `).join('');
}