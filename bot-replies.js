/* ================================================================
   FUSAKO CHATBOT — Future Sakato Dynamics Studio
   fusako-chatbot.js  ·  v3.0  ·  File tunggal gabungan

   Berisi:
     A. DATA & TEKS (templates, steps, system prompts)
     B. FLOW CHATBOT BIASA (alur konsultasi umum)
     C. FLOW CHATBOT PROMO (alur klaim promo Tipe 50)
     D. UI ENGINE  (render pesan, typing, opsi)
     E. PUBLIC API (FusakoChat.init / FusakoChat.startPromo)

   Cara pakai di HTML:
     <script src="fusako-chatbot.js"></script>

     // Chat biasa:
     FusakoChat.init({
       containerSelector: '#wrap',   // opsional, default '#wrap'
       waNumber: '6282285754080',     // opsional
     });

     // Dari popup promo — klaim diklik:
     FusakoChat.startPromo('PROMOTIPE50', {
       containerSelector: '#chat-panel',
     });

   Elemen HTML minimal yang dibutuhkan:
     <div id="wrap">
       <div id="msgs"></div>
       <div id="opts"></div>
       <input id="inp" />
       <button id="snd">Kirim</button>
     </div>
   ================================================================ */

;(function (global) {
  'use strict';

  /* ──────────────────────────────────────────────────────────────
     A. DATA & TEKS
     ────────────────────────────────────────────────────────────── */

  /** Helper: sapaan sesuai jam */
  function getSapaan() {
    const h = new Date().getHours();
    if (h >= 5  && h < 12) return 'Selamat pagi';
    if (h >= 12 && h < 15) return 'Selamat siang';
    if (h >= 15 && h < 19) return 'Selamat sore';
    return 'Selamat malam';
  }

  /** Waktu HH:MM */
  function getTime() {
    const d = new Date();
    return d.getHours().toString().padStart(2, '0') + ':' +
           d.getMinutes().toString().padStart(2, '0');
  }


  /* ── A1. TEMPLATE FALLBACK (pertanyaan di luar alur konsultasi) ── */
  const waTemplates = [
    {
      keys: /harga|biaya|tarif|cost|fee|bayar/i,
      reply:
        '💰 Biaya perencanaan kami bervariasi sesuai jenis dan skala proyek.\n\n' +
        '• Desain rumah tinggal: mulai Rp 3 jt\n' +
        '• Perkantoran / komersial: mulai Rp 8 jt\n' +
        '• Kawasan industri: sesuai kebutuhan\n\n' +
        'Semua estimasi transparan. Proyek apa yang sedang Anda rencanakan?'
    },
    {
      keys: /kantor|perkantoran|gedung|ruko|komersial|toko/i,
      reply:
        '🏢 Layanan *Desain Perkantoran & Komersial* kami:\n\n' +
        '• Gedung kantor 1–10 lantai\n• Ruko dan pusat perbelanjaan\n' +
        '• Desain representatif & fungsional\n\nBisa ceritakan gambaran proyeknya?'
    },
    {
      keys: /industri|pabrik|gudang|warehouse|manufaktur/i,
      reply:
        '🏭 Untuk *Perencanaan Kawasan Industri*, kami menangani:\n\n' +
        '• Desain pabrik & gudang\n• Layout kawasan industri\n' +
        '• Perencanaan utilitas & infrastruktur\n\nCeritakan kebutuhan industri Anda!'
    },
    {
      keys: /klinik|rumah sakit|puskesmas|kesehatan|medis|dokter/i,
      reply:
        '🏥 Kami berpengalaman dalam *Desain Fasilitas Kesehatan*:\n\n' +
        '• Klinik & puskesmas\n• Ruang periksa & apotek\n' +
        '• Standar kesehatan & sanitasi\n\nAda proyek fasilitas kesehatan yang ingin direncanakan?'
    },
    {
      keys: /cafe|restoran|hotel|penginapan|resort|kafe/i,
      reply:
        '☕ Untuk *Desain Cafe, Restoran & Penginapan*:\n\n' +
        '• Konsep interior modern & estetis\n• Denah sirkulasi pengunjung optimal\n' +
        '• Desain hotel & villa\n\nBagaimana konsep yang Anda bayangkan?'
    },
    {
      keys: /sipil|infrastruktur|jalan|jembatan|drainase|air bersih/i,
      reply:
        '🔧 Layanan *Perencanaan Sipil & Infrastruktur* kami:\n\n' +
        '• Perencanaan jalan & drainase\n• Sistem air bersih & sanitasi\n' +
        '• Dokumen teknis siap lelang\n\nProyek infrastruktur apa yang sedang direncanakan?'
    },
    {
      keys: /proses|alur|langkah|cara|prosedur|bagaimana|gimana/i,
      reply:
        '📋 Proses kerja kami sederhana:\n\n' +
        '1️⃣ Konsultasi — ceritakan kebutuhan\n' +
        '2️⃣ Brief & kajian — kami pelajari detail\n' +
        '3️⃣ Desain konsep — sketsa & rencana awal\n' +
        '4️⃣ Revisi — sampai sesuai keinginan\n' +
        '5️⃣ Dokumen final — siap bangun\n\nSemua bisa online! 💻'
    },
    {
      keys: /lokasi|alamat|dimana|sijunjung|sumatera/i,
      reply:
        '📍 Studio kami di *Sijunjung, Sumatera Barat*, namun melayani seluruh Indonesia secara online.\n\nAda yang ingin Anda tanyakan lebih lanjut?'
    },
    {
      keys: /kontak|hubungi|telepon|wa|whatsapp|nomor|email/i,
      reply:
        '📞 Untuk berdiskusi langsung, silakan klik tombol *"Hubungi Tim Kami"* di bawah — tim kami siap merespons via WhatsApp.\n\nAtau ada pertanyaan lain dulu?'
    },
    {
      keys: /lama|waktu|durasi|berapa lama|kapan selesai|deadline/i,
      reply:
        '⏱️ Estimasi waktu pengerjaan:\n\n' +
        '• Desain rumah: *7–14 hari*\n• Perkantoran: *14–21 hari*\n' +
        '• Proyek besar: sesuai kompleksitas\n\nAda target waktu tertentu?'
    },
    {
      keys: /revisi|ubah|ganti|tidak suka|kurang|perbaiki/i,
      reply:
        '✏️ Setiap paket sudah termasuk revisi desain hingga Anda puas. Kepuasan klien adalah prioritas kami. 💯\n\nMau tahu lebih lanjut tentang paket layanan kami?'
    },
    {
      keys: /portofolio|contoh|hasil|proyek|karya|galeri/i,
      reply:
        '🖼️ Portofolio kami bisa dilihat di bagian *"Proyek Kami"* di halaman ini.\n\nUntuk katalog lengkap dengan detail gambar, tim kami siap mengirimkan setelah konsultasi singkat.'
    },
    {
      keys: /terima kasih|makasih|thanks|mantap|bagus|oke|ok|siap/i,
      reply:
        '😊 Sama-sama! Senang bisa membantu.\n\nJika ada pertanyaan lain seputar desain dan perencanaan, jangan ragu bertanya ya!'
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
    {
      keys: /renovasi|renov|ubah rumah|perbaikan rumah/i,
      reply:
        '🔨 Kami juga melayani *Renovasi Bangunan*:\n\n' +
        '• Renovasi rumah tinggal\n• Perluasan bangunan\n• Ubah tampak fasad\n\n' +
        'Ceritakan kondisi bangunan sekarang dan perubahan yang diinginkan!'
    },
    {
      keys: /rumah|hunian|tinggal|tempat tinggal/i,
      reply:
        '🏠 Kami melayani *Desain Rumah Tinggal* dengan berbagai pilihan:\n\n' +
        '• Rumah 1 lantai hingga 3 lantai\n• Desain modern, minimalis, tropis, dan lainnya\n' +
        '• Gambar kerja lengkap + RAB\n\nBerapa luas tanah dan berapa lantai yang Anda rencanakan?'
    },
    {
      keys: /desain|rancang|arsitek|arsitektur/i,
      reply:
        '✏️ Kami siap membantu *desain dan perencanaan* bangunan Anda!\n\n' +
        'Layanan kami mencakup hunian, perkantoran, komersial, hingga kawasan industri.\n\nBangunan apa yang ingin Anda desain?'
    },
    {
      keys: /bangun|pembangunan|konstruksi|mau bikin|mau buat/i,
      reply:
        '🏗️ Bagus! Kami siap membantu perencanaan pembangunan Anda dari awal.\n\n' +
        'Mulai dari desain konsep, gambar kerja, hingga dokumen teknis lengkap.\n\nBangunan apa yang ingin Anda wujudkan?'
    },
    {
      keys: /halo|hai|hi|hello|selamat|pagi|siang|sore|malam|apa kabar/i,
      reply:
        '👋 Halo! Selamat datang di *Future Sakato Dynamics Studio*.\n\n' +
        'Kami siap membantu kebutuhan desain dan perencanaan bangunan Anda.\n\nAda yang bisa kami bantu?'
    },
    {
      keys: /berapa|ukuran|luas|meter|lantai|kamar/i,
      reply:
        '📐 Kami bisa bantu sesuai ukuran dan spesifikasi proyek Anda.\n\n' +
        'Coba ceritakan: luas tanah, jumlah lantai yang diinginkan, dan fungsi bangunannya. Kami siap bantu!'
    }
  ];


  /* ── A2. ALUR KONSULTASI HUNIAN ── */
  const waConsultSteps = [
    {
      id: 'welcome',
      getReply: () =>
        `${getSapaan()}! 👋\n\nTerima kasih telah menghubungi *Future Sakato Dynamics Studio*.\n\nApakah Anda ingin konsultasi desain rumah, renovasi, atau bangunan lainnya?`,
      saveKey: 'jenis_konsultasi',
      nextStep: 'luas_tanah'
    },
    {
      id: 'luas_tanah',
      getReply: () =>
        'Bisa disebutkan *luas tanah atau ukuran lahan*-nya?\n\n_Contoh: 8×12, 10×15, 120 m², dll._',
      saveKey: 'luas_tanah',
      nextStep: 'jumlah_lantai'
    },
    {
      id: 'jumlah_lantai',
      getReply: () =>
        'Berapa *jumlah lantai* yang direncanakan?\n\n• 1 lantai\n• 2 lantai\n• 3 lantai atau lebih\n• Belum menentukan',
      saveKey: 'jumlah_lantai',
      nextStep: 'kamar_tidur'
    },
    {
      id: 'kamar_tidur',
      getReply: () => 'Berapa *kamar tidur* yang dibutuhkan?',
      saveKey: 'kamar_tidur',
      nextStep: 'kamar_mandi'
    },
    {
      id: 'kamar_mandi',
      getReply: () => 'Berapa *kamar mandi* yang dibutuhkan?',
      saveKey: 'kamar_mandi',
      nextStep: 'penghuni'
    },
    {
      id: 'penghuni',
      getReply: () =>
        'Siapa yang akan *menempati* rumah tersebut?\n\n• Pasangan suami istri\n• Keluarga kecil\n• Keluarga besar\n• Orang tua dan anak\n• Investasi / disewakan\n• Lainnya',
      saveKey: 'penghuni',
      nextStep: 'garasi'
    },
    {
      id: 'garasi',
      getReply: () =>
        'Apakah membutuhkan *garasi atau carport*?\n\n• Tidak ada\n• 1 mobil\n• 2 mobil\n• 3 mobil atau lebih',
      saveKey: 'garasi',
      nextStep: 'ruangan_tambahan'
    },
    {
      id: 'ruangan_tambahan',
      getReply: () =>
        'Ruangan tambahan apa yang dibutuhkan?\n\n_Boleh sebutkan lebih dari satu. Contoh:_\n' +
        '• Mushola\n• Ruang kerja / home office\n• Ruang tamu\n• Ruang laundry\n' +
        '• Gudang\n• Ruang usaha\n• Balkon\n• Rooftop\n• Tidak ada',
      saveKey: 'ruangan_tambahan',
      nextStep: 'gaya_desain'
    },
    {
      id: 'gaya_desain',
      getReply: () =>
        'Gaya *desain* yang disukai?\n\n• Modern\n• Minimalis\n• Tropis\n' +
        '• Industrial\n• Klasik\n• Scandinavian\n• Japandi\n• Belum tahu',
      saveKey: 'gaya_desain',
      nextStep: 'status_tanah'
    },
    {
      id: 'status_tanah',
      getReply: () => 'Apakah *sudah memiliki tanah*?\n\n• Sudah\n• Belum',
      saveKey: 'status_tanah',
      nextStep: 'lokasi'
    },
    {
      id: 'lokasi',
      getReply: () =>
        '*Lokasi pembangunan* di daerah mana?\n\n_Contoh: Padang, Sijunjung, Jakarta Selatan, Makassar, dll._',
      saveKey: 'lokasi',
      nextStep: 'kondisi_lahan'
    },
    {
      id: 'kondisi_lahan',
      getReply: () =>
        'Bagaimana *kondisi lahan* saat ini?\n\n• Tanah kosong\n• Ada bangunan lama\n' +
        '• Renovasi rumah lama\n• Kavling perumahan\n• Hook / pojok\n• Belum tahu',
      saveKey: 'kondisi_lahan',
      nextStep: 'jadwal'
    },
    {
      id: 'jadwal',
      getReply: () =>
        'Kapan *rencana pembangunan* dimulai?\n\n• Secepatnya\n• 1–3 bulan\n' +
        '• 3–6 bulan\n• Lebih dari 6 bulan\n• Masih mencari referensi',
      saveKey: 'jadwal',
      nextStep: 'anggaran'
    },
    {
      id: 'anggaran',
      getReply: () =>
        'Berapa *kisaran anggaran pembangunan* yang disiapkan?\n\n' +
        '• Di bawah 300 juta\n• 300 – 500 juta\n• 500 juta – 1 miliar\n' +
        '• 1 – 2 miliar\n• Di atas 2 miliar\n• Belum menentukan',
      saveKey: 'anggaran',
      nextStep: 'catatan'
    },
    {
      id: 'catatan',
      getReply: () =>
        'Apakah ada *kebutuhan khusus* yang ingin disampaikan?\n\n_Contoh:_\n' +
        '• Banyak ventilasi / rumah terang\n• Ramah lansia / ramah anak\n' +
        '• Banyak taman\n• Bisa dikembangkan ke 2 lantai\n• Hemat biaya\n• Tidak ada catatan khusus',
      saveKey: 'catatan',
      nextStep: 'summary'
    }
  ];


  /* ── A3. ALUR KONSULTASI NON-HUNIAN ── */
  const waConsultStepsNonHunian = [
    {
      id: 'luas_tanah',
      getReply: () =>
        'Bisa disebutkan *luas lahan atau bangunan* yang direncanakan?\n\n_Contoh: 200 m², 15×30, dll._',
      saveKey: 'luas_tanah',
      nextStep: 'jumlah_lantai'
    },
    {
      id: 'jumlah_lantai',
      getReply: () =>
        'Berapa *jumlah lantai* yang direncanakan?\n\n• 1 lantai\n• 2–4 lantai\n• 5 lantai atau lebih\n• Belum menentukan',
      saveKey: 'jumlah_lantai',
      nextStep: 'fungsi_ruang'
    },
    {
      id: 'fungsi_ruang',
      getReply: () =>
        'Ruangan atau fasilitas utama apa yang dibutuhkan?\n\n' +
        '_Sebutkan yang relevan. Contoh: ruang meeting, area pamer,\ndapur, loker karyawan, mushola, parkir, dll._',
      saveKey: 'ruangan_tambahan',
      nextStep: 'gaya_desain'
    },
    {
      id: 'gaya_desain',
      getReply: () =>
        'Gaya *desain* yang diinginkan?\n\n• Modern\n• Minimalis\n• Industrial\n• Klasik\n• Tropis\n• Belum tahu',
      saveKey: 'gaya_desain',
      nextStep: 'status_tanah'
    },
    {
      id: 'status_tanah',
      getReply: () => 'Apakah *sudah memiliki lahan*?\n\n• Sudah\n• Belum',
      saveKey: 'status_tanah',
      nextStep: 'lokasi'
    },
    {
      id: 'lokasi',
      getReply: () =>
        '*Lokasi pembangunan* di daerah mana?\n\n_Contoh: Padang, Jakarta Utara, Surabaya, dll._',
      saveKey: 'lokasi',
      nextStep: 'kondisi_lahan'
    },
    {
      id: 'kondisi_lahan',
      getReply: () =>
        'Bagaimana *kondisi lahan* saat ini?\n\n• Tanah kosong\n• Ada bangunan lama\n• Renovasi bangunan lama\n• Belum tahu',
      saveKey: 'kondisi_lahan',
      nextStep: 'jadwal'
    },
    {
      id: 'jadwal',
      getReply: () =>
        'Kapan *rencana pembangunan* dimulai?\n\n• Secepatnya\n• 1–3 bulan\n' +
        '• 3–6 bulan\n• Lebih dari 6 bulan\n• Masih mencari referensi',
      saveKey: 'jadwal',
      nextStep: 'anggaran'
    },
    {
      id: 'anggaran',
      getReply: () =>
        'Berapa *kisaran anggaran pembangunan* yang disiapkan?\n\n' +
        '• Di bawah 500 juta\n• 500 juta – 1 miliar\n• 1 – 3 miliar\n• Di atas 3 miliar\n• Belum menentukan',
      saveKey: 'anggaran',
      nextStep: 'catatan'
    },
    {
      id: 'catatan',
      getReply: () =>
        'Apakah ada *kebutuhan khusus* lainnya?\n\n' +
        '_Contoh: hemat energi, parkir luas, representatif untuk klien,\nramah difabel, fasad korporat, dll._\nAtau ketik: *Tidak ada*',
      saveKey: 'catatan',
      nextStep: 'summary'
    }
  ];


  /* ── A4. FLOW CHATBOT BIASA (chatbot_fusako_v2) ── */
  const FLOW_BIASA = {
    welcome: {
      msg: () =>
        `${getSapaan()}! 👋\n\nSelamat datang di *Fusako Studio*.\n\nKami membantu layanan desain rumah, villa, ruko, kantor, interior, renovasi, hingga perencanaan pembangunan.\n\nApa yang ingin Anda konsultasikan?`,
      opts: [
        { label: '🏠 Desain Rumah',           value: 'Desain Rumah' },
        { label: '🏡 Desain Villa',            value: 'Desain Villa' },
        { label: '🏢 Desain Kantor',           value: 'Desain Kantor' },
        { label: '🏪 Desain Ruko/Toko',        value: 'Desain Ruko/Toko' },
        { label: '🛋️ Desain Interior',         value: 'Desain Interior' },
        { label: '🔨 Renovasi Bangunan',       value: 'Renovasi Bangunan' },
        { label: '📋 Konsultasi Perencanaan',  value: 'Konsultasi Perencanaan' },
        { label: '✏️ Ketik sendiri...',        value: null, manual: true },
      ],
      save: 'jenis',
      next: (v) => {
        const non = /kantor|ruko|toko|villa|interior|renovasi|perencanaan/i.test(v);
        return non ? 'tujuan_non' : 'status_lahan';
      }
    },
    status_lahan: {
      msg: () => 'Baik, kami siap membantu.\n\nApakah Anda sudah memiliki lahan?',
      opts: [
        { label: '✅ Sudah ada lahan',        value: 'Sudah ada lahan' },
        { label: '⏳ Sedang mencari lahan',   value: 'Sedang mencari lahan' },
        { label: '❌ Belum memiliki lahan',   value: 'Belum memiliki lahan' },
      ],
      save: 'status_lahan',
      next: (v) => /belum|cari/i.test(v) ? 'belum_lahan' : 'luas_lahan'
    },
    belum_lahan: {
      msg: () =>
        'Tidak masalah.\n\nBanyak klien kami berkonsultasi sebelum membeli lahan untuk mengetahui ukuran yang ideal.\n\nBoleh kami tahu kebutuhan umumnya?\n\n📌 Berapa kamar tidur yang diinginkan?\n📌 Berapa lantai yang direncanakan?\n📌 Berapa kebutuhan parkir kendaraan?\n\n_Silakan ketik jawaban Anda._',
      opts: [{ label: '✏️ Ketik kebutuhan saya...', value: null, manual: true }],
      save: 'cerita',
      next: () => 'layanan'
    },
    luas_lahan: {
      msg: () => 'Berapa perkiraan *luas lahan* yang dimiliki?\n\n_Contoh: 6×12 m, 8×15 m, 120 m², dll._',
      opts: [
        { label: '6×12 m',       value: '6×12 meter' },
        { label: '8×15 m',       value: '8×15 meter' },
        { label: '10×20 m',      value: '10×20 meter' },
        { label: '✏️ Ukuran lain...', value: null, manual: true },
      ],
      save: 'luas',
      next: () => 'kawasan'
    },
    kawasan: {
      msg: () => 'Lahan berada di kawasan apa?',
      opts: [
        { label: '🏘️ Perumahan',    value: 'Perumahan' },
        { label: '🌳 Pedesaan',     value: 'Pedesaan' },
        { label: '🏙️ Perkotaan',   value: 'Perkotaan' },
        { label: '🏖️ Kawasan wisata', value: 'Kawasan wisata' },
        { label: '✏️ Lainnya...',   value: null, manual: true },
      ],
      save: 'kawasan',
      next: (v, state) => state.mode === 'non_hunian' ? 'tujuan_non' : 'tujuan'
    },
    tujuan: {
      msg: () => 'Rumah yang direncanakan akan digunakan untuk?',
      opts: [
        { label: '👨‍👩‍👧‍👦 Hunian keluarga',     value: 'Hunian keluarga' },
        { label: '💼 Investasi',             value: 'Investasi' },
        { label: '🏠 Rumah kontrakan',       value: 'Rumah kontrakan' },
        { label: '🏡 Rumah pensiun',         value: 'Rumah pensiun' },
        { label: '🔄 Hunian + usaha',        value: 'Kombinasi hunian dan usaha' },
      ],
      save: 'tujuan',
      next: () => 'penghuni'
    },
    tujuan_non: {
      msg: () =>
        'Bangunan akan digunakan untuk tujuan apa?\n\n_Contoh: kantor operasional, toko retail, cafe, guest house, gudang, dll._',
      opts: [
        { label: '🏢 Kantor operasional',    value: 'Kantor operasional' },
        { label: '🏪 Toko / retail',         value: 'Toko / retail' },
        { label: '☕ Cafe / restoran',       value: 'Cafe / restoran' },
        { label: '🏨 Penginapan',            value: 'Penginapan / guest house' },
        { label: '🏭 Gudang / industri',     value: 'Gudang / industri' },
        { label: '✏️ Lainnya...',            value: null, manual: true },
      ],
      save: 'tujuan',
      next: () => 'luas_bangunan_non'
    },
    luas_bangunan_non: {
      msg: () => 'Luas bangunan yang direncanakan?\n\n_Contoh: 200 m², 15×30 m, dll._',
      opts: [
        { label: '< 200 m²',    value: 'Kurang dari 200 m²' },
        { label: '200–500 m²',  value: '200–500 m²' },
        { label: '> 500 m²',   value: 'Lebih dari 500 m²' },
        { label: '✏️ Sebutkan...', value: null, manual: true },
      ],
      save: 'luas',
      next: () => 'lantai'
    },
    penghuni: {
      msg: () => 'Berapa *jumlah anggota keluarga* yang akan menempati rumah?',
      opts: [
        { label: '2 orang',       value: '2 orang' },
        { label: '3–4 orang',     value: '3–4 orang' },
        { label: '5–6 orang',     value: '5–6 orang' },
        { label: '> 6 orang',     value: 'Lebih dari 6 orang' },
      ],
      save: 'penghuni',
      next: () => 'kamar'
    },
    kamar: {
      msg: () => 'Berapa *kamar tidur* yang diinginkan?',
      opts: [
        { label: '2 kamar', value: '2 kamar tidur' },
        { label: '3 kamar', value: '3 kamar tidur' },
        { label: '4 kamar', value: '4 kamar tidur' },
        { label: '> 4 kamar', value: 'Lebih dari 4 kamar tidur' },
      ],
      save: 'kamar',
      next: () => 'ruang_khusus'
    },
    ruang_khusus: {
      msg: () =>
        'Selain kamar tidur, adakah *ruang khusus* yang diinginkan?\n\n_Contoh: ruang kerja, mushola, ruang belajar, taman belakang, garasi 2 mobil, rooftop, kolam renang._',
      opts: [
        { label: 'Ruang kerja',     value: 'Ruang kerja' },
        { label: 'Mushola',         value: 'Mushola' },
        { label: 'Taman belakang',  value: 'Taman belakang' },
        { label: 'Garasi 2 mobil',  value: 'Garasi 2 mobil' },
        { label: '✏️ Sebutkan...',  value: null, manual: true },
        { label: 'Tidak ada',       value: 'Tidak ada' },
      ],
      save: 'ruang_khusus',
      next: () => 'konsep'
    },
    konsep: {
      msg: () => 'Apakah sudah ada gambaran *konsep desain* yang disukai?',
      opts: [
        { label: '🏠 Minimalis modern',          value: 'Minimalis modern' },
        { label: '🌿 Tropis modern',             value: 'Tropis modern' },
        { label: '🏛️ Klasik',                   value: 'Klasik' },
        { label: '🧱 Industrial',               value: 'Industrial' },
        { label: '✨ Modern luxury',             value: 'Modern luxury' },
        { label: '🤔 Belum tahu, minta rekomendasi', value: 'Belum tahu, ingin rekomendasi' },
      ],
      save: 'konsep',
      next: () => 'lantai'
    },
    lantai: {
      msg: () => 'Bangunan direncanakan berapa *lantai*?',
      opts: [
        { label: '1 lantai',        value: '1 lantai' },
        { label: '2 lantai',        value: '2 lantai' },
        { label: '3 lantai',        value: '3 lantai' },
        { label: 'Belum ditentukan', value: 'Belum ditentukan' },
      ],
      save: 'lantai',
      next: () => 'anggaran'
    },
    anggaran: {
      msg: () =>
        'Apakah sudah ada *perkiraan anggaran* pembangunan?\n\n_Jika belum pasti, cukup tuliskan perkiraannya._',
      opts: [
        { label: '< 300 juta',   value: 'Di bawah 300 juta' },
        { label: '300–500 juta', value: '300–500 juta' },
        { label: '500 jt–1 M',   value: '500 juta–1 miliar' },
        { label: '1–2 M',        value: '1–2 miliar' },
        { label: '> 2 M',        value: 'Di atas 2 miliar' },
        { label: 'Belum tahu',   value: 'Belum mengetahui' },
      ],
      save: 'anggaran',
      next: () => 'layanan'
    },
    layanan: {
      msg: () => 'Saat ini, layanan apa yang paling Anda butuhkan?',
      opts: [
        { label: '📐 Desain Denah',               value: 'Desain Denah' },
        { label: '🏠 Desain Arsitektur Lengkap',  value: 'Desain Arsitektur Lengkap' },
        { label: '📋 RAB Perkiraan Biaya',        value: 'RAB Perkiraan Biaya' },
        { label: '🛋️ Desain Interior',            value: 'Desain Interior' },
        { label: '📄 Gambar Kerja Teknis',        value: 'Gambar Kerja Teknis' },
        { label: '🤝 Konsultasi Awal',            value: 'Konsultasi Awal' },
      ],
      save: 'layanan',
      next: () => 'kontak'
    },
    kontak: {
      msg: () =>
        'Baik! Sebelum kami hubungkan ke tim konsultan, mohon lengkapi data berikut:\n\n📌 *Nama Anda*\n\n_Silakan ketik nama Anda._',
      opts: [{ label: '✏️ Ketik nama saya...', value: null, manual: true }],
      save: 'nama',
      next: () => 'kontak_lokasi'
    },
    kontak_lokasi: {
      msg: () => '📌 *Kota / Lokasi proyek* di mana?',
      opts: [
        { label: 'Jakarta',   value: 'Jakarta' },
        { label: 'Bekasi',    value: 'Bekasi' },
        { label: 'Bandung',   value: 'Bandung' },
        { label: 'Surabaya',  value: 'Surabaya' },
        { label: 'Medan',     value: 'Medan' },
        { label: '✏️ Kota lain...', value: null, manual: true },
      ],
      save: 'lokasi',
      next: () => 'kontak_wa'
    },
    kontak_wa: {
      msg: () => '📌 *Nomor WhatsApp* yang bisa kami hubungi?',
      opts: [{ label: '✏️ Ketik nomor WA...', value: null, manual: true }],
      save: 'wa',
      next: () => 'kontak_cerita'
    },
    kontak_cerita: {
      msg: () =>
        '📌 Ceritakan singkat *rumah impian Anda* atau hal spesifik yang ingin dikonsultasikan.',
      opts: [
        { label: '✏️ Cerita singkat...', value: null, manual: true },
        { label: 'Lewati',               value: '—' },
      ],
      save: 'cerita',
      next: () => 'summary'
    }
  };


  /* ── A5. FLOW CHATBOT PROMO (fusako_promo_to_chat_flow) ── */
  const PROMOCODE = 'PROMOTIPE50';

  const FLOW_PROMO = {
    welcome: {
      msg: () =>
        `${getSapaan()}! 👋\n\n🏷️ *Halo! Kode Promo ${PROMOCODE} berhasil digunakan.*\n\nSelamat datang di *Fusako Studio*!\n\nPromo ini berlaku untuk *Desain Bangunan Tipe 50* (luas maksimal *50 m²*), mencakup gambar kerja lengkap + RAB, dengan harga spesial *Rp 4.499.000* (hemat 44%).\n\nUntuk mulai klaim, silakan pilih jenis bangunan yang ingin didesain:`,
      opts: [
        { label: '🏠 Rumah Tinggal',      value: 'Rumah Tinggal' },
        { label: '🏡 Villa / Guest House', value: 'Villa / Guest House' },
        { label: '🏪 Ruko / Toko',        value: 'Ruko / Toko' },
        { label: '🏢 Kantor Kecil',       value: 'Kantor Kecil' },
        { label: '✏️ Lainnya...',         value: null, manual: true },
      ],
      save: 'jenis',
      next: () => 'konfirmasi_luas'
    },
    konfirmasi_luas: {
      msg: () =>
        'Promo ini berlaku untuk bangunan dengan *luas maksimal 50 m²*.\n\nApakah luas bangunan yang Anda rencanakan masih dalam batas tersebut?',
      opts: [
        { label: '✅ Ya, di bawah atau sama dengan 50 m²', value: 'Ya, ≤50 m²' },
        { label: '❌ Melebihi 50 m²', value: 'Melebihi 50 m²' },
      ],
      save: 'konfirmasi_luas',
      next: (v) => /melebihi/i.test(v) ? 'luar_promo' : 'status_lahan'
    },
    luar_promo: {
      msg: () =>
        'Terima kasih sudah jujur! 😊\n\nPromo *Tipe 50* hanya berlaku untuk bangunan ≤50 m². Untuk luas di atas itu, kami tetap siap membantu dengan layanan reguler.\n\nApakah Anda ingin melanjutkan konsultasi desain tanpa promo?',
      opts: [
        { label: '✅ Lanjut konsultasi reguler', value: 'Lanjut konsultasi reguler' },
        { label: '❌ Tidak, terima kasih',       value: 'Tidak' },
      ],
      save: 'keputusan_luar',
      next: (v) => /tidak/i.test(v) ? 'selesai_tolak' : 'status_lahan'
    },
    selesai_tolak: {
      msg: () =>
        'Baik, tidak masalah! 🙏\n\nJika sewaktu-waktu ada yang bisa kami bantu, jangan ragu hubungi kami kembali.\n\nTerima kasih sudah mengunjungi Fusako Studio!',
      opts: [],
      save: null,
      next: () => 'selesai_tolak'
    },
    status_lahan: {
      msg: () => 'Apakah Anda sudah memiliki lahan?',
      opts: [
        { label: '✅ Sudah ada lahan',     value: 'Sudah ada lahan' },
        { label: '⏳ Sedang mencari',      value: 'Sedang mencari lahan' },
        { label: '❌ Belum punya lahan',   value: 'Belum memiliki lahan' },
      ],
      save: 'status_lahan',
      next: (v) => /belum|cari/i.test(v) ? 'belum_lahan' : 'luas_lahan'
    },
    belum_lahan: {
      msg: () =>
        'Tidak masalah! Kami bisa bantu estimasi ukuran lahan yang sesuai.\n\nCeritakan kebutuhan umumnya:\n📌 Berapa kamar tidur?\n📌 Ada ruang khusus yang diinginkan?',
      opts: [{ label: '✏️ Ketik kebutuhan saya...', value: null, manual: true }],
      save: 'kebutuhan',
      next: () => 'konsep'
    },
    luas_lahan: {
      msg: () => 'Berapa ukuran lahannya?\n\n_Contoh: 5×10 m, 6×12 m, 50 m², dll._',
      opts: [
        { label: '5×10 m',          value: '5×10 m' },
        { label: '6×12 m',          value: '6×12 m' },
        { label: '7×10 m',          value: '7×10 m' },
        { label: '✏️ Ukuran lain...', value: null, manual: true },
      ],
      save: 'luas',
      next: () => 'kawasan'
    },
    kawasan: {
      msg: () => 'Lahan berada di kawasan apa?',
      opts: [
        { label: '🏘️ Perumahan',  value: 'Perumahan' },
        { label: '🌳 Pedesaan',   value: 'Pedesaan' },
        { label: '🏙️ Perkotaan', value: 'Perkotaan' },
        { label: '✏️ Lainnya...', value: null, manual: true },
      ],
      save: 'kawasan',
      next: () => 'kamar'
    },
    kamar: {
      msg: () =>
        'Berapa *kamar tidur* yang diinginkan?\n\n_Untuk bangunan ≤50 m², umumnya 1–2 kamar tidur._',
      opts: [
        { label: '1 kamar', value: '1 kamar tidur' },
        { label: '2 kamar', value: '2 kamar tidur' },
        { label: 'Studio / tanpa kamar terpisah', value: 'Studio' },
      ],
      save: 'kamar',
      next: () => 'ruang_khusus'
    },
    ruang_khusus: {
      msg: () =>
        'Ada ruang khusus yang diinginkan?\n\n_Sesuaikan dengan luas 50 m²._',
      opts: [
        { label: 'Ruang kerja',    value: 'Ruang kerja' },
        { label: 'Mushola',        value: 'Mushola' },
        { label: 'Dapur terbuka',  value: 'Dapur terbuka' },
        { label: 'Taman kecil',    value: 'Taman kecil' },
        { label: '✏️ Sebutkan...', value: null, manual: true },
        { label: 'Tidak ada',      value: 'Tidak ada' },
      ],
      save: 'ruang_khusus',
      next: () => 'konsep'
    },
    konsep: {
      msg: () => 'Konsep *desain* yang disukai?',
      opts: [
        { label: '🏠 Minimalis modern',          value: 'Minimalis modern' },
        { label: '🌿 Tropis modern',             value: 'Tropis modern' },
        { label: '🧱 Industrial',               value: 'Industrial' },
        { label: '✨ Modern luxury',             value: 'Modern luxury' },
        { label: '🤔 Minta rekomendasi',        value: 'Belum tahu, ingin rekomendasi' },
      ],
      save: 'konsep',
      next: () => 'kontak'
    },
    kontak: {
      msg: () =>
        'Hampir selesai! Mohon lengkapi data untuk klaim promo:\n\n📌 *Nama Anda?*',
      opts: [{ label: '✏️ Ketik nama...', value: null, manual: true }],
      save: 'nama',
      next: () => 'kontak_lokasi'
    },
    kontak_lokasi: {
      msg: () => '📌 *Kota / Lokasi proyek?*',
      opts: [
        { label: 'Jakarta',   value: 'Jakarta' },
        { label: 'Bekasi',    value: 'Bekasi' },
        { label: 'Bandung',   value: 'Bandung' },
        { label: 'Surabaya',  value: 'Surabaya' },
        { label: '✏️ Kota lain...', value: null, manual: true },
      ],
      save: 'lokasi',
      next: () => 'kontak_wa'
    },
    kontak_wa: {
      msg: () =>
        '📌 *Nomor WhatsApp* yang bisa kami hubungi untuk klaim promo?',
      opts: [{ label: '✏️ Ketik nomor WA...', value: null, manual: true }],
      save: 'wa',
      next: () => 'summary'
    }
  };


  /* ── A6. BUILDER RINGKASAN & WA ── */
  function buildSummaryBiasa(data, mode) {
    const d = data || {};
    const penawaranPaket =
      '\n\n━━━━━━━━━━━━━━━━━━━━\n📦 *PAKET LAYANAN KAMI*\n━━━━━━━━━━━━━━━━━━━━\n\n' +
      '🗺️ *Paket Denah Saja*\n   Gambar denah lantai + fasad\n   _Cocok untuk yang butuh gambar dasar_\n\n' +
      '📐 *Paket Detapo*\n   Denah + detail konstruksi + RAB\n   _Paling populer untuk bangun rumah_\n\n' +
      '🏗️ *Paket Lengkap*\n   Full dokumen teknis + pendampingan\n   _Untuk proyek skala menengah–besar_\n\n' +
      '📲 Klik *"Hubungi Tim Kami"* untuk kirim ringkasan ini ke WhatsApp admin kami.\n\nTim kami akan segera menghubungi Anda! 🙏';

    const hdr = mode === 'non_hunian'
      ? '🏢 *KONSULTASI BANGUNAN — Fusako Studio*'
      : '🏠 *KONSULTASI HUNIAN — Fusako Studio*';

    let s = '✅ *Terima kasih!* Konsultasi Anda telah kami catat.\n\n';
    s += '━━━━━━━━━━━━━━━━━━━━\n📋 *RINGKASAN KONSULTASI*\n━━━━━━━━━━━━━━━━━━━━\n\n';
    s += hdr + '\n\n';
    if (d.jenis)       s += (mode === 'non_hunian' ? '🏗️' : '🏠') + ' Jenis           : ' + d.jenis + '\n';
    if (d.status_lahan) s += '📋 Status lahan   : ' + d.status_lahan + '\n';
    if (d.luas)         s += '📐 Luas lahan     : ' + d.luas + '\n';
    if (d.kawasan)      s += '📍 Kawasan        : ' + d.kawasan + '\n';
    if (d.tujuan)       s += '🎯 Tujuan         : ' + d.tujuan + '\n';
    if (d.penghuni)     s += '👥 Penghuni       : ' + d.penghuni + '\n';
    if (d.kamar)        s += '🛏️ Kamar tidur    : ' + d.kamar + '\n';
    if (d.ruang_khusus) s += '🛋️ Ruang khusus  : ' + d.ruang_khusus + '\n';
    if (d.konsep)       s += '🎨 Konsep desain  : ' + d.konsep + '\n';
    if (d.lantai)       s += '🏢 Jumlah lantai  : ' + d.lantai + '\n';
    if (d.anggaran)     s += '💰 Anggaran       : ' + d.anggaran + '\n';
    if (d.layanan)      s += '📦 Layanan        : ' + d.layanan + '\n';
    if (d.nama)         s += '👤 Nama           : ' + d.nama + '\n';
    if (d.lokasi)       s += '📍 Lokasi proyek  : ' + d.lokasi + '\n';
    if (d.wa)           s += '📲 WhatsApp       : ' + d.wa + '\n';
    if (d.cerita)       s += '📝 Catatan        : ' + d.cerita + '\n';
    s += penawaranPaket;
    return s;
  }

  function buildWAMsgBiasa(data, mode, fromPromo, promoCode) {
    const d = data || {};
    const lines = [];
    if (fromPromo) lines.push('🏷️ *KODE PROMO: ' + promoCode + '*\n');
    lines.push(mode === 'non_hunian'
      ? '🏢 *KONSULTASI BANGUNAN — Fusako Studio*'
      : '🏠 *KONSULTASI HUNIAN — Fusako Studio*');
    lines.push('');
    if (d.jenis)        lines.push('Jenis          : ' + d.jenis);
    if (d.status_lahan) lines.push('Status lahan   : ' + d.status_lahan);
    if (d.luas)         lines.push('Luas lahan     : ' + d.luas);
    if (d.kawasan)      lines.push('Kawasan        : ' + d.kawasan);
    if (d.tujuan)       lines.push('Tujuan         : ' + d.tujuan);
    if (d.penghuni)     lines.push('Penghuni       : ' + d.penghuni);
    if (d.kamar)        lines.push('Kamar tidur    : ' + d.kamar);
    if (d.ruang_khusus) lines.push('Ruang khusus   : ' + d.ruang_khusus);
    if (d.konsep)       lines.push('Konsep desain  : ' + d.konsep);
    if (d.lantai)       lines.push('Jumlah lantai  : ' + d.lantai);
    if (d.anggaran)     lines.push('Anggaran       : ' + d.anggaran);
    if (d.layanan)      lines.push('Layanan        : ' + d.layanan);
    if (d.nama)         lines.push('Nama           : ' + d.nama);
    if (d.lokasi)       lines.push('Lokasi proyek  : ' + d.lokasi);
    if (d.wa)           lines.push('WhatsApp       : ' + d.wa);
    if (d.cerita)       lines.push('Catatan        : ' + d.cerita);
    lines.push('', 'Mohon tindak lanjut konsultasi ini. Terima kasih! 🙏');
    return lines.join('\n');
  }

  function buildSummaryPromo(data) {
    const d = data || {};
    let t = '✅ *Data klaim promo berhasil dicatat!*\n\n';
    t += '━━━━━━━━━━━━━━━━━━━━\n🏷️ *KLAIM PROMO ' + PROMOCODE + '*\n━━━━━━━━━━━━━━━━━━━━\n\n';
    t += '🏷️ Kode promo      : *' + PROMOCODE + '*\n';
    t += '💰 Harga promo     : *Rp 4.499.000* (hemat 44%)\n';
    t += '📐 Maks. luas      : 50 m²\n\n';
    if (d.jenis)           t += '🏠 Jenis bangunan  : ' + d.jenis + '\n';
    if (d.konfirmasi_luas) t += '📏 Luas bangunan   : ' + d.konfirmasi_luas + '\n';
    if (d.status_lahan)    t += '📋 Status lahan    : ' + d.status_lahan + '\n';
    if (d.luas)            t += '📐 Ukuran lahan    : ' + d.luas + '\n';
    if (d.kawasan)         t += '📍 Kawasan         : ' + d.kawasan + '\n';
    if (d.kamar)           t += '🛏️ Kamar tidur     : ' + d.kamar + '\n';
    if (d.ruang_khusus)    t += '🛋️ Ruang khusus   : ' + d.ruang_khusus + '\n';
    if (d.konsep)          t += '🎨 Konsep desain   : ' + d.konsep + '\n';
    if (d.kebutuhan)       t += '📝 Kebutuhan       : ' + d.kebutuhan + '\n';
    if (d.nama)            t += '👤 Nama            : ' + d.nama + '\n';
    if (d.lokasi)          t += '📍 Lokasi proyek   : ' + d.lokasi + '\n';
    if (d.wa)              t += '📲 WhatsApp        : ' + d.wa + '\n';
    t += '\n━━━━━━━━━━━━━━━━━━━━\n📦 *YANG DIDAPATKAN*\n━━━━━━━━━━━━━━━━━━━━\n\n';
    t += '✅ Gambar kerja lengkap (denah, tampak, potongan, detail)\n';
    t += '✅ RAB perkiraan biaya\n';
    t += '✅ Revisi desain maks. 2× sesuai masukan\n\n';
    t += '📲 Klik *"Kirim ke WA"* di bawah untuk konfirmasi klaim promo ke admin kami.\n\nTim kami akan segera menghubungi Anda! 🙏';
    return t;
  }

  function buildWAMsgPromo(data) {
    const d = data || {};
    const lines = [
      '*' + PROMOCODE + '* *' + PROMOCODE + '* *' + PROMOCODE + '*',
      '',
      '🏷️ *KLAIM PROMO TIPE 50 — Fusako Studio*',
      '',
      'Kode promo      : ' + PROMOCODE,
      'Harga promo     : Rp 4.499.000',
    ];
    if (d.jenis)           lines.push('Jenis bangunan  : ' + d.jenis);
    if (d.konfirmasi_luas) lines.push('Luas bangunan   : ' + d.konfirmasi_luas);
    if (d.status_lahan)    lines.push('Status lahan    : ' + d.status_lahan);
    if (d.luas)            lines.push('Ukuran lahan    : ' + d.luas);
    if (d.kawasan)         lines.push('Kawasan         : ' + d.kawasan);
    if (d.kamar)           lines.push('Kamar tidur     : ' + d.kamar);
    if (d.ruang_khusus)    lines.push('Ruang khusus    : ' + d.ruang_khusus);
    if (d.konsep)          lines.push('Konsep desain   : ' + d.konsep);
    if (d.kebutuhan)       lines.push('Kebutuhan       : ' + d.kebutuhan);
    if (d.nama)            lines.push('Nama            : ' + d.nama);
    if (d.lokasi)          lines.push('Lokasi proyek   : ' + d.lokasi);
    if (d.wa)              lines.push('WhatsApp        : ' + d.wa);
    lines.push('', 'Mohon konfirmasi klaim promo ini. Terima kasih! 🙏');
    return lines.join('\n');
  }


  /* ── A7. SYSTEM PROMPTS CLAUDE API ── */
  const waBotSystemPromptConsult =
    `Kamu adalah asisten konsultasi dari Future Sakato Dynamics Studio — studio desain dan perencanaan profesional berbasis di Sijunjung, Sumatera Barat, Indonesia.

Tugasmu KHUSUS dalam sesi ini adalah menjalankan alur konsultasi terstruktur untuk memahami kebutuhan bangunan calon klien, SATU pertanyaan dalam satu waktu, berurutan sesuai alur berikut:

ALUR PERTANYAAN (hunian):
1. Sambut user sesuai waktu (pagi/siang/sore/malam), tanyakan: "Apakah Anda ingin konsultasi desain rumah, renovasi, atau bangunan lainnya?"
2. Luas tanah atau ukuran lahan
3. Jumlah lantai (pilihan: 1 lantai / 2 lantai / 3 lantai atau lebih / Belum menentukan)
4. Kamar tidur yang dibutuhkan
5. Kamar mandi yang dibutuhkan
6. Siapa yang akan menempati (pilihan: Pasangan suami istri / Keluarga kecil / Keluarga besar / Orang tua dan anak / Investasi / Lainnya)
7. Garasi atau carport (pilihan: Tidak ada / 1 mobil / 2 mobil / 3 mobil atau lebih)
8. Ruangan tambahan (contoh: Mushola, Ruang kerja, Ruang laundry, Gudang, Ruang usaha, Balkon, Rooftop)
9. Gaya desain (pilihan: Modern / Minimalis / Tropis / Industrial / Klasik / Scandinavian / Japandi / Belum tahu)
10. Status tanah (Sudah / Belum)
11. Lokasi pembangunan
12. Kondisi lahan (pilihan: Tanah kosong / Ada bangunan lama / Renovasi rumah lama / Kavling perumahan / Hook / pojok / Belum tahu)
13. Kapan rencana pembangunan dimulai (pilihan: Secepatnya / 1-3 bulan / 3-6 bulan / Lebih dari 6 bulan / Masih mencari referensi)
14. Kisaran anggaran (pilihan: Di bawah 300 juta / 300-500 juta / 500 juta-1 miliar / 1-2 miliar / Di atas 2 miliar / Belum menentukan)
15. Kebutuhan khusus (contoh: banyak ventilasi, ramah lansia, banyak taman, hemat biaya)
16. Tampilkan ringkasan lengkap dengan label "Kapasitas kendaraan" untuk garasi, lalu tawarkan paket layanan

Jika user menyebut bangunan NON-HUNIAN (kantor, ruko, cafe, dll.), sesuaikan pertanyaan untuk bangunan komersial.

Aturan:
- SELALU satu pertanyaan per balasan
- Gunakan format teks bersih, cukup emoji pada sapaan awal
- Tampilkan pilihan dengan bullet • bukan emoji angka
- Jika user menjawab di luar topik, arahkan kembali dengan sopan
- Bahasa Indonesia yang sopan, ramah, dan profesional
- Jangan sebut bahwa kamu adalah AI`;

  const waBotSystemPrompt =
    `Kamu adalah asisten virtual dari Future Sakato Dynamics Studio, sebuah studio desain dan perencanaan profesional berbasis di Sijunjung, Sumatera Barat, Indonesia.

Layanan kami meliputi: desain hunian (rumah tinggal), desain perkantoran, perencanaan kawasan industri, desain fasilitas publik, perencanaan sipil & infrastruktur, desain klinik/fasilitas kesehatan, desain hotel & penginapan, desain cafe & restoran.

Nomor WhatsApp tim kami: +62 851-1703-1202
Email: futuresakatodynamics@gmail.com
Lokasi: Sijunjung, Sumatera Barat

Tugasmu:
- Sambut tamu dengan hangat dan profesional
- Jawab pertanyaan umum tentang layanan, harga estimasi, proses, dan portofolio
- Jika pertanyaan sangat spesifik (negosiasi harga detail, pengukuran lapangan, proposal resmi), sarankan untuk melanjutkan ke tim manusia
- Balas dalam Bahasa Indonesia yang sopan dan profesional
- Singkat dan jelas, maksimal 3-4 kalimat per balasan
- Jangan sebut bahwa kamu adalah AI
- Jika sesi ini berasal dari promo (ditandai flag fromPromo=true atau kode PROMOTIPE50), di bagian akhir ringkasan percakapan wajib tampilkan tulisan tebal: *PROMOTIPE50* *PROMOTIPE50* *PROMOTIPE50*`;


  /* ── A8. getConsultReply — dipanggil dari handler luar ── */
  function getConsultReply(userMsg, state) {
    if (state && state.fromPromo) return null;
    if (!state || !state.step) {
      state = { step: 'welcome', data: {}, mode: null, fromPromo: false };
      return { reply: waConsultSteps[0].getReply({}), state };
    }
    const msg = (userMsg || '').toLowerCase().trim();
    if (state.step === 'welcome') {
      const isNon = /kantor|ruko|gedung|komersial|toko|pabrik|gudang|cafe|restoran|hotel|klinik|fasilitas|infrastruktur/i.test(msg);
      state.mode = isNon ? 'non_hunian' : 'hunian';
      state.data['jenis_konsultasi'] = userMsg;
      state.step = 'luas_tanah';
      const steps = state.mode === 'non_hunian' ? waConsultStepsNonHunian : waConsultSteps;
      const nextStep = steps.find(s => s.id === 'luas_tanah');
      return {
        reply:
          '✅ Baik, kami catat!\n\n' +
          (state.mode === 'non_hunian'
            ? 'Kami siap bantu perencanaan bangunan Anda.\nBerikut beberapa pertanyaan singkat:\n\n'
            : 'Kami siap bantu wujudkan hunian impian Anda!\nBerikut beberapa pertanyaan singkat:\n\n') +
          nextStep.getReply(state.data),
        state
      };
    }
    const steps = state.mode === 'non_hunian' ? waConsultStepsNonHunian : waConsultSteps;
    const currentStep = steps.find(s => s.id === state.step);
    if (!currentStep) {
      state.step = 'welcome';
      return { reply: waConsultSteps[0].getReply({}), state };
    }
    if (currentStep.saveKey) state.data[currentStep.saveKey] = userMsg;
    if (currentStep.nextStep === 'summary') {
      state.step = 'done';
      return { reply: buildSummaryBiasa(state.data, state.mode), state };
    }
    const nextStep = steps.find(s => s.id === currentStep.nextStep);
    if (!nextStep) {
      state.step = 'done';
      return { reply: buildSummaryBiasa(state.data, state.mode), state };
    }
    state.step = nextStep.id;
    return { reply: nextStep.getReply(state.data), state };
  }


  /* ──────────────────────────────────────────────────────────────
     B. UI ENGINE
     ────────────────────────────────────────────────────────────── */

  function createEngine(cfg) {
    const sel  = cfg.containerSelector || '#wrap';
    const waNo = cfg.waNumber         || '6282285754080';

    // Resolusi elemen (ditemukan di dalam container atau global)
    const root = document.querySelector(sel) || document;
    const q    = (id) => document.getElementById(id) || root.querySelector('#' + id);

    const ME  = () => q('msgs');
    const OE  = () => q('opts');
    const INP = () => q('inp');
    const SND = () => q('snd');

    /** Format *bold* dan _italic_ */
    function fmt(t) {
      return t
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g,   '<em>$1</em>');
    }

    function addMsg(txt, who, extraClass) {
      const r = document.createElement('div');
      r.className = 'mrow ' + who;
      const b = document.createElement('div');
      b.className = 'bub ' + who + (extraClass ? ' ' + extraClass : '');
      b.innerHTML = fmt(txt) + '<div class="tm">' + getTime() + (who === 'usr' ? ' ✓✓' : '') + '</div>';
      r.appendChild(b);
      const me = ME();
      me.appendChild(r);
      me.scrollTop = me.scrollHeight;
    }

    function showTyp() {
      const me = ME();
      const r  = document.createElement('div');
      r.className = 'mrow bot';
      r.id = 'typ';
      r.innerHTML = '<div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
      me.appendChild(r);
      me.scrollTop = me.scrollHeight;
    }

    function hideTyp() {
      const e = document.getElementById('typ');
      if (e) e.remove();
    }

    function setOpts(arr, sendFn) {
      const oe = OE();
      oe.innerHTML = '';
      (arr || []).forEach(o => {
        const b = document.createElement('button');
        b.className = 'ob' + (o.manual ? ' manual' : '');
        b.textContent = o.label;
        b.onclick = () => sendFn(o.value !== null && o.value !== undefined ? o.value : null);
        oe.appendChild(b);
      });
    }

    async function botSay(txt, opts, sendFn, extraClass) {
      showTyp();
      await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
      hideTyp();
      addMsg(txt, 'bot', extraClass || '');
      if (sendFn) setOpts(opts || [], sendFn);
    }

    function clearChat() {
      ME().innerHTML = '';
      OE().innerHTML = '';
    }

    function openWA(text) {
      window.open('https://wa.me/' + waNo + '?text=' + encodeURIComponent(text), '_blank');
    }

    return { addMsg, showTyp, hideTyp, setOpts, botSay, clearChat, openWA, INP, SND, ME, OE };
  }


  /* ──────────────────────────────────────────────────────────────
     C. CHATBOT BIASA
     ────────────────────────────────────────────────────────────── */

  function initBiasa(cfg) {
    const eng = createEngine(cfg);
    let state = { step: 'welcome', data: {}, mode: null, fromPromo: false, promoCode: '' };

    async function process(userMsg) {
      const inp = eng.INP();
      if (inp) inp.disabled = true;
      eng.setOpts([], send);

      const step = FLOW_BIASA[state.step];
      if (!step) { if (inp) inp.disabled = false; return; }

      if (step.save) state.data[step.save] = userMsg;
      const nextId = step.next(userMsg, state);

      // Deteksi mode saat welcome
      if (state.step === 'welcome') {
        state.mode = /kantor|ruko|toko|villa|interior|renovasi|perencanaan/i.test(userMsg)
          ? 'non_hunian' : 'hunian';
      }

      if (nextId === 'summary') {
        state.step = 'done';
        await eng.botSay(buildSummaryBiasa(state.data, state.mode), [
          { label: '📲 Hubungi Tim Kami via WA', value: '__WA__' },
          { label: '🔄 Mulai konsultasi baru',   value: '__RESET__' },
        ], send);
      } else {
        const nxt = FLOW_BIASA[nextId];
        if (!nxt) { if (inp) inp.disabled = false; return; }
        state.step = nextId;
        await eng.botSay(nxt.msg(), nxt.opts, send);
      }

      if (inp) { inp.disabled = false; inp.focus(); }
    }

    async function send(val) {
      const inp = eng.INP();
      const msg = (val !== null && val !== undefined) ? val : (inp ? inp.value.trim() : '');
      if (!msg) return;
      if (inp) inp.value = '';

      if (msg === '__WA__') {
        eng.openWA(buildWAMsgBiasa(state.data, state.mode, state.fromPromo, state.promoCode));
        return;
      }
      if (msg === '__RESET__') { doReset(); return; }
      eng.addMsg(msg, 'usr');
      await process(msg);
    }

    async function doReset() {
      eng.clearChat();
      state = { step: 'welcome', data: {}, mode: null, fromPromo: false, promoCode: '' };
      const w = FLOW_BIASA.welcome;
      await eng.botSay(w.msg(), w.opts, send);
      state.step = 'welcome';
    }

    /** Mulai dari promo (dipanggil via FusakoChat.startPromoBiasa) */
    async function startPromo(code) {
      eng.clearChat();
      state = { step: 'welcome', data: {}, mode: null, fromPromo: true, promoCode: code };
      const promoMsg = getSapaan() + '! 👋\n\n🏷️ *Kode Promo: ' + code + '* berhasil digunakan!\n\nSelamat datang di *Fusako Studio*. Yuk, mulai konsultasi desain Anda dan dapatkan penawaran spesial.\n\nApa yang ingin Anda konsultasikan?';
      await eng.botSay(promoMsg, FLOW_BIASA.welcome.opts, send, 'promo-tag');
      state.step = 'welcome';
    }

    // Bind input & button
    const sndBtn = eng.SND();
    if (sndBtn) sndBtn.onclick = () => send(null);
    const inpEl = eng.INP();
    if (inpEl) inpEl.addEventListener('keydown', e => { if (e.key === 'Enter') send(null); });

    // Auto-start
    (async () => {
      await new Promise(r => setTimeout(r, 350));
      const w = FLOW_BIASA.welcome;
      await eng.botSay(w.msg(), w.opts, send);
      state.step = 'welcome';
    })();

    return { send, doReset, startPromo };
  }


  /* ──────────────────────────────────────────────────────────────
     D. CHATBOT PROMO
     ────────────────────────────────────────────────────────────── */

  function initPromo(cfg) {
    const eng = createEngine(cfg);
    let state = { step: 'welcome', data: {}, done: false };
    let locked = false;

    async function process(userMsg) {
      locked = true;
      const step = FLOW_PROMO[state.step];
      if (!step) { locked = false; return; }

      if (step.save) state.data[step.save] = userMsg;
      const nextId = step.next(userMsg);

      if (nextId === 'summary') {
        state.step = 'done';
        state.done = true;
        await eng.botSay(buildSummaryPromo(state.data), [], null);
        // Tampilkan wa-bar jika ada
        const waBar = document.getElementById('wa-bar');
        if (waBar) waBar.style.display = 'flex';
      } else if (nextId === 'selesai_tolak') {
        state.step = 'selesai_tolak';
        await eng.botSay(FLOW_PROMO.selesai_tolak.msg(), [], null);
      } else {
        const nxt = FLOW_PROMO[nextId];
        if (!nxt) { locked = false; return; }
        state.step = nextId;
        await eng.botSay(nxt.msg(), nxt.opts, send);
      }

      locked = false;
      const inp = eng.INP();
      if (inp) inp.focus();
    }

    async function send(val) {
      if (locked || state.done) return;
      const inp = eng.INP();
      const msg = (val !== null && val !== undefined) ? val : (inp ? inp.value.trim() : '');
      if (!msg) return;
      if (inp) inp.value = '';
      eng.addMsg(msg, 'usr');
      await process(msg);
    }

    function openWA() {
      eng.openWA(buildWAMsgPromo(state.data));
    }

    /** Dipanggil saat popup promo diklaim */
    async function startChat() {
      state = { step: 'welcome', data: {}, done: false };
      locked = false;
      eng.clearChat();
      const waBar = document.getElementById('wa-bar');
      if (waBar) waBar.style.display = 'none';

      eng.addMsg('Halo, saya ingin klaim Promo Desain Tipe 50 — Rp 4.499.000', 'usr');
      await new Promise(r => setTimeout(r, 400));
      const w = FLOW_PROMO.welcome;
      await eng.botSay(w.msg(), w.opts, send, 'promo-msg');
      state.step = 'welcome';
    }

    // Bind
    const sndBtn = eng.SND();
    if (sndBtn) sndBtn.onclick = () => send(null);
    const inpEl = eng.INP();
    if (inpEl) inpEl.addEventListener('keydown', e => { if (e.key === 'Enter') send(null); });

    return { send, startChat, openWA };
  }


  /* ──────────────────────────────────────────────────────────────
     E. PUBLIC API
     ────────────────────────────────────────────────────────────── */

  /**
   * FusakoChat.init(cfg)
   *   Inisialisasi chatbot biasa.
   *   cfg: { containerSelector, waNumber }
   *   Return: { send, doReset, startPromo }
   */
  function init(cfg) {
    return initBiasa(cfg || {});
  }

  /**
   * FusakoChat.startPromo(code, cfg)
   *   Inisialisasi chatbot biasa TAPI dimulai dengan mode promo.
   *   cfg: { containerSelector, waNumber }
   */
  function startPromo(code, cfg) {
    const bot = initBiasa(Object.assign({ _skipAutoStart: true }, cfg || {}));
    bot.startPromo(code || PROMOCODE);
    return bot;
  }

  /**
   * FusakoChat.initPromoFlow(cfg)
   *   Inisialisasi chatbot flow promo (dari popup klaim).
   *   cfg: { containerSelector, waNumber }
   *   Return: { send, startChat, openWA }
   */
  function initPromoFlow(cfg) {
    return initPromo(cfg || {});
  }

  /* ──────────────────────────────────────────────────────────────
     F. ALIAS GLOBAL — KOMPATIBILITAS DENGAN index.html
        index.html mengakses variabel-variabel ini langsung
        (dipakai di getTemplateReply, getBotReply, fsdGoChat, dll)
        tanpa prefix FusakoChat.xxx
     ────────────────────────────────────────────────────────────── */

  // Yang dipakai langsung di index.html:
  //   waTemplates            → getTemplateReply(msg)
  //   waBotSystemPrompt      → getBotReply() systemPrompt
  //   waBotSystemPromptConsult (opsional, expose saja)
  //   window._startPromo(code) → backward compat dari chatbot_fusako_v2
  global.waTemplates             = waTemplates;
  global.waBotSystemPrompt       = waBotSystemPrompt;
  global.waBotSystemPromptConsult = waBotSystemPromptConsult;
  global.waConsultSteps          = waConsultSteps;
  global.waConsultStepsNonHunian = waConsultStepsNonHunian;
  global.getSapaan               = getSapaan;
  global.getConsultReply         = getConsultReply;

  // Backward compat: window._startPromo(code) dari versi lama
  global._startPromo = function(code) {
    // Jika FusakoChat sudah di-init, panggil startPromo-nya
    // Jika belum, init dulu dengan default selector
    if (global._fusakoChatInstance && global._fusakoChatInstance.startPromo) {
      global._fusakoChatInstance.startPromo(code);
    } else {
      global._fusakoChatInstance = initBiasa({});
      global._fusakoChatInstance.startPromo(code);
    }
  };

  /* Expose ke global */
  global.FusakoChat = {
    init,
    startPromo,
    initPromoFlow,

    /* Data & helpers yang mungkin dipakai dari luar */
    PROMOCODE,
    waTemplates,
    waConsultSteps,
    waConsultStepsNonHunian,
    waBotSystemPrompt,
    waBotSystemPromptConsult,
    getConsultReply,
    buildSummary:    buildSummaryBiasa,
    buildWAMessage:  buildWAMsgBiasa,
    buildSummaryPromo,
    buildWAMsgPromo,
    getSapaan,
  };

})(window);

/* ================================================================
   CONTOH PENGGUNAAN LENGKAP
   ================================================================

   === 1. Chatbot biasa ===

   <div id="wrap">
     <div id="msgs"></div>
     <div id="opts"></div>
     <input id="inp" placeholder="Ketik pesan..." />
     <button id="snd">Kirim</button>
   </div>
   <script src="fusako-chatbot.js"></script>
   <script>
     FusakoChat.init({ containerSelector: '#wrap', waNumber: '6282285754080' });
   </script>


   === 2. Chatbot biasa dipicu dari kode promo ===

   <script>
     FusakoChat.startPromo('PROMOTIPE50', { containerSelector: '#chat-panel' });
   </script>


   === 3. Flow promo lengkap (popup → chat) ===

   <script src="fusako-chatbot.js"></script>
   <script>
     // Setelah popup popup promo diklik "Klaim":
     const promoBot = FusakoChat.initPromoFlow({ containerSelector: '#chat-panel' });

     // Tampilkan chat panel, sembunyikan popup, lalu:
     promoBot.startChat();

     // Tombol "Kirim ke WA" di wa-bar:
     document.getElementById('wa-kirim').onclick = () => promoBot.openWA();
   </script>

================================================================ */