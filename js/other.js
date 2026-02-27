/* ============================================
   OTHER.JS - Other Developments Panel
   ============================================ */

const otherData = DataStore.getData('other');

const otherCategories = ['Tümü', 'RPA', 'Power BI', 'Python', 'Excel/VBA'];
let activeOtherFilter = 'Tümü';

function renderOtherFilters() {
  const bar = document.getElementById('otherFilters');
  if (!bar) return;

  bar.innerHTML = otherCategories.map(cat =>
    `<button class="filter-btn ${cat === activeOtherFilter ? 'active' : ''}" data-category="${cat}">${cat}</button>`
  ).join('');

  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeOtherFilter = btn.dataset.category;
      renderOtherFilters();
      renderOtherCards();
    });
  });
}

function renderOtherCards() {
  const grid = document.getElementById('otherGrid');
  if (!grid) return;

  const filtered = activeOtherFilter === 'Tümü'
    ? otherData
    : otherData.filter(d => d.category === activeOtherFilter);

  grid.innerHTML = filtered.map(d => `
    <div class="project-card">
      <div class="card-name" style="font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">${d.name}</div>
      <span class="card-status ${d.status}" style="font-size: 0.7rem;">
        <span class="status-dot ${d.status}"></span>
        ${d.statusLabel}
      </span>
      <div style="margin-top: 8px;">
        <span class="filter-btn" style="font-size: 0.65rem; padding: 2px 8px; pointer-events: none;">${d.category}</span>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderOtherFilters();
  renderOtherCards();
});
