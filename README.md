# 🇮🇩 Nusantara Region Explorer

> Portal Interaktif, Visualizer, dan Developer Playground untuk **Open Data Wilayah Indonesia API** (Provinsi, Kabupaten/Kota, Kecamatan, dan Kelurahan/Desa).

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Fitur Utama

- 🗺️ **Cascading Visual Explorer:** Navigasi cepat dari tingkat Provinsi $\to$ Kabupaten/Kota $\to$ Kecamatan $\to$ Kelurahan/Desa.
- ⚡ **Instant Search & Filter:** Filter instan dengan kecepatan rendering tinggi.
- 💻 **Developer Playground:**
  - Live Endpoint Inspector (Method & URL).
  - Code Snippet Generator otomatis (cURL, JavaScript/TypeScript `fetch`, dan Vue 3 Composable).
  - Raw JSON Response Viewer dengan tombol salin.
- 📥 **Export Tooling:** Unduh data wilayah terpilih dalam format **JSON** dan **CSV**.
- 🌓 **Flat Minimalist UI / Clean UX:** Desain datar, responsif, tanpa elemen AI generik yang berat, mendukung mode Terang (*Paper*) & Gelap (*Dusk*).
- 🚀 **Client-side Caching Layer:** Caching pintar via in-memory & `localStorage` untuk meminimalkan beban network.

---

## 🛠️ Tech Stack

- **Framework:** Vue 3 (Composition API + TypeScript)
- **State Management:** Pinia
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide Icons (`lucide-vue-next`)
- **Data Source:** [EMSIFA API Wilayah Indonesia](https://emsifa.github.io/api-wilayah-indonesia/)

---

## 🚀 Memulai (Development)

### Prasyarat
- [Bun](https://bun.sh) atau [Node.js](https://nodejs.org) (v18+)

### Instalasi

```bash
# Clone repository
git clone https://github.com/spixelsdev/nusantara-region-explorer.git
cd nusantara-region-explorer

# Install dependencies (menggunakan Bun atau npm)
bun install
# atau: npm install

# Jalankan local development server
bun dev
# atau: npm run dev
```

Buka browser di `http://localhost:5173`.

### Build untuk Produksi

```bash
bun run build
# atau: npm run build
```

Hasil build statis siap deploy ada di folder `dist/`.

---

## 📄 Lisensi
Didistribusikan di bawah lisensi [MIT](LICENSE).
Data wilayah bersumber dari proyek terbuka [EMSIFA](https://github.com/emsifa/api-wilayah-indonesia).
