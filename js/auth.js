/* ============================================
   AUTH.JS - Password Protection Overlay
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('passwordOverlay');
    const input = document.getElementById('passwordInput');
    const submitBtn = document.getElementById('passwordSubmit');
    const errorMsg = document.getElementById('passwordError');

    // REMOVED: Session storage check to force login on every refresh
    // if (sessionStorage.getItem('authenticated') === 'true') { ... }

    // Function to check password
    function checkPassword() {
        const password = input.value;
        if (password === 'mustafa') {
            // REMOVED: sessionStorage.setItem('authenticated', 'true');

            // Success animation
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        } else {
            // Error animation
            errorMsg.style.display = 'block';
            input.parentElement.classList.add('shake');
            setTimeout(() => {
                input.parentElement.classList.remove('shake');
            }, 500);
            input.value = '';
            input.focus();
        }
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', checkPassword);
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        // Auto focus
        input.focus();
    }
});
