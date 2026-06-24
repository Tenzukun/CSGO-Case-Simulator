// -------------------------------------------------------
// Weekly Rewards System
// -------------------------------------------------------

const WEEKLY_REWARDS = [
    { day: 0, label: 'Day 1', dayName: 'Monday',    type: 'coins', base: 650,  icon: '💰', desc: '650 coins' },
    { day: 1, label: 'Day 2', dayName: 'Tuesday',   type: 'coins', base: 1000, icon: '💰', desc: '1,000 coins' },
    { day: 2, label: 'Day 3', dayName: 'Wednesday', type: 'coins', base: 1300, icon: '💰', desc: '1,300 coins' },
    { day: 3, label: 'Day 4', dayName: 'Thursday',  type: 'case',  caseId: 'chroma', icon: '🟣', desc: 'Free Chroma Case Open' },
    { day: 4, label: 'Day 5', dayName: 'Friday',    type: 'coins', base: 1600, icon: '💰', desc: '1,600 coins' },
    { day: 5, label: 'Day 6', dayName: 'Saturday',  type: 'coins', base: 2250, icon: '💰', desc: '2,250 coins' },
    { day: 6, label: 'Day 7', dayName: 'Sunday',    type: 'case',  caseId: 'dragon', icon: '🐉', desc: 'Free Dragon Case Open' },
];

// -------------------------------------------------------
// Week State
// -------------------------------------------------------

function getMondayMidnight() {
    const now          = new Date();
    const dayOfWeek    = now.getDay(); // 0=Sun, 1=Mon
    const daysFromMon  = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday       = new Date(now);
    monday.setDate(now.getDate() - daysFromMon);
    monday.setHours(0, 0, 0, 0);
    return monday.getTime();
}

function getWeeklyState() {
    let state = JSON.parse(localStorage.getItem('csgo_weekly') || '{}');

    const mondayMs = getMondayMidnight();

    // New week or first ever
    if (!state.weekStart || state.weekStart < mondayMs) {
        state = { weekStart: mondayMs, claimed: [] };
        localStorage.setItem('csgo_weekly', JSON.stringify(state));
    }

    return state;
}

function getCurrentWeekDay() {
    const state  = getWeeklyState();
    const dayMs  = 24 * 3600 * 1000;
    const dayNum = Math.floor((Date.now() - state.weekStart) / dayMs);
    return Math.min(dayNum, 6); // cap at 6 (Sunday)
}

// -------------------------------------------------------
// Claim Logic
// -------------------------------------------------------

function claimWeeklyDay(dayIndex) {
    const state      = getWeeklyState();
    const currentDay = getCurrentWeekDay();

    if (dayIndex > currentDay) return;
    if (state.claimed.includes(dayIndex)) return;

    const reward    = WEEKLY_REWARDS[dayIndex];
    let claimResult = null;

    if (reward.type === 'coins') {
        const amount = Math.round(reward.base * getWeeklyMultiplier());
        addCoins(amount);
        addLbCoins(amount);
        addXP(XP_WEEKLY);
        claimResult = { type: 'coins', amount };
    } else if (reward.type === 'case') {
        const caseData = CASES.find(c => c.id === reward.caseId);
        const result   = openCrate(caseData);
        result.rarity  = result.rarity; // ensure rarity is set

        // Save item (with id)
        const inv = JSON.parse(localStorage.getItem('csgo_inventory') || '[]');
        inv.push({
            id:       Date.now() + '-' + Math.floor(Math.random() * 10000),
            fullItem: result.fullItem, rarity: result.rarity, tier: result.tier,
            type:     result.type,     float:  result.floatVal, seed: result.seed,
            price:    result.price,    coins:  result.coins
        });
        localStorage.setItem('csgo_inventory', JSON.stringify(inv));

        addXP(XP_PER_RARITY[result.rarity] || 10);
        if (typeof addLbCase === 'function') addLbCase(result);
        if (typeof checkCaseAchievements === 'function') checkCaseAchievements(result);

        claimResult = { type: 'case', item: result, caseName: caseData.name };
    }

    state.claimed.push(dayIndex);
    localStorage.setItem('csgo_weekly', JSON.stringify(state));

    if (typeof checkWeeklyAchievements === 'function') checkWeeklyAchievements();
    schedulePush();
    renderWeeklyPage(claimResult);
    updateBalanceDisplay();
}

// -------------------------------------------------------
// Countdown Timer
// -------------------------------------------------------

let weeklyCountdownInterval = null;

function startWeeklyCountdown() {
    const el = document.getElementById('weeklyReset');
    if (!el) return;

    const tick = () => {
        const state   = getWeeklyState();
        const weekEnd = state.weekStart + 7 * 24 * 3600 * 1000;
        const diff    = weekEnd - Date.now();

        if (diff <= 0) {
            el.textContent = 'A new week has started!';
            renderWeeklyPage();
            return;
        }

        const d = Math.floor(diff / 86400000);
        const h = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        el.textContent = `Week resets in: ${d}d ${h}:${m}:${s}`;
    };

    tick();
    if (weeklyCountdownInterval) clearInterval(weeklyCountdownInterval);
    weeklyCountdownInterval = setInterval(tick, 1000);
}

// -------------------------------------------------------
// Render
// -------------------------------------------------------

function renderWeeklyPage(claimResult = null) {
    const state      = getWeeklyState();
    const currentDay = getCurrentWeekDay();
    const daysEl     = document.getElementById('weeklyDays');
    if (!daysEl) return;

    daysEl.innerHTML = WEEKLY_REWARDS.map((reward, i) => {
        const claimed      = state.claimed.includes(i);
        const isToday      = i === currentDay;
        const isFuture     = i > currentDay;
        const isMissed     = i < currentDay && !claimed;
        const isAvailable  = isToday && !claimed;

        let statusClass = '';
        if (claimed)      statusClass = 'claimed';
        else if (isAvailable) statusClass = 'available';
        else if (isFuture)    statusClass = 'future';
        else if (isMissed)    statusClass = 'missed';

        let statusHtml = '';
        if (claimed)      statusHtml = '<div class="weekly-status claimed-badge">✓ Claimed</div>';
        else if (isAvailable) statusHtml = `<button class="weekly-claim-btn" onclick="claimWeeklyDay(${i})">Claim</button>`;
        else if (isFuture)    statusHtml = '<div class="weekly-status future-badge">🔒 Upcoming</div>';
        else if (isMissed)    statusHtml = '<div class="weekly-status missed-badge">Missed</div>';

        const rewardText = reward.type === 'coins'
            ? `${Math.round(reward.base * getWeeklyMultiplier()).toLocaleString()} coins`
            : reward.desc;

        return `
            <div class="weekly-day-card ${statusClass}">
                <div class="weekly-day-label">${reward.dayName}</div>
                <div class="weekly-day-icon">${reward.icon}</div>
                <div class="weekly-day-reward">${rewardText}</div>
                ${statusHtml}
            </div>
        `;
    }).join('');

    // Show claim result
    const resultEl = document.getElementById('weeklyClaimResult');
    if (claimResult && resultEl) {
        resultEl.classList.remove('hidden');
        if (claimResult.type === 'coins') {
            resultEl.innerHTML = `<div class="weekly-result-coins">
                💰 Claimed ${claimResult.amount.toLocaleString()} coins!
            </div>`;
        } else {
            const col = RARITY_CLASSES[claimResult.item.rarity] || '';
            resultEl.innerHTML = `<div class="weekly-result-case">
                <div class="weekly-result-label">Free ${claimResult.caseName} opened!</div>
                <div class="weekly-result-item ${col}">${claimResult.item.fullItem}</div>
                <div class="weekly-result-value">Worth ${claimResult.item.coins.toLocaleString()} coins · Added to inventory</div>
            </div>`;
        }
        setTimeout(() => resultEl.classList.add('hidden'), 9000);
    }
}

// -------------------------------------------------------
// Init
// -------------------------------------------------------

function initWeekly() {
    getWeeklyState(); // ensure week is initialised
    startWeeklyCountdown();
}