/* ============================================
   OTHER.JS - Other Developments Panel
   ============================================ */

const otherData = [
    { name: 'Masraf RPA Botu', category: 'RPA', status: 'active', statusLabel: 'Aktif', desc: 'Masraf formlarını otomatik işleyen RPA botu.' },
    { name: 'Finansal Dashboard', category: 'Power BI', status: 'active', statusLabel: 'Aktif', desc: 'Gerçek zamanlı finansal gösterge paneli.' },
    { name: 'Veri Temizleme Scripti', category: 'Python', status: 'active', statusLabel: 'Aktif', desc: 'SAP verilerini temizleyen Python scripti.' },
    { name: 'Bütçe Takip Makrosu', category: 'Excel/VBA', status: 'active', statusLabel: 'Aktif', desc: 'Bütçe sapma analizlerini otomatikleştiren makro.' },
    { name: 'Fatura Okuma Botu', category: 'RPA', status: 'dev', statusLabel: 'Geliştirmede', desc: 'OCR ile fatura verilerini okuyan bot.' },
    { name: 'Satınalma Raporu', category: 'Power BI', status: 'active', statusLabel: 'Aktif', desc: 'Satınalma süreçlerinin detaylı Power BI raporu.' },
    { name: 'Otomatik Mail Parser', category: 'Python', status: 'dev', statusLabel: 'Geliştirmede', desc: 'Mail eklerini otomatik ayrıştıran Python aracı.' },
    { name: 'KDV Hesaplama Aracı', category: 'Excel/VBA', status: 'active', statusLabel: 'Aktif', desc: 'Karmaşık KDV senaryolarını hesaplayan araç.' },
    { name: 'Onay Akışı Botu', category: 'RPA', status: 'active', statusLabel: 'Aktif', desc: 'Onay süreçlerini takip eden ve hatırlatan bot.' },
    { name: 'Stok Analizi', category: 'Power BI', status: 'dev', statusLabel: 'Geliştirmede', desc: 'Stok hareketlerinin görsel analizi.' },
    { name: 'PDF Dönüştürücü', category: 'Python', status: 'active', statusLabel: 'Aktif', desc: 'Toplu PDF dönüşüm ve birleştirme aracı.' },
    { name: 'Muhasebe Kontrol Listesi', category: 'Excel/VBA', status: 'active', statusLabel: 'Aktif', desc: 'Ay sonu kapanış kontrol listesi otomasyonu.' }
];

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
