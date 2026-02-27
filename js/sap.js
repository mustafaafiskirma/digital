/* ============================================
   SAP.JS - SAP Development Cards
   ============================================ */

const sapData = DataStore.getData('sap');

function renderSAP() {
  const list = document.getElementById('sapList');
  if (!list) return;

  list.innerHTML = sapData.map((s, i) => {
    const stepsHTML = s.steps.map((step, j) => {
      const isCompleted = s.completedSteps.includes(j);
      const isCurrent = j === s.currentStep && !isCompleted;
      const dotClass = isCompleted ? 'completed' : (isCurrent ? 'current' : '');
      const lineClass = j < s.steps.length - 1 ? (s.completedSteps.includes(j) ? 'completed' : '') : '';

      return `
        <div class="progress-step">
          <span class="step-dot ${dotClass}">${isCompleted ? '✓' : (isCurrent ? '⟳' : '')}</span>
          ${j < s.steps.length - 1 ? `<span class="step-line ${lineClass}"></span>` : ''}
        </div>
      `;
    }).join('');

    const labelsHTML = s.steps.map(step => `<span>${step}</span>`).join('');

    return `
      <div class="sap-card" data-index="${i}">
        <div class="card-title">${s.title}</div>
        <div class="card-module">Modül: ${s.module}</div>
        <div class="progress-tracker">${stepsHTML}</div>
        <div class="progress-labels">${labelsHTML}</div>
        <div class="card-target">Hedef: ${s.target}</div>
      </div>
    `;
  }).join('');

  // Click handlers for SAP modal
  list.querySelectorAll('.sap-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index);
      showSAPModal(sapData[idx]);
    });
  });
}

function showSAPModal(sap) {
  const html = `
    <button class="modal-close">✕</button>
    <div class="modal-header">
      <span class="modal-icon"></span>
      <div>
        <h2>${sap.title}</h2>
        <div class="modal-status" style="color: var(--text-secondary); font-size: 0.85rem;">Modül: ${sap.module}</div>
      </div>
    </div>

    <div class="modal-section">
      <h3>Teknik Detaylar</h3>
      <p class="modal-description">${sap.description}</p>
    </div>

    <div class="modal-section">
      <h3>Etkilenen Modüller</h3>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${sap.affected.map(m => `<span class="status-badge">${m}</span>`).join('')}
      </div>
    </div>

    <div class="modal-section">
      <h3>Timeline</h3>
      <p class="modal-description">Hedef Tarih: <strong>${sap.target}</strong></p>
      <div class="modal-meta" style="margin-top: 12px;">
        <span>Sorumlu: ${sap.owner}</span>
      </div>
    </div>


  `;

  openModal(html);
}

document.addEventListener('DOMContentLoaded', renderSAP);
