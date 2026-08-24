<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRegionStore } from './stores/regionStore';
import Breadcrumbs from './components/Breadcrumbs.vue';
import ExplorerGrid from './components/ExplorerGrid.vue';
import PlaygroundPanel from './components/PlaygroundPanel.vue';
import CommandPalette from './components/CommandPalette.vue';
import AddressSandbox from './components/AddressSandbox.vue';
import { 
  Sun, 
  Moon, 
  Database, 
  Github, 
  Check, 
  Command, 
  TestTube2 
} from 'lucide-vue-next';

const store = useRegionStore();
const isDark = ref(false);
const isSandboxOpen = ref(false);
const copyFullAddressSuccess = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

const copyAddress = async () => {
  if (!store.fullAddress) return;
  await navigator.clipboard.writeText(store.fullAddress);
  copyFullAddressSuccess.value = true;
  setTimeout(() => {
    copyFullAddressSuccess.value = false;
  }, 2000);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }

  store.loadProvinces();
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white font-sans">
    <!-- Navbar Header (Clean Flat Style) -->
    <header class="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <!-- Logo / Title -->
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded bg-sky-600 dark:bg-sky-500 text-white flex items-center justify-center font-bold text-sm">
            NR
          </div>
          <div>
            <h1 class="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Nusantara Region Explorer
            </h1>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Open Data Wilayah Indonesia API & DevPortal
            </p>
          </div>
        </div>

        <!-- Action Links -->
        <div class="flex items-center gap-2">
          <!-- Sandbox Button -->
          <button 
            @click="isSandboxOpen = true"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-semibold transition-colors"
            title="Buka Live Form Sandbox & RT/RW Formatter"
          >
            <TestTube2 class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Address Sandbox</span>
          </button>

          <!-- Command Palette Trigger Button -->
          <button 
            @click="store.isCommandPaletteOpen = true"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs transition-colors"
            title="Cari Wilayah Global (Ctrl+K)"
          >
            <Command class="w-3.5 h-3.5" />
            <span class="hidden md:inline text-[11px]">Quick Search</span>
            <kbd class="hidden md:inline px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[9px]">Ctrl+K</kbd>
          </button>

          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme" 
            class="p-2 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Ganti Tema"
          >
            <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-slate-600" />
          </button>

          <!-- GitHub Source Link -->
          <a 
            href="https://github.com/spixelsdev/nusantara-region-explorer" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Github class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="max-w-6xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
      <!-- Info Hero Banner -->
      <section class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
            <Database class="w-3 h-3" />
            <span>Dataset EMSIFA Public API (38 Provinsi, 514 Kab/Kota, 7.200+ Kec, 83.000+ Kel)</span>
          </div>
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Eksplorasi Hirarki & Generator API Wilayah Indonesia
          </h2>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Telusuri struktur administratif Indonesia hingga tingkat Kelurahan/Desa. Dilengkapi fitur export data (JSON, CSV, SQL Dump), generator form cascading (Vue, React, HTML), serta <strong>Address Sandbox</strong> untuk simulasi format RT/RW label kurir ekspedisi.
          </p>

          <!-- Quick Actions & Stats -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <button 
              @click="isSandboxOpen = true" 
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <TestTube2 class="w-3.5 h-3.5" />
              <span>Coba Live Address & RT/RW Simulator &rarr;</span>
            </button>
          </div>
        </div>

        <!-- Selected Result Highlight -->
        <div v-if="store.fullAddress" class="shrink-0 p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 max-w-sm w-full">
          <div class="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
            <span>Wilayah Terpilih</span>
            <button @click="copyAddress" class="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
              <Check v-if="copyFullAddressSuccess" class="w-3 h-3 text-emerald-500" />
              <span>{{ copyFullAddressSuccess ? 'Tersalin' : 'Salin Alamat' }}</span>
            </button>
          </div>
          <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 break-words leading-tight">
            {{ store.fullAddress }}
          </div>
        </div>
      </section>

      <!-- Cascading Breadcrumbs Navigation -->
      <Breadcrumbs />

      <!-- Region Items Grid Explorer -->
      <ExplorerGrid />

      <!-- Developer & API Playground Panel -->
      <PlaygroundPanel />
    </main>

    <!-- Command Palette (Ctrl + K) -->
    <CommandPalette />

    <!-- Address & RT/RW Sandbox Modal -->
    <AddressSandbox :is-open="isSandboxOpen" @close="isSandboxOpen = false" />

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-12">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          Open Source Project • Powered by <strong>EMSIFA Wilayah Indonesia API</strong>
        </p>
        <div class="flex items-center gap-4 text-xs">
          <a href="https://www.emsifa.com/api-wilayah-indonesia/" target="_blank" rel="noopener noreferrer" class="hover:text-sky-600 dark:hover:text-sky-400 underline">
            Dokumentasi Sumber API
          </a>
          <span>•</span>
          <a href="https://github.com/spixelsdev/nusantara-region-explorer" target="_blank" rel="noopener noreferrer" class="hover:text-sky-600 dark:hover:text-sky-400 underline">
            Repository GitHub
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
