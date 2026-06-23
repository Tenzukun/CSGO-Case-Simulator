// -------------------------------------------------------
// Changelog System
// Bump CURRENT_VERSION whenever you push an update.
// The popup auto-shows to anyone who hasn't seen it yet.
// -------------------------------------------------------

const CURRENT_VERSION = 'v0.3';

const CHANGELOG = [
    {
        version: 'v0.3',
        date: 'Day 3',
        sections: [
            {
                label: 'New',
                items: [
                    { icon: '⭐', text: 'XP and Level system — earn XP from cases, fishing, and weekly rewards' },
                    { icon: '🏅', text: 'Achievements — 35 achievements across 6 categories' },
                    { icon: '🎁', text: 'Weekly Rewards — claim daily rewards Mon–Sun, including free case opens' },
                    { icon: '🔒', text: '4 new level-locked cases: Spectrum, Prisma, Glove, and Classified' },
                    { icon: '⭐', text: 'Favourites — star items in your inventory to protect them from Sell All' },
                    { icon: '❓', text: 'How to Play guide added as a new tab' },
                    { icon: '📈', text: 'Level Details panel — view milestone perks and XP progress' },
                    { icon: '🏆', text: 'Leaderboard now has a Level tab' },
                ],
            },
            {
                label: 'Improved',
                items: [
                    { icon: '☁️', text: 'Cloud save now syncs XP, level, achievements, weekly state, and favourites' },
                    { icon: '🗂️', text: 'Code split into dedicated modules for easier maintenance' },
                ],
            },
        ],
    },
    {
        version: 'v0.2',
        date: 'Day 2',
        sections: [
            {
                label: 'New',
                items: [
                    { icon: '🎣', text: 'Fishing minigame with tiered catches and a scrolling catch log' },
                    { icon: '🏆', text: 'Leaderboard powered by Firebase Realtime Database' },
                    { icon: '👤', text: 'Username modal on first visit for leaderboard identity' },
                    { icon: '☕', text: 'Ko-fi support button' },
                ],
            },
        ],
    },
    {
        version: 'v0.1',
        date: 'Day 1',
        sections: [
            {
                label: 'New',
                items: [
                    { icon: '🎰', text: '4 starting cases with rarity-based skin rolls' },
                    { icon: '💰', text: 'Coin system, inventory, and sell functionality' },
                    { icon: '📦', text: 'Multi-open (1x, 5x, 10x) and Quick Open toggle' },
                    { icon: '🎁', text: 'Daily reward system' },
                ],
            },
        ],
    },
];

// -------------------------------------------------------
// Storage helpers
// -------------------------------------------------------

function getSeenVersion() {
    return localStorage.getItem('csgo_changelog_seen') || '';
}

function markVersionSeen() {
    localStorage.setItem('csgo_changelog_seen', CURRENT_VERSION);
}

// -------------------------------------------------------
// Open / Close
// -------------------------------------------------------

function openChangelog() {
    document.getElementById('changelogOverlay').classList.remove('hidden');
}

function closeChangelog() {
    document.getElementById('changelogOverlay').classList.add('hidden');
    markVersionSeen();
}

// -------------------------------------------------------
// Render
// -------------------------------------------------------

function renderChangelog() {
    const badge = document.getElementById('changelogVersionBadge');
    if (badge) badge.textContent = CURRENT_VERSION;

    const body = document.getElementById('changelogBody');
    body.innerHTML = CHANGELOG.map((entry, idx) => `
        ${idx > 0 ? '<hr class="changelog-divider">' : ''}
        <div class="changelog-entry">
            ${idx > 0 ? `<div class="changelog-entry-version">${entry.version} — ${entry.date}</div>` : ''}
            ${entry.sections.map(sec => `
                <div class="changelog-section-label">${sec.label}</div>
                ${sec.items.map(item => `
                    <div class="changelog-item">
                        <span class="changelog-item-icon">${item.icon}</span>
                        <span>${item.text}</span>
                    </div>
                `).join('')}
            `).join('')}
        </div>
    `).join('');
}

// -------------------------------------------------------
// Init
// -------------------------------------------------------

function initChangelog() {
    renderChangelog();

    document.getElementById('changelogClose').addEventListener('click', closeChangelog);
    document.getElementById('changelogDismiss').addEventListener('click', closeChangelog);

    // Click backdrop to close
    document.getElementById('changelogOverlay').addEventListener('click', e => {
        if (e.target === document.getElementById('changelogOverlay')) closeChangelog();
    });

    // Auto-show for new versions
    if (getSeenVersion() !== CURRENT_VERSION) {
        setTimeout(openChangelog, 700);
    }
}

initChangelog();