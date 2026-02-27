/* ============================================
   ENV.JS - Merkezi Ortam Değişkenleri
   ⚠️ Bu dosyadaki __PLACEHOLDER__ değerler
   GitHub Actions tarafından deploy sırasında
   gerçek değerlerle değiştirilir.
   ============================================ */

const ENV = {
  // ── API Anahtarları ──
  HF_API_TOKEN: '__HF_API_TOKEN__',

  // ── Kimlik Doğrulama ──
  PASSWORD_HASH: '__PASSWORD_HASH__',
  ADMIN_HASH: '__ADMIN_HASH__',

  // ── GitHub API (Admin Yayınlama) ──
  GITHUB_PAT: '__GH_PAT__',
  GITHUB_REPO: 'mustafaafiskirma/digital',

  // ── Güvenlik Parametreleri ──
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 300000,           // 5 dakika (ms)
  INACTIVITY_TIMEOUT: 1800000,        // 30 dakika (ms)
  INACTIVITY_WARNING: 1500000,        // 25 dakika (ms)
  PROGRESSIVE_DELAYS: [0, 0, 5000, 15000, 30000],
  MAX_INPUT_LENGTH: 64
};
