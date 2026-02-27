/* ============================================
   METRICS.JS - Count-up Animation Dashboard
   ============================================ */

const metricsData = DataStore.getData('metrics');

function renderMetrics() {
    const grid = document.getElementById('metricsGrid');
    if (!grid) return;

    grid.innerHTML = metricsData.map((m, i) => `
    <div class="metric-card" data-index="${i}" onclick="openMetricDetail(${i})" style="cursor: pointer;">
      <div class="metric-label">${m.label}</div>
      <div class="metric-value">
        <span class="prefix">${m.prefix}</span>
        <span class="count" data-target="${m.value}" data-decimals="${m.value % 1 !== 0 ? 1 : 0}">0</span>
        <span class="suffix">${m.suffix}</span>
      </div>
      <div class="metric-footer">
        <div class="metric-change ${m.positive ? 'positive' : 'negative'}">
          ${m.positive ? '+' : '-'}${m.change}
        </div>
        <div class="metric-change-label">${m.changeLabel}</div>
      </div>
    </div>
  `).join('');

    // Count-up animation on scroll
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.count');
                counters.forEach(counter => animateCount(counter));
                metricsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    metricsObserver.observe(grid);
}

// Global scope'a ekleyelim ki HTML'den erişilebilsin
window.openMetricDetail = function (index) {
    const data = metricsData[index];
    const modal = document.getElementById('modalContent');
    const overlay = document.getElementById('modalOverlay');

    if (!modal || !overlay) return;

    modal.innerHTML = `
        <button class="modal-close" onclick="closeModal()">✕</button>
        <div class="modal-header">
            <div class="modal-icon">${data.icon}</div>
            <div>
                <h2>${data.label}</h2>
                <div class="modal-status" style="color: var(--neon-blue)">${data.change} ${data.changeLabel}</div>
            </div>
        </div>
        <div class="modal-section">
            <h3>📝 Açıklama</h3>
            <p class="modal-description">${data.description}</p>
        </div>
        <div class="modal-section">
            <h3>📊 Detaylar</h3>
            <ul style="list-style: none; padding: 0;">
                ${data.details.map(d => `
                    <li style="
                        background: var(--bg-primary); 
                        padding: 10px 15px; 
                        margin-bottom: 8px; 
                        border-radius: 8px; 
                        font-size: 0.9rem;
                        display: flex; 
                        align-items: center; 
                        gap: 10px;
                        border: 1px solid var(--border-color);
                    ">
                        <span style="color: var(--neon-blue);">•</span> ${d}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    overlay.classList.add('open');
};

window.closeModal = function () {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('open');
};

// Dışarı tıklayınca kapatma
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        window.closeModal();
    }
});

function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals) || 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = eased * target;
        el.textContent = currentValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', renderMetrics);
