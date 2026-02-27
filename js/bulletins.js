/* ============================================
   BULLETINS – FAN / ARC CARD LAYOUT
   ============================================ */
(function () {

  // ── Data ──
  const bulletins = DataStore.getData('bulletins');

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
