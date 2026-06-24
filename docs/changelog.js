// -------------------------------------------------------
// Changelog
// -------------------------------------------------------

const CHANGELOG = [
    {
        version: 'v0.19',
        title: 'README Update & Header Resize',
        date: 'June 2026',
        changes: [
            { type: 'improved', text: 'README updated to reflect current project state: added prestige, upgrade skill trees, sound effects, and changelog to the features list; all 11 cases now listed in the unlock table; project file structure updated to include changelog.js and changelog.css.' },
            { type: 'improved', text: 'Top navigation bar increased in height for better visibility and easier interaction.' },
        ]
    },
    {
        version: 'v0.18',
        title: 'Sign Out Fix & Instant Cross-Device Sync',
        date: 'June 2026',
        changes: [
            { type: 'fix',      text: 'Sign Out button now works. It was wired inside a block that returned early for logged-in users, so it was never being attached.' },
            { type: 'new',      text: 'Instant cross-device sync added via Firebase Server-Sent Events (SSE). Changes made on one device appear on another device immediately — no polling or page refresh needed.' },
            { type: 'improved', text: 'Coins, level, XP, inventory, achievements, and stats all stay in sync across devices in real time.' },
            { type: 'improved', text: 'A subtle "↻ Synced" indicator briefly appears in the top nav when remote changes are received.' },
        ]
    },
    {
        version: 'v0.17',
        title: 'Best Item Leaderboard Fix',
        date: 'June 2026',
        changes: [
            { type: 'fix', text: 'Best Item leaderboard now ranks purely by coin value — the highest-value item wins regardless of rarity. Previously rarity rank took priority, meaning a lower-value Gold item could rank above a higher-value Red.' },
        ]
    },
    {
        version: 'v0.16',
        title: 'Fishing Cooldown Removed',
        date: 'June 2026',
        changes: [
            { type: 'improved', text: 'Removed the 1.5-second cooldown between fishing casts. The cast button re-enables immediately after a catch.' },
        ]
    },
    {
        version: 'v0.15',
        title: 'Cases Restored, Grid Expansion & Alert Fix',
        date: 'June 2026',
        changes: [
            { type: 'new',      text: 'Recoil Case (8,500 coins, Level 10) re-added — includes Butterfly Knife | Lore, AK-47 | Orion, USP-S | Printstream and more.' },
            { type: 'new',      text: 'Phantom Case (22,000 coins, Level 20) re-added — includes Karambit | Lore, AK-47 | X-Ray, USP-S | The Traitor and more.' },
            { type: 'new',      text: 'Revolution Case (50,000 coins, Level 32) re-added — includes Butterfly Knife | Doppler, AK-47 | Head Shot, AWP | Duality and more.' },
            { type: 'improved', text: 'Case selection grid now shows 6 cases per row (was 4), fitting all 11 cases cleanly across two rows.' },
            { type: 'improved', text: 'Gold drop alert moved from top-centre to bottom-right — slides up from the corner instead of dropping in from the top.' },
        ]
    },
    {
        version: 'v0.14',
        title: 'Instant Fishing & Dynamic Catch Chances',
        date: 'June 2026',
        changes: [
            { type: 'new',      text: 'Instant Fishing toggle added to the Fishing page — skips the cast animation and bite pause so catches resolve immediately. The 1.5s cooldown between casts still applies.' },
            { type: 'improved', text: 'Catch Chances section is now fully dynamic — percentages and coin ranges update in real time to reflect your active fishing skill upgrades (e.g. Keen Eyes shows 12% rare instead of 8%, coin multipliers reflect boosted ranges).' },
            { type: 'improved', text: 'Mystery Chest row only appears in Catch Chances once the mastery skill is unlocked.' },
            { type: 'improved', text: 'Instant Fishing preference saves to localStorage and persists across sessions.' },
        ]
    },
    {
        version: 'v0.13',
        title: 'Progression & Economy Rebalance',
        date: 'June 2026',
        changes: [
            { type: 'balance', text: 'XP required per level increased 50% (base 200 → 300). Reaching level 35 now requires ~461k XP instead of 308k.' },
            { type: 'balance', text: 'Fishing coin multiplier capped at 1.25× regardless of level. Previously it scaled unbounded — at level 35 it was 2.7×, making fishing give 409k coins/hour. Now capped at ~58k/hour.' },
            { type: 'balance', text: 'Fishing coin ranges cut a further ~40%: small coins 30–100 → 15–60, big coins 100–300 → 60–175, junk 30–100 → 15–60, rare junk 150–400 → 90–250.' },
            { type: 'balance', text: 'Fishing cooldown of 1.5 seconds added between casts, limiting maximum cast rate to ~10/min.' },
            { type: 'balance', text: 'Weekly multiplier rate reduced from 5% to 3% per level. At level 35: 2.7× → 2.02×.' },
            { type: 'balance', text: 'Weekly base coin rewards reduced ~35%: Monday 1,000 → 650, Tuesday 1,500 → 1,000, Wednesday 2,000 → 1,300, Friday 2,500 → 1,600, Saturday 3,500 → 2,250. Total: 10,500 → 6,800 per week at level 1.' },
            { type: 'balance', text: 'Mystery Chest (fishing mastery skill) payout reduced from 200–1,000 → 150–600 coins.' },
        ]
    },
    {
        version: 'v0.12',
        title: 'Prestige System',
        date: 'June 2026',
        changes: [
            { type: 'new',      text: 'Prestige system added — reach the level cap to prestige, resetting progress in exchange for lasting rewards.' },
            { type: 'new',      text: 'Max level starts at 50 and increases by 10 per prestige (P1 = Lv60 cap, P2 = Lv70, and so on).' },
            { type: 'new',      text: 'Each prestige awards 1 Prestige Point, spendable in Upgrades to unlock any case or fishing skill for free.' },
            { type: 'new',      text: 'All-time best skin display in the account panel Stats tab — shows the best skin ever rolled, survives every prestige and inventory wipe.' },
            { type: 'new',      text: 'Prestige badge on the leaderboard next to your username: bronze (P1–2), silver (P3–5), gold (P6–9), diamond (P10+).' },
            { type: 'new',      text: 'XP bar turns gold and shows "MAX LEVEL — Prestige Ready!" when the cap is hit.' },
            { type: 'new',      text: 'Prestige confirmation modal clearly shows what is lost and what is kept before committing.' },
            { type: 'improved', text: 'Career cases opened and total coins earned are preserved across prestiges on the leaderboard.' },
        ]
    },
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