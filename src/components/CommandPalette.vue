<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRegionStore } from '../stores/regionStore';
import { Search, X, MapPin, Loader2, CornerDownLeft } from 'lucide-vue-next';
import type { GlobalSearchResult } from '../types/region';
import { regionApi } from '../services/api';

const store = useRegionStore();
const inputRef = ref<HTMLInputElement | null>(null);
const searchResults = ref<GlobalSearchResult[]>([]);
const isSearching = ref(false);
let searchTimeout: any = null;

// Search across provinces and regencies
const performSearch = async (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  const results: GlobalSearchResult[] = [];

  // Match in provinces
  store.provinces.forEach(p => {
    if (p.name.toLowerCase().includes(q)) {
      results.push({
        id: p.id,
        name: p.name,
        level: 'province'
      });
    }
  });

  // Also search in regencies of cached / selected provinces
  try {
    // If user query is 2+ chars, check regencies of active provinces
    for (const prov of store.provinces.slice(0, 15)) {
      if (results.length >= 20) break;
      try {
        const regs = await regionApi.getRegencies(prov.id);
        regs.forEach(r => {
          if (r.name.toLowerCase().includes(q) && results.length < 20) {
            results.push({
              id: r.id,
              name: r.name,
              level: 'regency',
              parentName: prov.name,
              provinceId: prov.id
            });
          }
        });
      } catch (e) {}
    }
  } catch (e) {}

  searchResults.value = results;
  isSearching.value = false;
};

watch(() => store.globalSearchQuery, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(newVal);
  }, 250);
});

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    store.isCommandPaletteOpen = !store.isCommandPaletteOpen;
    if (store.isCommandPaletteOpen) {
      setTimeout(() => inputRef.value?.focus(), 50);
    }
  } else if (e.key === 'Escape' && store.isCommandPaletteOpen) {
    store.isCommandPaletteOpen = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const handleSelectResult = (item: GlobalSearchResult) => {
  store.jumpToResult(item);
};
</script>

<template>
  <div 
    v-if="store.isCommandPaletteOpen" 
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-xs"
    @click.self="store.isCommandPaletteOpen = false"
  >
    <div class="w-full max-w-xl bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 font-sans">
      <!-- Input bar -->
      <div class="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <Search class="w-4 h-4 text-slate-400 shrink-0" />
        <input 
          ref="inputRef"
          v-model="store.globalSearchQuery"
          type="text"
          placeholder="Cari provinsi atau kabupaten/kota (mis: Bandung, Bali)..."
          class="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />
        <Loader2 v-if="isSearching" class="w-4 h-4 animate-spin text-sky-500 shrink-0" />
        <button 
          @click="store.isCommandPaletteOpen = false" 
          class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Results List -->
      <div class="max-h-80 overflow-y-auto p-2">
        <div v-if="!store.globalSearchQuery.trim()" class="px-3 py-6 text-center text-xs text-slate-400">
          Ketik nama wilayah untuk navigasi cepat. Tekan <kbd class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">ESC</kbd> untuk menutup.
        </div>

        <div v-else-if="!isSearching && searchResults.length === 0" class="px-3 py-6 text-center text-xs text-slate-400">
          Tidak ditemukan wilayah dengan nama "{{ store.globalSearchQuery }}".
        </div>

        <div v-else class="space-y-1">
          <button 
            v-for="res in searchResults" 
            :key="res.id + res.level"
            @click="handleSelectResult(res)"
            class="w-full flex items-center justify-between px-3 py-2 text-left rounded hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
          >
            <div class="flex items-center gap-2.5 truncate">
              <MapPin class="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <div class="truncate">
                <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                  {{ res.name }}
                </span>
                <span v-if="res.parentName" class="text-[11px] text-slate-400 ml-1.5">
                  ({{ res.parentName }})
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {{ res.level === 'province' ? 'Provinsi' : 'Kab/Kota' }}
              </span>
              <CornerDownLeft class="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100" />
            </div>
          </button>
        </div>
      </div>

      <!-- Footer Guide -->
      <div class="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Navigasi Instan</span>
        <div class="flex items-center gap-2">
          <span>Tutup: <kbd class="font-mono">ESC</kbd></span>
        </div>
      </div>
    </div>
  </div>
</template>
