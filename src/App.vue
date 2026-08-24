<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRegionStore } from './stores/regionStore';
import Breadcrumbs from './components/Breadcrumbs.vue';
import ExplorerGrid from './components/ExplorerGrid.vue';
import PlaygroundPanel from './components/PlaygroundPanel.vue';
import CommandPalette from './components/CommandPalette.vue';
import AddressSandbox from './components/AddressSandbox.vue';
import SchoolDirectory from './components/SchoolDirectory.vue';
import RegionalBudgetPanel from './components/RegionalBudgetPanel.vue';
import BosCalculatorModal from './components/BosCalculatorModal.vue';
import type { SchoolItem } from './types/school';
import { 
  Sun, 
  Moon, 
  Database, 
  Github, 
  Check, 
  Command, 
  TestTube2,
  MapPin,
  GraduationCap,
  Terminal,
  Search,
  Coins,
  Calculator
} from 'lucide-vue-next';

const store = useRegionStore();
const isDark = ref(false);
const isSandboxOpen = ref(false);
const isBosModalOpen = ref(false);
const selectedSchoolForBos = ref<SchoolItem | null>(null);
const copyFullAddressSuccess = ref(false);

const activeTab = ref<'region' | 'schools' | 'budget' | 'dev'>('region');

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

const openBosCalculator = (school: SchoolItem | null = null) => {
  selectedSchoolForBos.value = school;
  isBosModalOpen.value = true;
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
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white font-sans text-sm antialiased">
    <!-- Navbar Header -->
    <header class="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        <!-- Logo / Title -->
        <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded bg-sky-600 dark:bg-sky-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
            NR
          </div>
          <div class="min-w-0">
            <h1 class="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
              Nusantara Data Portal
            </h1>
            <p class="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
              Wilayah • Sekolah & BOS • Postur APBD
            </p>
          </div>
        </div>

        <!-- Action Links -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <!-- Sandbox Button -->
          <button 
            @click="isSandboxOpen = true"
            class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-semibold transition-colors"
            title="Buka Live Form Sandbox & RT/RW Formatter"
          >
            <TestTube2 class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Sandbox</span>
          </button>

          <!-- Command Palette Trigger Button -->
          <button 
            @click="store.isCommandPaletteOpen = true"
            class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs transition-colors"
            title="Cari Wilayah Global (Ctrl+K)"
          >
            <Search class="w-3.5 h-3.5 sm:hidden" />
            <Command class="w-3.5 h-3.5 hidden sm:inline" />
            <span class="hidden md:inline text-[11px]">Cari</span>
            <kbd class="hidden md:inline px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[9px]">Ctrl+K</kbd>
          </button>

          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme" 
            class="p-2 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Ganti Tema"
          >
            <Sun v-if="isDark" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <Moon v-else class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
          </button>

          <!-- GitHub Source Link -->
          <a 
            href="https://github.com/spixelsdev/nusantara-region-explorer" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            title="Source Code GitHub"
          >
            <Github class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1 w-full space-y-4 sm:space-y-6">
      <!-- Info Hero Banner -->
      <section class="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-3.5 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5 max-w-2xl">
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              <Database class="w-3 h-3 shrink-0" />
              <span>38 Prov, 514 Kab, 7.2k Kec, 83k Kel</span>
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <GraduationCap class="w-3 h-3 shrink-0" />
              <span>215k+ Sekolah & Dana BOS</span>
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Coins class="w-3 h-3 shrink-0" />
              <span>Postur APBD & Fiskal</span>
            </span>
          </div>

          <h2 class="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            Portal Data Wilayah, Pendidikan & Keuangan Daerah Indonesia
          </h2>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Eksplorasi terpadu hierarki administratif wilayah, direktori sekolah nasional, kalkulator alokasi dana BOS (BOSP), dan postur anggaran daerah (APBD/TKD/Dana Desa).
          </p>

          <!-- Quick Actions -->
          <div class="flex flex-wrap items-center gap-3 pt-0.5">
            <button 
              @click="isSandboxOpen = true" 
              class="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <TestTube2 class="w-3.5 h-3.5" />
              <span>Address Sandbox (RT/RW)</span>
            </button>
            <span class="text-slate-300 dark:text-slate-700">•</span>
            <button 
              @click="openBosCalculator(null)" 
              class="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Calculator class="w-3.5 h-3.5" />
              <span>Kalkulator Dana BOS &rarr;</span>
            </button>
          </div>
        </div>

        <!-- Selected Result Highlight -->
        <div v-if="store.fullAddress" class="shrink-0 p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 w-full md:max-w-xs">
          <div class="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
            <span>Wilayah Terpilih</span>
            <button @click="copyAddress" class="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
              <Check v-if="copyFullAddressSuccess" class="w-3 h-3 text-emerald-500" />
              <span>{{ copyFullAddressSuccess ? 'Tersalin' : 'Salin' }}</span>
            </button>
          </div>
          <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 break-words leading-tight">
            {{ store.fullAddress }}
          </div>
        </div>
      </section>

      <!-- Main Navigation Tabs (Touch Friendly & Scrollable) -->
      <div class="flex items-center gap-1 sm:gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <button 
          @click="activeTab = 'region'"
          class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 whitespace-nowrap"
          :class="activeTab === 'region' ? 'border-sky-600 dark:border-sky-400 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30 rounded-t' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          <MapPin class="w-3.5 h-3.5" />
          <span>Hirarki Wilayah</span>
        </button>

        <button 
          @click="activeTab = 'schools'"
          class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 whitespace-nowrap"
          :class="activeTab === 'schools' ? 'border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 rounded-t' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          <GraduationCap class="w-3.5 h-3.5" />
          <span>Direktori Sekolah & BOS</span>
          <span class="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-mono">215k</span>
        </button>

        <button 
          @click="activeTab = 'budget'"
          class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 whitespace-nowrap"
          :class="activeTab === 'budget' ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-t' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          <Coins class="w-3.5 h-3.5" />
          <span>Postur APBD & Fiskal</span>
        </button>

        <button 
          @click="activeTab = 'dev'"
          class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border-b-2 transition-colors shrink-0 whitespace-nowrap"
          :class="activeTab === 'dev' ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-t' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          <Terminal class="w-3.5 h-3.5" />
          <span>Dev Tools & Code Gen</span>
        </button>
      </div>

      <!-- Tab 1: Region Explorer -->
      <div v-show="activeTab === 'region'" class="space-y-4 sm:space-y-6">
        <Breadcrumbs />
        <ExplorerGrid />
      </div>

      <!-- Tab 2: Schools Directory & NPSN Lookup -->
      <div v-show="activeTab === 'schools'">
        <SchoolDirectory @calculate-bos="openBosCalculator" />
      </div>

      <!-- Tab 3: Regional APBD & Fiscal Posture -->
      <div v-show="activeTab === 'budget'">
        <RegionalBudgetPanel @open-bos-calc="openBosCalculator(null)" />
      </div>

      <!-- Tab 4: Developer & API Playground Panel -->
      <div v-show="activeTab === 'dev' || activeTab === 'region'">
        <PlaygroundPanel />
      </div>
    </main>

    <!-- Command Palette (Ctrl + K) -->
    <CommandPalette />

    <!-- Address & RT/RW Sandbox Modal -->
    <AddressSandbox :is-open="isSandboxOpen" @close="isSandboxOpen = false" />

    <!-- Dana BOS Calculator Modal -->
    <BosCalculatorModal 
      :is-open="isBosModalOpen" 
      :target-school="selectedSchoolForBos" 
      @close="isBosModalOpen = false" 
    />

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-center sm:text-left">
          Open Source Portal • Data: <strong>Kemendagri</strong>, <strong>Kemendikbud</strong>, <strong>DJPK Kemenkeu</strong>
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 text-xs">
          <a href="https://www.emsifa.com/api-wilayah-indonesia/" target="_blank" rel="noopener noreferrer" class="hover:text-sky-600 dark:hover:text-sky-400 underline">
            API Wilayah
          </a>
          <span>•</span>
          <a href="https://github.com/wanrabbae/api-sekolah-indonesia" target="_blank" rel="noopener noreferrer" class="hover:text-amber-600 dark:hover:text-amber-400 underline">
            API Sekolah
          </a>
          <span>•</span>
          <a href="https://djpk.kemenkeu.go.id/" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-600 dark:hover:text-emerald-400 underline">
            DJPK Kemenkeu
          </a>
          <span>•</span>
          <a href="https://github.com/spixelsdev/nusantara-region-explorer" target="_blank" rel="noopener noreferrer" class="hover:text-sky-600 dark:hover:text-sky-400 underline">
            GitHub Repo
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
