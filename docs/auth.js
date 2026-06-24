// -------------------------------------------------------
// Auth System
// -------------------------------------------------------
// NOTE: Passwords are hashed with SHA-256 client-side
// before storing in Firebase. This is a fun web game,
// not a banking app — don't use a real password here.
// -------------------------------------------------------

// -------------------------------------------------------
// Force wipe — bump this string to wipe all users'
// localStorage on their next visit.
// -------------------------------------------------------
const RESET_VERSION = 'v2';

(function enforceReset() {
    if (localStorage.getItem('csgo_reset_version') !== RESET_VERSION) {
        Object.keys(localStorage)
            .filter(k => k.startsWith('csgo_') && k !== 'csgo_reset_version')
            .forEach(k => localStorage.removeItem(k));
        localStorage.setItem('csgo_reset_version', RESET_VERSION);
    }
})();

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

async function sha256(str) {
    const buf  = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function isGuest() {
    return localStorage.getItem('csgo_guest') === 'true';
}

function isLoggedIn() {
    return !isGuest() && !!localStorage.getItem('csgo_username');
}

function setAuthError(elId, msg) {
    const el = document.getElementById(elId);
    if (el) el.textContent = msg;
}

function clearAuthErrors() {
    setAuthError('authSignInError', '');
    setAuthError('authSignUpError', '');
}

// -------------------------------------------------------
// Sign In
// -------------------------------------------------------

async function authSignIn() {
    const username = document.getElementById('authSignInUsername').value.trim();
    const password = document.getElementById('authSignInPassword').value;

    if (!username || !password) {
        setAuthError('authSignInError', 'Please fill in all fields.');
        return;
    }

    const btn = document.getElementById('authSignInBtn');
    btn.disabled    = true;
    btn.textContent = 'Signing in...';

    try {
        const res  = await fetch(`${FIREBASE_URL}/users/${encodeURIComponent(username)}.json`);
        const user = await res.json();

        if (!user) {
            setAuthError('authSignInError', 'Username not found.');
            btn.disabled = false; btn.textContent = 'Sign In';
            return;
        }

        const hash = await sha256(password);
        if (hash !== user.passwordHash) {
            setAuthError('authSignInError', 'Incorrect password.');
            btn.disabled = false; btn.textContent = 'Sign In';
            return;
        }

        // Load saved player data
        const pRes   = await fetch(`${FIREBASE_URL}/players/${encodeURIComponent(username)}.json`);
        const pData  = await pRes.json();
        if (pData) {
            applyCloudData(username, pData);
        } else {
            localStorage.setItem('csgo_username', username);
        }

        localStorage.removeItem('csgo_guest');
        document.getElementById('authOverlay').classList.add('hidden');
        location.reload();

    } catch (e) {
        setAuthError('authSignInError', 'Connection error. Try again.');
        btn.disabled = false; btn.textContent = 'Sign In';
    }
}

// -------------------------------------------------------
// Create Account
// -------------------------------------------------------

async function authSignUp() {
    const username = document.getElementById('authSignUpUsername').value.trim();
    const password = document.getElementById('authSignUpPassword').value;
    const confirm  = document.getElementById('authSignUpConfirm').value;

    if (!username || !password) {
        setAuthError('authSignUpError', 'Please fill in all fields.');
        return;
    }
    if (username.length < 3) {
        setAuthError('authSignUpError', 'Username must be at least 3 characters.');
        return;
    }
    if (/[^a-zA-Z0-9_]/.test(username)) {
        setAuthError('authSignUpError', 'Username can only contain letters, numbers, and underscores.');
        return;
    }
    if (password.length < 4) {
        setAuthError('authSignUpError', 'Password must be at least 4 characters.');
        return;
    }
    if (password !== confirm) {
        setAuthError('authSignUpError', 'Passwords do not match.');
        return;
    }

    const btn = document.getElementById('authSignUpBtn');
    btn.disabled    = true;
    btn.textContent = 'Creating...';

    try {
        const res  = await fetch(`${FIREBASE_URL}/users/${encodeURIComponent(username)}.json`);
        const user = await res.json();

        if (user) {
            setAuthError('authSignUpError', 'Username already taken.');
            btn.disabled = false; btn.textContent = 'Create Account';
            return;
        }

        const hash = await sha256(password);
        await fetch(`${FIREBASE_URL}/users/${encodeURIComponent(username)}.json`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ passwordHash: hash, createdAt: Date.now() })
        });

        localStorage.setItem('csgo_username', username);
        localStorage.removeItem('csgo_guest');
        document.getElementById('authOverlay').classList.add('hidden');
        schedulePush();

    } catch (e) {
        setAuthError('authSignUpError', 'Connection error. Try again.');
        btn.disabled = false; btn.textContent = 'Create Account';
    }
}

// -------------------------------------------------------
// Guest
// -------------------------------------------------------

function playAsGuest() {
    localStorage.setItem('csgo_guest', 'true');
    localStorage.removeItem('csgo_username');
    document.getElementById('authOverlay').classList.add('hidden');
}

// -------------------------------------------------------
// Sign Out
// -------------------------------------------------------

function signOut() {
    if (!confirm('Sign out? Your progress is saved to your account.')) return;
    Object.keys(localStorage)
        .filter(k => k.startsWith('csgo_') && k !== 'csgo_reset_version')
        .forEach(k => localStorage.removeItem(k));
    location.reload();
}

// -------------------------------------------------------
// Init
// -------------------------------------------------------

function initAuth() {
    // Sign out must be wired regardless of login state
    document.getElementById('signOutBtn')?.addEventListener('click', signOut);

    if (isLoggedIn() || isGuest()) return;

    document.getElementById('authOverlay').classList.remove('hidden');

    // Tab switching
    document.getElementById('authSignInTab').addEventListener('click', () => {
        document.getElementById('authSignInTab').classList.add('active');
        document.getElementById('authSignUpTab').classList.remove('active');
        document.getElementById('authSignInForm').classList.remove('hidden');
        document.getElementById('authSignUpForm').classList.add('hidden');
        clearAuthErrors();
    });

    document.getElementById('authSignUpTab').addEventListener('click', () => {
        document.getElementById('authSignUpTab').classList.add('active');
        document.getElementById('authSignInTab').classList.remove('active');
        document.getElementById('authSignUpForm').classList.remove('hidden');
        document.getElementById('authSignInForm').classList.add('hidden');
        clearAuthErrors();
    });

    document.getElementById('authSignInBtn').addEventListener('click', authSignIn);
    document.getElementById('authSignUpBtn').addEventListener('click', authSignUp);
    document.getElementById('authGuestBtn').addEventListener('click', playAsGuest);

    // Enter key support
    ['authSignInUsername', 'authSignInPassword'].forEach(id => {
        document.getElementById(id)?.addEventListener('keydown', e => {
            if (e.key === 'Enter') authSignIn();
        });
    });
    ['authSignUpUsername', 'authSignUpPassword', 'authSignUpConfirm'].forEach(id => {
        document.getElementById(id)?.addEventListener('keydown', e => {
            if (e.key === 'Enter') authSignUp();
        });
    });
}