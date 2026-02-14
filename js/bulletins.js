/* ============================================
   BULLETINS – FAN / ARC CARD LAYOUT
   ============================================ */
(function () {

  // ── Data ──
  // coverImage: path to image in assets/bulletins/ (jpg/png)
  // pdfFile   : path to PDF in assets/bulletins/
  const bulletins = [
    {
      id: 1,
      month: 'Toplantılarda Copilot',
      year: 2026,
      title: 'Business Bülten Seri:6',
      topic: 'AI',
      coverImage: 'assets/bulletins/ocak-2026.jpg',
      pdfFile: 'assets/bulletins/ocak-2026.pdf',
      icon: '',
      mostRead: true,
      summary: 'Teams Copilot ile toplantı özetleri ve aksiyon yönetimi.'
    },
    {
      id: 6,
      month: 'Eylül',
      year: 2026,
      title: 'Tüketici Yolculuğu',
      topic: 'Pazarlama',
      coverImage: 'assets/bulletins/tuketici-yolculugu.jpg',
      pdfFile: 'assets/bulletins/tuketici-yolculugu.pdf',
      icon: '',
      mostRead: false,
      summary: 'Müşteri deneyimini iyileştirmek için tüketici yolculuğu.'
    },
    {
      id: 2,
      month: 'Şubat',
      year: 2026,
      title: 'Yapay Zeka',
      topic: 'AI',
      coverImage: 'assets/bulletins/yapay-zeka.jpg',
      pdfFile: 'assets/bulletins/yapay-zeka.pdf',
      icon: '',
      mostRead: false,
      summary: 'Yapay zeka teknolojilerindeki son gelişmeler.'
    },
    {
      id: 3,
      month: 'Aralık',
      year: 2026,
      title: 'Blockchain',
      topic: 'Teknoloji',
      coverImage: 'assets/bulletins/blockchain.jpg',
      pdfFile: 'assets/bulletins/blockchain.pdf',
      icon: '',
      mostRead: false,
      summary: 'Blokzincir teknolojisi ve iş dünyasındaki uygulamaları.'
    },
    {
      id: 4,
      month: 'Kasım',
      year: 2026,
      title: 'MS To-Do',
      topic: 'Verimlilik',
      coverImage: 'assets/bulletins/ms-to-do.jpg',
      pdfFile: 'assets/bulletins/ms-to-do.pdf',
      icon: '',
      mostRead: false,
      summary: 'Microsoft To-Do ile işlerinizi daha iyi organize edin.'
    },
    {
      id: 5,
      month: 'Ekim',
      year: 2026,
      title: 'SAP Analizi',
      topic: 'SAP',
      coverImage: 'assets/bulletins/sap-analysis.jpg',
      pdfFile: 'assets/bulletins/sap-analysis.pdf',
      icon: '�',
      mostRead: false,
      summary: 'SAP sistemleri üzerine detaylı analizler.'
    },
    {
      id: 7,
      month: 'Ağustos',
      year: 2026,
      title: 'Kahvaltı',
      topic: 'Yaşam',
      coverImage: 'assets/bulletins/kahvaltı.jpg',
      pdfFile: 'assets/bulletins/kahvaltı.pdf',
      icon: '',
      mostRead: false,
      summary: 'Sağlıklı ve keyifli kahvaltı önerileri.'
    }
  ];

  const topics = ['Tümü', ...new Set(bulletins.map(b => b.topic))];
  let activeIndex = 0;
  let filteredBulletins = [...bulletins];

  // ── DOM ──
  const fanContainer = document.getElementById('fanContainer');
  const detailPanel = document.getElementById('activeBulletinDetail');
  const filtersEl = document.getElementById('bulletinFilters');
  const btnPrev = document.getElementById('fanPrev');
  const btnNext = document.getElementById('fanNext');

  if (!fanContainer) return;

  // ── Render Filters ──
  function renderFilters() {
    filtersEl.innerHTML = topics.map((t, i) =>
      `<button class="filter-btn${i === 0 ? ' active' : ''}" data-topic="${t}">${t}</button>`
    ).join('');

    filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const topic = btn.dataset.topic;
        filteredBulletins = topic === 'Tümü' ? [...bulletins] : bulletins.filter(b => b.topic === topic);
        activeIndex = 0;
        renderFan();
      });
    });
  }

  // ── Position cards in a stack (overlapping) ──
  function renderStack() {
    // Remove existing cards
    fanContainer.querySelectorAll('.bulletin-card').forEach(c => c.remove());
    // Remove nav buttons if they exist
    const prevBtn = document.getElementById('fanPrev');
    const nextBtn = document.getElementById('fanNext');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';

    // Update container class for styling
    fanContainer.className = 'bulletin-stack';

    const total = filteredBulletins.length;
    if (total === 0) {
      detailPanel.innerHTML = '<p style="color:var(--text-muted)">Bu kategoride bülten bulunmuyor.</p>';
      return;
    }

    // Create cards with concave structure
    const middleIndex = (filteredBulletins.length - 1) / 2;

    filteredBulletins.forEach((b, i) => {
      const card = document.createElement('div');
      card.className = 'bulletin-card';

      // Calculate transforms for convex (n-shape) layout
      // Center is highest (0), sides go down (positive Y)
      const offset = i - middleIndex;
      const absOffset = Math.abs(offset);

      const rotateDeg = offset * 5; // More pronounced rotation
      const translateY = absOffset * 35; // Deeper curve (convex)

      // Apply inline styles for structure
      card.style.transform = `translateY(${translateY}px) rotate(${rotateDeg}deg)`;
      card.style.zIndex = i + 1; // Base z-index order

      const coverHTML = b.coverImage
        ? `<img class="card-cover" src="${b.coverImage}" alt="${b.title}" onerror="this.outerHTML='<div class=\\'card-cover-placeholder\\'>${b.icon}</div>'">`
        : `<div class="card-cover-placeholder">${b.icon}</div>`;

      card.innerHTML = `
        ${b.mostRead ? '<span class="most-read">⭐</span>' : ''}
        ${coverHTML}
        <div class="card-title-container">
          <div class="card-title-sm">${b.title}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        openBulletinModal(b);
      });

      // Hover handling for z-index management
      card.addEventListener('mouseenter', () => {
        // Bring to front on hover
        card.style.zIndex = 100;
      });

      card.addEventListener('mouseleave', () => {
        // Reset z-index
        card.style.zIndex = i + 1;
      });

      fanContainer.appendChild(card);
    });

    // No redundant layoutCards() call needed for CSS-based layout
  }

  // ── Open Bulletin Detail Modal ──
  function openBulletinModal(b) {
    const coverHTML = b.coverImage
      ? `<img src="${b.coverImage}" alt="${b.title}" style="width:100%;max-height:300px;object-fit:cover;border-radius:var(--radius-md);margin-bottom:var(--space-lg);" onerror="this.style.display='none'">`
      : `<div style="width:100%;height:160px;display:flex;align-items:center;justify-content:center;font-size:4rem;background:linear-gradient(135deg,var(--navy),var(--navy-light));border-radius:var(--radius-md);margin-bottom:var(--space-lg);color:rgba(255,255,255,0.5);">${b.icon}</div>`;

    const html = `
      <button class="modal-close" onclick="closeModal()">✕</button>
      ${coverHTML}
      <div class="modal-header">
        <h2>${b.icon} ${b.title}</h2>
        <div class="modal-status">${b.topic}</div>
      </div>

      <div class="modal-section">
        <h3>İçerik Özeti</h3>
        <p class="modal-description">${b.summary}</p>
      </div>

      <div class="modal-section">
        <h3>Bilgiler</h3>
        <div class="modal-meta">
          <span>${b.month} ${b.year}</span>
          <span>${b.topic}</span>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-primary" onclick="window.open('${b.pdfFile}', '_blank')">PDF Görüntüle</button>
        <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${b.title}'); alert('Kopyalandı!')">Paylaş</button>
      </div>
    `;

    if (typeof openModal === 'function') {
      openModal(html);
    }
  }

  // ── Init ──
  renderFilters();
  renderStack();

})();
