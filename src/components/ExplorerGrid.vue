<script setup lang="ts">
import { useRegionStore } from '../stores/regionStore';
import { Search, MapPin, Loader2, ArrowRight, CheckCircle2, Command } from 'lucide-vue-next';

const store = useRegionStore();

const handleSelect = (item: any) => {
  if (store.currentLevel === 'province') {
    store.selectProvince(item);
  } else if (store.currentLevel === 'regency') {
    store.selectRegency(item);
  } else if (store.currentLevel === 'district') {
    store.selectDistrict(item);
  } else if (store.currentLevel === 'village') {
    store.selectVillage(item);
  }
};

const getLevelTitle = () => {
  switch (store.currentLevel) {
    case 'province': return 'Pilih Provinsi';
    case 'regency': return `Kabupaten / Kota di ${store.selectedProvince?.name}`;
    case 'district': return `Kecamatan di ${store.selectedRegency?.name}`;
    case 'village': return `Kelurahan / Desa di Kec. ${store.selectedDistrict?.name}`;
  }
};
</script>

<template>
  <div class="space-y-3 sm:space-y-4">
    <!-- Header & Search Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-1">
      <div class="min-w-0">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 truncate">
          <MapPin class="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span class="truncate">{{ getLevelTitle() }}</span>
        </h2>
        <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Menampilkan {{ store.filteredList.length }} data wilayah
        </p>
      </div>

      <!-- Quick Filter & Command Palette trigger -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="store.searchQuery"
            type="text" 
            placeholder="Filter list ini..." 
            class="w-full pl-8 sm:pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <button 
          @click="store.isCommandPaletteOpen = true"
          class="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400 transition-colors shrink-0"
          title="Cari seluruh wilayah Indonesia (Ctrl+K)"
        >
          <Command class="w-3.5 h-3.5" />
          <span class="font-mono text-[10px]">Ctrl+K</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="flex flex-col items-center justify-center py-12 sm:py-16 text-slate-400 gap-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-md">
      <Loader2 class="w-6 h-6 animate-spin text-sky-600 dark:text-sky-400" />
      <span class="text-xs">Mengambil data dari endpoint...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="p-3 sm:p-4 border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-md text-xs">
      {{ store.error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="store.filteredList.length === 0" class="py-10 sm:py-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800 rounded-md text-xs px-4">
      Tidak ada data wilayah yang cocok dengan pencarian "{{ store.searchQuery }}".
    </div>

    <!-- Grid List (Responsive 1-col on mobile, 2-col on tablet, 3-4 col on desktop) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-2.5">
      <button 
        v-for="item in store.filteredList" 
        :key="item.id"
        @click="handleSelect(item)"
        class="flex items-center justify-between p-2.5 sm:p-3 rounded border text-left transition-all duration-150 group relative active:scale-[0.99] touch-manipulation"
        :class="[
          store.currentLevel === 'village' && store.selectedVillage?.id === item.id
            ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200'
        ]"
      >
        <div class="space-y-0.5 truncate pr-2">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold truncate group-hover:text-sky-600 dark:group-hover:text-sky-400">
              {{ item.name }}
            </span>
            <span v-if="store.currentLevel === 'province' && (item as any).isDOB" class="shrink-0 px-1 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              DOB
            </span>
          </div>
          <div class="text-[10px] font-mono text-slate-400">
            KODE: {{ item.id }}
          </div>
        </div>

        <div class="shrink-0 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 pl-1">
          <CheckCircle2 v-if="store.currentLevel === 'village' && store.selectedVillage?.id === item.id" class="w-4 h-4 text-sky-500" />
          <ArrowRight v-else class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>
    </div>
  </div>
</template>
