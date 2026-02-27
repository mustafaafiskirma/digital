#!/bin/bash
# ============================================
# setup-local.sh - Yerel Geliştirme Ortamı
# .env dosyasından değerleri js/env.js'e enjekte eder
# ============================================

ENV_FILE=".env"
TARGET="js/env.js"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env dosyası bulunamadı!"
    echo "   .env.example dosyasını .env olarak kopyalayıp doldurun:"
    echo "   cp .env.example .env"
    exit 1
fi

# .env dosyasından değerleri oku
source "$ENV_FILE"

# env.js'i template'den yeniden oluştur
cat > "$TARGET" << EOF
/* ============================================
   ENV.JS - Merkezi Ortam Değişkenleri
   Yerel ortam - setup-local.sh tarafından oluşturuldu
   ============================================ */

const ENV = {
  // ── API Anahtarları ──
  HF_API_TOKEN: '${HF_API_TOKEN}',

  // ── Kimlik Doğrulama ──
  PASSWORD_HASH: '${PASSWORD_HASH}',

  // ── Güvenlik Parametreleri ──
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 300000,
  INACTIVITY_TIMEOUT: 1800000,
  INACTIVITY_WARNING: 1500000,
  PROGRESSIVE_DELAYS: [0, 0, 5000, 15000, 30000],
  MAX_INPUT_LENGTH: 64
};
EOF

echo "✅ js/env.js yerel değerlerle güncellendi!"
echo "   ⚠️ DİKKAT: Bu dosyayı commit etmeden önce placeholder'lara döndürün:"
echo "   git checkout js/env.js"
