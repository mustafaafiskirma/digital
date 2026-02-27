/* ============================================
   TRAINING.JS - Training Corner Logic
   ============================================ */

const trainingData = DataStore.getData('training');

const tabNames = [
  { key: 'videos', label: 'Video Eğitimler' },
  { key: 'docs', label: 'Dökümanlar' },
  { key: 'quickstart', label: 'Quick Start' },
  { key: 'faq', label: 'SSS' }
];

let activeTab = 'videos';
let searchQuery = '';

function renderTrainingTabs() {
  const el = document.getElementById('trainingTabs');
  if (!el) return;

  el.innerHTML = tabNames.map(t =>
    `<button class="tab-btn ${t.key === activeTab ? 'active' : ''}" data-tab="${t.key}">${t.label}</button>`
  ).join('');

  el.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      renderTrainingTabs();
      renderTrainingContent();
    });
  });
}

function renderTrainingContent() {
  const container = document.getElementById('trainingContent');
  if (!container) return;

  if (activeTab === 'faq') {
    renderFAQ(container);
    return;
  }

  const items = trainingData[activeTab];
  const filtered = searchQuery
    ? items.filter(i => i.title.toLowerCase().includes(searchQuery) || i.desc.toLowerCase().includes(searchQuery))
    : items;

  if (filtered.length === 0) {
    container.innerHTML = '<div style="text-align:center; color: var(--text-muted); padding: 48px;">Sonuç bulunamadı.</div>';
    return;
  }

  container.innerHTML = `
    <div class="training-grid">
      ${filtered.map(item => {
    let meta = '';
    if (item.duration) meta = `${item.duration}`;
    else if (item.format) meta = `${item.format}`;
    else if (item.time) meta = `${item.time}`;

    const hasVideo = item.videoFile ? 'data-video="' + item.videoFile + '"' : '';
    const clickHint = item.videoFile ? '<div style="margin-top:8px;font-size:0.75rem;color:var(--neon-blue);">▶ Tıkla ve izle</div>' : '';

    return `
          <div class="training-card" ${hasVideo} style="${item.videoFile ? 'cursor:pointer;' : ''}">
            <div class="card-type-icon">${item.icon}</div>
            <div class="card-title">${item.title}</div>
            <div class="card-desc">${item.desc}</div>
            <div class="card-meta">${meta}</div>
            ${clickHint}
          </div>
        `;
  }).join('')}
    </div>
  `;

  // Attach click handlers for video cards
  container.querySelectorAll('.training-card[data-video]').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.video;
      const title = card.querySelector('.card-title').textContent;
      const html = `
          <button class="modal-close">✕</button>
          <div class="modal-header"><h2>${title}</h2></div>
          <div style="margin-top:var(--space-lg);">
            <video controls autoplay style="width:100%;max-height:70vh;border-radius:var(--radius-md);background:#000;">
              <source src="${src}" type="video/mp4">
              Tarayıcınız video etiketini desteklemiyor.
            </video>
          </div>
        `;
      if (typeof openModal === 'function') openModal(html);
    });
  });
}

function renderFAQ(container) {
  const filtered = searchQuery
    ? trainingData.faq.filter(f => f.q.toLowerCase().includes(searchQuery) || f.a.toLowerCase().includes(searchQuery))
    : trainingData.faq;

  container.innerHTML = `
    <div class="faq-list">
      ${filtered.map((f, i) => `
        <div class="faq-item" id="faq-${i}">
          <button class="faq-question" onclick="toggleFAQ(${i})">
            ${f.q}
            <span class="arrow" style="transition: transform 0.3s;">▼</span>
          </button>
          <div class="faq-answer">${f.a}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleFAQ(index) {
  const item = document.getElementById(`faq-${index}`);
  if (item) item.classList.toggle('open');
}

// Search
function initSearch() {
  const input = document.getElementById('trainingSearch');
  if (!input) return;

  input.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderTrainingContent();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTrainingTabs();
  renderTrainingContent();
  initSearch();
});
