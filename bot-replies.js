/* =============================================================
   BOT REPLIES — Future Sakato Dynamics Studio
   File ini berisi semua teks balasan chatbot WhatsApp.
   Edit di sini, perubahan langsung berlaku di website.
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   1.  TEMPLATE FALLBACK
       Dipakai jika API Claude tidak tersedia / gagal merespons.
       Setiap item:
         keys  → regex kata kunci pemicu (case-insensitive)
         reply → teks balasan bot (gunakan \n untuk baris baru)

   CATATAN ALUR:
   • Chat LANGSUNG ke bot → gunakan alur konsultasi step-by-step
     (diatur via waConsultSteps di bawah).
     waTemplates di sini hanya sebagai fallback pertanyaan umum
     di LUAR alur konsultasi (harga, proses, dll).
   • Chat dari PROMO / IKLAN / KALKULATOR → flow promo tetap
     berjalan seperti biasa, tidak terpengaruh perubahan ini.
   ───────────────────────────────────────────────────────────── */
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
      '📞 Untuk berdiskusi langsung, silakan klik tombol *"Hubungi Tim Kami"* di bawah — tim kami siap merespons via WhatsApp.\n\n' +
      'Atau ada pertanyaan lain dulu?'
  },

  {
    keys: /lama|waktu|durasi|berapa lama|kapan selesai|deadline/i,
    reply:
      '⏱️ Estimasi waktu pengerjaan:\n\n' +
      '• Desain rumah: *7–14 hari*\n' +
      '• Perkantoran: *14–21 hari*\n' +
      '• Proyek besar: sesuai kompleksitas\n\n' +
      'Ada target waktu tertentu?'
  },

  {
    keys: /revisi|ubah|ganti|tidak suka|kurang|perbaiki/i,
    reply:
      '✏️ Setiap paket sudah termasuk revisi desain hingga Anda puas. Kepuasan klien adalah prioritas kami. 💯\n\n' +
      'Mau tahu lebih lanjut tentang paket layanan kami?'
  },

  {
    keys: /portofolio|contoh|hasil|proyek|karya|galeri/i,
    reply:
      '🖼️ Portofolio kami bisa dilihat di bagian *"Proyek Kami"* di halaman ini.\n\n' +
      'Untuk katalog lengkap dengan detail gambar, tim kami siap mengirimkan setelah konsultasi singkat.'
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
      'Coba ceritakan: luas tanah, jumlah lantai yang diinginkan, dan fungsi bangunannya. Kami siap bantu!'
  }

];  // ← akhir waTemplates


/* ─────────────────────────────────────────────────────────────
   2.  ALUR KONSULTASI STEP-BY-STEP (HUNIAN)
       Digunakan ketika pengguna membuka chat LANGSUNG ke bot.
       Urutan pertanyaan konsultasi rumah/hunian.
   ───────────────────────────────────────────────────────────── */

/** Helper: sapaan sesuai jam */
function getSapaan() {
  const jam = new Date().getHours();
  if (jam >= 5  && jam < 12) return 'Selamat pagi';
  if (jam >= 12 && jam < 15) return 'Selamat siang';
  if (jam >= 15 && jam < 19) return 'Selamat sore';
  return 'Selamat malam';
}

const waConsultSteps = [

  /* STEP 0 — Welcome */
  {
    id: 'welcome',
    getReply: () =>
      `${getSapaan()}! 👋\n\n` +
      'Terima kasih telah menghubungi *Future Sakato Dynamics Studio*.\n\n' +
      'Apakah Anda ingin konsultasi desain rumah, renovasi, atau bangunan lainnya?',
    saveKey: 'jenis_konsultasi',
    nextStep: 'luas_tanah'
  },

  /* STEP 1 — Luas tanah */
  {
    id: 'luas_tanah',
    getReply: () =>
      'Bisa disebutkan *luas tanah atau ukuran lahan*-nya?\n\n' +
      '_Contoh: 8×12, 10×15, 120 m², dll._',
    saveKey: 'luas_tanah',
    nextStep: 'jumlah_lantai'
  },

  /* STEP 2 — Jumlah lantai */
  {
    id: 'jumlah_lantai',
    getReply: () =>
      'Berapa *jumlah lantai* yang direncanakan?\n\n' +
      '• 1 lantai\n' +
      '• 2 lantai\n' +
      '• 3 lantai atau lebih\n' +
      '• Belum menentukan',
    saveKey: 'jumlah_lantai',
    nextStep: 'kamar_tidur'
  },

  /* STEP 3 — Kamar tidur */
  {
    id: 'kamar_tidur',
    getReply: () =>
      'Berapa *kamar tidur* yang dibutuhkan?',
    saveKey: 'kamar_tidur',
    nextStep: 'kamar_mandi'
  },

  /* STEP 4 — Kamar mandi */
  {
    id: 'kamar_mandi',
    getReply: () =>
      'Berapa *kamar mandi* yang dibutuhkan?',
    saveKey: 'kamar_mandi',
    nextStep: 'penghuni'
  },

  /* STEP 5 — Penghuni */
  {
    id: 'penghuni',
    getReply: () =>
      'Siapa yang akan *menempati* rumah tersebut?\n\n' +
      '• Pasangan suami istri\n' +
      '• Keluarga kecil\n' +
      '• Keluarga besar\n' +
      '• Orang tua dan anak\n' +
      '• Investasi / disewakan\n' +
      '• Lainnya',
    saveKey: 'penghuni',
    nextStep: 'garasi'
  },

  /* STEP 6 — Garasi */
  {
    id: 'garasi',
    getReply: () =>
      'Apakah membutuhkan *garasi atau carport*?\n\n' +
      '• Tidak ada\n' +
      '• 1 mobil\n' +
      '• 2 mobil\n' +
      '• 3 mobil atau lebih',
    saveKey: 'garasi',
    nextStep: 'ruangan_tambahan'
  },

  /* STEP 7 — Ruangan tambahan */
  {
    id: 'ruangan_tambahan',
    getReply: () =>
      'Ruangan tambahan apa yang dibutuhkan?\n\n' +
      '_Boleh sebutkan lebih dari satu. Contoh:_\n' +
      '• Mushola\n' +
      '• Ruang kerja / home office\n' +
      '• Ruang tamu\n' +
      '• Ruang laundry\n' +
      '• Gudang\n' +
      '• Ruang usaha\n' +
      '• Balkon\n' +
      '• Rooftop\n' +
      '• Tidak ada',
    saveKey: 'ruangan_tambahan',
    nextStep: 'gaya_desain'
  },

  /* STEP 8 — Gaya desain */
  {
    id: 'gaya_desain',
    getReply: () =>
      'Gaya *desain* yang disukai?\n\n' +
      '• Modern\n' +
      '• Minimalis\n' +
      '• Tropis\n' +
      '• Industrial\n' +
      '• Klasik\n' +
      '• Scandinavian\n' +
      '• Japandi\n' +
      '• Belum tahu',
    saveKey: 'gaya_desain',
    nextStep: 'status_tanah'
  },

  /* STEP 9 — Status tanah */
  {
    id: 'status_tanah',
    getReply: () =>
      'Apakah *sudah memiliki tanah*?\n\n' +
      '• Sudah\n' +
      '• Belum',
    saveKey: 'status_tanah',
    nextStep: 'lokasi'
  },

  /* STEP 10 — Lokasi */
  {
    id: 'lokasi',
    getReply: () =>
      '*Lokasi pembangunan* di daerah mana?\n\n' +
      '_Contoh: Padang, Sijunjung, Jakarta Selatan, Makassar, dll._',
    saveKey: 'lokasi',
    nextStep: 'kondisi_lahan'
  },

  /* STEP 11 — Kondisi lahan */
  {
    id: 'kondisi_lahan',
    getReply: () =>
      'Bagaimana *kondisi lahan* saat ini?\n\n' +
      '• Tanah kosong\n' +
      '• Ada bangunan lama\n' +
      '• Renovasi rumah lama\n' +
      '• Kavling perumahan\n' +
      '• Hook / pojok\n' +
      '• Belum tahu',
    saveKey: 'kondisi_lahan',
    nextStep: 'jadwal'
  },

  /* STEP 12 — Jadwal */
  {
    id: 'jadwal',
    getReply: () =>
      'Kapan *rencana pembangunan* dimulai?\n\n' +
      '• Secepatnya\n' +
      '• 1–3 bulan\n' +
      '• 3–6 bulan\n' +
      '• Lebih dari 6 bulan\n' +
      '• Masih mencari referensi',
    saveKey: 'jadwal',
    nextStep: 'anggaran'
  },

  /* STEP 13 — Anggaran */
  {
    id: 'anggaran',
    getReply: () =>
      'Berapa *kisaran anggaran pembangunan* yang disiapkan?\n\n' +
      '• Di bawah 300 juta\n' +
      '• 300 – 500 juta\n' +
      '• 500 juta – 1 miliar\n' +
      '• 1 – 2 miliar\n' +
      '• Di atas 2 miliar\n' +
      '• Belum menentukan',
    saveKey: 'anggaran',
    nextStep: 'catatan'
  },

  /* STEP 14 — Catatan khusus */
  {
    id: 'catatan',
    getReply: () =>
      'Apakah ada *kebutuhan khusus* yang ingin disampaikan?\n\n' +
      '_Contoh:_\n' +
      '• Banyak ventilasi / rumah terang\n' +
      '• Ramah lansia / ramah anak\n' +
      '• Banyak taman\n' +
      '• Bisa dikembangkan ke 2 lantai\n' +
      '• Hemat biaya\n' +
      '• Tidak ada catatan khusus',
    saveKey: 'catatan',
    nextStep: 'summary'
  }

];  // ← akhir waConsultSteps (hunian)


/* ─────────────────────────────────────────────────────────────
   3.  ALUR KONSULTASI STEP-BY-STEP (NON-HUNIAN)
       Digunakan bila user menyebut kantor, ruko, cafe, dll.
   ───────────────────────────────────────────────────────────── */
const waConsultStepsNonHunian = [

  {
    id: 'luas_tanah',
    getReply: () =>
      'Bisa disebutkan *luas lahan atau bangunan* yang direncanakan?\n\n' +
      '_Contoh: 200 m², 15×30, dll._',
    saveKey: 'luas_tanah',
    nextStep: 'jumlah_lantai'
  },

  {
    id: 'jumlah_lantai',
    getReply: () =>
      'Berapa *jumlah lantai* yang direncanakan?\n\n' +
      '• 1 lantai\n' +
      '• 2–4 lantai\n' +
      '• 5 lantai atau lebih\n' +
      '• Belum menentukan',
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
      'Gaya *desain* yang diinginkan?\n\n' +
      '• Modern\n' +
      '• Minimalis\n' +
      '• Industrial\n' +
      '• Klasik\n' +
      '• Tropis\n' +
      '• Belum tahu',
    saveKey: 'gaya_desain',
    nextStep: 'status_tanah'
  },

  {
    id: 'status_tanah',
    getReply: () =>
      'Apakah *sudah memiliki lahan*?\n\n' +
      '• Sudah\n' +
      '• Belum',
    saveKey: 'status_tanah',
    nextStep: 'lokasi'
  },

  {
    id: 'lokasi',
    getReply: () =>
      '*Lokasi pembangunan* di daerah mana?\n\n' +
      '_Contoh: Padang, Jakarta Utara, Surabaya, dll._',
    saveKey: 'lokasi',
    nextStep: 'kondisi_lahan'
  },

  {
    id: 'kondisi_lahan',
    getReply: () =>
      'Bagaimana *kondisi lahan* saat ini?\n\n' +
      '• Tanah kosong\n' +
      '• Ada bangunan lama\n' +
      '• Renovasi bangunan lama\n' +
      '• Belum tahu',
    saveKey: 'kondisi_lahan',
    nextStep: 'jadwal'
  },

  {
    id: 'jadwal',
    getReply: () =>
      'Kapan *rencana pembangunan* dimulai?\n\n' +
      '• Secepatnya\n' +
      '• 1–3 bulan\n' +
      '• 3–6 bulan\n' +
      '• Lebih dari 6 bulan\n' +
      '• Masih mencari referensi',
    saveKey: 'jadwal',
    nextStep: 'anggaran'
  },

  {
    id: 'anggaran',
    getReply: () =>
      'Berapa *kisaran anggaran pembangunan* yang disiapkan?\n\n' +
      '• Di bawah 500 juta\n' +
      '• 500 juta – 1 miliar\n' +
      '• 1 – 3 miliar\n' +
      '• Di atas 3 miliar\n' +
      '• Belum menentukan',
    saveKey: 'anggaran',
    nextStep: 'catatan'
  },

  {
    id: 'catatan',
    getReply: () =>
      'Apakah ada *kebutuhan khusus* lainnya?\n\n' +
      '_Contoh: hemat energi, parkir luas, representatif untuk klien,\nramah difabel, fasad korporat, dll._\n' +
      'Atau ketik: *Tidak ada*',
    saveKey: 'catatan',
    nextStep: 'summary'
  }

];  // ← akhir waConsultStepsNonHunian


/* ─────────────────────────────────────────────────────────────
   4.  FUNGSI UTAMA KONSULTASI
       Dipanggil oleh chatbot handler di kode utama website.

   Parameter:
     userMsg  → string pesan terakhir user
     state    → objek sesi konsultasi, simpan di window._consultState
                { step, data, mode, fromPromo }

   Return: { reply: string, state: object }
           atau null jika fromPromo = true
   ───────────────────────────────────────────────────────────── */
function getConsultReply(userMsg, state) {
  // Jika dari promo/iklan/kalkulator → skip, handler utama yang menangani
  if (state && state.fromPromo) return null;

  // Inisialisasi state baru
  if (!state || !state.step) {
    state = { step: 'welcome', data: {}, mode: null, fromPromo: false };
    return { reply: waConsultSteps[0].getReply({}), state };
  }

  const msg = (userMsg || '').toLowerCase().trim();

  /* ── Setelah step welcome → deteksi mode hunian/non-hunian ── */
  if (state.step === 'welcome') {
    const isNonHunian = /kantor|ruko|gedung|komersial|toko|pabrik|gudang|cafe|restoran|hotel|klinik|fasilitas|infrastruktur/i.test(msg);
    state.mode = isNonHunian ? 'non_hunian' : 'hunian';
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

  /* ── Proses step yang aktif ──────────────────────────────── */
  const steps = state.mode === 'non_hunian' ? waConsultStepsNonHunian : waConsultSteps;
  const currentStep = steps.find(s => s.id === state.step);

  if (!currentStep) {
    state.step = 'welcome';
    return { reply: waConsultSteps[0].getReply({}), state };
  }

  // Simpan jawaban
  if (currentStep.saveKey) {
    state.data[currentStep.saveKey] = userMsg;
  }

  // Ke ringkasan atau step berikutnya
  if (currentStep.nextStep === 'summary') {
    state.step = 'done';
    return { reply: buildSummary(state.data, state.mode), state };
  }

  const nextStep = steps.find(s => s.id === currentStep.nextStep);
  if (!nextStep) {
    state.step = 'done';
    return { reply: buildSummary(state.data, state.mode), state };
  }

  state.step = nextStep.id;
  return { reply: nextStep.getReply(state.data), state };
}


/* ─────────────────────────────────────────────────────────────
   5.  BUILDER RINGKASAN KONSULTASI
   ───────────────────────────────────────────────────────────── */
function buildSummary(data, mode) {
  const d = data || {};

  /* Penawaran paket (TETAP ADA — tidak dihapus) */
  const penawaranPaket =
    '\n\n━━━━━━━━━━━━━━━━━━━━\n' +
    '📦 *PAKET LAYANAN KAMI*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '🗺️ *Paket Denah Saja*\n' +
    '   Gambar denah lantai + fasad\n' +
    '   _Cocok untuk yang butuh gambar dasar_\n\n' +
    '📐 *Paket Detapo*\n' +
    '   Denah + detail konstruksi + RAB\n' +
    '   _Paling populer untuk bangun rumah_\n\n' +
    '🏗️ *Paket Lengkap*\n' +
    '   Full dokumen teknis + pendampingan\n' +
    '   _Untuk proyek skala menengah–besar_\n\n' +
    '💬 Hubungi tim kami untuk harga & detail paket!';

  if (mode === 'non_hunian') {
    return (
      '✅ Terima kasih! Konsultasi awal Anda telah kami catat.\n\n' +
      '━━━━━━━━━━━━━━━━━━━━\n' +
      '📋 *RINGKASAN KONSULTASI*\n' +
      '━━━━━━━━━━━━━━━━━━━━\n\n' +
      `🏗️ Jenis proyek          : ${d.jenis_konsultasi  || '—'}\n` +
      `📐 Luas lahan            : ${d.luas_tanah        || '—'}\n` +
      `🏢 Jumlah lantai         : ${d.jumlah_lantai     || '—'}\n` +
      `🛋️ Fasilitas utama      : ${d.ruangan_tambahan  || '—'}\n` +
      `🎨 Gaya desain           : ${d.gaya_desain       || '—'}\n` +
      `📋 Status lahan          : ${d.status_tanah      || '—'}\n` +
      `📍 Lokasi                : ${d.lokasi            || '—'}\n` +
      `🏞️ Kondisi lahan        : ${d.kondisi_lahan     || '—'}\n` +
      `📅 Waktu pembangunan     : ${d.jadwal            || '—'}\n` +
      `💰 Anggaran              : ${d.anggaran          || '—'}\n` +
      `📝 Catatan khusus        : ${d.catatan           || '—'}\n` +
      penawaranPaket +
      '\n\n━━━━━━━━━━━━━━━━━━━━\n' +
      '📲 Klik tombol *"Hubungi Tim Kami"* di bawah untuk mengirim ringkasan ini ke WhatsApp admin kami secara otomatis.\n\n' +
      'Tim kami akan segera menghubungi Anda! 🙏'
    );
  }

  /* Default: hunian */
  return (
    '✅ Terima kasih! Data konsultasi Anda telah kami catat.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '📋 *RINGKASAN KONSULTASI*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    `🏠 Jenis konsultasi      : ${d.jenis_konsultasi  || '—'}\n` +
    `📐 Luas tanah            : ${d.luas_tanah        || '—'}\n` +
    `🏗️ Jumlah lantai        : ${d.jumlah_lantai     || '—'}\n` +
    `🛏️ Kamar tidur          : ${d.kamar_tidur       || '—'}\n` +
    `🚿 Kamar mandi           : ${d.kamar_mandi       || '—'}\n` +
    `👨‍👩‍👧 Penghuni             : ${d.penghuni          || '—'}\n` +
    `🚗 Kapasitas kendaraan   : ${d.garasi            || '—'}\n` +
    `🛋️ Ruangan tambahan     : ${d.ruangan_tambahan  || '—'}\n` +
    `🎨 Gaya desain           : ${d.gaya_desain       || '—'}\n` +
    `📋 Status tanah          : ${d.status_tanah      || '—'}\n` +
    `📍 Lokasi                : ${d.lokasi            || '—'}\n` +
    `🏞️ Kondisi lahan        : ${d.kondisi_lahan     || '—'}\n` +
    `📅 Waktu pembangunan     : ${d.jadwal            || '—'}\n` +
    `💰 Anggaran              : ${d.anggaran          || '—'}\n` +
    `📝 Catatan khusus        : ${d.catatan           || '—'}\n` +
    penawaranPaket +
    '\n\n━━━━━━━━━━━━━━━━━━━━\n' +
    '📲 Klik tombol *"Hubungi Tim Kami"* di bawah untuk mengirim ringkasan ini ke WhatsApp admin kami secara otomatis.\n\n' +
    'Tim kami akan segera menghubungi Anda! 🙏'
  );
}


/* ─────────────────────────────────────────────────────────────
   6.  BUILDER PESAN WHATSAPP OTOMATIS
       Dipanggil saat tombol "Hubungi Tim Kami" diklik setelah
       ringkasan konsultasi ditampilkan.
       Return: string siap kirim ke WhatsApp admin.
   ───────────────────────────────────────────────────────────── */
function buildWAMessage(data, mode) {
  const d = data || {};
  const header = mode === 'non_hunian'
    ? '🏢 *KONSULTASI BANGUNAN — Future Sakato Dynamics*'
    : '🏠 *KONSULTASI HUNIAN — Future Sakato Dynamics*';

  const body = mode === 'non_hunian'
    ? [
        `Jenis proyek         : ${d.jenis_konsultasi  || '—'}`,
        `Luas lahan           : ${d.luas_tanah        || '—'}`,
        `Jumlah lantai        : ${d.jumlah_lantai     || '—'}`,
        `Fasilitas utama      : ${d.ruangan_tambahan  || '—'}`,
        `Gaya desain          : ${d.gaya_desain       || '—'}`,
        `Status lahan         : ${d.status_tanah      || '—'}`,
        `Lokasi               : ${d.lokasi            || '—'}`,
        `Kondisi lahan        : ${d.kondisi_lahan     || '—'}`,
        `Waktu pembangunan    : ${d.jadwal            || '—'}`,
        `Anggaran             : ${d.anggaran          || '—'}`,
        `Catatan khusus       : ${d.catatan           || '—'}`
      ].join('\n')
    : [
        `Jenis konsultasi     : ${d.jenis_konsultasi  || '—'}`,
        `Luas tanah           : ${d.luas_tanah        || '—'}`,
        `Jumlah lantai        : ${d.jumlah_lantai     || '—'}`,
        `Kamar tidur          : ${d.kamar_tidur       || '—'}`,
        `Kamar mandi          : ${d.kamar_mandi       || '—'}`,
        `Penghuni             : ${d.penghuni          || '—'}`,
        `Kapasitas kendaraan  : ${d.garasi            || '—'}`,
        `Ruangan tambahan     : ${d.ruangan_tambahan  || '—'}`,
        `Gaya desain          : ${d.gaya_desain       || '—'}`,
        `Status tanah         : ${d.status_tanah      || '—'}`,
        `Lokasi               : ${d.lokasi            || '—'}`,
        `Kondisi lahan        : ${d.kondisi_lahan     || '—'}`,
        `Waktu pembangunan    : ${d.jadwal            || '—'}`,
        `Anggaran             : ${d.anggaran          || '—'}`,
        `Catatan khusus       : ${d.catatan           || '—'}`
      ].join('\n');

  return `${header}\n\n${body}\n\nMohon tindak lanjut konsultasi ini. Terima kasih! 🙏`;
}


/* ─────────────────────────────────────────────────────────────
   7.  SYSTEM PROMPT CLAUDE API — KONSULTASI STEP-BY-STEP
       Aktif ketika user chat langsung (bukan dari promo).
   ───────────────────────────────────────────────────────────── */
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

Jika user menyebut bangunan NON-HUNIAN (kantor, ruko, cafe, dll.), sesuaikan pertanyaan untuk bangunan komersial (hapus kamar tidur/mandi/penghuni, ganti dengan fungsi ruang utama).

Aturan:
- SELALU satu pertanyaan per balasan
- Gunakan format teks bersih tanpa emoji berlebihan, cukup pada sapaan awal
- Tampilkan pilihan dengan bullet • bukan emoji angka
- Jika user menjawab di luar topik, arahkan kembali dengan sopan
- Setelah semua data terkumpul, tampilkan ringkasan lengkap dan tawarkan paket layanan
- Bahasa Indonesia yang sopan, ramah, dan profesional
- Jangan sebut bahwa kamu adalah AI`;


/* ─────────────────────────────────────────────────────────────
   8.  SYSTEM PROMPT CLAUDE API — CHAT UMUM / PROMO
       Dipakai untuk chat umum dan yang bersumber dari
       promo / iklan / kalkulator.
       TIDAK BERUBAH dari versi sebelumnya.
   ───────────────────────────────────────────────────────────── */
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
- Jika sesi ini berasal dari promo (ditandai flag fromPromo=true atau kode PROMOTIPE50),
  maka di bagian akhir ringkasan percakapan wajib tampilkan tulisan tebal:
  *PROMOTIPE50* *PROMOTIPE50* *PROMOTIPE50*`;