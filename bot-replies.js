/* =============================================================
   CHATBOT FUSAKO STUDIO — chatbot-fusako.js
   Versi: 2.0 (Alur Pilihan + Input Manual)

   CARA PAKAI DI index.html:
   1. Tambahkan <script src="chatbot-fusako.js"></script>
      sebelum </body>
   2. Pastikan elemen chatbot (waPopup, waInput, dll.)
      sudah ada di HTML (tidak berubah dari versi sebelumnya)
   3. Fungsi yang bisa dipanggil dari luar:
      - sendBotMsg()          → kirim pesan dari input #waInput
      - window._startPromo(code) → mulai sesi dari popup promo
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   0. KONFIGURASI
   ───────────────────────────────────────────────────────────── */
const FUSAKO_CONFIG = {
  waNumber:    '6285117031202',       /* nomor WA admin tanpa + */
  promoCode:   'PROMOTIPE50',         /* kode promo aktif       */
  promoHarga:  'Rp 4.499.000',        /* harga promo            */
  promoHargaAsli: 'Rp 8.000.000',     /* harga asli             */
  promoMaxLuas: 50,                   /* max luas promo (m²)    */
  promoHemat:  '44%',                 /* persentase hemat       */
  promoSlot:   2,                     /* kuota slot promo       */

  /* Warna header chatbot saat mode promo */
  colorPromo:  '#d4930e',
  colorNormal: '#075E54',

  /* Gunakan Claude API atau fallback template */
  useClaudeAPI: true,
};


/* ─────────────────────────────────────────────────────────────
   1. TEMPLATE FALLBACK
      Dipakai jika API Claude tidak tersedia / gagal merespons.
      Hanya berlaku untuk chat DARI PROMO atau chat umum
      (bukan alur konsultasi step-by-step langsung).
   ───────────────────────────────────────────────────────────── */
const waTemplates = [

  {
    keys: /harga|biaya|tarif|cost|fee|bayar/i,
    reply:
      '💰 Biaya perencanaan kami bervariasi sesuai jenis dan skala proyek.\n\n' +
      '🏠 *Desain Lengkap (Rumah / Villa / Hotel / Apartemen):*\n' +
      '   • Paket Lengkap: Rp 95.000/m²\n' +
      '   • Paket Detapo: Rp 45.000/m²\n\n' +
      '🏪 *Desain Lengkap (Kos-kosan / Ruko / Rukan):*\n' +
      '   • Paket Lengkap: Rp 65.000/m²\n' +
      '   • Paket Detapo: Rp 32.000/m²\n\n' +
      '🗺️ *Paket Denah Saja (1–3 lantai):* Rp 300.000 (flat)\n\n' +
      'Semua estimasi transparan. Proyek apa yang sedang Anda rencanakan?'
  },

  {
    keys: /kantor|perkantoran|gedung|ruko|komersial|toko/i,
    reply:
      '🏢 Layanan *Desain Perkantoran & Komersial* kami:\n\n' +
      '• Gedung kantor 1–10 lantai\n' +
      '• Ruko dan pusat perbelanjaan\n' +
      '• Desain representatif & fungsional\n\n' +
      'Bisa ceritakan gambaran proyeknya?'
  },

  {
    keys: /industri|pabrik|gudang|warehouse|manufaktur/i,
    reply:
      '🏭 Untuk *Perencanaan Kawasan Industri*, kami menangani:\n\n' +
      '• Desain pabrik & gudang\n' +
      '• Layout kawasan industri\n' +
      '• Perencanaan utilitas & infrastruktur\n\n' +
      'Ceritakan kebutuhan industri Anda!'
  },

  {
    keys: /klinik|rumah sakit|puskesmas|kesehatan|medis|dokter/i,
    reply:
      '🏥 Kami berpengalaman dalam *Desain Fasilitas Kesehatan*:\n\n' +
      '• Klinik & puskesmas\n' +
      '• Ruang periksa & apotek\n' +
      '• Standar kesehatan & sanitasi\n\n' +
      'Ada proyek fasilitas kesehatan yang ingin direncanakan?'
  },

  {
    keys: /cafe|restoran|hotel|penginapan|resort|kafe/i,
    reply:
      '☕ Untuk *Desain Cafe, Restoran & Penginapan*:\n\n' +
      '• Konsep interior modern & estetis\n' +
      '• Denah sirkulasi pengunjung optimal\n' +
      '• Desain hotel & villa\n\n' +
      'Bagaimana konsep yang Anda bayangkan?'
  },

  {
    keys: /sipil|infrastruktur|jalan|jembatan|drainase|air bersih/i,
    reply:
      '🔧 Layanan *Perencanaan Sipil & Infrastruktur* kami:\n\n' +
      '• Perencanaan jalan & drainase\n' +
      '• Sistem air bersih & sanitasi\n' +
      '• Dokumen teknis siap lelang\n\n' +
      'Proyek infrastruktur apa yang sedang direncanakan?'
  },

  {
    keys: /proses|alur|langkah|cara|prosedur|bagaimana|gimana/i,
    reply:
      '📋 Proses kerja kami sederhana:\n\n' +
      '1️⃣ Konsultasi — ceritakan kebutuhan\n' +
      '2️⃣ Brief & kajian — kami pelajari detail\n' +
      '3️⃣ Desain konsep — sketsa & rencana awal\n' +
      '4️⃣ Revisi — sampai sesuai keinginan\n' +
      '5️⃣ Dokumen final — siap bangun\n\n' +
      'Semua bisa online! 💻'
  },

  {
    keys: /lokasi|alamat|dimana|sijunjung|sumatera/i,
    reply:
      '📍 Studio kami di *Sijunjung, Sumatera Barat*, namun melayani seluruh Indonesia secara online.\n\n' +
      'Ada yang ingin Anda tanyakan lebih lanjut?'
  },

  {
    keys: /kontak|hubungi|telepon|wa|whatsapp|nomor|email/i,
    reply:
      '📞 Untuk berdiskusi langsung, silakan klik tombol *"Hubungi Tim Kami"* — tim kami siap merespons via WhatsApp.\n\n' +
      'Atau ada pertanyaan lain dulu?'
  },

  {
    keys: /lama|waktu|durasi|berapa lama|kapan selesai|deadline/i,
    reply:
      '⏱️ Estimasi waktu pengerjaan:\n\n' +
      '• Desain rumah: *7–30 hari*\n' +
      '• Perkantoran: *14–90 hari*\n' +
      '• Proyek besar: sesuai kompleksitas\n\n' +
      'Ada target waktu tertentu?'
  },

  {
    keys: /revisi|ubah|ganti|tidak suka|kurang|perbaiki/i,
    reply:
      '✏️ Setiap paket sudah termasuk revisi desain. Kepuasan klien adalah prioritas kami. 💯\n\n' +
      'Mau tahu lebih lanjut tentang paket layanan kami?'
  },

  {
    keys: /portofolio|contoh|hasil|proyek|karya|galeri/i,
    reply:
      '🖼️ Portofolio kami bisa dilihat di bagian *"Proyek Kami"* di halaman ini.\n\n' +
      'Untuk katalog lengkap, tim kami siap mengirimkan setelah konsultasi singkat.'
  },

  {
    keys: /terima kasih|makasih|thanks|mantap|bagus|oke|ok|siap/i,
    reply:
      '😊 Sama-sama! Senang bisa membantu.\n\n' +
      'Jika ada pertanyaan lain seputar desain dan perencanaan, jangan ragu bertanya ya!'
  },

  {
    keys: /berapa|ukuran|luas|meter|lantai|kamar/i,
    reply:
      '📐 Kami bisa bantu sesuai ukuran dan spesifikasi proyek Anda.\n\n' +
      'Coba ceritakan: luas tanah, jumlah lantai, dan fungsi bangunannya.'
  },

  {
    keys: /rumah|hunian|tinggal|tempat tinggal/i,
    reply:
      '🏠 Kami melayani *Desain Rumah Tinggal* dengan berbagai pilihan:\n\n' +
      '• Rumah 1 lantai hingga 3 lantai\n' +
      '• Desain modern, minimalis, tropis, dan lainnya\n' +
      '• Gambar kerja lengkap + RAB\n\n' +
      'Berapa luas tanah dan berapa lantai yang Anda rencanakan?'
  },

  {
    keys: /desain|rancang|arsitek|arsitektur/i,
    reply:
      '✏️ Kami siap membantu *desain dan perencanaan* bangunan Anda!\n\n' +
      'Layanan kami mencakup hunian, perkantoran, komersial, hingga kawasan industri.\n\n' +
      'Bangunan apa yang ingin Anda desain?'
  },

  {
    keys: /renovasi|renov|ubah rumah|perbaikan rumah/i,
    reply:
      '🔨 Kami juga melayani *Renovasi Bangunan*:\n\n' +
      '• Renovasi rumah tinggal\n' +
      '• Perluasan bangunan\n' +
      '• Ubah tampak fasad\n\n' +
      'Ceritakan kondisi bangunan sekarang dan perubahan yang diinginkan!'
  },

  {
    keys: /bangun|pembangunan|konstruksi|mau bikin|mau buat/i,
    reply:
      '🏗️ Bagus! Kami siap membantu perencanaan pembangunan Anda dari awal.\n\n' +
      'Mulai dari desain konsep, gambar kerja, hingga dokumen teknis lengkap.\n\n' +
      'Bangunan apa yang ingin Anda wujudkan?'
  },

  {
    keys: /halo|hai|hi|hello|selamat|pagi|siang|sore|malam|apa kabar/i,
    reply:
      '👋 Halo! Selamat datang di *Fusako Studio*.\n\n' +
      'Kami siap membantu kebutuhan desain dan perencanaan bangunan Anda.\n\n' +
      'Ada yang bisa kami bantu?'
  },

  {
    keys: /paket|layanan|pilihan|penawaran/i,
    reply:
      '📦 Berikut paket layanan kami:\n\n' +
      '🗺️ *Paket Denah Saja* — gambar denah + fasad\n' +
      '📐 *Paket Detapo* — denah + detail konstruksi + RAB _(paling populer)_\n' +
      '🏗️ *Paket Lengkap* — full dokumen teknis + pendampingan\n\n' +
      'Mau info harga atau detail salah satu paket?'
  },

];   /* ← akhir waTemplates */


/* ─────────────────────────────────────────────────────────────
   2. ALUR KONSULTASI STEP-BY-STEP (LANGSUNG / BIASA)
      Berlaku saat user buka chat langsung (bukan dari promo).
      Setiap step memiliki:
        id        → identifier unik step
        msg       → fungsi yang mengembalikan teks pertanyaan
        opts      → array pilihan tombol { label, value, manual? }
        save      → key untuk menyimpan jawaban ke state.data
        next      → fungsi(value) yang mengembalikan id step berikutnya
   ───────────────────────────────────────────────────────────── */
const waConsultSteps = [

  {
    id: 'welcome',
    msg: () => {
      const s = _getSapaan();
      return `${s}! 👋\n\nSelamat datang di *Fusako Studio*.\n\nKami membantu layanan desain rumah, villa, ruko, kantor, interior, renovasi, hingga perencanaan pembangunan.\n\nApa yang ingin Anda konsultasikan?`;
    },
    opts: [
      { label: '🏠 Desain Rumah',           value: 'Desain Rumah' },
      { label: '🏡 Desain Villa',            value: 'Desain Villa' },
      { label: '🏢 Desain Kantor',           value: 'Desain Kantor' },
      { label: '🏪 Desain Ruko/Toko',        value: 'Desain Ruko/Toko' },
      { label: '🛋️ Desain Interior',        value: 'Desain Interior' },
      { label: '🔨 Renovasi Bangunan',       value: 'Renovasi Bangunan' },
      { label: '📋 Konsultasi Perencanaan',  value: 'Konsultasi Perencanaan' },
      { label: '✏️ Ketik sendiri...',        value: null, manual: true },
    ],
    save: 'jenis',
    next: (v) => {
      const non = /kantor|ruko|toko|villa|interior|renovasi|perencanaan/i.test(v);
      window._consultState.mode = non ? 'non_hunian' : 'hunian';
      return 'status_lahan';
    },
  },

  {
    id: 'status_lahan',
    msg: () => 'Baik, kami siap membantu.\n\nApakah Anda sudah memiliki lahan?',
    opts: [
      { label: '✅ Sudah ada lahan',         value: 'Sudah ada lahan' },
      { label: '⏳ Sedang mencari lahan',    value: 'Sedang mencari lahan' },
      { label: '❌ Belum memiliki lahan',    value: 'Belum memiliki lahan' },
    ],
    save: 'status_lahan',
    next: (v) => /belum|cari/i.test(v) ? 'belum_lahan' : 'luas_lahan',
  },

  {
    id: 'belum_lahan',
    msg: () =>
      'Tidak masalah. Banyak klien kami berkonsultasi sebelum membeli lahan untuk mengetahui ukuran yang ideal.\n\n' +
      'Boleh kami tahu:\n' +
      '📌 Berapa kamar tidur yang diinginkan?\n' +
      '📌 Berapa lantai yang direncanakan?\n' +
      '📌 Berapa kebutuhan parkir kendaraan?\n\n' +
      '_Silakan ketik jawaban Anda._',
    opts: [{ label: '✏️ Ketik kebutuhan saya...', value: null, manual: true }],
    save: 'kebutuhan_awal',
    next: () => 'layanan',
  },

  {
    id: 'luas_lahan',
    msg: () => 'Berapa perkiraan *luas lahan* yang dimiliki?\n\n_Contoh: 6×12 m, 8×15 m, 120 m², dll._',
    opts: [
      { label: '6×12 m',  value: '6×12 meter' },
      { label: '8×15 m',  value: '8×15 meter' },
      { label: '10×20 m', value: '10×20 meter' },
      { label: '✏️ Ukuran lain...', value: null, manual: true },
    ],
    save: 'luas',
    next: () => 'kawasan',
  },

  {
    id: 'kawasan',
    msg: () => 'Lahan berada di kawasan apa?',
    opts: [
      { label: '🏘️ Perumahan',      value: 'Perumahan' },
      { label: '🌳 Pedesaan',       value: 'Pedesaan' },
      { label: '🏙️ Perkotaan',     value: 'Perkotaan' },
      { label: '🏖️ Kawasan wisata', value: 'Kawasan wisata' },
      { label: '✏️ Lainnya...', value: null, manual: true },
    ],
    save: 'kawasan',
    next: () => window._consultState.mode === 'non_hunian' ? 'tujuan_non' : 'tujuan',
  },

  {
    id: 'tujuan',
    msg: () => 'Rumah yang direncanakan akan digunakan untuk?',
    opts: [
      { label: '👨‍👩‍👧‍👦 Hunian keluarga',    value: 'Hunian keluarga' },
      { label: '💼 Investasi',               value: 'Investasi' },
      { label: '🏠 Rumah kontrakan',         value: 'Rumah kontrakan' },
      { label: '🏡 Rumah pensiun',           value: 'Rumah pensiun' },
      { label: '🔄 Hunian + usaha',          value: 'Kombinasi hunian dan usaha' },
    ],
    save: 'tujuan',
    next: () => 'kamar',
  },

  {
    id: 'tujuan_non',
    msg: () =>
      'Bangunan akan digunakan untuk tujuan apa?\n\n_Contoh: kantor operasional, toko retail, cafe, guest house, gudang._',
    opts: [
      { label: '🏢 Kantor operasional',  value: 'Kantor operasional' },
      { label: '🏪 Toko / retail',       value: 'Toko / retail' },
      { label: '☕ Cafe / restoran',     value: 'Cafe / restoran' },
      { label: '🏨 Penginapan',          value: 'Penginapan / guest house' },
      { label: '🏭 Gudang / industri',   value: 'Gudang / industri' },
      { label: '✏️ Lainnya...',          value: null, manual: true },
    ],
    save: 'tujuan',
    next: () => 'lantai',
  },

  {
    id: 'kamar',
    msg: () => 'Berapa *kamar tidur* yang diinginkan?',
    opts: [
      { label: '2 kamar', value: '2 kamar tidur' },
      { label: '3 kamar', value: '3 kamar tidur' },
      { label: '4 kamar', value: '4 kamar tidur' },
      { label: '> 4 kamar', value: 'Lebih dari 4 kamar tidur' },
    ],
    save: 'kamar',
    next: () => 'ruang_khusus',
  },

  {
    id: 'ruang_khusus',
    msg: () =>
      'Selain kamar tidur, ada *ruang khusus* yang diinginkan?\n\n' +
      '_Contoh: ruang kerja, mushola, taman belakang, garasi 2 mobil, rooftop._',
    opts: [
      { label: 'Ruang kerja',    value: 'Ruang kerja' },
      { label: 'Mushola',        value: 'Mushola' },
      { label: 'Taman belakang', value: 'Taman belakang' },
      { label: 'Garasi 2 mobil', value: 'Garasi 2 mobil' },
      { label: '✏️ Sebutkan...', value: null, manual: true },
      { label: 'Tidak ada',      value: 'Tidak ada' },
    ],
    save: 'ruang_khusus',
    next: () => 'konsep',
  },

  {
    id: 'konsep',
    msg: () => 'Konsep *desain* yang disukai?',
    opts: [
      { label: '🏠 Minimalis modern',       value: 'Minimalis modern' },
      { label: '🌿 Tropis modern',          value: 'Tropis modern' },
      { label: '🏛️ Klasik',               value: 'Klasik' },
      { label: '🧱 Industrial',            value: 'Industrial' },
      { label: '✨ Modern luxury',          value: 'Modern luxury' },
      { label: '🤔 Minta rekomendasi',     value: 'Belum tahu, ingin rekomendasi' },
    ],
    save: 'konsep',
    next: () => 'lantai',
  },

  {
    id: 'lantai',
    msg: () => 'Bangunan direncanakan berapa *lantai*?',
    opts: [
      { label: '1 lantai',         value: '1 lantai' },
      { label: '2 lantai',         value: '2 lantai' },
      { label: '3 lantai',         value: '3 lantai' },
      { label: 'Belum ditentukan', value: 'Belum ditentukan' },
    ],
    save: 'lantai',
    next: () => 'anggaran',
  },

  {
    id: 'anggaran',
    msg: () => 'Perkiraan *anggaran pembangunan*?\n\n_Jika belum pasti, pilih estimasi terdekat._',
    opts: [
      { label: '< 300 juta',     value: 'Di bawah 300 juta' },
      { label: '300–500 juta',   value: '300–500 juta' },
      { label: '500 jt–1 M',    value: '500 juta–1 miliar' },
      { label: '1–2 M',         value: '1–2 miliar' },
      { label: '> 2 M',         value: 'Di atas 2 miliar' },
      { label: 'Belum tahu',    value: 'Belum mengetahui' },
    ],
    save: 'anggaran',
    next: () => 'layanan',
  },

  {
    id: 'layanan',
    msg: () => 'Layanan apa yang paling Anda butuhkan?',
    opts: [
      { label: '📐 Desain Denah',           value: 'Desain Denah' },
      { label: '🏠 Arsitektur Lengkap',     value: 'Desain Arsitektur Lengkap' },
      { label: '📋 RAB',                    value: 'RAB Perkiraan Biaya' },
      { label: '🛋️ Desain Interior',       value: 'Desain Interior' },
      { label: '📄 Gambar Kerja Teknis',    value: 'Gambar Kerja Teknis' },
      { label: '🤝 Konsultasi Awal',        value: 'Konsultasi Awal' },
    ],
    save: 'layanan',
    next: () => 'paket_pilih',
  },

  {
    id: 'paket_pilih',
    msg: (data) => {
      const lahan = (data && data.luas) ? data.luas : '';
      const isNonHunian = (window._consultState && window._consultState.mode === 'non_hunian');
      const tarifLengkap = isNonHunian ? 'Rp 65.000/m²' : 'Rp 95.000/m²';
      const tarifDetapo  = isNonHunian ? 'Rp 32.000/m²' : 'Rp 45.000/m²';
      const jenisLabel   = isNonHunian ? '(Kos-kosan / Ruko / Rukan)' : '(Rumah Tinggal / Villa / Hotel / Apartemen)';
      return (
        '📦 *Pilih Paket Layanan Kami:*\n' +
        `_${jenisLabel}_\n\n` +
        '🗺️ *Paket Denah Saja* — Rp 300.000\n' +
        '   Gambar denah lantai, max 3 lantai\n\n' +
        `📐 *Paket Detapo* — ${tarifDetapo}\n` +
        '   Denah + detail konstruksi + RAB\n' +
        '   _Paling populer!_\n\n' +
        `🏗️ *Paket Lengkap* — ${tarifLengkap}\n` +
        '   Full dokumen teknis + pendampingan\n\n' +
        (lahan ? `_Estimasi otomatis tersedia setelah Anda pilih paket._\n\n` : '') +
        'Paket mana yang sesuai kebutuhan Anda?'
      );
    },
    opts: [
      { label: '🗺️ Paket Denah Saja',  value: 'Paket Denah Saja' },
      { label: '📐 Paket Detapo',       value: 'Paket Detapo' },
      { label: '🏗️ Paket Lengkap',     value: 'Paket Lengkap' },
    ],
    save: 'paket',
    next: () => 'kalkulator',
  },

  {
    id: 'kalkulator',
    msg: (data) => {
      const d = data || {};
      const isNonHunian = (window._consultState && window._consultState.mode === 'non_hunian');

      /* Tarif per m² sesuai jenis bangunan — kiblatnya harga website */
      const hargaBase = {
        'Paket Denah Saja': 300000,
        'Paket Detapo':     isNonHunian ? 32000 : 45000,
        'Paket Lengkap':    isNonHunian ? 65000 : 95000,
      };
      const tarifLabel = {
        'Paket Denah Saja': 'Rp 300.000 (flat)',
        'Paket Detapo':     isNonHunian ? 'Rp 32.000/m²' : 'Rp 45.000/m²',
        'Paket Lengkap':    isNonHunian ? 'Rp 65.000/m²' : 'Rp 95.000/m²',
      };
      const paket = d.paket || 'Paket Detapo';
      const base = hargaBase[paket] || 45000;

      /* Parsing luas dari berbagai format */
      let luas = 0;
      const luasStr = (d.luas || '').toLowerCase().replace(/\s/g,'');
      const matchXY = luasStr.match(/(\d+)[×x](\d+)/);
      if (matchXY) {
        luas = parseInt(matchXY[1]) * parseInt(matchXY[2]);
      } else {
        const matchM2 = luasStr.match(/(\d+)m²?/);
        if (matchM2) luas = parseInt(matchM2[1]);
      }

      /* Kalkulasi total sesuai paket */
      let total = base;
      let note = '';
      if (paket === 'Paket Denah Saja') {
        /* Flat — tidak tergantung luas */
        total = 300000;
        note = luas > 0 ? `\n_(Harga flat untuk denah 1–3 lantai)_` : '';
      } else if (luas > 0) {
        /* Tarif × luas untuk Detapo & Lengkap */
        total = base * luas;
        note = `\n_(${tarifLabel[paket]} × ${luas} m²)_`;
      }

      const totalStr = 'Rp ' + total.toLocaleString('id-ID');

      /* Simpan hasil kalkulator ke state */
      window._consultState.data.estimasi_harga = totalStr;
      window._consultState.data.estimasi_luas   = luas > 0 ? luas + ' m²' : '-';

      return (
        '🧮 *Estimasi Biaya Otomatis*\n\n' +
        `📦 Paket       : *${paket}*\n` +
        `💲 Tarif       : ${tarifLabel[paket]}\n` +
        (luas > 0 ? `📐 Luas desain : ${luas} m²\n` : '') +
        `💰 Estimasi    : *${totalStr}*${note}\n\n` +
        '⚠️ _Estimasi ini bersifat indikatif. Harga final dikonfirmasi setelah konsultasi lanjutan._\n\n' +
        'Lanjut lengkapi data diri untuk konfirmasi?'
      );
    },
    opts: [
      { label: '✅ Lanjut isi data', value: 'Lanjut' },
      { label: '🔄 Ganti paket',     value: '__BACK_PAKET__' },
    ],
    save: null,
    next: (v) => /back_paket/i.test(v) ? 'paket_pilih' : 'kontak',
  },

  {
    id: 'kontak',
    msg: () => 'Hampir selesai! Mohon lengkapi data:\n\n📌 *Nama Anda?*',
    opts: [{ label: '✏️ Ketik nama...', value: null, manual: true }],
    save: 'nama',
    next: () => 'kontak_lokasi',
  },

  {
    id: 'kontak_lokasi',
    msg: () => '📌 *Kota / Lokasi proyek?*',
    opts: [
      { label: 'Jakarta',    value: 'Jakarta' },
      { label: 'Bekasi',     value: 'Bekasi' },
      { label: 'Bandung',    value: 'Bandung' },
      { label: 'Surabaya',   value: 'Surabaya' },
      { label: 'Medan',      value: 'Medan' },
      { label: '✏️ Kota lain...', value: null, manual: true },
    ],
    save: 'lokasi',
    next: () => 'kontak_wa',
  },

  {
    id: 'kontak_wa',
    msg: () => '📌 *Nomor WhatsApp* yang bisa kami hubungi?',
    opts: [{ label: '✏️ Ketik nomor WA...', value: null, manual: true }],
    save: 'wa',
    next: () => 'summary',
  },

];   /* ← akhir waConsultSteps (biasa) */


/* ─────────────────────────────────────────────────────────────
   3. ALUR KONSULTASI STEP-BY-STEP (MODE PROMO)
      Dipakai jika user masuk dari popup promo (fsdGoChat).
      Memiliki step tambahan: konfirmasi luas ≤50 m².
   ───────────────────────────────────────────────────────────── */
const waConsultStepsPromo = [

  {
    id: 'welcome',
    msg: () => {
      const s = _getSapaan();
      const cfg = FUSAKO_CONFIG;
      return (
        `${s}! 👋\n\n` +
        `🏷️ *Halo! Kode Promo ${cfg.promoCode} berhasil digunakan.*\n\n` +
        `Selamat datang di *Fusako Studio*!\n\n` +
        `Promo ini berlaku untuk *Desain Bangunan Tipe ${cfg.promoMaxLuas}* ` +
        `(luas maksimal *${cfg.promoMaxLuas} m²*), mencakup:\n` +
        `✅ Gambar kerja lengkap (denah, tampak, potongan, detail)\n` +
        `✅ RAB perkiraan biaya\n` +
        `✅ Revisi desain maks. 2×\n\n` +
        `Harga spesial: *${cfg.promoHarga}* (hemat ${cfg.promoHemat} dari ${cfg.promoHargaAsli})\n\n` +
        `Untuk mulai klaim, pilih jenis bangunan Anda:`
      );
    },
    opts: [
      { label: '🏠 Rumah Tinggal',       value: 'Rumah Tinggal' },
      { label: '🏡 Villa / Guest House', value: 'Villa / Guest House' },
      { label: '🏪 Ruko / Toko',         value: 'Ruko / Toko' },
      { label: '🏢 Kantor Kecil',        value: 'Kantor Kecil' },
      { label: '✏️ Lainnya...',          value: null, manual: true },
    ],
    save: 'jenis',
    next: () => 'konfirmasi_luas',
  },

  {
    id: 'konfirmasi_luas',
    msg: () =>
      `Promo ini berlaku untuk bangunan dengan *luas maksimal ${FUSAKO_CONFIG.promoMaxLuas} m²*.\n\n` +
      'Apakah luas bangunan yang Anda rencanakan masih dalam batas tersebut?',
    opts: [
      { label: `✅ Ya, ≤${FUSAKO_CONFIG.promoMaxLuas} m²`,  value: `Ya, ≤${FUSAKO_CONFIG.promoMaxLuas} m²` },
      { label: `❌ Melebihi ${FUSAKO_CONFIG.promoMaxLuas} m²`, value: `Melebihi ${FUSAKO_CONFIG.promoMaxLuas} m²` },
    ],
    save: 'konfirmasi_luas',
    next: (v) => /melebihi/i.test(v) ? 'luar_promo' : 'status_lahan',
  },

  {
    id: 'luar_promo',
    msg: () =>
      'Terima kasih sudah jujur! 😊\n\n' +
      `Promo *Tipe ${FUSAKO_CONFIG.promoMaxLuas}* hanya berlaku untuk bangunan ≤${FUSAKO_CONFIG.promoMaxLuas} m². ` +
      'Untuk luas di atas itu, kami tetap siap membantu dengan layanan reguler.\n\n' +
      'Apakah Anda ingin melanjutkan konsultasi desain tanpa promo?',
    opts: [
      { label: '✅ Lanjut konsultasi reguler', value: 'Lanjut' },
      { label: '❌ Tidak, terima kasih',       value: 'Tidak' },
    ],
    save: 'keputusan_luar',
    next: (v) => /tidak/i.test(v) ? 'selesai_tolak' : 'status_lahan',
  },

  {
    id: 'selesai_tolak',
    msg: () =>
      'Baik, tidak masalah! 🙏\n\n' +
      'Jika sewaktu-waktu ada yang bisa kami bantu, jangan ragu hubungi kami kembali.\n\n' +
      'Terima kasih sudah mengunjungi *Fusako Studio*!',
    opts: [],
    save: null,
    next: () => 'selesai_tolak',
  },

  {
    id: 'status_lahan',
    msg: () => 'Apakah Anda sudah memiliki lahan?',
    opts: [
      { label: '✅ Sudah ada lahan',      value: 'Sudah ada lahan' },
      { label: '⏳ Sedang mencari',       value: 'Sedang mencari lahan' },
      { label: '❌ Belum punya lahan',    value: 'Belum memiliki lahan' },
    ],
    save: 'status_lahan',
    next: (v) => /belum|cari/i.test(v) ? 'belum_lahan' : 'luas_lahan',
  },

  {
    id: 'belum_lahan',
    msg: () =>
      'Tidak masalah! Kami bisa bantu estimasi ukuran lahan yang sesuai.\n\n' +
      'Ceritakan kebutuhan umumnya:\n' +
      '📌 Berapa kamar tidur?\n' +
      '📌 Ada ruang khusus yang diinginkan?',
    opts: [{ label: '✏️ Ketik kebutuhan...', value: null, manual: true }],
    save: 'kebutuhan_awal',
    next: () => 'konsep',
  },

  {
    id: 'luas_lahan',
    msg: () => `Berapa ukuran lahannya?\n\n_Contoh: 5×10 m, 6×12 m, 50 m², dll._`,
    opts: [
      { label: '5×10 m', value: '5×10 m' },
      { label: '6×12 m', value: '6×12 m' },
      { label: '7×10 m', value: '7×10 m' },
      { label: '✏️ Ukuran lain...', value: null, manual: true },
    ],
    save: 'luas',
    next: () => 'kawasan',
  },

  {
    id: 'kawasan',
    msg: () => 'Lahan berada di kawasan apa?',
    opts: [
      { label: '🏘️ Perumahan',      value: 'Perumahan' },
      { label: '🌳 Pedesaan',       value: 'Pedesaan' },
      { label: '🏙️ Perkotaan',     value: 'Perkotaan' },
      { label: '✏️ Lainnya...', value: null, manual: true },
    ],
    save: 'kawasan',
    next: () => 'kamar',
  },

  {
    id: 'kamar',
    msg: () => `Berapa *kamar tidur* yang diinginkan?\n\n_Untuk bangunan ≤${FUSAKO_CONFIG.promoMaxLuas} m², umumnya 1–2 kamar._`,
    opts: [
      { label: '1 kamar',                  value: '1 kamar tidur' },
      { label: '2 kamar',                  value: '2 kamar tidur' },
      { label: 'Studio (tanpa kamar terpisah)', value: 'Studio' },
    ],
    save: 'kamar',
    next: () => 'ruang_khusus',
  },

  {
    id: 'ruang_khusus',
    msg: () => `Ada ruang khusus yang diinginkan?\n\n_Sesuaikan dengan luas ≤${FUSAKO_CONFIG.promoMaxLuas} m²._`,
    opts: [
      { label: 'Ruang kerja',     value: 'Ruang kerja' },
      { label: 'Mushola',         value: 'Mushola' },
      { label: 'Dapur terbuka',   value: 'Dapur terbuka' },
      { label: 'Taman kecil',     value: 'Taman kecil' },
      { label: '✏️ Sebutkan...',  value: null, manual: true },
      { label: 'Tidak ada',       value: 'Tidak ada' },
    ],
    save: 'ruang_khusus',
    next: () => 'konsep',
  },

  {
    id: 'konsep',
    msg: () => 'Konsep *desain* yang disukai?',
    opts: [
      { label: '🏠 Minimalis modern',  value: 'Minimalis modern' },
      { label: '🌿 Tropis modern',     value: 'Tropis modern' },
      { label: '🧱 Industrial',       value: 'Industrial' },
      { label: '✨ Modern luxury',     value: 'Modern luxury' },
      { label: '🤔 Minta rekomendasi', value: 'Belum tahu, ingin rekomendasi' },
    ],
    save: 'konsep',
    next: () => 'paket_pilih_promo',
  },

  {
    id: 'paket_pilih_promo',
    msg: () => {
      const cfg = FUSAKO_CONFIG;
      return (
        '📦 *Pilih Paket untuk Promo Anda:*\n\n' +
        `🏷️ *${cfg.promoCode}* — Paket Desain Tipe ${cfg.promoMaxLuas}\n` +
        `   Harga spesial: *${cfg.promoHarga}*\n` +
        `   (Hemat ${cfg.promoHemat} dari ${cfg.promoHargaAsli})\n` +
        '   ✅ Gambar kerja lengkap + RAB + revisi 2×\n\n' +
        '📐 *Paket Detapo Reguler* — mulai Rp 32.000/m² (Kos/Ruko) · Rp 45.000/m² (Rumah/Villa)\n' +
        '   Denah + detail konstruksi + RAB\n\n' +
        '🏗️ *Paket Lengkap Reguler* — mulai Rp 65.000/m² (Kos/Ruko) · Rp 95.000/m² (Rumah/Villa)\n' +
        '   Full dokumen teknis + pendampingan\n\n' +
        'Pilih paket mana yang Anda inginkan?'
      );
    },
    opts: [
      { label: `🏷️ ${FUSAKO_CONFIG.promoCode} (Promo)`, value: FUSAKO_CONFIG.promoCode },
      { label: '📐 Paket Detapo Reguler',                value: 'Paket Detapo' },
      { label: '🏗️ Paket Lengkap Reguler',              value: 'Paket Lengkap' },
    ],
    save: 'paket',
    next: () => 'kalkulator_promo',
  },

  {
    id: 'kalkulator_promo',
    msg: (data) => {
      const d = data || {};
      const cfg = FUSAKO_CONFIG;
      const paket = d.paket || cfg.promoCode;

      /* Tarif per m² sesuai jenis bangunan — kiblatnya harga website */
      const isNonHunian = (window._consultState && window._consultState.mode === 'non_hunian');
      const hargaMap = {};
      hargaMap[cfg.promoCode]  = 4499000; /* promo: flat */
      hargaMap['Paket Detapo'] = isNonHunian ? 32000 : 45000;
      hargaMap['Paket Lengkap']= isNonHunian ? 65000 : 95000;
      const baseHarga = hargaMap[paket] || 4499000;

      const tarifLabel = {};
      tarifLabel['Paket Detapo']  = isNonHunian ? 'Rp 32.000/m²' : 'Rp 45.000/m²';
      tarifLabel['Paket Lengkap'] = isNonHunian ? 'Rp 65.000/m²' : 'Rp 95.000/m²';

      /* Parsing luas */
      let luas = 0;
      const luasStr = (d.luas || '').toLowerCase().replace(/\s/g,'');
      const matchXY = luasStr.match(/(\d+)[×x](\d+)/);
      if (matchXY) luas = parseInt(matchXY[1]) * parseInt(matchXY[2]);
      else {
        const matchM2 = luasStr.match(/(\d+)m²?/);
        if (matchM2) luas = parseInt(matchM2[1]);
      }

      let total = baseHarga;
      let note = '';
      const isPromoKode = paket === cfg.promoCode;

      if (isPromoKode) {
        total = 4499000;
        note = `\n_Harga promo tetap ${cfg.promoHarga} untuk ≤${cfg.promoMaxLuas} m²_`;
      } else if (luas > 0) {
        total = baseHarga * luas;
        note = `\n_(${tarifLabel[paket]} × ${luas} m²)_`;
      }

      const totalStr = 'Rp ' + total.toLocaleString('id-ID');
      window._consultState.data.estimasi_harga = totalStr;
      window._consultState.data.estimasi_luas   = luas > 0 ? luas + ' m²' : '-';

      return (
        '🧮 *Estimasi Biaya Otomatis*\n\n' +
        `📦 Paket       : *${paket}*\n` +
        (!isPromoKode && tarifLabel[paket] ? `💲 Tarif       : ${tarifLabel[paket]}\n` : '') +
        (luas > 0 ? `📐 Luas desain : ${luas} m²\n` : '') +
        `💰 Estimasi    : *${totalStr}*${note}\n\n` +
        (isPromoKode ? `🏷️ *Kode: ${cfg.promoCode} — berlaku!*\n\n` : '') +
        '⚠️ _Estimasi indikatif. Harga final dikonfirmasi admin._\n\n' +
        'Lanjut isi data diri untuk konfirmasi?'
      );
    },
    opts: [
      { label: '✅ Lanjut isi data', value: 'Lanjut' },
      { label: '🔄 Ganti paket',     value: '__BACK_PAKET__' },
    ],
    save: null,
    next: (v) => /back_paket/i.test(v) ? 'paket_pilih_promo' : 'kontak',
  },

  {
    id: 'kontak',
    msg: () => 'Hampir selesai! Mohon lengkapi data untuk klaim promo:\n\n📌 *Nama Anda?*',
    opts: [{ label: '✏️ Ketik nama...', value: null, manual: true }],
    save: 'nama',
    next: () => 'kontak_lokasi',
  },

  {
    id: 'kontak_lokasi',
    msg: () => '📌 *Kota / Lokasi proyek?*',
    opts: [
      { label: 'Jakarta',    value: 'Jakarta' },
      { label: 'Bekasi',     value: 'Bekasi' },
      { label: 'Bandung',    value: 'Bandung' },
      { label: 'Surabaya',   value: 'Surabaya' },
      { label: '✏️ Kota lain...', value: null, manual: true },
    ],
    save: 'lokasi',
    next: () => 'kontak_wa',
  },

  {
    id: 'kontak_wa',
    msg: () => '📌 *Nomor WhatsApp* untuk konfirmasi klaim promo?',
    opts: [{ label: '✏️ Ketik nomor WA...', value: null, manual: true }],
    save: 'wa',
    next: () => 'summary',
  },

];   /* ← akhir waConsultStepsPromo */


/* ─────────────────────────────────────────────────────────────
   4. BUILDER RINGKASAN KONSULTASI
   ───────────────────────────────────────────────────────────── */
function buildSummary(data, mode, fromPromo) {
  const d = data || {};
  const cfg = FUSAKO_CONFIG;

  let t = '✅ *Terima kasih!* Konsultasi Anda telah kami catat.\n\n';
  t += '━━━━━━━━━━━━━━━━━━━━\n';
  t += fromPromo
    ? `🏷️ *KLAIM PROMO ${cfg.promoCode}*\n`
    : '📋 *RINGKASAN KONSULTASI*\n';
  t += '━━━━━━━━━━━━━━━━━━━━\n\n';

  if (fromPromo) {
    t += `🏷️ Kode promo      : *${cfg.promoCode}*\n`;
    t += `💰 Harga promo     : *${cfg.promoHarga}* (hemat ${cfg.promoHemat})\n`;
    t += `📐 Maks. luas      : ${cfg.promoMaxLuas} m²\n\n`;
  }

  if (d.jenis)            t += (mode === 'non_hunian' ? '🏗️' : '🏠') + ` Jenis           : ${d.jenis}\n`;
  if (d.konfirmasi_luas)  t += `📏 Luas bangunan   : ${d.konfirmasi_luas}\n`;
  if (d.status_lahan)     t += `📋 Status lahan    : ${d.status_lahan}\n`;
  if (d.luas)             t += `📐 Ukuran lahan    : ${d.luas}\n`;
  if (d.kawasan)          t += `📍 Kawasan         : ${d.kawasan}\n`;
  if (d.tujuan)           t += `🎯 Tujuan          : ${d.tujuan}\n`;
  if (d.kamar)            t += `🛏️ Kamar tidur     : ${d.kamar}\n`;
  if (d.ruang_khusus)     t += `🛋️ Ruang khusus   : ${d.ruang_khusus}\n`;
  if (d.konsep)           t += `🎨 Konsep desain   : ${d.konsep}\n`;
  if (d.lantai)           t += `🏢 Jumlah lantai   : ${d.lantai}\n`;
  if (d.anggaran)         t += `💰 Anggaran        : ${d.anggaran}\n`;
  if (d.layanan)          t += `📦 Layanan         : ${d.layanan}\n`;
  if (d.kebutuhan_awal)   t += `📝 Kebutuhan awal  : ${d.kebutuhan_awal}\n`;
  if (d.nama)             t += `👤 Nama            : ${d.nama}\n`;
  if (d.lokasi)           t += `📍 Lokasi proyek   : ${d.lokasi}\n`;

  /* ── PAKET TERPILIH (bold) ── */
  t += '\n━━━━━━━━━━━━━━━━━━━━\n';
  t += '📦 *PAKET YANG DIPILIH*\n';
  t += '━━━━━━━━━━━━━━━━━━━━\n\n';

  if (d.paket) {
    t += `🏷️ *${d.paket}*\n`;
  } else if (fromPromo) {
    t += `🏷️ *${cfg.promoCode} — Paket Desain Tipe ${cfg.promoMaxLuas}*\n`;
  } else {
    t += '📐 *Paket Detapo* _(default)_\n';
  }

  if (d.estimasi_luas && d.estimasi_luas !== '-')
    t += `📐 Luas estimasi   : ${d.estimasi_luas}\n`;
  if (d.estimasi_harga)
    t += `💰 *Estimasi biaya : ${d.estimasi_harga}*\n`;

  if (fromPromo) {
    t += '\n📋 *Yang didapatkan:*\n';
    t += '✅ Gambar kerja lengkap (denah, tampak, potongan, detail)\n';
    t += '✅ RAB perkiraan biaya\n';
    t += `✅ Revisi desain maks. 2×\n`;
    t += `\n🏷️ *Promo ${cfg.promoCode} berlaku untuk konsultasi ini!*\n`;
  }

  t += '\n━━━━━━━━━━━━━━━━━━━━\n';
  t += '📲 Klik *"Hubungi Tim Kami"* untuk kirim ringkasan ke WhatsApp kami.\n';

  /* ── NOMOR WA ADMIN — PALING AKHIR ── */
  t += '\n📞 *Nomor WhatsApp Tim Fusako Studio:*\n';
  t += `*+${cfg.waNumber}*\n\n`;
  t += 'Tim kami akan segera menghubungi Anda! 🙏';

  return t;
}


/* ─────────────────────────────────────────────────────────────
   5. BUILDER PESAN WHATSAPP OTOMATIS
   ───────────────────────────────────────────────────────────── */
function buildWAMessage(data, mode, fromPromo) {
  const d = data || {};
  const cfg = FUSAKO_CONFIG;

  const header = fromPromo
    ? `🏷️ *KLAIM PROMO ${cfg.promoCode} — Fusako Studio*`
    : (mode === 'non_hunian'
        ? '🏢 *KONSULTASI BANGUNAN — Fusako Studio*'
        : '🏠 *KONSULTASI HUNIAN — Fusako Studio*');

  let lines = [];

  if (fromPromo) {
    lines.push(`*${cfg.promoCode}* *${cfg.promoCode}* *${cfg.promoCode}*`);
    lines.push('');
    lines.push(header);
    lines.push('');
    lines.push(`Kode promo      : *${cfg.promoCode}*`);
    lines.push(`Harga promo     : *${cfg.promoHarga}*`);
  } else {
    lines.push(header);
    lines.push('');
  }

  if (d.jenis)            lines.push(`Jenis           : ${d.jenis}`);
  if (d.konfirmasi_luas)  lines.push(`Luas bangunan   : ${d.konfirmasi_luas}`);
  if (d.status_lahan)     lines.push(`Status lahan    : ${d.status_lahan}`);
  if (d.luas)             lines.push(`Ukuran lahan    : ${d.luas}`);
  if (d.kawasan)          lines.push(`Kawasan         : ${d.kawasan}`);
  if (d.tujuan)           lines.push(`Tujuan          : ${d.tujuan}`);
  if (d.kamar)            lines.push(`Kamar tidur     : ${d.kamar}`);
  if (d.ruang_khusus)     lines.push(`Ruang khusus    : ${d.ruang_khusus}`);
  if (d.konsep)           lines.push(`Konsep desain   : ${d.konsep}`);
  if (d.lantai)           lines.push(`Jumlah lantai   : ${d.lantai}`);
  if (d.anggaran)         lines.push(`Anggaran        : ${d.anggaran}`);
  if (d.layanan)          lines.push(`Layanan         : ${d.layanan}`);
  if (d.kebutuhan_awal)   lines.push(`Kebutuhan awal  : ${d.kebutuhan_awal}`);
  if (d.nama)             lines.push(`Nama            : ${d.nama}`);
  if (d.lokasi)           lines.push(`Lokasi proyek   : ${d.lokasi}`);

  /* ── PAKET TERPILIH — BOLD ── */
  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  if (d.paket) {
    lines.push(`*PAKET DIPILIH: ${d.paket}*`);
  } else if (fromPromo) {
    lines.push(`*PAKET DIPILIH: ${cfg.promoCode} — Tipe ${cfg.promoMaxLuas}*`);
  }
  if (d.estimasi_luas && d.estimasi_luas !== '-')
    lines.push(`Estimasi luas   : ${d.estimasi_luas}`);
  if (d.estimasi_harga)
    lines.push(`*Estimasi biaya : ${d.estimasi_harga}*`);
  lines.push('━━━━━━━━━━━━━━━━━━━━');

  lines.push('');
  lines.push('Mohon tindak lanjut konsultasi ini. Terima kasih! 🙏');

  /* ── NOMOR WA KONSUMEN — PALING AKHIR ── */
  if (d.wa) {
    lines.push('');
    lines.push(`📲 *Nomor WA Konsumen: ${d.wa}*`);
  }

  return lines.join('\n');
}


/* ─────────────────────────────────────────────────────────────
   6. SYSTEM PROMPT CLAUDE API — KONSULTASI (LANGSUNG)
   ───────────────────────────────────────────────────────────── */
const waBotSystemPromptConsult =
`Kamu adalah asisten konsultasi dari Fusako Studio (Future Sakato Dynamics Studio) — studio desain dan perencanaan profesional berbasis di Sijunjung, Sumatera Barat, Indonesia.

Tugasmu KHUSUS dalam sesi ini adalah menjalankan alur konsultasi terstruktur untuk memahami kebutuhan bangunan calon klien, SATU pertanyaan dalam satu waktu.

ALUR PERTANYAAN (hunian):
1. Sambut user sesuai waktu (pagi/siang/sore/malam), tanyakan jenis konsultasi
2. Status kepemilikan lahan
3. Luas tanah atau ukuran lahan
4. Kawasan lokasi (perumahan, pedesaan, perkotaan, wisata)
5. Tujuan bangunan (hunian keluarga, investasi, kontrakan, dll.)
6. Kamar tidur yang dibutuhkan
7. Ruangan khusus yang diinginkan
8. Gaya desain
9. Jumlah lantai
10. Kisaran anggaran pembangunan
11. Layanan yang dibutuhkan
12. Nama, lokasi proyek, nomor WhatsApp
13. Tampilkan ringkasan + tawarkan paket layanan

Jika user menyebut bangunan NON-HUNIAN (kantor, ruko, cafe, dll.), sesuaikan pertanyaan.

Aturan:
- SELALU satu pertanyaan per balasan
- Tampilkan pilihan dengan bullet • 
- Setiap pilihan diikuti opsi "atau ketik sendiri"
- Jika user menjawab di luar topik, arahkan kembali dengan sopan
- Bahasa Indonesia yang sopan, ramah, dan profesional
- Jangan sebut bahwa kamu adalah AI`;


/* ─────────────────────────────────────────────────────────────
   7. SYSTEM PROMPT CLAUDE API — CHAT UMUM / PROMO
   ───────────────────────────────────────────────────────────── */
const waBotSystemPrompt =
`Kamu adalah asisten virtual dari Fusako Studio (Future Sakato Dynamics Studio), sebuah studio desain dan perencanaan profesional berbasis di Sijunjung, Sumatera Barat, Indonesia.

Layanan kami meliputi: desain hunian (rumah tinggal), desain perkantoran, perencanaan kawasan industri, desain fasilitas publik, perencanaan sipil & infrastruktur, desain klinik/fasilitas kesehatan, desain hotel & penginapan, desain cafe & restoran.

Nomor WhatsApp tim kami: +62 822-8575-4080
Email: halo@sakato.studio
Website: fusakostudio.com
Lokasi: Sijunjung, Sumatera Barat

Tugasmu:
- Sambut tamu dengan hangat dan profesional
- Jawab pertanyaan umum tentang layanan, harga estimasi, proses, dan portofolio
- Jika pertanyaan sangat spesifik, sarankan untuk melanjutkan ke tim manusia
- Balas dalam Bahasa Indonesia yang sopan dan profesional
- Singkat dan jelas, maksimal 3-4 kalimat per balasan
- Jangan sebut bahwa kamu adalah AI
- Jika sesi ini berasal dari promo (ditandai flag fromPromo=true atau kode PROMOTIPE50),
  maka di bagian akhir ringkasan percakapan wajib tampilkan tulisan tebal:
  *PROMOTIPE50* *PROMOTIPE50* *PROMOTIPE50*`;


/* ─────────────────────────────────────────────────────────────
   8. FUNGSI UTAMA — KONSULTASI STEP-BY-STEP
      Dipanggil oleh handler chatbot di kode utama website.

   Parameter:
     userMsg  → string pesan terakhir user
     state    → objek sesi, simpan di window._consultState
                { step, data, mode, fromPromo, done }

   Return: { reply: string, opts: array, state: object }
           atau null jika fromPromo = true (handle di handler lain)
   ───────────────────────────────────────────────────────────── */
function getConsultReply(userMsg, state) {
  /* Jika dari promo → pakai alur promo */
  const steps = (state && state.fromPromo) ? waConsultStepsPromo : waConsultSteps;

  /* Inisialisasi state baru */
  if (!state || !state.step) {
    const initState = { step: 'welcome', data: {}, mode: null, fromPromo: false, done: false };
    const welcomeStep = steps.find(s => s.id === 'welcome');
    return { reply: welcomeStep.msg(), opts: welcomeStep.opts, state: initState };
  }

  if (state.done) return null;

  const msg = (userMsg || '').trim();

  /* Temukan step aktif */
  const currentStep = steps.find(s => s.id === state.step);
  if (!currentStep) {
    state.step = 'welcome';
    const ws = steps.find(s => s.id === 'welcome');
    return { reply: ws.msg(), opts: ws.opts, state };
  }

  /* Simpan jawaban user */
  if (currentStep.save) {
    state.data[currentStep.save] = userMsg;
  }

  /* Tentukan step berikutnya */
  const nextId = currentStep.next(msg.toLowerCase());

  if (nextId === 'summary') {
    state.step = 'done';
    state.done = true;
    return {
      reply: buildSummary(state.data, state.mode, state.fromPromo),
      opts: [
        { label: '📲 Hubungi Tim Kami via WA', value: '__WA__' },
        { label: '🔄 Mulai konsultasi baru',   value: '__RESET__' },
      ],
      state,
    };
  }

  if (nextId === 'selesai_tolak') {
    state.step = 'selesai_tolak';
    state.done = true;
    const tolakStep = steps.find(s => s.id === 'selesai_tolak');
    return { reply: tolakStep.msg(), opts: [], state };
  }

  const nextStep = steps.find(s => s.id === nextId);
  if (!nextStep) {
    state.step = 'done';
    state.done = true;
    return {
      reply: buildSummary(state.data, state.mode, state.fromPromo),
      opts: [{ label: '📲 Hubungi Tim Kami via WA', value: '__WA__' }],
      state,
    };
  }

  state.step = nextId;
  return { reply: nextStep.msg(state.data), opts: nextStep.opts, state };
}


/* ─────────────────────────────────────────────────────────────
   9. FUNGSI PENDUKUNG (INTERNAL)
   ───────────────────────────────────────────────────────────── */

/** Sapaan sesuai jam lokal */
function _getSapaan() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'Selamat pagi';
  if (h >= 12 && h < 15) return 'Selamat siang';
  if (h >= 15 && h < 19) return 'Selamat sore';
  return 'Selamat malam';
}

/** Cocokkan pesan ke template fallback */
function _matchTemplate(msg) {
  const m = (msg || '').toLowerCase();
  for (const t of waTemplates) {
    if (t.keys.test(m)) return t.reply;
  }
  return null;
}

/** Buka WA dengan pesan konsultasi */
function _openWA(data, mode, fromPromo) {
  const text = buildWAMessage(data, mode, fromPromo);
  const url  = 'https://wa.me/' + FUSAKO_CONFIG.waNumber +
               '?text=' + encodeURIComponent(text);
  window.open(url, '_blank');
}


/* ─────────────────────────────────────────────────────────────
   10. INISIALISASI STATE & INTEGRASI WEBSITE
       Bagian ini menghubungkan semua fungsi di atas ke
       elemen HTML chatbot yang sudah ada di index.html.
   ───────────────────────────────────────────────────────────── */

/** State konsultasi global (disimpan di window) */
window._consultState = {
  step:      null,
  data:      {},
  mode:      null,
  fromPromo: false,
  done:      false,
};

/**
 * Mulai sesi dari popup promo (dipanggil oleh fsdGoChat di HTML).
 * @param {string} code - kode promo, misal 'PROMOTIPE50'
 */
window._startPromo = function(code) {
  window._consultState = {
    step:      'welcome',
    data:      {},
    mode:      null,
    fromPromo: true,
    done:      false,
  };

  /* Update warna header chatbot ke oranye (mode promo) */
  var hdr = document.querySelector('#waPopup .wa-header, .wa-header, #waHeader');
  if (hdr) hdr.style.background = FUSAKO_CONFIG.colorPromo;

  /* Tampilkan badge promo di header */
  var badge = document.getElementById('waPromoHeaderBadge');
  if (!badge) {
    badge = document.createElement('span');
    badge.id = 'waPromoHeaderBadge';
    badge.style.cssText =
      'background:#fff;color:' + FUSAKO_CONFIG.colorPromo +
      ';font-size:9px;font-weight:700;padding:2px 7px;' +
      'border-radius:3px;letter-spacing:1px;margin-left:auto;flex-shrink:0';
    badge.textContent = code || FUSAKO_CONFIG.promoCode;
    if (hdr) hdr.appendChild(badge);
  }

  /* Reset area chat */
  var msgArea = document.getElementById('waMessages');
  if (msgArea) msgArea.innerHTML = '';
  _clearBotOpts();

  /* Kirim pesan awal user (persis seperti fsdGoChat) */
  setTimeout(function() {
    var input = document.getElementById('waInput');
    if (input) {
      input.value = 'Halo, saya ingin klaim Promo Desain Tipe 50 — Rp 4.499.000';
      if (typeof sendBotMsg === 'function') sendBotMsg();
    } else {
      /* Fallback: langsung trigger step welcome tanpa input */
      _triggerBotStep('Halo, saya ingin klaim promo');
    }
  }, 700);
};

/**
 * Fungsi utama yang dipanggil setiap kali user kirim pesan.
 * Menggantikan / melengkapi sendBotMsg yang sudah ada.
 */
/* ─────────────────────────────────────────────────────────────
   10b. FILTER KATA KASAR (PROFANITY FILTER)
        Mendeteksi kata kasar dalam pesan user dan merespons
        dengan bahasa yang sopan tanpa melanjutkan ke bot.

        Logika pengecualian:
        - "lantai"  → mengandung "tai" tapi bukan kata kasar
        - "detapo"  → mengandung substring yang tidak relevan
        - Jika kata kasar muncul sebagai BAGIAN dari kata jasa
          yang dikenali (misal nama paket, istilah teknik),
          filter tidak aktif.
   ───────────────────────────────────────────────────────────── */

/** Daftar kata kasar beserta pola regex-nya.
 *  Setiap entri: { pattern: RegExp, safe: RegExp|null }
 *  safe → jika cocok dengan safe, abaikan (konteks aman).
 */
const _profanityList = [
  /* ── Bahasa Indonesia ── */
  { pattern: /\banjing\b/i,    safe: null },
  { pattern: /\bbangsat\b/i,   safe: null },
  { pattern: /\bbajingan\b/i,  safe: null },
  { pattern: /\bbrengsek\b/i,  safe: null },
  { pattern: /\bgoblok\b/i,    safe: null },
  { pattern: /\btolol\b/i,     safe: null },
  { pattern: /\bidiot\b/i,     safe: null },
  { pattern: /\bbego\b/i,      safe: null },
  /* "tai" → kecualikan: lantai, detail, paket detapo, material */
  { pattern: /\btai\b/i,       safe: /lantai|detail|material|detapo|atap\s*gentai/i },
  { pattern: /\bsialan\b/i,    safe: null },
  { pattern: /\bkeparat\b/i,   safe: null },
  { pattern: /\bbedebah\b/i,   safe: null },
  { pattern: /\bbacot\b/i,     safe: null },
  { pattern: /\bkampret\b/i,   safe: null },
  { pattern: /\bmonyet\b/i,    safe: null },
  { pattern: /\bbabi\b/i,      safe: null },
  { pattern: /\bkontol\b/i,    safe: null },
  { pattern: /\bmemek\b/i,     safe: null },
  { pattern: /\bngentot\b/i,   safe: null },
  /* ── Jawa ── */
  { pattern: /\bjancok\b/i,    safe: null },
  { pattern: /\bjancuk\b/i,    safe: null },
  { pattern: /\basu\b/i,       safe: /^asu$/i },  /* hanya jika berdiri sendiri */
  { pattern: /\bcangkem\b/i,   safe: null },
  { pattern: /\bndhasmu\b/i,   safe: null },
  { pattern: /\bdamput\b/i,    safe: null },
  { pattern: /\bwedus\b/i,     safe: null },
  { pattern: /\bjaran\b/i,     safe: /jalan\s*jaran|jenis\s*jaran/i },
  /* ── Sunda ── */
  { pattern: /\bkoplok\b/i,    safe: null },
  { pattern: /\bkehed\b/i,     safe: null },
  { pattern: /\bbagong\b/i,    safe: null },
  { pattern: /\bbelegug\b/i,   safe: null },
  { pattern: /\bjurig\b/i,     safe: null },
  { pattern: /\bheunceut\b/i,  safe: null },
  { pattern: /\bsia\b/i,       safe: /\bsia[pn]\b|\bsias[a-z]/i }, /* kecualikan "siap", "siang", dll */
  /* ── Minangkabau ── */
  { pattern: /\bpantek\b/i,    safe: null },
  { pattern: /\banjiang\b/i,   safe: null },
  { pattern: /\bbaruak\b/i,    safe: null },
  { pattern: /\bkalera\b/i,    safe: null },
  { pattern: /\bpoyok\b/i,     safe: null },
  /* ── Batak ── */
  { pattern: /\bkimak\b/i,     safe: null },
  { pattern: /\bbagudung\b/i,  safe: null },
  { pattern: /\bittak\b/i,     safe: null },
  /* ── Bugis/Makassar ── */
  { pattern: /\btelaso\b/i,    safe: null },
  { pattern: /\bsundala\b/i,   safe: null },
  { pattern: /\btolo\b/i,      safe: /\btolok\b|\btolongan\b|\btolong\b/i },
  { pattern: /\bkongkong\b/i,  safe: null },
  /* ── Palembang ── */
  { pattern: /\bkampang\b/i,   safe: null },
  { pattern: /\bbengak\b/i,    safe: null },
  { pattern: /\bpilat\b/i,     safe: null },
  /* ── Sasak ── */
  { pattern: /\btele\b/i,      safe: null },
  { pattern: /\bbasong\b/i,    safe: null },
  { pattern: /\bbewi\b/i,      safe: null },
  { pattern: /\bgodik\b/i,     safe: null },
  { pattern: /\bbongoh\b/i,    safe: null },
  { pattern: /\bbodo\b/i,      safe: /\bbodoh\b/i }, /* "bodoh" beda dengan "bodo" kasar */
  /* ── Manado ── */
  { pattern: /\btelasota\b/i,  safe: null },
  { pattern: /\bboke\b/i,      safe: null },
  { pattern: /\bpendo\b/i,     safe: null },
  { pattern: /\bsangaya\b/i,   safe: null },
];

/** Variasi respons sopan agar tidak monoton */
const _profanityReplies = [
  /* 1 — Minta gunakan bahasa sopan */
  '🙏 Mohon maaf, kami ingin mengingatkan dengan hormat — *tolong gunakan bahasa yang sopan* agar kami dapat melayani Anda dengan lebih baik. Kami siap membantu kebutuhan desain dan perencanaan Anda!',

  /* 2 — Minta gunakan bahasa yang baik */
  '😊 Halo! Kami senang Anda menghubungi Fusako Studio. Demi kenyamanan bersama, *tolong gunakan bahasa yang baik* dalam percakapan ini ya. Ada yang bisa kami bantu seputar proyek Anda?',

  /* 3 — Pendekatan empati + ajak bicara baik-baik */
  '🌟 Kami memahami mungkin ada hal yang membuat Anda kurang nyaman. Namun kami mohon, *mari kita ngobrol dengan baik-baik* — kami di sini untuk membantu, bukan sebaliknya. Ceritakan kebutuhan Anda, kami dengarkan! 😊',

  /* 4 — Tegas tapi tetap ramah */
  '⚠️ Ups! Sepertinya ada kata yang kurang tepat. Fusako Studio berkomitmen menjaga suasana percakapan yang nyaman dan profesional. *Yuk, kita mulai ulang dengan bahasa yang lebih baik* — kami siap melayani Anda sepenuh hati! 🙏',

  /* 5 — Ringan dan mengalihkan ke topik positif */
  '😊 Eh, kayaknya ada yang lagi kurang mood nih! Tenang, kami tetap di sini untuk membantu. *Kalau boleh, gunakan bahasa yang lebih ramah ya* — biar diskusi kita soal desain rumah impian Anda makin seru! 🏠✨',
];

var _profanityReplyIdx = 0;

/**
 * Cek apakah pesan mengandung kata kasar.
 * Mengembalikan true jika ada kata kasar yang tidak termasuk konteks aman.
 * @param {string} msg
 * @returns {boolean}
 */
function _hasProfanity(msg) {
  var m = (msg || '').toLowerCase();
  for (var i = 0; i < _profanityList.length; i++) {
    var entry = _profanityList[i];
    if (entry.pattern.test(m)) {
      /* Cek konteks aman */
      if (entry.safe && entry.safe.test(m)) continue;
      return true;
    }
  }
  return false;
}

/**
 * Tampilkan balasan sopan jika ada kata kasar.
 * Menggunakan rotasi respons agar tidak monoton.
 */
function _handleProfanity() {
  var reply = _profanityReplies[_profanityReplyIdx % _profanityReplies.length];
  _profanityReplyIdx++;
  _showTyping(function() {
    _appendBotBubble(reply, false);
    /* Tetap tampilkan opsi utama agar user bisa melanjutkan */
    var s = window._consultState;
    if (s && s.step && !s.done) {
      var steps = s.fromPromo ? waConsultStepsPromo : waConsultSteps;
      var cur = steps.find(function(x){ return x.id === s.step; });
      if (cur && cur.opts) _renderOpts(cur.opts);
    }
  });
}


function sendBotMsg() {
  var input = document.getElementById('waInput');
  if (!input) return;
  var msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  /* Tampilkan bubble user */
  _appendUserBubble(msg);

  /* ── FILTER KATA KASAR ── */
  if (_hasProfanity(msg)) {
    _handleProfanity();
    return;
  }

  /* Aksi khusus */
  if (msg === '__WA__') {
    _openWA(window._consultState.data, window._consultState.mode, window._consultState.fromPromo);
    return;
  }
  if (msg === '__RESET__') {
    _resetConsult();
    return;
  }
  if (msg === '__BACK_PAKET__') {
    /* Balik ke step paket_pilih sesuai mode */
    var s = window._consultState;
    s.step = s.fromPromo ? 'paket_pilih_promo' : 'paket_pilih';
    s.done = false;
    var steps = s.fromPromo ? waConsultStepsPromo : waConsultSteps;
    var paketStep = steps.find(function(x){ return x.id === s.step; });
    if (paketStep) {
      _showTyping(function() {
        _appendBotBubble(paketStep.msg(s.data), false);
        _renderOpts(paketStep.opts);
      });
    }
    return;
  }

  /* Jalankan alur konsultasi */
  _triggerBotStep(msg);
}

function _triggerBotStep(msg) {
  var s = window._consultState;

  /* Jika state kosong → inisialisasi */
  if (!s.step) {
    var init = getConsultReply(null, null);
    window._consultState = init.state;
    _showTyping(function() {
      _appendBotBubble(init.reply, s.fromPromo);
      _renderOpts(init.opts);
    });
    return;
  }

  /* Proses pesan */
  var result = getConsultReply(msg, s);
  if (!result) {
    /* Coba fallback template */
    var fb = _matchTemplate(msg);
    if (fb) {
      _showTyping(function() { _appendBotBubble(fb, false); });
    }
    return;
  }

  window._consultState = result.state;
  _showTyping(function() {
    _appendBotBubble(result.reply, result.state.fromPromo && result.state.step === 'welcome');
    _renderOpts(result.opts || []);
  });
}

/* ── UI Helpers ── */

function _getTime() {
  var d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

function _appendUserBubble(text) {
  var area = document.getElementById('waMessages');
  if (!area) return;
  var row = document.createElement('div');
  row.className = 'wa-msg-row usr';
  row.innerHTML =
    '<div class="wa-bubble usr">' + _escHtml(text) +
    '<div class="wa-tm">' + _getTime() + ' ✓✓</div></div>';
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function _appendBotBubble(text, isPromo) {
  var area = document.getElementById('waMessages');
  if (!area) return;
  var row = document.createElement('div');
  row.className = 'wa-msg-row bot';
  var cls = 'wa-bubble bot' + (isPromo ? ' promo' : '');
  row.innerHTML =
    '<div class="' + cls + '">' + _fmtText(text) +
    '<div class="wa-tm">' + _getTime() + '</div></div>';
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
}

function _showTyping(cb) {
  var area = document.getElementById('waMessages');
  if (!area) { if(cb) cb(); return; }
  var row = document.createElement('div');
  row.className = 'wa-msg-row bot';
  row.id = 'wa-typing-row';
  row.innerHTML =
    '<div class="wa-bubble bot typing">' +
    '<span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
    '</div>';
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
  setTimeout(function() {
    var el = document.getElementById('wa-typing-row');
    if (el) el.remove();
    if (cb) cb();
  }, 700 + Math.random() * 500);
}

function _renderOpts(opts) {
  var container = document.getElementById('waBotOpts');
  if (!container) {
    /* Buat container jika belum ada */
    container = document.createElement('div');
    container.id = 'waBotOpts';
    container.style.cssText =
      'padding:6px 10px;display:flex;flex-wrap:wrap;gap:5px;' +
      'background:#ECE5DD;border-top:0.5px solid rgba(0,0,0,0.08)';
    var area = document.getElementById('waMessages');
    if (area && area.parentNode) {
      area.parentNode.insertBefore(container, area.nextSibling);
    }
  }
  container.innerHTML = '';
  var isPromo = window._consultState.fromPromo;
  opts.forEach(function(o) {
    var btn = document.createElement('button');
    btn.style.cssText =
      'background:#fff;border:0.5px solid ' + (isPromo ? '#d4930e' : '#25D366') + ';' +
      'color:' + (isPromo ? '#7a3d00' : '#075E54') + ';' +
      'border-radius:15px;padding:4px 10px;font-size:11.5px;cursor:pointer;' +
      'white-space:nowrap;font-family:inherit' +
      (o.manual ? ';font-style:italic;border-color:#aaa;color:#888' : '');
    btn.textContent = o.label;
    btn.addEventListener('click', function() {
      var val = (o.value !== null && o.value !== undefined) ? o.value : null;
      if (val === null) {
        /* Manual: fokus ke input */
        var inp = document.getElementById('waInput');
        if (inp) { inp.focus(); inp.placeholder = 'Ketik jawaban Anda...'; }
        return;
      }
      /* Simulasi user kirim */
      var inp = document.getElementById('waInput');
      if (inp) {
        inp.value = val;
        sendBotMsg();
      }
    });
    container.appendChild(btn);
  });
}

function _clearBotOpts() {
  var c = document.getElementById('waBotOpts');
  if (c) c.innerHTML = '';
}

function _resetConsult() {
  window._consultState = { step: null, data: {}, mode: null, fromPromo: false, done: false };
  var area = document.getElementById('waMessages');
  if (area) area.innerHTML = '';
  _clearBotOpts();

  /* Reset warna header */
  var hdr = document.querySelector('#waPopup .wa-header, .wa-header, #waHeader');
  if (hdr) hdr.style.background = FUSAKO_CONFIG.colorNormal;
  var badge = document.getElementById('waPromoHeaderBadge');
  if (badge) badge.remove();

  /* Mulai ulang */
  setTimeout(function() { _triggerBotStep(null); }, 300);
}

function _escHtml(t) {
  return (t || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function _fmtText(t) {
  return _escHtml(t)
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}


/* ─────────────────────────────────────────────────────────────
   11. AUTO-INIT
       Saat halaman load, inisialisasi chatbot.
       Ubah fsdGoChat() di HTML menjadi:
         window._startPromo('PROMOTIPE50');
       agar promo berjalan lewat alur ini.
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  /* Tambahkan CSS animasi typing jika belum ada */
  if (!document.getElementById('fusako-bot-style')) {
    var style = document.createElement('style');
    style.id = 'fusako-bot-style';
    style.textContent =
      '.wa-bubble.promo{background:#FEF3E2!important;border-left:3px solid #d4930e!important}' +
      '.dot{display:inline-block;width:6px;height:6px;border-radius:50%;' +
      'background:#aaa;margin:0 2px;animation:waDot 1s infinite}' +
      '.dot:nth-child(2){animation-delay:.15s}' +
      '.dot:nth-child(3){animation-delay:.3s}' +
      '@keyframes waDot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}';
    document.head.appendChild(style);
  }

  /* Sambungkan tombol WA di akhir ringkasan jika ada */
  document.addEventListener('click', function(e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute('data-wa-send') === '1') {
      _openWA(window._consultState.data, window._consultState.mode, window._consultState.fromPromo);
    }
  });
});

/* ── Ekspor untuk debug/testing di console ── */
window._fusakoBot = {
  config:           FUSAKO_CONFIG,
  state:            function() { return window._consultState; },
  reset:            _resetConsult,
  startPromo:       window._startPromo,
  buildSummary:     buildSummary,
  buildWAMessage:   buildWAMessage,
  matchTemplate:    _matchTemplate,
};