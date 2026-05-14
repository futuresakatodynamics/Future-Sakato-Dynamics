# 🚀 Panduan Deploy Future Sakato Dynamics ke Vercel
## (Dengan Bot WhatsApp — API Key Aman)

---

## 📁 Struktur Folder yang Dibutuhkan

```
future-sakato/
├── index.html        ← file website utama
├── vercel.json       ← konfigurasi Vercel
├── api/
│   └── chat.js       ← proxy backend (API key disimpan di sini, AMAN)
└── images/           ← folder gambar (jika ada)
    └── topo3d.jpg
```

---

## LANGKAH 1 — Siapkan Folder di Komputer

1. Buat folder baru, contoh: `future-sakato`
2. Masukkan file-file berikut ke dalam folder tersebut:
   - `index.html`  (file website yang sudah diupdate)
   - `vercel.json`
   - Buat subfolder `api/`, lalu masukkan `chat.js` di dalamnya
   - Masukkan folder `images/` jika ada

---

## LANGKAH 2 — Daftar / Login Vercel

1. Buka: **https://vercel.com**
2. Klik **Sign Up** → pilih **Continue with GitHub**
3. Jika belum punya akun GitHub, daftar dulu di **https://github.com**
4. Hubungkan akun GitHub ke Vercel

---

## LANGKAH 3 — Upload Project ke GitHub

1. Buka **https://github.com/new**
2. Buat repository baru:
   - Repository name: `future-sakato-dynamics`
   - Pilih **Private** (agar kode tidak publik)
   - Klik **Create repository**

3. Upload file dengan cara:
   - Klik **uploading an existing file**
   - Drag & drop seluruh isi folder `future-sakato/`
   - Klik **Commit changes**

   > ⚠️ Pastikan struktur folder `api/chat.js` dan `vercel.json`
   > ikut ter-upload, bukan hanya `index.html`

---

## LANGKAH 4 — Deploy ke Vercel

1. Buka **https://vercel.com/dashboard**
2. Klik **Add New → Project**
3. Pilih repository `future-sakato-dynamics` → klik **Import**
4. Di halaman konfigurasi:
   - Framework Preset: pilih **Other**
   - Root Directory: biarkan default (`./`)
5. Klik **Deploy**
6. Tunggu sekitar 1-2 menit → website sudah online! ✅

---

## LANGKAH 5 — Tambahkan API Key Anthropic (WAJIB)

Ini langkah terpenting agar bot bisa berjalan.

1. Di dashboard Vercel, klik project `future-sakato-dynamics`
2. Klik tab **Settings**
3. Di menu kiri, klik **Environment Variables**
4. Tambahkan variable baru:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-xxxxxxxxxxxxxxxx` ← isi dengan API key Anda
   - Environment: centang **Production**, **Preview**, **Development**
5. Klik **Save**

6. Setelah disimpan, **redeploy** agar perubahan aktif:
   - Klik tab **Deployments**
   - Klik titik tiga (**⋮**) pada deployment teratas
   - Klik **Redeploy**

---

## LANGKAH 6 — Cara Mendapatkan API Key Anthropic

1. Buka: **https://console.anthropic.com**
2. Daftar atau login
3. Klik **API Keys** di menu kiri
4. Klik **Create Key**
5. Beri nama, contoh: `future-sakato-bot`
6. Copy key-nya (hanya tampil sekali!)
7. Paste ke Environment Variable Vercel (Langkah 5)

> 💡 **Biaya API:** Claude Sonnet sangat terjangkau.
> Estimasi untuk ~1.000 percakapan/bulan: sekitar **$1–3 USD**
> (tergantung panjang chat)

---

## LANGKAH 7 — Custom Domain (Opsional)

Jika ingin pakai domain sendiri, misal `futuresakatodynamics.com`:

1. Di Vercel → Settings → **Domains**
2. Klik **Add Domain**
3. Ketik domain Anda → klik **Add**
4. Ikuti instruksi untuk update DNS di tempat Anda beli domain
   (Niagahoster, Domainesia, GoDaddy, dll)
5. Tunggu propagasi DNS sekitar 5-30 menit

---

## ✅ Checklist Sebelum Go Live

- [ ] Folder `api/chat.js` sudah ada di repository
- [ ] File `vercel.json` sudah ada di root folder
- [ ] `ANTHROPIC_API_KEY` sudah diisi di Environment Variables
- [ ] Sudah redeploy setelah menambah API key
- [ ] Test bot di website — kirim pesan, pastikan bot membalas
- [ ] Test tombol WhatsApp muncul setelah 10x chat

---

## 🔧 Jika Bot Tidak Membalas

Cek di Vercel → tab **Functions** → klik `api/chat` → lihat **Logs**

Kemungkinan penyebab:
- API key belum diisi atau salah → cek Environment Variables
- Belum redeploy setelah tambah API key → lakukan Redeploy
- Saldo Anthropic habis → cek di console.anthropic.com

---

## 📞 Ringkasan Alur Bot

```
Pengunjung chat
      ↓
  Browser (index.html)
      ↓  kirim ke /api/chat
  Vercel Backend (chat.js)
      ↓  pakai API key dari env variable
  Anthropic API (Claude)
      ↓  kirim balik balasan
  Browser tampilkan ke pengunjung
```

API key **tidak pernah muncul** di browser pengunjung. Aman! 🔒
