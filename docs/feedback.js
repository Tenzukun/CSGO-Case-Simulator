// -------------------------------------------------------
// Feedback Page
// -------------------------------------------------------

let fbRating = 0;

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

function fbHighlightStars(count) {
    document.querySelectorAll('.fb-star').forEach((star, i) => {
        star.classList.toggle('active', i < count);
    });
    const textEl = document.getElementById('fbRatingText');
    if (textEl) textEl.textContent = count > 0 ? RATING_LABELS[count] : '';
}

function fbResetForm() {
    fbRating = 0;
    fbHighlightStars(0);
    const msg = document.getElementById('fbMessage');
    const cat = document.getElementById('fbCategory');
    const btn = document.getElementById('fbSubmitBtn');
    if (msg) msg.value = '';
    if (cat) cat.value = 'General';
    if (btn) { btn.disabled = false; btn.textContent = 'Submit Feedback'; }
    document.getElementById('fbForm')?.classList.remove('hidden');
    document.getElementById('fbSuccess')?.classList.add('hidden');
}

async function fbSubmit() {
    if (fbRating === 0) {
        alert('Please select a star rating first.');
        return;
    }
    const message = document.getElementById('fbMessage')?.value.trim();
    if (!message) {
        alert('Please write a message before submitting.');
        return;
    }

    const category = document.getElementById('fbCategory')?.value || 'General';
    const username  = (typeof getUsername === 'function' && getUsername()) || 'Guest';
    const btn       = document.getElementById('fbSubmitBtn');

    if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

    const entry = { username, rating: fbRating, category, message, timestamp: Date.now() };

    try {
        if (typeof FIREBASE_URL !== 'undefined' && FIREBASE_URL) {
            await fetch(`${FIREBASE_URL}/feedback/${Date.now()}.json`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(entry)
            });
        }

        // Send email notification via EmailJS (silent fail — don't block submission)
        if (typeof emailjs !== 'undefined' && typeof EMAILJS_SERVICE_ID !== 'undefined') {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                username: entry.username,
                rating:   entry.rating,
                message:  entry.message,
                category: entry.category
            }).catch(e => console.warn('EmailJS notification failed:', e));
        }

        document.getElementById('fbForm')?.classList.add('hidden');
        document.getElementById('fbSuccess')?.classList.remove('hidden');
    } catch (e) {
        alert('Could not submit feedback. Please try again.');
        if (btn) { btn.disabled = false; btn.textContent = 'Submit Feedback'; }
    }
}

function renderFeedbackPage() {
    fbResetForm();
}

function initFeedbackPage() {
    // Initialise EmailJS with public key
    if (typeof emailjs !== 'undefined' && typeof EMAILJS_PUBLIC_KEY !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // Star rating interactivity
    document.querySelectorAll('.fb-star').forEach((star, i) => {
        star.addEventListener('mouseenter', () => fbHighlightStars(i + 1));
        star.addEventListener('mouseleave', () => fbHighlightStars(fbRating));
        star.addEventListener('click',      () => { fbRating = i + 1; fbHighlightStars(fbRating); });
    });

    document.getElementById('fbSubmitBtn')?.addEventListener('click', fbSubmit);
    document.getElementById('fbAgainBtn')?.addEventListener('click',  fbResetForm);
}