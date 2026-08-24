# 🇮🇩 Nusantara Data & Region Explorer

> Portal Interaktif, Visualizer, dan Developer Playground untuk **Open Data Wilayah, Direktori Sekolah, Estimator BOS, & Postur APBD Indonesia**.

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Security Policy](https://img.shields.io/badge/Security-Policy-blue.svg)](SECURITY.md)
[![Terms of Use](https://img.shields.io/badge/Terms-Disclaimer-orange.svg)](TERMS.md)

---

## ✨ Fitur Utama

- 🗺️ **Cascading Region Explorer:** Navigasi 4-tingkat wilayah administratif (38 Provinsi $\to$ 514 Kab/Kota $\to$ 7.200+ Kecamatan $\to$ 83.000+ Kelurahan/Desa).
- 🎓 **Direktori 215.000+ Sekolah & NPSN:** Pencarian instan sekolah (SD/SMP/SMA/SMK/SLB) sinkron dengan wilayah aktif, filter status Negeri/Swasta, dan link Google Maps koordinat GPS.
- 🧮 **Kalkulator & Estimator Dana BOS (BOSP):** Simulasi pagu BOS otomatis menggunakan formula Standar Satuan Biaya Majemuk Kemendikbudristek, multiplier IKK daerah, dan preset kapasitas rombel Dapodik.
- 🪙 **Postur APBD & Keuangan Daerah:** Visualisasi rasio PAD vs Transfer Pusat (TKD: DAU/DAK/DBH) dan rincian belanja daerah serta Dana Desa.
- 🧪 **Live Address Sandbox (RT/RW Formatter):** Simulator label pengiriman ekspedisi standar kurir (JNE/J&T/Shopee) dan generator JSON payload.
- 💻 **Developer Playground:** Code snippet generator (cURL, Fetch JS/TS, Vue 3, React, HTML Vanilla), SQL DUMP generator, dan Prisma ORM Seeder.
- 🌓 **Flat Minimalist UI & Responsive Mobile:** Tampilan bebas ornamen AI generik, mendukung mode Terang (*Paper*) dan Gelap (*Dusk*).

---

## 🛡️ Kebijakan Hukum & Keamanan

Untuk melindungi proyek ini dari penyalahgunaan pihak-pihak tidak bertanggung jawab, harap baca dokumen ketentuan berikut:
- **[TERMS.md](TERMS.md)** — Ketentuan Penggunaan, Penafian Hukum (*Non-Government Affiliation*), dan Kepatuhan UU PDP No. 27/2022.
- **[SECURITY.md](SECURITY.md)** — Kebijakan pelaporan celah keamanan dan pencegahan eksploitasi.

---

## 🛠️ Tech Stack

- **Framework:** Vue 3 (Composition API + TypeScript)
- **State Management:** Pinia
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide Icons (`lucide-vue-next`)
- **Data Source:**
  - Data Wilayah: [EMSIFA API Wilayah Indonesia](https://www.emsifa.com/api-wilayah-indonesia/)
  - Data Sekolah: [API Sekolah Indonesia](https://github.com/wanrabbae/api-sekolah-indonesia)
  - Data Keuangan: Agregasi Regulasi DJPK Kemenkeu & Kemendikbudristek

---

## 🚀 Memulai (Development)

```bash
# Clone repository
git clone https://github.com/spixelsdev/nusantara-region-explorer.git
cd nusantara-region-explorer

# Install dependencies (Bun / npm)
bun install

# Jalankan development server
bun dev
```

---

## 📄 Lisensi
Didistribusikan di bawah lisensi terbuka **[MIT License](LICENSE)**.  
Copyright (c) 2026 SpixelsDev.
