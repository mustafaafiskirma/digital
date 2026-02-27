/* ============================================
   AGENTS.JS - Agent Cards & Detail Modal
   ============================================ */

const agentsData = DataStore.getData('agents');

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
