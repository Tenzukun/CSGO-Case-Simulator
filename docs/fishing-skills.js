// -------------------------------------------------------
// Fishing Skill Tree
// -------------------------------------------------------

const FISHING_SKILLS = [
    // Root
    {
        id: 'fisher_novice', name: 'Novice Fisher', icon: '🎣',
        desc: 'You\'ve picked up the rod. Everything starts here.',
        cost: 0, requires: null, branch: 'root'
    },

    // 💰 Wealth Branch
    {
        id: 'wealth_1', name: 'Coin Magnet', icon: '🧲',
        desc: 'All fishing coin rewards +25%.',
        cost: 1000, requires: 'fisher_novice', branch: 'wealth'
    },
    {
        id: 'wealth_2', name: 'Silver Lure', icon: '🪝',
        desc: 'Big coin catch chance +10%.',
        cost: 3000, requires: 'wealth_1', branch: 'wealth'
    },
    {
        id: 'wealth_3', name: 'Golden Net', icon: '🥅',
        desc: 'All coin rewards ×2.',
        cost: 10000, requires: 'wealth_2', branch: 'wealth'
    },
    {
        id: 'wealth_4', name: 'Treasure Diver', icon: '🤿',
        desc: 'Rare junk sells for 3× coins.',
        cost: 35000, requires: 'wealth_3', branch: 'wealth'
    },

    // 🎯 Precision Branch
    {
        id: 'precision_1', name: 'Keen Eyes', icon: '👁️',
        desc: 'Rare junk catch chance +4%.',
        cost: 1500, requires: 'fisher_novice', branch: 'precision'
    },
    {
        id: 'precision_2', name: 'Steady Hook', icon: '🔩',
        desc: 'Skin drop chance +1%.',
        cost: 5000, requires: 'precision_1', branch: 'precision'
    },
    {
        id: 'precision_3', name: 'Expert Aim', icon: '🎯',
        desc: 'Skin drop chance +2%.',
        cost: 15000, requires: 'precision_2', branch: 'precision'
    },
    {
        id: 'precision_4', name: 'Legendary Rod', icon: '⭐',
        desc: 'Skin drop chance +3%. Max skin chance: 8%.',
        cost: 50000, requires: 'precision_3', branch: 'precision'
    },

    // ⚡ Mastery Branch
    {
        id: 'mastery_1', name: 'XP Bait', icon: '⚡',
        desc: 'Fishing XP gains +50%.',
        cost: 800, requires: 'fisher_novice', branch: 'mastery'
    },
    {
        id: 'mastery_2', name: 'Double Dip', icon: '🎲',
        desc: '15% chance to reel in a bonus catch on top of your main one.',
        cost: 2500, requires: 'mastery_1', branch: 'mastery'
    },
    {
        id: 'mastery_3', name: 'Mystery Chest', icon: '📦',
        desc: '5% chance to catch a Mystery Chest worth 500–3,000 coins.',
        cost: 8000, requires: 'mastery_2', branch: 'mastery'
    },
    {
        id: 'mastery_4', name: 'Sea Legend', icon: '🌊',
        desc: 'Double Dip chance → 30%. All fishing multipliers ×1.25.',
        cost: 25000, requires: 'mastery_3', branch: 'mastery'
    },
];

// -------------------------------------------------------
// Storage
// -------------------------------------------------------

function getFishSkillsUnlocked() {
    const saved = JSON.parse(localStorage.getItem('csgo_fishing_skills') || '[]');
    if (!saved.includes('fisher_novice')) saved.push('fisher_novice');
    return saved;
}

function hasFishSkill(id) {
    return getFishSkillsUnlocked().includes(id);
}

function unlockFishSkill(id) {
    const skill = FISHING_SKILLS.find(s => s.id === id);
    if (!skill || hasFishSkill(id)) return;
    if (skill.requires && !hasFishSkill(skill.requires)) return;

    if (getCoins() < skill.cost) {
        alert(`You need ${skill.cost.toLocaleString()} coins to unlock ${skill.name}.`);
        return;
    }

    const unlocked = getFishSkillsUnlocked();
    unlocked.push(id);
    localStorage.setItem('csgo_fishing_skills', JSON.stringify(unlocked));
    spendCoins(skill.cost);
    SFX.unlock();
    renderFishingSkillTree('fishSkillContainer');
}

// -------------------------------------------------------
// Bonus Calculator
// (consumed by fishing.js for every cast)
// -------------------------------------------------------

function getFishingBonus() {
    const has = hasFishSkill;

    const coinMult = (has('wealth_1') ? 1.25 : 1)
                   * (has('wealth_3') ? 2    : 1)
                   * (has('mastery_4') ? 1.25 : 1);

    const bigCoinBonus  = has('wealth_2') ? 10 : 0;
    const rareValueMult = has('wealth_4') ? 3  : 1;

    const rareChanceBonus = has('precision_1') ? 4 : 0;
    const skinChanceBonus = (has('precision_2') ? 1 : 0)
                          + (has('precision_3') ? 2 : 0)
                          + (has('precision_4') ? 3 : 0);

    const xpMult      = (has('mastery_1') ? 1.5  : 1)
                      * (has('mastery_4') ? 1.25 : 1);
    const doubleDip   = (has('mastery_2') ? 0.15 : 0)
                      + (has('mastery_4') ? 0.15 : 0);
    const mysteryCatch = has('mastery_3');

    return {
        coinMult, bigCoinBonus, rareValueMult,
        rareChanceBonus, skinChanceBonus,
        xpMult, doubleDip, mysteryCatch
    };
}

// -------------------------------------------------------
// Render
// -------------------------------------------------------

function renderFishingSkillTree(containerId = 'fishSkillTree') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const unlocked = getFishSkillsUnlocked();

    function state(skill) {
        if (unlocked.includes(skill.id))                                return 'unlocked';
        if (!skill.requires || unlocked.includes(skill.requires))       return 'available';
        return 'locked';
    }

    function skillCard(skill) {
        const s    = state(skill);
        const req  = FISHING_SKILLS.find(x => x.id === skill.requires);

        const footer = s === 'unlocked'
            ? `<div class="fs-unlocked">✓ Unlocked</div>`
            : s === 'available'
            ? `<button class="fs-unlock-btn" onclick="unlockFishSkill('${skill.id}')">🔓 ${skill.cost.toLocaleString()} coins</button>`
            : `<div class="fs-locked">🔒 Requires ${req?.name || '?'}</div>`;

        return `
            <div class="fs-node fs-${s}${skill.branch === 'root' ? ' fs-root' : ''}">
                <div class="fs-icon">${skill.icon}</div>
                <div class="fs-name">${skill.name}</div>
                <div class="fs-desc">${skill.desc}</div>
                ${footer}
            </div>
        `;
    }

    function branch(ids, label, icon) {
        const skills = ids.map(id => FISHING_SKILLS.find(s => s.id === id));
        return `
            <div class="fs-branch">
                <div class="fs-branch-label">${icon} ${label}</div>
                ${skills.map((sk, i) => `
                    ${skillCard(sk)}
                    ${i < skills.length - 1 ? '<div class="fs-vline"></div>' : ''}
                `).join('')}
            </div>
        `;
    }

    // Active bonus summary
    const bonus  = getFishingBonus();
    const tags   = [];
    if (bonus.coinMult > 1)         tags.push(`💰 Coins ×${bonus.coinMult.toFixed(2)}`);
    if (bonus.bigCoinBonus > 0)     tags.push(`📈 Big coin +${bonus.bigCoinBonus}%`);
    if (bonus.rareChanceBonus > 0)  tags.push(`✨ Rare +${bonus.rareChanceBonus}%`);
    if (bonus.rareValueMult > 1)    tags.push(`💎 Rare ×${bonus.rareValueMult}`);
    if (bonus.skinChanceBonus > 0)  tags.push(`🔫 Skin +${bonus.skinChanceBonus}%`);
    if (bonus.xpMult > 1)           tags.push(`⚡ XP ×${bonus.xpMult.toFixed(2)}`);
    if (bonus.doubleDip > 0)        tags.push(`🎲 Double Dip ${(bonus.doubleDip * 100).toFixed(0)}%`);
    if (bonus.mysteryCatch)         tags.push(`📦 Mystery Chest`);

    const bonusBar = tags.length
        ? `<div class="fs-bonus-bar">
               <div class="fs-bonus-label">Active Bonuses</div>
               <div class="fs-bonus-tags">${tags.map(t => `<span class="fs-tag">${t}</span>`).join('')}</div>
           </div>`
        : `<div class="fs-bonus-bar fs-bonus-empty">No skills unlocked yet — spend coins below to start!</div>`;

    const root = FISHING_SKILLS.find(s => s.branch === 'root');

    container.innerHTML = `
        ${bonusBar}
        <div class="fs-root-row">${skillCard(root)}</div>
        <div class="fs-root-line">
            <div class="fs-root-h"></div>
        </div>
        <div class="fs-branches">
            ${branch(['wealth_1','wealth_2','wealth_3','wealth_4'],       'Wealth',    '💰')}
            ${branch(['precision_1','precision_2','precision_3','precision_4'], 'Precision', '🎯')}
            ${branch(['mastery_1','mastery_2','mastery_3','mastery_4'],   'Mastery',   '⚡')}
        </div>
        <div class="fs-legend">
            <span class="fs-leg unlocked">■ Unlocked</span>
            <span class="fs-leg available">■ Available</span>
            <span class="fs-leg locked">■ Locked</span>
        </div>
    `;
}

function initFishingSkillTree() {
    const unlocked = getFishSkillsUnlocked();
    if (!unlocked.includes('fisher_novice')) {
        unlocked.push('fisher_novice');
        localStorage.setItem('csgo_fishing_skills', JSON.stringify(unlocked));
    }

    const toggle  = document.getElementById('fishSkillToggle');
    const treeDiv = document.getElementById('fishSkillTree');

    if (toggle && treeDiv) {
        toggle.addEventListener('click', () => {
            const hidden = treeDiv.classList.toggle('hidden');
            toggle.textContent = hidden ? '🌿 Skill Tree ▾' : '🌿 Skill Tree ▴';
            if (!hidden) renderFishingSkillTree();
        });
    }
}
