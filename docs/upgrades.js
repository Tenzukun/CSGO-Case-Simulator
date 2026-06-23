// -------------------------------------------------------
// Upgrades Page — Cases + Fishing skill trees
// -------------------------------------------------------

let activeUpgradeTab = 'cases';

function switchUpgradeTab(tabId) {
    activeUpgradeTab = tabId;

    document.querySelectorAll('.upgrade-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.utab === tabId);
    });
    document.querySelectorAll('.upgrade-tab-content').forEach(el => {
        el.classList.toggle('hidden', el.id !== `upgradeTab-${tabId}`);
    });

    if (tabId === 'cases')   renderCaseSkillTree('caseSkillContainer');
    if (tabId === 'fishing') renderFishingSkillTree('fishSkillContainer');
}

function initUpgradesPage() {
    document.querySelectorAll('.upgrade-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchUpgradeTab(btn.dataset.utab));
    });

    // Ensure root skills are always unlocked
    const caseUnlocked = getCaseSkillsUnlocked();
    if (!caseUnlocked.includes('case_novice')) {
        caseUnlocked.push('case_novice');
        localStorage.setItem('csgo_case_skills', JSON.stringify(caseUnlocked));
    }

    const fishUnlocked = getFishSkillsUnlocked();
    if (!fishUnlocked.includes('fisher_novice')) {
        fishUnlocked.push('fisher_novice');
        localStorage.setItem('csgo_fishing_skills', JSON.stringify(fishUnlocked));
    }
}

function renderUpgradesPage() {
    if (activeUpgradeTab === 'cases')   renderCaseSkillTree('caseSkillContainer');
    if (activeUpgradeTab === 'fishing') renderFishingSkillTree('fishSkillContainer');
}
