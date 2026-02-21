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

  // ── Hero Floating Keywords & Collision ──
  const floatContainer = document.getElementById('heroFloatingWords');
  const heroSection = document.getElementById('hero');
  const lineFill = document.getElementById('heroLineFill');
  let currentFill = 0;

  if (floatContainer && heroSection) {
    const keywords = [
      'AGENT', 'COPILOT', 'S/4HANA', 'DASHBOARD', 'VERİMLİLİK',
      'BÜLTEN', 'RPA', 'POWER BI', 'OTOMASYON', 'SAP', 'PYTHON',
      'MACHINE LEARNING', 'FATURA', 'RAPOR', 'DİJİTAL İKİZ', 'IOT',
      'ANALİTİK', 'WORKFLOW', 'ERP', 'API', 'CLOUD', 'DATA LAKE',
      'GENAI', 'NLP', 'CHATBOT', 'FIORI', 'ABAP', 'VBA', 'EXCEL',
      'MUTABAKAT', 'RİSK ANALİZİ', 'KONSOLİDASYON', 'BLOCKCHAIN',
      'DEEP LEARNING', 'TAHSİLAT', 'E-FATURA', 'REAL-TIME'
    ];

    function spawnCollisionDrop(topPercent) {
      const drop = document.createElement('div');
      drop.className = 'collision-drop';
      drop.style.setProperty('--drop-start', topPercent + '%');

      // Blue only
      const color = 'var(--neon-blue)';
      drop.style.background = `linear-gradient(to bottom, ${color}, transparent)`;
      drop.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;

      heroSection.appendChild(drop);

      // Accumulate Line Fill
      // Only contribute if below previous fill or random chance
      if (lineFill) {
        // Increase fill slightly
        currentFill += 0.5;

        if (currentFill >= 100) {
          // ── TRIGGER DISCHARGE COMBO ──
          currentFill = 0;

          const shockwave = document.getElementById('heroShockwave');
          const title = document.querySelector('.hero-title');

          if (shockwave) {
            shockwave.classList.add('active');
            setTimeout(() => shockwave.classList.remove('active'), 1000);
          }

          if (title) {
            title.classList.add('flash');
            setTimeout(() => title.classList.remove('flash'), 1000);
          }

          // Screen Shake
          document.body.classList.add('shake-effect');
          setTimeout(() => document.body.classList.remove('shake-effect'), 500);
        }

        lineFill.style.height = currentFill + '%';
      }

      // Remove after animation
      setTimeout(() => {
        drop.remove();
      }, 1500);
    }

    function spawnWord(instant = false) {
      const word = document.createElement('span');
      word.textContent = keywords[Math.floor(Math.random() * keywords.length)];

      const side = Math.random() > 0.5 ? 'left' : 'right';
      word.className = `hero-floating-word ${side}`;

      const size = 0.8 + Math.random() * 2.0; // 0.8rem - 2.8rem
      const top = Math.random() * 90;          // 0% - 90% vertical
      // Duration needs to be consistent for collision calculation
      // Let's vary it slightly but keep it trackable if we want precise collision 
      // For now, simpler approach: CSS animation handles movement. 
      // We just need to sync the drop.

      // Faster animation for higher energy
      const duration = 6 + Math.random() * 8; // 6s - 14s travel time
      const opacity = 0.3 + Math.random() * 0.6;

      word.style.fontSize = size + 'rem';
      word.style.top = top + '%';
      word.style.animationDuration = duration + 's';
      word.style.setProperty('--word-opacity', opacity);

      if (instant) {
        // Instant spawn (already in motion) - tricky to sync collision for these
        word.style.animationDelay = `-${Math.random() * duration}s`;
      } else {
        // New spawn - schedule collision drop
        // Collision happens at 50% progress (since we move from side to center in CSS? 
        // Actually CSS moves from 0 to Center. So collision is at end of animation? 
        // Wait, current CSS moves from -10% to Center? 
        // Let's re-read CSS intent: 
        // right: -10% -> translateX(-50vw ...) 
        // It moves TOWARDS center. The animation ends AT the center.
        // So collision is at the END of the animation duration.

        setTimeout(() => {
          if (document.body.contains(word)) { // Check if word still exists/visible
            spawnCollisionDrop(top);
          }
        }, duration * 1000 * 0.95); // Trigger slightly before end to look good
      }

      floatContainer.appendChild(word);

      // Remove after animation completes
      setTimeout(() => {
        word.remove();
      }, duration * 1000);
    }

    // Spawn initial batch
    for (let i = 0; i < 50; i++) {
      spawnWord(true);
    }

    // High Density Spawning
    setInterval(() => spawnWord(false), 150); // Every 150ms
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
