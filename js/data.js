/* ============================================
   DATA.JS - Merkezi Veri Yönetimi
   Otomatik oluşturuldu: 02.03.2026 09:19:15
   ============================================ */

const DataStore = (function () {

  const STORAGE_PREFIX = 'mid_';

  const DEFAULTS = {
  "metrics": [
    {
      "value": 24,
      "prefix": "%",
      "suffix": "",
      "label": "VERİMLİLİK ARTIŞI",
      "change": "5%",
      "changeLabel": "geçen çeyreğe göre",
      "positive": true,
      "icon": "📈",
      "description": "Dijitalleşme projeleri sayesinde iş süreçlerindeki verimlilik artışı.",
      "details": [
        "Otomasyon ile manuel iş yükünde %15 azalma",
        "Süreç iyileştirmeleri ile %8 hız artışı",
        "Hata oranlarında %90 düşüş"
      ]
    },
    {
      "value": 1240,
      "prefix": "",
      "suffix": " saat",
      "label": "KAZANILAN ZAMAN",
      "change": "8%",
      "changeLabel": "geçen çeyreğe göre",
      "positive": true,
      "icon": "⏱️",
      "description": "Yıl başından bu yana tamamlanan projelerle toplam kazanılan adam/saat.",
      "details": [
        "RPA Robotları: 850 saat",
        "Süreç Optimizasyonu: 210 saat",
        "Self-Servis Raporlama: 180 saat"
      ]
    },
    {
      "value": 2.1,
      "prefix": "₺",
      "suffix": " Mn",
      "label": "YILLIK TASARRUF",
      "change": "12%",
      "changeLabel": "geçen çeyreğe göre",
      "positive": true,
      "icon": "💸",
      "description": "Dijitalleşme inisiyatifleri sonucu elde edilen maliyet tasarrufları.",
      "details": [
        "Kağıt/Baskı Tasarrufu: 0.4 Mn ₺",
        "Lisans Optimizasyonu: 1.2 Mn ₺",
        "Operasyonel Verimlilik: 0.5 Mn ₺"
      ]
    },
    {
      "value": 47,
      "prefix": "",
      "suffix": "",
      "label": "TAMAMLANAN PROJE",
      "change": "3 Proje",
      "changeLabel": "geçen çeyreğe göre",
      "positive": true,
      "icon": "✅",
      "description": "2025 yılı içerisinde başarıyla canlıya alınan dijitalleşme projeleri.",
      "details": [
        "Finansal Raporlama Otomasyonu",
        "Tedarikçi Portalı Yenilemesi",
        "Mobil Onay Mekanizması"
      ]
    }
  ],
  "agents": [
    {
      "name": "Tüpraş Mali İşler Asistanı",
      "module": "Tüm Şirket",
      "steps": [
        "Konsept",
        "Geliştirme",
        "Pilot",
        "Canlı"
      ],
      "currentStep": 3,
      "completedSteps": [
        0,
        1,
        2,
        3
      ],
      "target": "Tamamlandı",
      "statusLabel": "Canlıda",
      "status": "active",
      "description": "Tüpraş Mali İşler ekiplerinin günlük operasyonlarında anlık destek sağlayan yapay zeka asistanı.",
      "owner": "Mustafa Fışkırma",
      "savings": "₺1,200,000",
      "timeSaved": "1,500 saat/yıl",
      "before": {
        "time": "2 saat/gün",
        "error": "%5 hata",
        "staff": "Tüm ekip"
      },
      "after": {
        "time": "Anlık",
        "error": "%0 hata",
        "staff": "AI Asistan"
      },
      "chartData": [
        40,
        45,
        50,
        55,
        60,
        65,
        70,
        75,
        80,
        85,
        88,
        90,
        92,
        94,
        95,
        96,
        96,
        97,
        97,
        98,
        98,
        99,
        99,
        99,
        100,
        100,
        100,
        100,
        100,
        100
      ],
      "versions": [
        {
          "tag": "v1.0",
          "date": "14.02.2026",
          "note": "Canlıya geçiş"
        }
      ]
    },
    {
      "name": "Budget Asist",
      "module": "Tüm Şirket",
      "steps": [
        "Konsept",
        "Geliştirme",
        "Test",
        "Canlı"
      ],
      "currentStep": 2,
      "completedSteps": [
        0,
        1
      ],
      "target": "Nisan 2026",
      "statusLabel": "Test Aşamasında",
      "status": "dev",
      "description": "Bütçe planlama döngülerinde varyans analizlerini otomatize eden akıllı asistan.",
      "owner": "Mustafa Fışkırma",
      "savings": "₺850,000",
      "timeSaved": "900 saat/yıl",
      "before": {
        "time": "3 gün/ay",
        "error": "%10 sapma",
        "staff": "4 kişi"
      },
      "after": {
        "time": "1 saat/ay",
        "error": "%2 sapma",
        "staff": "1 kişi"
      },
      "chartData": [
        20,
        25,
        30,
        35,
        40,
        45,
        48,
        52,
        55,
        60,
        62,
        65,
        68,
        70,
        72,
        75,
        78,
        80,
        82,
        85,
        87,
        88,
        90,
        91,
        92,
        93,
        94,
        95,
        95,
        96
      ],
      "versions": [
        {
          "tag": "v0.8",
          "date": "10.02.2026",
          "note": "Geliştirme tamamlandı"
        }
      ]
    },
    {
      "name": "Dijital Muhabir",
      "module": "Vergi Teşvik ve Uygulama Ekibi",
      "steps": [
        "Konsept",
        "Geliştirme",
        "Pilot",
        "Canlı"
      ],
      "currentStep": 1,
      "completedSteps": [
        0
      ],
      "target": "Belirsiz",
      "statusLabel": "Durduruldu",
      "status": "maint",
      "description": "Şirket içi ve dışı finansal haberleri analiz edip özetleyen dijital haberci.",
      "owner": "Mustafa Fışkırma",
      "savings": "-",
      "timeSaved": "-",
      "before": {
        "time": "-",
        "error": "-",
        "staff": "-"
      },
      "after": {
        "time": "-",
        "error": "-",
        "staff": "-"
      },
      "chartData": [
        10,
        15,
        20,
        25,
        28,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30,
        30
      ],
      "versions": [
        {
          "tag": "v0.3",
          "date": "15.01.2026",
          "note": "Proje askıya alındı"
        }
      ]
    },
    {
      "name": "Kurumsal Hafıza",
      "module": "Mali İşler Direktörlüğü",
      "steps": [
        "Analiz",
        "Geliştirme",
        "Pilot",
        "Canlı"
      ],
      "currentStep": 0,
      "completedSteps": [],
      "target": "2027 Q1",
      "statusLabel": "Başlangıç",
      "status": "dev",
      "description": "Geçmiş finansal kararları ve dokümanları sorgulanabilir hale getiren bilgi bankası.",
      "owner": "Mustafa Fışkırma",
      "savings": "Hedef: ₺2M",
      "timeSaved": "Hedef: 3000 saat",
      "before": {
        "time": "Kayıp",
        "error": "Yüksek",
        "staff": "-"
      },
      "after": {
        "time": "Saniyeler",
        "error": "Yok",
        "staff": "-"
      },
      "chartData": [
        0,
        1,
        2,
        3,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ],
      "versions": [
        {
          "tag": "v0.1",
          "date": "01.02.2026",
          "note": "Analiz çalışmaları"
        }
      ]
    }
  ],
  "sap": [
    {
      "title": "SAP FI Güncelleme",
      "module": "FI/CO",
      "steps": [
        "Analiz",
        "Geliştirme",
        "Test",
        "Canlı"
      ],
      "currentStep": 2,
      "completedSteps": [
        0,
        1
      ],
      "target": "15 Mart 2026",
      "description": "Finansal muhasebe modülünde yeni raporlama altyapısı.",
      "owner": "Deniz Cem",
      "affected": [
        "FI",
        "CO",
        "MM"
      ]
    },
    {
      "title": "SAP MM Entegrasyonu",
      "module": "MM/SD",
      "steps": [
        "Analiz",
        "Geliştirme",
        "Test",
        "Canlı"
      ],
      "currentStep": 1,
      "completedSteps": [
        0
      ],
      "target": "30 Nisan 2026",
      "description": "Malzeme yönetimi ve satış dağıtım modüllerinin entegrasyonu.",
      "owner": "Deniz Cem",
      "affected": [
        "MM",
        "SD",
        "FI"
      ]
    },
    {
      "title": "SAP HR Portalı",
      "module": "HR",
      "steps": [
        "Analiz",
        "Geliştirme",
        "Test",
        "Canlı"
      ],
      "currentStep": 3,
      "completedSteps": [
        0,
        1,
        2
      ],
      "target": "01 Mart 2026",
      "description": "İnsan kaynakları self-servis portal geliştirmesi.",
      "owner": "Deniz Cem",
      "affected": [
        "HR",
        "FI"
      ]
    },
    {
      "title": "SAP BW Raporlama",
      "module": "BW/BI",
      "steps": [
        "Analiz",
        "Geliştirme",
        "Test",
        "Canlı"
      ],
      "currentStep": 0,
      "completedSteps": [],
      "target": "15 Haziran 2026",
      "description": "Business Warehouse raporlama altyapısının modernizasyonu.",
      "owner": "Deniz Cem",
      "affected": [
        "BW",
        "FI",
        "CO",
        "MM"
      ]
    },
    {
      "title": "deneme",
      "module": "deneme",
      "description": "deneme",
      "target": "xx",
      "owner": "deneme",
      "currentStep": 0,
      "steps": [
        "Analiz",
        "Geliştirme",
        "Test",
        "Canlı"
      ],
      "completedSteps": [],
      "affected": []
    }
  ],
  "other": [
    {
      "name": "Masraf RPA Botu",
      "category": "RPA",
      "status": "active",
      "statusLabel": "Aktif",
      "desc": "Masraf formlarını otomatik işleyen RPA botu."
    },
    {
      "name": "Finansal Dashboard",
      "category": "Power BI",
      "status": "active",
      "statusLabel": "Aktif",
      "desc": "Gerçek zamanlı finansal gösterge paneli."
    },
    {
      "name": "Veri Temizleme Scripti",
      "category": "Python",
      "status": "active",
      "statusLabel": "Aktif",
      "desc": "SAP verilerini temizleyen Python scripti."
    },
    {
      "name": "Bütçe Takip Makrosu",
      "category": "Excel/VBA",
      "status": "active",
      "statusLabel": "Aktif",
      "desc": "Bütçe sapma analizlerini otomatikleştiren makro."
    },
    {
      "name": "Fatura Okuma Botu",
      "category": "RPA",
      "status": "dev",
      "statusLabel": "Geliştirmede",
      "desc": "OCR ile fatura verilerini okuyan bot."
    },
    {
      "name": "Satınalma Raporu",
      "category": "Power BI",
      "status": "active",
      "statusLabel": "Aktif",
      "desc": "Satınalma süreçlerinin detaylı Power BI raporu."
    },
    {
      "name": "Otomatik Mail Parser",
      "category": "Python",
      "status": "dev",
      "statusLabel": "Geliştirmede",
      "desc": "Mail eklerini otomatik ayrıştıran Python aracı."
    },
    {
      "name": "KDV Hesaplama Aracı",
      "category": "Excel/VBA",
      "status": "active",
      "statusLabel": "Aktif",
      "desc": "Karmaşık KDV senaryolarını hesaplayan araç."
    },
    {
      "name": "Onay Akışı Botu",
      "category": "RPA",
      "status": "active",
      "statusLabel": "Aktif",
      "desc": "Onay süreçlerini takip eden ve hatırlatan bot."
    },
    {
      "name": "Stok Analizi",
      "category": "Power BI",
      "status": "dev",
      "statusLabel": "Geliştirmede",
      "desc": "Stok hareketlerinin görsel analizi."
    },
    {
      "name": "PDF Dönüştürücü",
      "category": "Python",
      "status": "active",
      "statusLabel": "Aktif",
      "desc": "Toplu PDF dönüşüm ve birleştirme aracı."
    },
    {
      "name": "Muhasebe Kontrol Listesi",
      "category": "Excel/VBA",
      "status": "active",
      "statusLabel": "Aktif",
      "desc": "Ay sonu kapanış kontrol listesi otomasyonu."
    }
  ],
  "bulletins": [
    {
      "id": 1,
      "month": "Toplantılarda Copilot",
      "year": 2026,
      "title": "Business Bülten Seri:6",
      "topic": "AI",
      "coverImage": "assets/bulletins/ocak-2026.jpg",
      "pdfFile": "assets/bulletins/ocak-2026.pdf",
      "icon": "",
      "mostRead": true,
      "summary": "Teams Copilot ile toplantı özetleri ve aksiyon yönetimi."
    },
    {
      "id": 6,
      "month": "Eylül",
      "year": 2026,
      "title": "Tüketici Yolculuğu",
      "topic": "Pazarlama",
      "coverImage": "assets/bulletins/tuketici-yolculugu.jpg",
      "pdfFile": "assets/bulletins/tuketici-yolculugu.pdf",
      "icon": "",
      "mostRead": false,
      "summary": "Müşteri deneyimini iyileştirmek için tüketici yolculuğu."
    },
    {
      "id": 2,
      "month": "Şubat",
      "year": 2026,
      "title": "Yapay Zeka",
      "topic": "AI",
      "coverImage": "assets/bulletins/yapay-zeka.jpg",
      "pdfFile": "assets/bulletins/yapay-zeka.pdf",
      "icon": "",
      "mostRead": false,
      "summary": "Yapay zeka teknolojilerindeki son gelişmeler."
    },
    {
      "id": 3,
      "month": "Aralık",
      "year": 2026,
      "title": "Blockchain",
      "topic": "Teknoloji",
      "coverImage": "assets/bulletins/blockchain.jpg",
      "pdfFile": "assets/bulletins/blockchain.pdf",
      "icon": "",
      "mostRead": false,
      "summary": "Blokzincir teknolojisi ve iş dünyasındaki uygulamaları."
    },
    {
      "id": 4,
      "month": "Kasım",
      "year": 2026,
      "title": "MS To-Do",
      "topic": "Verimlilik",
      "coverImage": "assets/bulletins/ms-to-do.jpg",
      "pdfFile": "assets/bulletins/ms-to-do.pdf",
      "icon": "",
      "mostRead": false,
      "summary": "Microsoft To-Do ile işlerinizi daha iyi organize edin."
    },
    {
      "id": 5,
      "month": "Ekim",
      "year": 2026,
      "title": "SAP Analizi",
      "topic": "SAP",
      "coverImage": "assets/bulletins/sap-analysis.jpg",
      "pdfFile": "assets/bulletins/sap-analysis.pdf",
      "icon": "",
      "mostRead": false,
      "summary": "SAP sistemleri üzerine detaylı analizler."
    },
    {
      "id": 7,
      "month": "Ağustos",
      "year": 2026,
      "title": "Kahvaltı",
      "topic": "Yaşam",
      "coverImage": "assets/bulletins/kahvaltı.jpg",
      "pdfFile": "assets/bulletins/kahvaltı.pdf",
      "icon": "",
      "mostRead": false,
      "summary": "Sağlıklı ve keyifli kahvaltı önerileri."
    },
    {
      "title": "UiPath ",
      "month": "Şubat",
      "year": 2026,
      "topic": "AI",
      "summary": "Uipath ile kapalı devre agent",
      "coverImage": "assets/bulletins/whatsapp-image-2026-02-27-at-18.04.16.jpeg",
      "pdfFile": "assets/bulletins/business-bulten-template-.pdf",
      "mostRead": false,
      "id": 8,
      "icon": ""
    }
  ],
  "roadmap": [
    {
      "name": "Tüpraş Mali İşler Asistanı",
      "category": "Agent",
      "quarter": "2026 Q1",
      "status": "completed"
    },
    {
      "name": "Budget Asist",
      "category": "Agent",
      "quarter": "2026 Q2",
      "status": "in-progress"
    },
    {
      "name": "Kurumsal Hafıza",
      "category": "Agent",
      "quarter": "2026 Q4",
      "status": "planned"
    },
    {
      "name": "Dijital Muhabir",
      "category": "Agent",
      "quarter": "2026 Q1",
      "status": "in-progress"
    },
    {
      "name": "Fatura RPA Botu",
      "category": "RPA",
      "quarter": "2026 Q1",
      "status": "in-progress"
    },
    {
      "name": "SAP FI Güncelleme",
      "category": "SAP",
      "quarter": "2026 Q1",
      "status": "in-progress"
    },
    {
      "name": "SAP HR Portalı",
      "category": "SAP",
      "quarter": "2026 Q1",
      "status": "in-progress"
    },
    {
      "name": "Portal Lansmanı",
      "category": "Diğer",
      "quarter": "2026 Q1",
      "status": "in-progress"
    },
    {
      "name": "Finansal Dashboard",
      "category": "Power BI",
      "quarter": "2025 Q4",
      "status": "completed"
    },
    {
      "name": "Masraf RPA Botu",
      "category": "RPA",
      "quarter": "2025 Q4",
      "status": "completed"
    },
    {
      "name": "SAP MM Enteg.",
      "category": "SAP",
      "quarter": "2026 Q2",
      "status": "planned"
    },
    {
      "name": "Stok Analizi",
      "category": "Power BI",
      "quarter": "2026 Q2",
      "status": "planned"
    },
    {
      "name": "SAP BW Raporlama",
      "category": "SAP",
      "quarter": "2026 Q3",
      "status": "planned"
    },
    {
      "name": "AI Portal v2.0",
      "category": "Diğer",
      "quarter": "2026 Q3",
      "status": "planned"
    }
  ],
  "training": {
    "videos": [
      {
        "title": "Nomex Fatura Süreci",
        "desc": "Nomex fatura sürecinin detaylı anlatımı.",
        "duration": "",
        "icon": "",
        "videoFile": "assets/videos/Nomex_Fatura_Sureci.mp4"
      },
      {
        "title": "Agent Kullanım Rehberi",
        "desc": "Agentları nasıl kullanacağınızı adım adım öğrenin.",
        "duration": "5:32",
        "icon": "",
        "videoFile": ""
      },
      {
        "title": "SAP Rapor Oluşturma",
        "desc": "SAP üzerinde özel rapor oluşturma eğitimi.",
        "duration": "8:15",
        "icon": "",
        "videoFile": ""
      },
      {
        "title": "Power BI Temelleri",
        "desc": "Power BI ile dashboard oluşturma temelleri.",
        "duration": "12:45",
        "icon": "",
        "videoFile": ""
      },
      {
        "title": "RPA Bot Geliştirme",
        "desc": "UiPath ile basit bir RPA botu geliştirin.",
        "duration": "15:20",
        "icon": "",
        "videoFile": ""
      },
      {
        "title": "Python ile Veri Analizi",
        "desc": "Pandas kütüphanesi ile veri analizi.",
        "duration": "18:30",
        "icon": "",
        "videoFile": ""
      },
      {
        "title": "Portal Kullanım Eğitimi",
        "desc": "Bu portal nasıl kullanılır?",
        "duration": "3:45",
        "icon": "",
        "videoFile": ""
      }
    ],
    "docs": [
      {
        "title": "Fatura Agent Kılavuzu",
        "desc": "Fatura Agent kullanım kılavuzu.",
        "format": "PDF",
        "icon": ""
      },
      {
        "title": "RPA Bot Kullanım Dökümanı",
        "desc": "RPA botlarının teknik dökümanı.",
        "format": "PDF",
        "icon": ""
      },
      {
        "title": "Genel Portal Rehberi",
        "desc": "Portal kullanım rehberi.",
        "format": "PDF",
        "icon": ""
      },
      {
        "title": "SAP FI Modül Rehberi",
        "desc": "SAP Finansal muhasebe modül rehberi.",
        "format": "PDF",
        "icon": ""
      },
      {
        "title": "Veri Güvenliği Politikası",
        "desc": "Dijital veri güvenliği kuralları.",
        "format": "PDF",
        "icon": ""
      },
      {
        "title": "API Entegrasyon Rehberi",
        "desc": "Dış sistemlerle entegrasyon rehberi.",
        "format": "PDF",
        "icon": ""
      }
    ],
    "quickstart": [
      {
        "title": "Hızlı Başlangıç: Agent",
        "desc": "5 dakikada ilk agentınızı çalıştırın.",
        "time": "5 dk",
        "icon": ""
      },
      {
        "title": "Hızlı Başlangıç: RPA",
        "desc": "İlk RPA botunuzu 10 dakikada kurun.",
        "time": "10 dk",
        "icon": ""
      },
      {
        "title": "Hızlı Başlangıç: Power BI",
        "desc": "İlk dashboardunuzu oluşturun.",
        "time": "15 dk",
        "icon": ""
      },
      {
        "title": "Hızlı Başlangıç: Portal",
        "desc": "Portalı etkili kullanmanın yolları.",
        "time": "3 dk",
        "icon": ""
      }
    ],
    "faq": [
      {
        "q": "Agent nedir ve nasıl çalışır?",
        "a": "Agent, belirli bir iş sürecini otomatik olarak yürüten yapay zeka destekli yazılım bileşenidir."
      },
      {
        "q": "Nasıl yeni bir proje talebi oluşturabilirim?",
        "a": "Teams kanalı üzerinden ekibimizle iletişime geçebilirsiniz."
      },
      {
        "q": "Dark mode ayarı nerede?",
        "a": "Sağ üst köşedeki güneş/ay ikonuna tıklayarak geçiş yapabilirsiniz."
      },
      {
        "q": "Sunum modunu nasıl kullanırım?",
        "a": "Üst menüdeki \"Sunum\" butonuna tıklayın. Ok tuşları ile gezinebilirsiniz."
      },
      {
        "q": "Verileri nasıl dışa aktarabilirim?",
        "a": "Her bölümde export seçenekleri bulunmaktadır."
      },
      {
        "q": "Bülten aboneliği nasıl yapılır?",
        "a": "Ana sayfadaki Bültenler bölümünden abone olabilirsiniz."
      },
      {
        "q": "Bir hata bulursam kime bildirmeliyim?",
        "a": "Mustafa.Fiskirma@tupras.com.tr adresine mail gönderebilirsiniz."
      }
    ]
  }
};

  function getData(key) {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      if (stored) return JSON.parse(stored);
    } catch (e) { console.warn('[DataStore] hata:', key, e); }
    return JSON.parse(JSON.stringify(DEFAULTS[key]));
  }

  function setData(key, value) {
    try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)); }
    catch (e) { console.error('[DataStore] hata:', key, e); }
  }

  function resetData(key) { localStorage.removeItem(STORAGE_PREFIX + key); }
  function resetAll() { Object.keys(DEFAULTS).forEach(k => localStorage.removeItem(STORAGE_PREFIX + k)); }
  function exportAll() { const d = {}; Object.keys(DEFAULTS).forEach(k => { d[k] = getData(k); }); return d; }
  function importAll(data) { Object.keys(data).forEach(k => { if (DEFAULTS.hasOwnProperty(k)) setData(k, data[k]); }); }
  function generateDataFile() {
    const allData = exportAll();
    const now = new Date().toLocaleString('tr-TR');
    let output = `/* ============================================\n`;
    output += `   DATA.JS - Merkezi Veri Yönetimi\n`;
    output += `   Otomatik oluşturuldu: ${now}\n`;
    output += `   ============================================ */\n\n`;
    output += `const DataStore = (function () {\n\n`;
    output += `  const STORAGE_PREFIX = 'mid_';\n\n`;
    output += `  const DEFAULTS = ${JSON.stringify(allData, null, 2)};\n\n`;
    output += `  function getData(key) {\n`;
    output += `    try {\n`;
    output += `      const stored = localStorage.getItem(STORAGE_PREFIX + key);\n`;
    output += `      if (stored) return JSON.parse(stored);\n`;
    output += `    } catch (e) { console.warn('[DataStore] hata:', key, e); }\n`;
    output += `    return JSON.parse(JSON.stringify(DEFAULTS[key]));\n`;
    output += `  }\n\n`;
    output += `  function setData(key, value) {\n`;
    output += `    try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)); }\n`;
    output += `    catch (e) { console.error('[DataStore] hata:', key, e); }\n`;
    output += `  }\n\n`;
    output += `  function resetData(key) { localStorage.removeItem(STORAGE_PREFIX + key); }\n`;
    output += `  function resetAll() { Object.keys(DEFAULTS).forEach(k => localStorage.removeItem(STORAGE_PREFIX + k)); }\n`;
    output += `  function exportAll() { const d = {}; Object.keys(DEFAULTS).forEach(k => { d[k] = getData(k); }); return d; }\n`;
    output += `  function importAll(data) { Object.keys(data).forEach(k => { if (DEFAULTS.hasOwnProperty(k)) setData(k, data[k]); }); }\n`;
    output += `  ` + generateDataFile.toString() + `\n\n`;
    output += `  return { getData, setData, resetData, resetAll, exportAll, importAll, generateDataFile, DEFAULTS };\n`;
    output += `})();\n`;
    return output;
  }

  return { getData, setData, resetData, resetAll, exportAll, importAll, generateDataFile, DEFAULTS };
})();
