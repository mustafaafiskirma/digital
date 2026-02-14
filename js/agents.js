/* ============================================
   AGENTS.JS - Agent Cards & Detail Modal
   ============================================ */

const agentsData = [
  {
    name: 'Tüpraş Mali İşler Asistanı',
    module: 'Tüm Şirket',
    steps: ['Konsept', 'Geliştirme', 'Pilot', 'Canlı'],
    currentStep: 3,
    completedSteps: [0, 1, 2, 3],
    target: 'Tamamlandı',
    statusLabel: 'Canlıda',
    status: 'active',
    description: 'Tüpraş Mali İşler ekiplerinin günlük operasyonlarında anlık destek sağlayan, mevzuat ve süreç sorularını yanıtlayan yapay zeka asistanı.',
    owner: 'Mustafa Fışkırma',
    savings: '₺1,200,000',
    timeSaved: '1,500 saat/yıl',
    before: { time: '2 saat/gün', error: '%5 hata', staff: 'Tüm ekip' },
    after: { time: 'Anlık', error: '%0 hata', staff: 'AI Asistan' },
    chartData: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 88, 90, 92, 94, 95, 96, 96, 97, 97, 98, 98, 99, 99, 99, 100, 100, 100, 100, 100, 100],
    versions: [{ tag: 'v1.0', date: '14.02.2026', note: 'Canlıya geçiş' }]
  },
  {
    name: 'Budget Asist',
    module: 'Tüm Şirket',
    steps: ['Konsept', 'Geliştirme', 'Test', 'Canlı'],
    currentStep: 2,
    completedSteps: [0, 1],
    target: 'Nisan 2026',
    statusLabel: 'Test Aşamasında',
    status: 'dev',
    description: 'Bütçe planlama döngülerinde varyans analizlerini otomatize eden ve tahminleme yapan akıllı asistan.',
    owner: 'Mustafa Fışkırma',
    savings: '₺850,000',
    timeSaved: '900 saat/yıl',
    before: { time: '3 gün/ay', error: '%10 sapma', staff: '4 kişi' },
    after: { time: '1 saat/ay', error: '%2 sapma', staff: '1 kişi' },
    chartData: [20, 25, 30, 35, 40, 45, 48, 52, 55, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 87, 88, 90, 91, 92, 93, 94, 95, 95, 96],
    versions: [{ tag: 'v0.8', date: '10.02.2026', note: 'Geliştirme tamamlandı' }]
  },
  {
    name: 'Dijital Muhabir',
    module: 'Vergi Teşvik ve Uygulama Ekibi',
    steps: ['Konsept', 'Geliştirme', 'Pilot', 'Canlı'],
    currentStep: 1,
    completedSteps: [0],
    target: 'Belirsiz',
    statusLabel: 'Durduruldu',
    status: 'maint',
    description: 'Şirket içi ve dışı finansal haberleri, kur değişimlerini ve piyasa verilerini analiz edip özetleyen dijital haberci.',
    owner: 'Mustafa Fışkırma',
    savings: '-',
    timeSaved: '-',
    before: { time: '-', error: '-', staff: '-' },
    after: { time: '-', error: '-', staff: '-' },
    chartData: [10, 15, 20, 25, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    versions: [{ tag: 'v0.3', date: '15.01.2026', note: 'Proje askıya alındı' }]
  },
  {
    name: 'Kurumsal Hafıza',
    module: 'Mali İşler Direktörlüğü',
    steps: ['Analiz', 'Geliştirme', 'Pilot', 'Canlı'],
    currentStep: 0,
    completedSteps: [],
    target: '2027 Q1',
    statusLabel: 'Başlangıç',
    status: 'dev',
    description: 'Geçmiş finansal kararları, dokümanları ve toplantı notlarını indeksleyerek sorgulanabilir hale getiren bilgi bankası.',
    owner: 'Mustafa Fışkırma',
    savings: 'Hedef: ₺2M',
    timeSaved: 'Hedef: 3000 saat',
    before: { time: 'Kayıp', error: 'Yüksek', staff: '-' },
    after: { time: 'Saniyeler', error: 'Yok', staff: '-' },
    chartData: [0, 1, 2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    versions: [{ tag: 'v0.1', date: '01.02.2026', note: 'Analiz çalışmaları' }]
  }
];

function renderAgents() {
  const grid = document.getElementById('agentGrid');
  const statusEl = document.getElementById('agentStatus');
  if (!grid || !statusEl) return;

  // Status Summary removed as per user request
  // counts and statusEl code removed
  if (statusEl) statusEl.style.display = 'none';

  grid.innerHTML = agentsData.map((a, i) => {
    // Progress Steps HTML oluşturma (sap.js mantığı)
    const stepsHTML = a.steps.map((step, j) => {
      const isCompleted = a.completedSteps.includes(j);
      const isCurrent = j === a.currentStep && !isCompleted;
      const dotClass = isCompleted ? 'completed' : (isCurrent ? 'current' : '');
      const lineClass = j < a.steps.length - 1 ? (a.completedSteps.includes(j) ? 'completed' : '') : '';

      return `
        <div class="progress-step">
          <span class="step-dot ${dotClass}" title="${step}">${isCompleted ? '✓' : (isCurrent ? '⟳' : '')}</span>
          ${j < a.steps.length - 1 ? `<span class="step-line ${lineClass}"></span>` : ''}
        </div>
      `;
    }).join('');

    const labelsHTML = a.steps.map(step => `<span>${step}</span>`).join('');

    return `
      <div class="agent-card sap-style" data-index="${i}">
        <div class="card-title">${a.name}</div>
        <div class="card-module" style="margin-bottom: 12px;">Kapsam: ${a.module}</div>
        <div class="progress-tracker">${stepsHTML}</div>
        <div class="progress-labels">${labelsHTML}</div>
        <div class="card-target" style="margin-top: 12px; font-size: 0.75rem; color: var(--text-secondary);">Hedef: ${a.target}</div>
      </div>
    `;
  }).join('');

  // Click handlers
  grid.querySelectorAll('.agent-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index);
      showAgentModal(agentsData[idx]);
    });
  });
}

function showAgentModal(agent) {


  const html = `
    <button class="modal-close" onclick="closeModal()">✕</button>
    <div class="modal-header">
      <span class="modal-icon">🤖</span>
      <div>
        <h2>${agent.name}</h2>
        <div class="modal-status">
          <span class="card-status ${agent.status}">
            <span class="status-dot ${agent.status}"></span>
            ${agent.statusLabel}
          </span>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h3>Genel Bilgi</h3>
      <p class="modal-description">${agent.description}</p>
      <div class="modal-meta">
        <span>Hedef Tarih: ${agent.target}</span>
        <span>Sorumlu: ${agent.owner}</span>
      </div>
    </div>

    <div class="modal-section">
      <h3>Kazanımlar</h3>
      <div class="savings-grid">
        <div class="savings-card">
          <div class="value">${agent.savings}</div>
          <div class="label">Yıllık Tasarruf</div>
        </div>
        <div class="savings-card">
          <div class="value">${agent.timeSaved}</div>
          <div class="label">Kazanılan Zaman</div>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h3>Öncesi / Sonrası</h3>
      <div class="comparison-table">
        <div class="comparison-col before">
          <h4>Öncesi</h4>
          <div class="comparison-item">Süre: ${agent.before.time}</div>
          <div class="comparison-item">Hata: ${agent.before.error}</div>
        </div>
        <div class="comparison-col after">
          <h4>Sonrası</h4>
          <div class="comparison-item">Süre: ${agent.after.time}</div>
          <div class="comparison-item">Hata: ${agent.after.error}</div>
        </div>
      </div>
    </div>




  `;

  // Re-use existing modal logic if available, or simpler implementation
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  if (overlay && content) {
    content.innerHTML = html;
    overlay.classList.add('open');
  }
}

document.addEventListener('DOMContentLoaded', renderAgents);
