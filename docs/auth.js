// -------------------------------------------------------
// Auth System — Firebase Authentication
// -------------------------------------------------------
// Uses the Firebase Auth REST API (no SDK required).
// Passwords are managed entirely by Firebase Auth.
// Each account stores a UID→username mapping in the
// Realtime Database so the rest of the app is unchanged.
// -------------------------------------------------------

// -------------------------------------------------------
// Force wipe — bump this string to wipe all users'
// localStorage on their next visit.
// v3: migrated to Firebase Authentication
// -------------------------------------------------------
const RESET_VERSION = 'v3';

(function enforceReset() {
    if (localStorage.getItem('csgo_reset_version') !== RESET_VERSION) {
        Object.keys(localStorage)
            .filter(k => k.startsWith('csgo_') && k !== 'csgo_reset_version')
            .forEach(k => localStorage.removeItem(k));
        localStorage.setItem('csgo_reset_version', RESET_VERSION);
    }
})();

// -------------------------------------------------------
// Firebase Auth REST helper
// -------------------------------------------------------

async function firebaseAuthRequest(endpoint, body) {
    const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${FIREBASE_API_KEY}`,
        {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(body)
        }
    );
    const data = await res.json();
    if (!res.ok) throw data.error || { message: 'Unknown error' };
    return data;
}

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

function isGuest() {
    return localStorage.getItem('csgo_guest') === 'true';
}

function isLoggedIn() {
    return !isGuest() && !!localStorage.getItem('csgo_uid');
}

function getUsername() {
    return localStorage.getItem('csgo_username');
}

function setAuthError(elId, msg) {
    const el = document.getElementById(elId);
    if (el) el.textContent = msg;
}

function clearAuthErrors() {
    setAuthError('authSignInError',  '');
    setAuthError('authSignUpError',  '');
    setAuthError('authForgotError',  '');
    setAuthError('authForgotSuccess', '');
}

// Maps Firebase Auth error codes to friendly messages
function getFirebaseErrorMessage(error) {
    const code = (error?.message || '').toUpperCase();
    if (code.includes('INVALID_LOGIN_CREDENTIALS') ||
        code.includes('WRONG_PASSWORD') ||
        code.includes('EMAIL_NOT_FOUND') ||
        code.includes('INVALID_PASSWORD')) {
        return 'Incorrect email or password.';
    }
    if (code.includes('EMAIL_EXISTS'))         return 'An account with this email already exists.';
    if (code.includes('INVALID_EMAIL'))        return 'Please enter a valid email address.';
    if (code.includes('WEAK_PASSWORD'))        return 'Password must be at least 6 characters.';
    if (code.includes('USER_DISABLED'))        return 'This account has been disabled.';
    if (code.includes('TOO_MANY_ATTEMPTS') ||
        code.includes('TOO_MANY_REQUESTS'))    return 'Too many attempts. Please try again later.';
    if (code.includes('NETWORK'))              return 'Connection error. Check your internet.';
    return 'Something went wrong. Please try again.';
}

// -------------------------------------------------------
// Sign In
// -------------------------------------------------------

async function authSignIn() {
    const email    = document.getElementById('authSignInEmail').value.trim();
    const password = document.getElementById('authSignInPassword').value;

    if (!email || !password) {
        setAuthError('authSignInError', 'Please fill in all fields.');
        return;
    }

    const btn = document.getElementById('authSignInBtn');
    btn.disabled    = true;
    btn.textContent = 'Signing in...';

    try {
        // Authenticate with Firebase Auth
        const authData = await firebaseAuthRequest('signInWithPassword', {
            email, password, returnSecureToken: true
        });

        const uid = authData.localId;

        // Look up the username mapped to this UID
        const mapRes  = await fetch(`${FIREBASE_URL}/auth_users/${uid}.json`);
        const mapData = await mapRes.json();
        const username = mapData?.username;

        if (!username) {
            setAuthError('authSignInError', 'Account data not found. Please contact support.');
            btn.disabled = false; btn.textContent = 'Sign In';
            return;
        }

        // Load saved player data from Firebase
        const pRes  = await fetch(`${FIREBASE_URL}/players/${encodeURIComponent(username)}.json`);
        const pData = await pRes.json();

        if (pData) {
            applyCloudData(username, pData);
        } else {
            localStorage.setItem('csgo_username', username);
        }

        localStorage.setItem('csgo_uid', uid);
        localStorage.setItem('csgo_refresh_token', authData.refreshToken);
        localStorage.removeItem('csgo_guest');

        document.getElementById('authOverlay').classList.add('hidden');
        location.reload();

    } catch (e) {
        setAuthError('authSignInError', getFirebaseErrorMessage(e));
        btn.disabled = false; btn.textContent = 'Sign In';
    }
}

// -------------------------------------------------------
// Create Account
// -------------------------------------------------------

async function authSignUp() {
    const email    = document.getElementById('authSignUpEmail').value.trim();
    const username = document.getElementById('authSignUpUsername').value.trim();
    const password = document.getElementById('authSignUpPassword').value;
    const confirm  = document.getElementById('authSignUpConfirm').value;

    if (!email || !username || !password) {
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
    if (password.length < 6) {
        setAuthError('authSignUpError', 'Password must be at least 6 characters.');
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
        // Check username availability
        const nameRes  = await fetch(`${FIREBASE_URL}/auth_usernames/${encodeURIComponent(username)}.json`);
        const nameData = await nameRes.json();
        if (nameData) {
            setAuthError('authSignUpError', 'Username already taken.');
            btn.disabled = false; btn.textContent = 'Create Account';
            return;
        }

        // Create Firebase Auth account
        const authData = await firebaseAuthRequest('signUp', {
            email, password, returnSecureToken: true
        });

        const uid = authData.localId;

        // Store UID → username + email mapping
        await fetch(`${FIREBASE_URL}/auth_users/${uid}.json`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ username, email, createdAt: Date.now() })
        });

        // Store username → UID for uniqueness checks on future sign-ups
        await fetch(`${FIREBASE_URL}/auth_usernames/${encodeURIComponent(username)}.json`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(uid)
        });

        localStorage.setItem('csgo_uid', uid);
        localStorage.setItem('csgo_username', username);
        localStorage.setItem('csgo_refresh_token', authData.refreshToken);
        localStorage.removeItem('csgo_guest');

        document.getElementById('authOverlay').classList.add('hidden');
        schedulePush();

    } catch (e) {
        setAuthError('authSignUpError', getFirebaseErrorMessage(e));
        btn.disabled = false; btn.textContent = 'Create Account';
    }
}

// -------------------------------------------------------
// Forgot Password
// -------------------------------------------------------

async function authForgotPassword() {
    const email = document.getElementById('authForgotEmail').value.trim();

    if (!email) {
        setAuthError('authForgotError', 'Please enter your email address.');
        return;
    }

    const btn = document.getElementById('authForgotBtn');
    btn.disabled    = true;
    btn.textContent = 'Sending...';

    try {
        await firebaseAuthRequest('sendOobCode', {
            requestType: 'PASSWORD_RESET',
            email
        });

        setAuthError('authForgotError', '');
        setAuthError('authForgotSuccess', 'Reset email sent! Check your inbox.');
        btn.textContent = 'Sent!';

    } catch (e) {
        setAuthError('authForgotError', getFirebaseErrorMessage(e));
        btn.disabled = false; btn.textContent = 'Send Reset Email';
    }
}

// -------------------------------------------------------
// Guest
// -------------------------------------------------------

function playAsGuest() {
    localStorage.setItem('csgo_guest', 'true');
    localStorage.removeItem('csgo_username');
    localStorage.removeItem('csgo_uid');
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
// Forgot password view helpers
// -------------------------------------------------------

function showForgotPassword() {
    document.getElementById('authTabsRow').classList.add('hidden');
    document.getElementById('authSignInForm').classList.add('hidden');
    document.getElementById('authSignUpForm').classList.add('hidden');
    document.getElementById('authForgotForm').classList.remove('hidden');
    document.getElementById('authDivider').classList.add('hidden');
    document.getElementById('authGuestBtn').classList.add('hidden');
    document.getElementById('authGuestNote').classList.add('hidden');
    clearAuthErrors();
}

function showSignInTab() {
    document.getElementById('authTabsRow').classList.remove('hidden');
    document.getElementById('authForgotForm').classList.add('hidden');
    document.getElementById('authDivider').classList.remove('hidden');
    document.getElementById('authGuestBtn').classList.remove('hidden');
    document.getElementById('authGuestNote').classList.remove('hidden');
    document.getElementById('authSignInTab').classList.add('active');
    document.getElementById('authSignUpTab').classList.remove('active');
    document.getElementById('authSignInForm').classList.remove('hidden');
    document.getElementById('authSignUpForm').classList.add('hidden');
    clearAuthErrors();
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

    // Form buttons
    document.getElementById('authSignInBtn').addEventListener('click', authSignIn);
    document.getElementById('authSignUpBtn').addEventListener('click', authSignUp);
    document.getElementById('authGuestBtn').addEventListener('click', playAsGuest);
    document.getElementById('authForgotBtn').addEventListener('click', authForgotPassword);
    document.getElementById('authForgotLink').addEventListener('click', showForgotPassword);
    document.getElementById('authBackLink').addEventListener('click', showSignInTab);

    // Enter key support
    ['authSignInEmail', 'authSignInPassword'].forEach(id => {
        document.getElementById(id)?.addEventListener('keydown', e => {
            if (e.key === 'Enter') authSignIn();
        });
    });
    ['authSignUpEmail', 'authSignUpUsername', 'authSignUpPassword', 'authSignUpConfirm'].forEach(id => {
        document.getElementById(id)?.addEventListener('keydown', e => {
            if (e.key === 'Enter') authSignUp();
        });
    });
    document.getElementById('authForgotEmail')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') authForgotPassword();
    });
}
