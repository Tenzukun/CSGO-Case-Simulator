// -------------------------------------------------------
// Sound Effects — Web Audio API (no files needed)
// -------------------------------------------------------

const SFX = (() => {
    let _ctx = null;

    function ctx() {
        if (!_ctx) {
            const C = window.AudioContext || window.webkitAudioContext;
            _ctx = new C();
        }
        // Resume in case browser suspended it
        if (_ctx.state === 'suspended') _ctx.resume();
        return _ctx;
    }

    function enabled() {
        return localStorage.getItem('csgo_sound_enabled') !== 'false';
    }

    // -------------------------------------------------------
    // Primitives
    // -------------------------------------------------------

    // Oscillator: type, freq, startVol, endVol, startTime, duration, freqEnd
    function osc(type, freq, vol, endVol, t0, dur, freqEnd) {
        const c  = ctx();
        const o  = c.createOscillator();
        const g  = c.createGain();
        const at = c.currentTime + t0;
        o.type = type;
        o.frequency.setValueAtTime(freq, at);
        if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, at + dur);
        g.gain.setValueAtTime(vol, at);
        g.gain.exponentialRampToValueAtTime(Math.max(endVol, 0.0001), at + dur);
        o.connect(g);
        g.connect(c.destination);
        o.start(at);
        o.stop(at + dur + 0.02);
    }

    // Short noise burst (splash, impact, etc.)
    function noise(dur, vol, t0 = 0, freq = 1500) {
        const c      = ctx();
        const frames = Math.ceil(c.sampleRate * dur);
        const buf    = c.createBuffer(1, frames, c.sampleRate);
        const data   = buf.getChannelData(0);
        for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
        const src    = c.createBufferSource();
        const filt   = c.createBiquadFilter();
        const g      = c.createGain();
        const at     = c.currentTime + t0;
        src.buffer   = buf;
        filt.type    = 'bandpass';
        filt.frequency.value = freq;
        filt.Q.value = 0.8;
        g.gain.setValueAtTime(vol, at);
        g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
        src.connect(filt); filt.connect(g); g.connect(c.destination);
        src.start(at); src.stop(at + dur);
    }

    // -------------------------------------------------------
    // Case Opening
    // -------------------------------------------------------

    function roll() {
        if (!enabled()) return;
        // Rapid ticking that builds up
        for (let i = 0; i < 10; i++) {
            const t    = i * 0.08;
            const freq = 220 + i * 30;
            osc('square', freq, 0.06, 0.001, t, 0.04);
        }
        // Final wind-up tone
        osc('sine', 180, 0.1, 0.001, 0.85, 0.15, 400);
    }

    function reveal(rarity) {
        if (!enabled()) return;
        switch (rarity) {
            case 'Blue':       _revealBlue();   break;
            case 'Purple':     _revealPurple(); break;
            case 'Pink':       _revealPink();   break;
            case 'Rare (Red)': _revealRed();    break;
            case 'GOLD':       _revealGold();   break;
        }
    }

    function _revealBlue() {
        osc('sine', 660, 0.2, 0.001, 0, 0.35);
    }

    function _revealPurple() {
        osc('sine', 660, 0.18, 0.001, 0,    0.28);
        osc('sine', 880, 0.22, 0.001, 0.18, 0.38);
    }

    function _revealPink() {
        [880, 1100, 1320].forEach((f, i) => osc('sine', f, 0.2, 0.001, i * 0.11, 0.28));
    }

    function _revealRed() {
        noise(0.07, 0.3, 0, 300);
        osc('sawtooth', 90,  0.25, 0.001, 0,    0.18);
        osc('sine',     440, 0.22, 0.001, 0.14, 0.42);
        osc('sine',     660, 0.18, 0.001, 0.3,  0.55);
    }

    function _revealGold() {
        noise(0.12, 0.35, 0, 400);
        // Dramatic ascending fanfare
        const notes = [523, 659, 784, 1047, 1319, 1047, 1319, 1568];
        const times = [0,  0.1, 0.2, 0.35, 0.52, 0.65, 0.75, 0.88];
        notes.forEach((f, i) => osc('sine', f, 0.28, 0.001, times[i], 0.28));
        // Harmony layer
        osc('triangle', 523, 0.1, 0.001, 0.35, 0.7);
        osc('triangle', 659, 0.1, 0.001, 0.52, 0.6);
    }

    // -------------------------------------------------------
    // Coins / Economy
    // -------------------------------------------------------

    function coin() {
        if (!enabled()) return;
        osc('sine', 1050, 0.14, 0.001, 0,    0.10);
        osc('sine', 1350, 0.11, 0.001, 0.07, 0.20);
    }

    function sell() {
        if (!enabled()) return;
        osc('sine', 800,  0.12, 0.001, 0,    0.08);
        osc('sine', 1000, 0.12, 0.001, 0.06, 0.16);
        osc('sine', 1200, 0.10, 0.001, 0.12, 0.24);
    }

    // -------------------------------------------------------
    // Fishing
    // -------------------------------------------------------

    function cast() {
        if (!enabled()) return;
        // Whoosh down + splash
        osc('sine', 500, 0.12, 0.001, 0, 0.18, 80);
        noise(0.12, 0.12, 0.16, 2500);
    }

    function bite() {
        if (!enabled()) return;
        osc('triangle', 520, 0.18, 0.001, 0,    0.07);
        osc('triangle', 720, 0.14, 0.001, 0.05, 0.12);
    }

    function catchFish(type) {
        if (!enabled()) return;
        switch (type) {
            case 'coins':
                coin();
                break;
            case 'junk':
                osc('square', 180, 0.1, 0.001, 0, 0.12);
                osc('square', 140, 0.08, 0.001, 0.08, 0.2);
                break;
            case 'rare':
                osc('sine', 660,  0.18, 0.001, 0,    0.22);
                osc('sine', 880,  0.16, 0.001, 0.14, 0.36);
                osc('sine', 1100, 0.13, 0.001, 0.28, 0.48);
                break;
            case 'skin':
                _revealPink();
                break;
        }
    }

    // -------------------------------------------------------
    // Progression
    // -------------------------------------------------------

    function levelUp() {
        if (!enabled()) return;
        // Four-note ascending chord
        [523, 659, 784, 1047].forEach((f, i) => {
            osc('sine',     f, 0.25, 0.001, i * 0.13, 0.4);
            osc('triangle', f, 0.08, 0.001, i * 0.13, 0.35);
        });
    }

    function achievement() {
        if (!enabled()) return;
        [784, 988, 1175, 1568].forEach((f, i) =>
            osc('sine', f, 0.22, 0.001, i * 0.1, 0.28)
        );
    }

    // -------------------------------------------------------
    // UI
    // -------------------------------------------------------

    function unlock() {
        if (!enabled()) return;
        osc('sine', 440, 0.16, 0.001, 0,   0.12);
        osc('sine', 660, 0.18, 0.001, 0.1, 0.24);
        osc('sine', 880, 0.15, 0.001, 0.2, 0.38);
    }

    function click() {
        if (!enabled()) return;
        osc('sine', 480, 0.07, 0.001, 0, 0.05);
    }

    function weeklyCollect() {
        if (!enabled()) return;
        [523, 659, 784, 659, 1047].forEach((f, i) =>
            osc('sine', f, 0.2, 0.001, i * 0.1, 0.22)
        );
    }

    // -------------------------------------------------------
    // Settings toggle wiring
    // -------------------------------------------------------

    function initToggle() {
        const toggle = document.getElementById('soundToggle');
        if (!toggle) return;
        // Set initial state from localStorage
        toggle.checked = enabled();
        toggle.addEventListener('change', e => {
            localStorage.setItem('csgo_sound_enabled', e.target.checked ? 'true' : 'false');
            if (e.target.checked) click();
        });
    }

    return { roll, reveal, coin, sell, cast, bite, catchFish, levelUp, achievement, unlock, click, weeklyCollect, initToggle };
})();

document.addEventListener('DOMContentLoaded', () => SFX.initToggle());
