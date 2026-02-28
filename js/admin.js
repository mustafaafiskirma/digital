/* ============================================
   ADMIN.JS - Admin Panel Business Logic
   CRUD for all 7 modules + Auth + Export
   ============================================ */

(function () {
    'use strict';

    // ═══════════════════════════════════════
    // AUTH
    // ═══════════════════════════════════════
    let isAuth = false;

    async function sha256(msg) {
        const buf = new TextEncoder().encode(msg);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const loginOverlay = document.getElementById('loginOverlay');
    const adminApp = document.getElementById('adminApp');
    const loginBtn = document.getElementById('adminLoginBtn');
    const loginInput = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    const honeypot = document.getElementById('honeypotAdmin');

    let failedAttempts = parseInt(sessionStorage.getItem('adminFailed') || '0');
    let lockUntil = parseInt(sessionStorage.getItem('adminLock') || '0');

    loginBtn.addEventListener('click', doLogin);
    loginInput.addEventListener('keypress', e => { if (e.key === 'Enter') doLogin(); });

    async function doLogin() {
        if (honeypot && honeypot.value.length > 0) { loginError.textContent = 'Erişim reddedildi.'; return; }
        if (lockUntil > Date.now()) {
            const s = Math.ceil((lockUntil - Date.now()) / 1000);
            loginError.textContent = `Çok fazla deneme. ${s} sn bekleyin.`;
            return;
        }
        const pw = loginInput.value.replace(/[<>"'&]/g, '');
        const h = await sha256(pw);
        if (h === ENV.ADMIN_HASH || h === ENV.PASSWORD_HASH) {
            isAuth = true;
            failedAttempts = 0;
            sessionStorage.setItem('adminFailed', '0');
            loginOverlay.style.display = 'none';
            adminApp.style.display = 'flex';
            renderSection(activeSection);
        } else {
            failedAttempts++;
            sessionStorage.setItem('adminFailed', failedAttempts.toString());
            const rem = 5 - failedAttempts;
            if (rem <= 0) {
                lockUntil = Date.now() + 300000;
                sessionStorage.setItem('adminLock', lockUntil.toString());
                loginError.textContent = 'Hesap kilitlendi. 5 dakika bekleyin.';
                failedAttempts = 0;
                sessionStorage.setItem('adminFailed', '0');
            } else {
                loginError.textContent = `Hatalı şifre. ${rem} deneme kaldı.`;
            }
            loginInput.value = '';
        }
    }

    // ═══════════════════════════════════════
    // SECTION CONFIG
    // ═══════════════════════════════════════
    const SECTIONS = {
        metrics: {
            title: 'Metrikler',
            columns: ['label', 'value', 'prefix', 'suffix', 'change'],
            columnLabels: ['Etiket', 'Değer', 'Ön Ek', 'Son Ek', 'Değişim'],
            fields: [
                { key: 'label', label: 'Etiket', type: 'text' },
                { key: 'value', label: 'Değer', type: 'number', step: '0.1' },
                { key: 'prefix', label: 'Ön Ek (₺, % vb.)', type: 'text' },
                { key: 'suffix', label: 'Son Ek (saat, Mn vb.)', type: 'text' },
                { key: 'change', label: 'Değişim', type: 'text' },
                { key: 'changeLabel', label: 'Değişim Açıklama', type: 'text' },
                { key: 'positive', label: 'Pozitif mi?', type: 'select', options: [{ v: true, l: 'Evet' }, { v: false, l: 'Hayır' }] },
                { key: 'icon', label: 'İkon (emoji)', type: 'text' },
                { key: 'description', label: 'Açıklama', type: 'textarea' },
            ],
            nameKey: 'label'
        },
        agents: {
            title: 'Agentlar',
            columns: ['name', 'module', 'statusLabel', 'target'],
            columnLabels: ['Ad', 'Kapsam', 'Durum', 'Hedef'],
            fields: [
                { key: 'name', label: 'Agent Adı', type: 'text' },
                { key: 'module', label: 'Kapsam', type: 'text' },
                { key: 'description', label: 'Açıklama', type: 'textarea' },
                { key: 'status', label: 'Durum Kodu', type: 'select', options: [{ v: 'active', l: 'Aktif' }, { v: 'dev', l: 'Geliştirmede' }, { v: 'maint', l: 'Durduruldu' }] },
                { key: 'statusLabel', label: 'Durum Etiketi', type: 'text' },
                { key: 'target', label: 'Hedef Tarih', type: 'text' },
                { key: 'owner', label: 'Sorumlu', type: 'text' },
                { key: 'savings', label: 'Yıllık Tasarruf', type: 'text' },
                { key: 'timeSaved', label: 'Kazanılan Zaman', type: 'text' },
                { key: 'currentStep', label: 'Mevcut Adım (0-indexed)', type: 'number' },
            ],
            nameKey: 'name'
        },
        sap: {
            title: 'SAP Geliştirmeleri',
            columns: ['title', 'module', 'target', 'owner'],
            columnLabels: ['Başlık', 'Modül', 'Hedef', 'Sorumlu'],
            fields: [
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'module', label: 'SAP Modülü', type: 'text' },
                { key: 'description', label: 'Açıklama', type: 'textarea' },
                { key: 'target', label: 'Hedef Tarih', type: 'text' },
                { key: 'owner', label: 'Sorumlu', type: 'text' },
                { key: 'currentStep', label: 'Mevcut Adım (0-indexed)', type: 'number' },
            ],
            nameKey: 'title'
        },
        other: {
            title: 'Diğer Geliştirmeler',
            columns: ['name', 'category', 'statusLabel'],
            columnLabels: ['Ad', 'Kategori', 'Durum'],
            fields: [
                { key: 'name', label: 'Proje Adı', type: 'text' },
                { key: 'category', label: 'Kategori', type: 'select', options: [{ v: 'RPA', l: 'RPA' }, { v: 'Power BI', l: 'Power BI' }, { v: 'Python', l: 'Python' }, { v: 'Excel/VBA', l: 'Excel/VBA' }] },
                { key: 'status', label: 'Durum Kodu', type: 'select', options: [{ v: 'active', l: 'Aktif' }, { v: 'dev', l: 'Geliştirmede' }] },
                { key: 'statusLabel', label: 'Durum Etiketi', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
            ],
            nameKey: 'name'
        },
        bulletins: {
            title: 'Bültenler',
            columns: ['title', 'month', 'year', 'topic'],
            columnLabels: ['Başlık', 'Ay', 'Yıl', 'Konu'],
            fields: [
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'month', label: 'Ay', type: 'text' },
                { key: 'year', label: 'Yıl', type: 'number' },
                { key: 'topic', label: 'Konu', type: 'text' },
                { key: 'summary', label: 'Özet', type: 'textarea' },
                { key: 'coverImage', label: 'Kapak Resmi', type: 'file', accept: 'image/*', uploadDir: 'assets/bulletins/' },
                { key: 'pdfFile', label: 'PDF Dosyası', type: 'file', accept: '.pdf', uploadDir: 'assets/bulletins/' },
                { key: 'mostRead', label: 'En Çok Okunan?', type: 'select', options: [{ v: true, l: 'Evet' }, { v: false, l: 'Hayır' }] },
            ],
            nameKey: 'title'
        },
        roadmap: {
            title: 'Roadmap',
            columns: ['name', 'category', 'quarter', 'status'],
            columnLabels: ['Ad', 'Kategori', 'Çeyrek', 'Durum'],
            fields: [
                { key: 'name', label: 'Proje Adı', type: 'text' },
                { key: 'category', label: 'Kategori', type: 'select', options: [{ v: 'Agent', l: 'Agent' }, { v: 'SAP', l: 'SAP' }, { v: 'RPA', l: 'RPA' }, { v: 'Power BI', l: 'Power BI' }, { v: 'Diğer', l: 'Diğer' }] },
                { key: 'quarter', label: 'Çeyrek (ör: 2026 Q2)', type: 'text' },
                { key: 'status', label: 'Durum', type: 'select', options: [{ v: 'completed', l: 'Tamamlandı' }, { v: 'in-progress', l: 'Devam Ediyor' }, { v: 'planned', l: 'Planlanan' }] },
            ],
            nameKey: 'name'
        },
        training: {
            title: 'Eğitim İçerikleri',
            // Training is special — has sub-tabs
            subSections: {
                videos: {
                    label: 'Video Eğitimler',
                    columns: ['title', 'duration'],
                    columnLabels: ['Başlık', 'Süre'],
                    fields: [
                        { key: 'title', label: 'Başlık', type: 'text' },
                        { key: 'desc', label: 'Açıklama', type: 'textarea' },
                        { key: 'duration', label: 'Süre', type: 'text' },
                        { key: 'videoFile', label: 'Video Dosyası', type: 'file', accept: 'video/*', uploadDir: 'assets/videos/' },
                    ]
                },
                docs: {
                    label: 'Dökümanlar',
                    columns: ['title', 'format'],
                    columnLabels: ['Başlık', 'Format'],
                    fields: [
                        { key: 'title', label: 'Başlık', type: 'text' },
                        { key: 'desc', label: 'Açıklama', type: 'textarea' },
                        { key: 'format', label: 'Format', type: 'text' },
                    ]
                },
                quickstart: {
                    label: 'Quick Start',
                    columns: ['title', 'time'],
                    columnLabels: ['Başlık', 'Süre'],
                    fields: [
                        { key: 'title', label: 'Başlık', type: 'text' },
                        { key: 'desc', label: 'Açıklama', type: 'textarea' },
                        { key: 'time', label: 'Süre', type: 'text' },
                    ]
                },
                faq: {
                    label: 'SSS',
                    columns: ['q'],
                    columnLabels: ['Soru'],
                    fields: [
                        { key: 'q', label: 'Soru', type: 'text' },
                        { key: 'a', label: 'Cevap', type: 'textarea' },
                    ]
                }
            }
        }
    };

    let activeSection = 'metrics';
    let activeSubSection = 'videos';

    // ═══════════════════════════════════════
    // NAVIGATION
    // ═══════════════════════════════════════
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSection = btn.dataset.section;
            if (activeSection === 'training') activeSubSection = 'videos';
            renderSection(activeSection);
        });
    });

    // ═══════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════
    function renderSection(section) {
        const cfg = SECTIONS[section];
        document.getElementById('sectionTitle').textContent = cfg.title;
        const area = document.getElementById('contentArea');
        const addBtn = document.getElementById('btnAdd');

        if (section === 'training') {
            renderTrainingSection(area);
            addBtn.style.display = 'inline-block';
            addBtn.onclick = () => openAddModal(section);
        } else {
            const data = DataStore.getData(section);
            addBtn.style.display = 'inline-block';
            addBtn.onclick = () => openAddModal(section);
            renderTable(area, data, cfg.columns, cfg.columnLabels, section);
        }
    }

    function renderTable(container, data, columns, columnLabels, section, subKey) {
        if (!data || data.length === 0) {
            container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><h3>Veri Yok</h3><p>Yeni öğe eklemek için "Yeni Ekle" butonunu kullanın.</p></div>`;
            return;
        }

        let html = `<table class="data-table"><thead><tr>`;
        html += `<th>#</th>`;
        columnLabels.forEach(l => { html += `<th>${l}</th>`; });
        html += `<th>İşlemler</th></tr></thead><tbody>`;

        data.forEach((item, i) => {
            html += `<tr>`;
            html += `<td>${i + 1}</td>`;
            columns.forEach(col => {
                let val = item[col];
                if (val === true) val = 'Evet';
                else if (val === false) val = 'Hayır';
                else if (val == null) val = '-';
                // Status badge
                if (col === 'status' || col === 'statusLabel') {
                    const statusClass = item.status || '';
                    html += `<td><span class="status-badge ${statusClass}">${val}</span></td>`;
                } else {
                    html += `<td>${String(val).substring(0, 50)}</td>`;
                }
            });
            html += `<td><div class="action-btns">`;
            html += `<button class="btn-edit" data-idx="${i}" data-section="${section}" ${subKey ? `data-sub="${subKey}"` : ''}>Düzenle</button>`;
            html += `<button class="btn-delete" data-idx="${i}" data-section="${section}" ${subKey ? `data-sub="${subKey}"` : ''}>Sil</button>`;
            html += `</div></td></tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;

        // Bind events
        container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const sec = btn.dataset.section;
                const sub = btn.dataset.sub || null;
                openEditModal(sec, idx, sub);
            });
        });

        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const sec = btn.dataset.section;
                const sub = btn.dataset.sub || null;
                if (confirm('Bu öğeyi silmek istediğinize emin misiniz?')) {
                    deleteItem(sec, idx, sub);
                }
            });
        });
    }

    function renderTrainingSection(area) {
        const cfg = SECTIONS.training.subSections;
        const data = DataStore.getData('training');

        let tabsHtml = `<div style="display:flex;gap:8px;margin-bottom:20px;">`;
        Object.keys(cfg).forEach(key => {
            const active = key === activeSubSection ? 'btn-primary' : 'btn-secondary';
            tabsHtml += `<button class="btn ${active} training-sub-tab" data-sub="${key}">${cfg[key].label}</button>`;
        });
        tabsHtml += `</div><div id="trainingTableArea"></div>`;
        area.innerHTML = tabsHtml;

        area.querySelectorAll('.training-sub-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                activeSubSection = btn.dataset.sub;
                renderTrainingSection(area);
            });
        });

        const subCfg = cfg[activeSubSection];
        const subData = data[activeSubSection] || [];
        const tableArea = document.getElementById('trainingTableArea');
        renderTable(tableArea, subData, subCfg.columns, subCfg.columnLabels, 'training', activeSubSection);
    }

    // ═══════════════════════════════════════
    // MODAL - ADD / EDIT
    // ═══════════════════════════════════════
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalSave = document.getElementById('modalSave');
    const modalCancel = document.getElementById('modalCancel');
    const modalClose = document.getElementById('modalClose');

    let currentEditSection = null;
    let currentEditIndex = -1;
    let currentEditSub = null;

    function getFields(section, sub) {
        if (section === 'training' && sub) {
            return SECTIONS.training.subSections[sub].fields;
        }
        return SECTIONS[section].fields;
    }

    function openEditModal(section, index, sub) {
        currentEditSection = section;
        currentEditIndex = index;
        currentEditSub = sub;

        let data;
        if (sub) {
            data = DataStore.getData(section)[sub][index];
        } else {
            data = DataStore.getData(section)[index];
        }

        const fields = getFields(section, sub);
        modalTitle.textContent = 'Düzenle: ' + (data.name || data.title || data.label || data.q || '');
        renderForm(fields, data);
        modal.classList.add('open');
    }

    function openAddModal(section) {
        currentEditSection = section;
        currentEditIndex = -1;
        currentEditSub = section === 'training' ? activeSubSection : null;

        const fields = getFields(section, currentEditSub);
        modalTitle.textContent = 'Yeni Ekle';
        renderForm(fields, {});
        modal.classList.add('open');
    }

    function renderForm(fields, data) {
        let html = '';
        fields.forEach(f => {
            html += `<div class="form-group">`;
            html += `<label>${f.label}</label>`;
            const val = data[f.key] != null ? data[f.key] : '';

            if (f.type === 'textarea') {
                html += `<textarea id="field_${f.key}" rows="3">${sanitize(String(val))}</textarea>`;
            } else if (f.type === 'select') {
                html += `<select id="field_${f.key}">`;
                f.options.forEach(o => {
                    const sel = String(val) === String(o.v) ? 'selected' : '';
                    html += `<option value="${o.v}" ${sel}>${o.l}</option>`;
                });
                html += `</select>`;
            } else if (f.type === 'file') {
                html += `<div class="file-upload-area" id="upload_area_${f.key}">`;
                html += `<input type="hidden" id="field_${f.key}" value="${sanitize(String(val))}">`;
                html += `<div class="file-upload-row">`;
                html += `<input type="file" id="file_${f.key}" accept="${f.accept || '*'}" class="file-input">`;
                html += `<button type="button" class="btn btn-primary btn-upload" data-key="${f.key}" data-dir="${f.uploadDir}">Yükle</button>`;
                html += `</div>`;
                if (val) {
                    html += `<div class="file-current">Mevcut: <span>${sanitize(String(val))}</span></div>`;
                }
                html += `<div class="file-status" id="status_${f.key}"></div>`;
                html += `</div>`;
            } else {
                html += `<input type="${f.type}" id="field_${f.key}" value="${sanitize(String(val))}" ${f.step ? `step="${f.step}"` : ''}>`;
            }
            html += `</div>`;
        });
        modalBody.innerHTML = html;

        // Bind upload buttons
        modalBody.querySelectorAll('.btn-upload').forEach(btn => {
            btn.addEventListener('click', async () => {
                const key = btn.dataset.key;
                const dir = btn.dataset.dir;
                const fileInput = document.getElementById('file_' + key);
                const hiddenInput = document.getElementById('field_' + key);
                const statusEl = document.getElementById('status_' + key);

                if (!fileInput.files || fileInput.files.length === 0) {
                    statusEl.innerHTML = '<span style="color:#ff6b6b;">Lütfen önce bir dosya seçin.</span>';
                    return;
                }

                const file = fileInput.files[0];
                const maxSize = 100 * 1024 * 1024; // 100MB
                if (file.size > maxSize) {
                    statusEl.innerHTML = '<span style="color:#ff6b6b;">Dosya 100MB limitini aşıyor.</span>';
                    return;
                }

                btn.disabled = true;
                btn.textContent = 'Yükleniyor...';
                statusEl.innerHTML = '<span style="color:#48CAE4;">Dosya yükleniyor...</span>';

                try {
                    const filePath = await uploadFileToGitHub(file, dir);
                    hiddenInput.value = filePath;
                    statusEl.innerHTML = `<span style="color:#22c55e;">Yüklendi: ${filePath}</span>`;
                    const currentEl = btn.closest('.file-upload-area').querySelector('.file-current');
                    if (currentEl) {
                        currentEl.innerHTML = `Mevcut: <span>${filePath}</span>`;
                    } else {
                        const newCurrent = document.createElement('div');
                        newCurrent.className = 'file-current';
                        newCurrent.innerHTML = `Mevcut: <span>${filePath}</span>`;
                        btn.closest('.file-upload-row').after(newCurrent);
                    }
                } catch (e) {
                    console.error('[Upload]', e);
                    statusEl.innerHTML = `<span style="color:#ff6b6b;">Hata: ${e.message}</span>`;
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'Yükle';
                }
            });
        });
    }

    function sanitize(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ═══════════════════════════════════════
    // FILE UPLOAD via GitHub API
    // ═══════════════════════════════════════
    async function uploadFileToGitHub(file, uploadDir) {
        const token = ENV.GITHUB_PAT;
        const repo = ENV.GITHUB_REPO;

        if (!token || token === '__GH_PAT__') {
            throw new Error('GitHub PAT yapılandırılmamış. Dosya yüklemesi deploy sonrası çalışır.');
        }

        // Dosya adını temizle (Türkçe karakter, boşluk)
        const cleanName = file.name
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9._-]/g, '')
            .toLowerCase();
        const filePath = uploadDir + cleanName;

        // Dosyayı base64 olarak oku
        const base64Content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // Mevcut dosya var mı kontrol et (SHA lazım güncelleme için)
        let sha = null;
        try {
            const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
            });
            if (getRes.ok) {
                const info = await getRes.json();
                sha = info.sha;
            }
        } catch (e) { /* dosya yok, yeni oluşturulacak */ }

        // Dosyayı yükle/güncelle
        const body = {
            message: `[Admin] Dosya yüklendi: ${cleanName}`,
            content: base64Content
        };
        if (sha) body.sha = sha;

        const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || 'Yükleme başarısız');
        }

        return filePath;
    }

    modalSave.addEventListener('click', saveItem);
    modalCancel.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    function closeModal() {
        modal.classList.remove('open');
        currentEditSection = null;
        currentEditIndex = -1;
        currentEditSub = null;
    }

    function saveItem() {
        const fields = getFields(currentEditSection, currentEditSub);
        const item = currentEditIndex >= 0 ? getExistingItem() : {};

        fields.forEach(f => {
            const el = document.getElementById('field_' + f.key);
            if (!el) return;
            let val = el.value;

            // Type coercion
            if (f.type === 'number') val = parseFloat(val) || 0;
            if (f.type === 'select') {
                if (val === 'true') val = true;
                else if (val === 'false') val = false;
            }

            item[f.key] = val;
        });

        // Save to DataStore
        if (currentEditSub) {
            const allData = DataStore.getData(currentEditSection);
            if (currentEditIndex >= 0) {
                allData[currentEditSub][currentEditIndex] = item;
            } else {
                allData[currentEditSub].push(item);
            }
            DataStore.setData(currentEditSection, allData);
        } else {
            const allData = DataStore.getData(currentEditSection);
            if (currentEditIndex >= 0) {
                allData[currentEditIndex] = item;
            } else {
                // Add default fields for new items
                if (currentEditSection === 'agents') {
                    item.steps = item.steps || ['Konsept', 'Geliştirme', 'Test', 'Canlı'];
                    item.completedSteps = item.completedSteps || [];
                    item.before = item.before || { time: '-', error: '-', staff: '-' };
                    item.after = item.after || { time: '-', error: '-', staff: '-' };
                    item.chartData = item.chartData || new Array(30).fill(0);
                    item.versions = item.versions || [];
                }
                if (currentEditSection === 'sap') {
                    item.steps = item.steps || ['Analiz', 'Geliştirme', 'Test', 'Canlı'];
                    item.completedSteps = item.completedSteps || [];
                    item.affected = item.affected || [];
                }
                if (currentEditSection === 'bulletins') {
                    item.id = Math.max(0, ...allData.map(b => b.id || 0)) + 1;
                    item.icon = item.icon || '';
                }
                allData.push(item);
            }
            DataStore.setData(currentEditSection, allData);
        }

        closeModal();
        renderSection(activeSection);
        showToast('Kaydedildi ✓');
    }

    function getExistingItem() {
        if (currentEditSub) {
            return { ...DataStore.getData(currentEditSection)[currentEditSub][currentEditIndex] };
        }
        return { ...DataStore.getData(currentEditSection)[currentEditIndex] };
    }

    // ═══════════════════════════════════════
    // DELETE
    // ═══════════════════════════════════════
    function deleteItem(section, index, sub) {
        if (sub) {
            const allData = DataStore.getData(section);
            allData[sub].splice(index, 1);
            DataStore.setData(section, allData);
        } else {
            const allData = DataStore.getData(section);
            allData.splice(index, 1);
            DataStore.setData(section, allData);
        }
        renderSection(activeSection);
        showToast('Silindi ✓');
    }

    // ═══════════════════════════════════════
    // PUBLISH via GitHub API
    // ═══════════════════════════════════════
    document.getElementById('btnPublish').addEventListener('click', async () => {
        const btn = document.getElementById('btnPublish');
        const originalText = btn.textContent;
        btn.textContent = 'Yayımlanıyor...';
        btn.disabled = true;

        try {
            const content = DataStore.generateDataFile();
            const repo = ENV.GITHUB_REPO;
            const path = 'js/data.js';
            const token = ENV.GITHUB_PAT;

            if (!token || token === '__GH_PAT__') {
                // Fallback: dosya indirme (yerel geliştirme)
                const blob = new Blob([content], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data.js';
                a.click();
                URL.revokeObjectURL(url);
                showToast('GitHub PAT eksik. data.js dosya olarak indirildi.');
                btn.textContent = originalText;
                btn.disabled = false;
                return;
            }

            // 1. Mevcut dosyanın SHA'sını al
            const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
            });
            const fileInfo = await getRes.json();
            const sha = fileInfo.sha;

            // 2. Dosyayı güncelle
            const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `[Admin Panel] Veri güncellendi - ${new Date().toLocaleString('tr-TR')}`,
                    content: btoa(unescape(encodeURIComponent(content))),
                    sha: sha
                })
            });

            if (putRes.ok) {
                showToast('Yayımlandı! Site 1-2 dk içinde güncellenecek.');
            } else {
                const err = await putRes.json();
                throw new Error(err.message || 'GitHub API hatası');
            }
        } catch (e) {
            console.error('[Admin] Yayımlama hatası:', e);
            showToast('Hata: ' + e.message);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });

    // ═══════════════════════════════════════
    // RESET
    // ═══════════════════════════════════════
    document.getElementById('btnResetAll').addEventListener('click', () => {
        if (confirm('Tüm verileri varsayılana döndürmek istediğinize emin misiniz?')) {
            DataStore.resetAll();
            renderSection(activeSection);
            showToast('Tüm veriler sıfırlandı');
        }
    });

    document.getElementById('btnResetSection').addEventListener('click', () => {
        if (confirm(`"${SECTIONS[activeSection].title}" verilerini varsayılana döndürmek istiyor musunuz?`)) {
            DataStore.resetData(activeSection);
            renderSection(activeSection);
            showToast(`${SECTIONS[activeSection].title} sıfırlandı`);
        }
    });

    // ═══════════════════════════════════════
    // TOAST
    // ═══════════════════════════════════════
    function showToast(msg) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

})();
