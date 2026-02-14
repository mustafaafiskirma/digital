/* ============================================
   ROADMAP.JS - Timeline / Kanban / List Views
   ============================================ */

const roadmapData = [
  // Agents (Synced with Homepage)
  { name: 'Tüpraş Mali İşler Asistanı', category: 'Agent', quarter: '2026 Q1', status: 'completed' },
  { name: 'Budget Asist', category: 'Agent', quarter: '2026 Q2', status: 'in-progress' },
  { name: 'Kurumsal Hafıza', category: 'Agent', quarter: '2026 Q4', status: 'planned' },
  { name: 'Dijital Muhabir', category: 'Agent', quarter: '2026 Q1', status: 'in-progress' }, // Suspended/Dev

  // Other Existing Items
  { name: 'Fatura RPA Botu', category: 'RPA', quarter: '2026 Q1', status: 'in-progress' },
  { name: 'SAP FI Güncelleme', category: 'SAP', quarter: '2026 Q1', status: 'in-progress' },
  { name: 'SAP HR Portalı', category: 'SAP', quarter: '2026 Q1', status: 'in-progress' },
  { name: 'Portal Lansmanı', category: 'Diğer', quarter: '2026 Q1', status: 'in-progress' },

  // Past / Future
  { name: 'Finansal Dashboard', category: 'Power BI', quarter: '2025 Q4', status: 'completed' },
  { name: 'Masraf RPA Botu', category: 'RPA', quarter: '2025 Q4', status: 'completed' },
  { name: 'SAP MM Enteg.', category: 'SAP', quarter: '2026 Q2', status: 'planned' },
  { name: 'Stok Analizi', category: 'Power BI', quarter: '2026 Q2', status: 'planned' },
  { name: 'SAP BW Raporlama', category: 'SAP', quarter: '2026 Q3', status: 'planned' },
  { name: 'AI Portal v2.0', category: 'Diğer', quarter: '2026 Q3', status: 'planned' }
];

const roadmapCategories = ['Tümü', 'Agent', 'SAP', 'RPA', 'Power BI', 'Diğer'];
let activeRoadmapFilter = 'Tümü';
let activeView = 'timeline';

function getFilteredData() {
  return activeRoadmapFilter === 'Tümü'
    ? roadmapData
    : roadmapData.filter(d => d.category === activeRoadmapFilter);
}

function renderRoadmapFilters() {
  const bar = document.getElementById('roadmapFilters');
  if (!bar) return;

  bar.innerHTML = roadmapCategories.map(cat =>
    `<button class="filter-btn ${cat === activeRoadmapFilter ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
  ).join('');

  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeRoadmapFilter = btn.dataset.cat;
      renderRoadmapFilters();
      renderSummary();
      renderView();
    });
  });
}

function renderSummary() {
  const el = document.getElementById('roadmapSummary');
  if (!el) return;
  const data = getFilteredData();
  const completed = data.filter(d => d.status === 'completed').length;
  const inProgress = data.filter(d => d.status === 'in-progress').length;
  const planned = data.filter(d => d.status === 'planned').length;

  el.innerHTML = `
    <span class="summary-item"><span style="color: var(--status-active);">●</span> Tamamlandı: ${completed}</span>
    <span class="summary-item"><span style="color: var(--status-dev);">●</span> Devam Eden: ${inProgress}</span>
    <span class="summary-item"><span style="color: var(--status-planned);">●</span> Planlanan: ${planned}</span>
  `;
}

function renderView() {
  const container = document.getElementById('roadmapView');
  if (!container) return;
  renderTimeline(container);
}

function renderTimeline(container) {
  const data = getFilteredData();
  const quarters = [...new Set(data.map(d => d.quarter))].sort();

  const itemsHTML = quarters.map(q => {
    const qItems = data.filter(d => d.quarter === q);
    const statusIcon = qItems.every(d => d.status === 'completed') ? 'completed'
      : qItems.some(d => d.status === 'in-progress') ? 'in-progress' : 'planned';

    return `
      <div class="timeline-item">
        <div class="quarter-label">${q}</div>
        <div class="timeline-dot ${statusIcon}"></div>
        <div class="timeline-card">
          ${qItems.map(item => `
            <div class="card-name">${item.name}</div>
            <div class="card-status-icon">${item.status === 'completed' ? '●' : item.status === 'in-progress' ? '◐' : '○'}</div>
          `).join('<hr style="border:none;border-top:1px solid var(--border-color);margin:8px 0;">')}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="timeline-container">
      <div class="timeline-line"></div>
      <div class="timeline-items">${itemsHTML}</div>
    </div>
  `;
}

// 2026 Progress Logic
function updateYearProgress() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);

  if (now.getFullYear() < 2026) {
    setYearProgress(0);
    return;
  }
  if (now.getFullYear() > 2026) {
    setYearProgress(100);
    return;
  }

  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor((now - start) / oneDay);
  const totalDays = 365;
  const progress = (dayOfYear / totalDays) * 100;

  setYearProgress(progress);
}

function setYearProgress(percent) {
  const bar = document.getElementById('yearProgressFill');
  if (bar) {
    // Ensure minimum visibility if early in year
    const finalPercent = Math.max(percent, 5);
    bar.style.width = `${finalPercent}%`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderRoadmapFilters();
  renderSummary();
  renderView();
  updateYearProgress();
});
