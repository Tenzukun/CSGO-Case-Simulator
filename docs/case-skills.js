// -------------------------------------------------------
// Case Upgrade Skill Tree
// -------------------------------------------------------

const CASE_SKILLS = [
    // Root
    {
        id: 'case_novice', name: 'Case Opener', icon: '📦',
        desc: 'You\'ve cracked your first case. Everything starts here.',
        cost: 0, requires: null, branch: 'root'
    },

    // 🎲 Fortune Branch — better rarity odds
    {
        id: 'fortune_1', name: 'Lucky Break', icon: '🍀',
        desc: 'Gold +0.10%, Red +0.20% drop chance.',
        cost: 2000, requires: 'case_novice', branch: 'fortune'
    },
    {
        id: 'fortune_2', name: 'Hot Streak', icon: '🔥',
        desc: 'Gold +0.10% more, Red +0.20% more (stacks).',
        cost: 7000, requires: 'fortune_1', branch: 'fortune'
    },
    {
        id: 'fortune_3', name: 'Blessed', icon: '✨',
        desc: 'Pink +1.0%, Gold +0.15% more.',
        cost: 20000, requires: 'fortune_2', branch: 'fortune'
    },
    {
        id: 'fortune_4', name: 'Divine Luck', icon: '👑',
        desc: 'Gold +0.15% more, Red +0.20% more, Pink +0.50% more.',
        cost: 65000, requires: 'fortune_3', branch: 'fortune'
    },

    // 💎 Value Branch — better coin returns
    {
        id: 'value_1', name: 'Sharp Eye', icon: '🔍',
        desc: 'All dropped items worth +20% coins.',
        cost: 2500, requires: 'case_novice', branch: 'value'
    },
    {
        id: 'value_2', name: 'Gold Sense', icon: '💛',
        desc: 'Gold items worth +75% extra coins.',
        cost: 8000, requires: 'value_1', branch: 'value'
    },
    {
        id: 'value_3', name: 'Market Master', icon: '📈',
        desc: 'All items worth +40% coins total.',
        cost: 22000, requires: 'value_2', branch: 'value'
    },
    {
        id: 'value_4', name: 'Vault Lord', icon: '🏦',
        desc: 'All items ×2 coins. Gold items ×3 coins total.',
        cost: 70000, requires: 'value_3', branch: 'value'
    },

    // ⚡ Efficiency Branch — discounts & XP
    {
        id: 'efficiency_1', name: 'Opener\'s Edge', icon: '⚡',
        desc: 'XP from case opens +50%.',
        cost: 1500, requires: 'case_novice', branch: 'efficiency'
    },
    {
        id: 'efficiency_2', name: 'Bulk Buyer', icon: '🛒',
        desc: 'All cases cost 10% less to open.',
        cost: 4000, requires: 'efficiency_1', branch: 'efficiency'
    },
    {
        id: 'efficiency_3', name: 'VIP Status', icon: '🎫',
        desc: 'All cases cost 20% less total.',
        cost: 12000, requires: 'efficiency_2', branch: 'efficiency'
    },
    {
        id: 'efficiency_4', name: 'Elite Member', icon: '💎',
        desc: 'Cases cost 30% less total. XP from cases ×2.',
        cost: 40000, requires: 'efficiency_3', branch: 'efficiency'
    },
];

// -------------------------------------------------------
// Storage
// -------------------------------------------------------

function getCaseSkillsUnlocked() {
    const saved = JSON.parse(localStorage.getItem('csgo_case_skills') || '[]');
    if (!saved.includes('case_novice')) saved.push('case_novice');
    return saved;
}

function hasCaseSkill(id) {
    return getCaseSkillsUnlocked().includes(id);
}

function unlockCaseSkill(id) {
    const skill = CASE_SKILLS.find(s => s.id === id);
    if (!skill || hasCaseSkill(id)) return;
    if (skill.requires && !hasCaseSkill(skill.requires)) return;

    if (getCoins() < skill.cost) {
        alert(`You need ${skill.cost.toLocaleString()} coins to unlock ${skill.name}.`);
        return;
    }

    const unlocked = getCaseSkillsUnlocked();
    unlocked.push(id);
    localStorage.setItem('csgo_case_skills', JSON.stringify(unlocked));
    spendCoins(skill.cost);
    renderCaseSkillTree('caseSkillContainer');
}

// -------------------------------------------------------
// Bonus Calculator
// -------------------------------------------------------

function getCaseBonus() {
    const has = hasCaseSkill;

    // Fortune — flat additions to rarity %
    const goldBoost = (has('fortune_1') ? 0.10 : 0)
                    + (has('fortune_2') ? 0.10 : 0)
                    + (has('fortune_3') ? 0.15 : 0)
                    + (has('fortune_4') ? 0.15 : 0);

    const redBoost  = (has('fortune_1') ? 0.20 : 0)
                    + (has('fortune_2') ? 0.20 : 0)
                    + (has('fortune_4') ? 0.20 : 0);

    const pinkBoost = (has('fortune_3') ? 1.00 : 0)
                    + (has('fortune_4') ? 0.50 : 0);

    // Value — cumulative multipliers
    const baseValueMult = has('value_4') ? 2.0
                        : has('value_3') ? 1.6
                        : has('value_1') ? 1.2
                        : 1.0;

    const goldValueExtraMult = has('value_4') ? 1.5
                             : has('value_2') ? 1.75
                             : 1.0;

    // Efficiency
    const costDiscount = (has('efficiency_2') ? 0.10 : 0)
                       + (has('efficiency_3') ? 0.10 : 0)
                       + (has('efficiency_4') ? 0.10 : 0);

    const xpMult = (has('efficiency_1') ? 1.5 : 1)
                 * (has('efficiency_4') ? (4/3) : 1);

    return {
        goldBoost, redBoost, pinkBoost,
        valueMult: baseValueMult,
        goldValueMult: baseValueMult * goldValueExtraMult,
        costDiscount,
        xpMult
    };
}

// -------------------------------------------------------
// Render
// -------------------------------------------------------

function renderCaseSkillTree(containerId = 'caseSkillContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const unlocked = getCaseSkillsUnlocked();

    function state(skill) {
        if (unlocked.includes(skill.id))                          return 'unlocked';
        if (!skill.requires || unlocked.includes(skill.requires)) return 'available';
        return 'locked';
    }

    function skillCard(skill) {
        const s   = state(skill);
        const req = CASE_SKILLS.find(x => x.id === skill.requires);

        const footer = s === 'unlocked'
            ? `<div class="fs-unlocked-badge">✓ Unlocked</div>`
            : s === 'available'
            ? `<button class="fs-unlock-btn" onclick="unlockCaseSkill('${skill.id}')">🔓 ${skill.cost.toLocaleString()} coins</button>`
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
        const skills = ids.map(id => CASE_SKILLS.find(s => s.id === id));
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

    // Active bonuses
    const bonus = getCaseBonus();
    const tags  = [];
    if (bonus.goldBoost > 0)      tags.push(`🟡 Gold +${(bonus.goldBoost).toFixed(2)}%`);
    if (bonus.redBoost > 0)       tags.push(`🔴 Red +${(bonus.redBoost).toFixed(2)}%`);
    if (bonus.pinkBoost > 0)      tags.push(`🩷 Pink +${(bonus.pinkBoost).toFixed(2)}%`);
    if (bonus.valueMult > 1)      tags.push(`💰 Value ×${bonus.valueMult.toFixed(2)}`);
    if (bonus.goldValueMult > 1)  tags.push(`🟡 Gold value ×${bonus.goldValueMult.toFixed(2)}`);
    if (bonus.costDiscount > 0)   tags.push(`🏷️ Cost -${(bonus.costDiscount * 100).toFixed(0)}%`);
    if (bonus.xpMult > 1)         tags.push(`⚡ XP ×${bonus.xpMult.toFixed(2)}`);

    const bonusBar = tags.length
        ? `<div class="fs-bonus-bar">
               <div class="fs-bonus-label">Active Bonuses</div>
               <div class="fs-bonus-tags">${tags.map(t => `<span class="fs-tag">${t}</span>`).join('')}</div>
           </div>`
        : `<div class="fs-bonus-bar fs-bonus-empty">No upgrades unlocked yet — spend coins below to start!</div>`;

    const root = CASE_SKILLS.find(s => s.branch === 'root');

    container.innerHTML = `
        ${bonusBar}
        <div class="fs-root-row">${skillCard(root)}</div>
        <div class="fs-root-line"><div class="fs-root-h"></div></div>
        <div class="fs-branches">
            ${branch(['fortune_1','fortune_2','fortune_3','fortune_4'],       'Fortune',    '🎲')}
            ${branch(['value_1','value_2','value_3','value_4'],               'Value',      '💎')}
            ${branch(['efficiency_1','efficiency_2','efficiency_3','efficiency_4'], 'Efficiency', '⚡')}
        </div>
        <div class="fs-legend">
            <span class="fs-leg unlocked">■ Unlocked</span>
            <span class="fs-leg available">■ Available</span>
            <span class="fs-leg locked">■ Locked</span>
        </div>
    `;
}
