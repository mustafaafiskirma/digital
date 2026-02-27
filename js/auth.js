/* ============================================
   AUTH.JS - Güvenli Kimlik Doğrulama
   SHA-256 Hash + Brute-Force + Honeypot + Inactivity Timeout
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('passwordOverlay');
    const input = document.getElementById('passwordInput');
    const submitBtn = document.getElementById('passwordSubmit');
    const errorMsg = document.getElementById('passwordError');
    const lockoutMsg = document.getElementById('lockoutMessage');
    const honeypot = document.getElementById('honeypotField');

    // ── Güvenlik Yapılandırması (ENV objesinden okunur) ──
    const SECURITY_CONFIG = {
        passwordHash: ENV.PASSWORD_HASH,
        maxAttempts: ENV.MAX_LOGIN_ATTEMPTS,
        lockoutDuration: ENV.LOCKOUT_DURATION,
        inactivityTimeout: ENV.INACTIVITY_TIMEOUT,
        inactivityWarning: ENV.INACTIVITY_WARNING,
        progressiveDelays: ENV.PROGRESSIVE_DELAYS,
    };

    // ── Brute-Force Durum Takibi ──
    let failedAttempts = parseInt(sessionStorage.getItem('failedAttempts') || '0');
    let lockoutUntil = parseInt(sessionStorage.getItem('lockoutUntil') || '0');
    let isAuthenticated = false;

    // ── SHA-256 Hash Fonksiyonu ──
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ── Honeypot Kontrolü ──
    function isBot() {
        return honeypot && honeypot.value.length > 0;
    }

    // ── Lockout Kontrolü ──
    function isLockedOut() {
        if (lockoutUntil > Date.now()) {
            const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            if (lockoutMsg) {
                lockoutMsg.style.display = 'block';
                lockoutMsg.textContent = `Çok fazla başarısız deneme. ${minutes}:${seconds.toString().padStart(2, '0')} sonra tekrar deneyin.`;
            }
            return true;
        }
        if (lockoutMsg) lockoutMsg.style.display = 'none';
        return false;
    }

    // ── Progresif Bekleme ──
    function getDelay() {
        const delays = SECURITY_CONFIG.progressiveDelays;
        const index = Math.min(failedAttempts, delays.length - 1);
        return delays[index];
    }

    // ── Parola Kontrol Fonksiyonu ──
    async function checkPassword() {
        // Bot kontrolü
        if (isBot()) {
            console.warn('[GÜVENLİK] Bot tespit edildi - honeypot tetiklendi');
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'Erişim reddedildi.';
            return;
        }

        // Lockout kontrolü
        if (isLockedOut()) return;

        // Progresif bekleme kontrolü
        const delay = getDelay();
        if (delay > 0) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Bekleyin...';
            await new Promise(resolve => setTimeout(resolve, delay));
            submitBtn.disabled = false;
            submitBtn.textContent = 'Giriş';
        }

        const password = input.value;
        if (!password) return;

        // XSS sanitizasyon - tehlikeli karakterleri temizle
        const sanitized = password.replace(/[<>"'&]/g, '');

        // SHA-256 ile parola hash karşılaştırması
        const hash = await sha256(sanitized);

        const isAdmin = hash === ENV.ADMIN_HASH;
        const isRegular = hash === SECURITY_CONFIG.passwordHash;

        if (isAdmin || isRegular) {
            // ✅ Başarılı giriş
            failedAttempts = 0;
            sessionStorage.setItem('failedAttempts', '0');
            sessionStorage.removeItem('lockoutUntil');
            isAuthenticated = true;

            // Admin tespiti
            if (isAdmin) {
                sessionStorage.setItem('isAdmin', 'true');
                const adminBtn = document.getElementById('adminNavBtn');
                if (adminBtn) adminBtn.style.display = 'inline-block';
            } else {
                sessionStorage.removeItem('isAdmin');
            }

            // Giriş başarılı animasyon
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                // İnaktiflik zamanlayıcısını başlat
                startInactivityTimer();
            }, 500);

        } else {
            // ❌ Başarısız giriş
            failedAttempts++;
            sessionStorage.setItem('failedAttempts', failedAttempts.toString());

            // Kalan deneme sayısını göster
            const remaining = SECURITY_CONFIG.maxAttempts - failedAttempts;

            if (remaining <= 0) {
                // Hesap kilitle
                lockoutUntil = Date.now() + SECURITY_CONFIG.lockoutDuration;
                sessionStorage.setItem('lockoutUntil', lockoutUntil.toString());
                failedAttempts = 0;
                sessionStorage.setItem('failedAttempts', '0');

                if (lockoutMsg) {
                    lockoutMsg.style.display = 'block';
                    lockoutMsg.textContent = 'Çok fazla başarısız deneme. 5 dakika beklemelisiniz.';
                }
                errorMsg.style.display = 'none';

                // Lockout süresini geri say
                const lockoutInterval = setInterval(() => {
                    if (!isLockedOut()) {
                        clearInterval(lockoutInterval);
                    }
                }, 1000);

            } else {
                errorMsg.style.display = 'block';
                errorMsg.textContent = `Hatalı şifre. ${remaining} deneme hakkınız kaldı.`;
            }

            // Shake animasyonu
            input.parentElement.classList.add('shake');
            setTimeout(() => {
                input.parentElement.classList.remove('shake');
            }, 500);
            input.value = '';
            input.focus();
        }
    }

    // ── İnaktiflik Timeout Sistemi ──
    let inactivityTimer = null;
    let warningTimer = null;
    let inactivityModal = null;

    function startInactivityTimer() {
        resetInactivityTimer();

        // Kullanıcı etkileşimlerini dinle
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, resetInactivityTimer, { passive: true });
        });
    }

    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        clearTimeout(warningTimer);
        hideInactivityWarning();

        if (!isAuthenticated) return;

        // 25 dakikada uyarı göster
        warningTimer = setTimeout(() => {
            showInactivityWarning();
        }, SECURITY_CONFIG.inactivityWarning);

        // 30 dakikada oturumu sonlandır
        inactivityTimer = setTimeout(() => {
            logoutDueToInactivity();
        }, SECURITY_CONFIG.inactivityTimeout);
    }

    function showInactivityWarning() {
        if (inactivityModal) return;

        inactivityModal = document.createElement('div');
        inactivityModal.id = 'inactivityWarning';
        inactivityModal.style.cssText = `
            position: fixed; inset: 0; z-index: 99999;
            background: rgba(0,0,0,0.7);
            display: flex; align-items: center; justify-content: center;
            backdrop-filter: blur(5px);
        `;
        inactivityModal.innerHTML = `
            <div style="
                background: var(--bg-card, #1A2234);
                border: 1px solid var(--neon-blue, #00B4D8);
                border-radius: 16px;
                padding: 40px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 0 30px rgba(0,180,216,0.2);
            ">
                <div style="font-size: 3rem; margin-bottom: 16px;">⏱️</div>
                <h3 style="color: var(--text-primary, #fff); margin-bottom: 12px; font-size: 1.3rem;">
                    İnaktiflik Uyarısı
                </h3>
                <p style="color: var(--text-secondary, #94A3B8); margin-bottom: 24px; line-height: 1.6;">
                    5 dakika içinde etkileşim olmazsa oturumunuz güvenlik nedeniyle sonlandırılacaktır.
                </p>
                <button onclick="this.closest('#inactivityWarning').remove(); document.getElementById('inactivityWarning').__dismissed = true;" style="
                    padding: 12px 32px;
                    background: var(--neon-blue, #00B4D8);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                ">Devam Et</button>
            </div>
        `;
        document.body.appendChild(inactivityModal);
    }

    function hideInactivityWarning() {
        const warning = document.getElementById('inactivityWarning');
        if (warning) {
            warning.remove();
        }
        inactivityModal = null;
    }

    function logoutDueToInactivity() {
        isAuthenticated = false;
        hideInactivityWarning();

        // Password overlay'ı tekrar göster
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
        }
        if (input) {
            input.value = '';
            input.focus();
        }
        if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = 'İnaktiflik nedeniyle oturum sonlandırıldı.';
            errorMsg.style.color = '#ffa500';
        }
    }

    // ── Lockout durumunu başlangıçta kontrol et ──
    if (isLockedOut()) {
        const lockoutInterval = setInterval(() => {
            if (!isLockedOut()) {
                clearInterval(lockoutInterval);
            }
        }, 1000);
    }

    // ── Event Listener'lar ──
    if (submitBtn) {
        submitBtn.addEventListener('click', checkPassword);
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        input.focus();
    }

    // ── Konsol Güvenlik Uyarısı ──
    console.log(
        '%c⚠️ DUR!',
        'color: #E30613; font-size: 48px; font-weight: bold; text-shadow: 2px 2px 0 #000;'
    );
    console.log(
        '%cBu tarayıcı özelliği geliştiriciler içindir. Birisi size buraya bir şey yapıştırmanızı söylediyse, bu bir dolandırıcılık girişimidir ve hesabınıza erişim sağlayabilir.',
        'color: #ff6b6b; font-size: 16px; line-height: 1.6;'
    );
    console.log(
        '%cTÜPRAŞ MID Portal — Güvenlik Korumalı',
        'color: #00B4D8; font-size: 12px;'
    );
});
