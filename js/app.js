/* ============================================
   APP.JS - Core application logic
   Theme, Navigation, Presentation Mode
   ============================================ */

// ── Theme Management ──
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('mid-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mid-theme', next);
  });
}

// ── Mobile Hamburger ──
// ── Advanced Menu & Magnetic Button ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  // Toggle Menu
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Toggle body scroll
    if (navLinks.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Magnetic Button Effect
  hamburger.addEventListener('mousemove', (e) => {
    const rect = hamburger.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Move button slightly (magnetic pull)
    hamburger.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  hamburger.addEventListener('mouseleave', () => {
    // Reset position
    hamburger.style.transform = 'translate(0, 0)';
  });
}



// ── Modal Utilities ──
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');

function openModal(html) {
  if (!modalOverlay || !modalContent) return;
  modalContent.innerHTML = html;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Close handlers
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  const closeBtn = modalContent.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
}

function closeModal() {
  if (!modalOverlay) return;
  // Stop any playing video/audio inside the modal
  const video = modalContent?.querySelector('video');
  if (video) {
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) closeModal();
});

// ── Scroll Animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.metric-card, .panel, .fan-container').forEach(el => {
    observer.observe(el);
  });

  // ── Hero Floating Keywords ──
  const floatContainer = document.getElementById('heroFloatingWords');
  if (floatContainer) {
    const keywords = [
      'AGENT', 'COPILOT', 'S/4HANA', 'DASHBOARD', 'VERİMLİLİK',
      'BÜLTEN', 'RPA', 'POWER BI', 'OTOMASYON', 'SAP', 'PYTHON',
      'MACHINE LEARNING', 'FATURA', 'RAPOR', 'DİJİTAL İKİZ', 'IOT',
      'ANALİTİK', 'WORKFLOW', 'ERP', 'API', 'CLOUD', 'DATA LAKE',
      'GENAI', 'NLP', 'CHATBOT', 'FIORI', 'ABAP', 'VBA', 'EXCEL',
      'MUTABAKAT', 'RİSK ANALİZİ', 'KONSOLİDASYON', 'BLOCKCHAIN',
      'DEEP LEARNING', 'TAHSİLAT', 'E-FATURA', 'REAL-TIME'
    ];

    function spawnWord(instant = false) {
      const word = document.createElement('span');
      word.className = 'hero-floating-word';
      word.textContent = keywords[Math.floor(Math.random() * keywords.length)];

      const size = 0.9 + Math.random() * 2.5; // 0.9rem - 3.4rem
      const top = Math.random() * 95;          // 0% - 95% vertical
      const duration = 15 + Math.random() * 20; // 15s - 35s flow
      const opacity = 0.3 + Math.random() * 0.4; // 0.3 - 0.7 opacity (much more visible)

      word.style.fontSize = size + 'rem';
      word.style.top = top + '%';
      word.style.animationDuration = duration + 's';
      word.style.opacity = opacity;

      if (instant) {
        word.style.animationDelay = `-${Math.random() * duration}s`;
      }

      floatContainer.appendChild(word);

      // Remove after animation completes
      setTimeout(() => {
        word.remove();
      }, duration * 1000);
    }

    // Spawn initial batch - Instant fill
    for (let i = 0; i < 40; i++) {
      spawnWord(true);
    }

    // Keep spawning - High density
    setInterval(() => spawnWord(false), 400);
  }

  // ── Panel Tabs Logic ──
  const tabs = document.querySelectorAll('.panel-tab');
  const contents = document.querySelectorAll('.panel-tab-content');

  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked
        tab.classList.add('active');
        const targetId = `panel-${tab.dataset.tab}`;
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }
});
