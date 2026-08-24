<script setup lang="ts">
import { useRegionStore } from '../stores/regionStore';
import { ChevronRight, Home } from 'lucide-vue-next';

const store = useRegionStore();
</script>

<template>
  <nav class="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto py-2.5 border-b border-slate-200 dark:border-slate-800 no-scrollbar select-none">
    <button 
      @click="store.jumpToLevel('province')"
      class="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 px-2 py-1 rounded transition-colors font-medium shrink-0"
      :class="{ 'text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/60': store.currentLevel === 'province' }"
    >
      <Home class="w-3.5 h-3.5" />
      <span>Indonesia</span>
    </button>

    <template v-if="store.selectedProvince">
      <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0 mx-0.5" />
      <button 
        @click="store.jumpToLevel('regency')"
        class="hover:text-slate-900 dark:hover:text-slate-100 px-2 py-1 rounded transition-colors font-medium whitespace-nowrap shrink-0"
        :class="{ 'text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/60': store.currentLevel === 'regency' }"
      >
        {{ store.selectedProvince.name }}
      </button>
    </template>

    <template v-if="store.selectedRegency">
      <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0 mx-0.5" />
      <button 
        @click="store.jumpToLevel('district')"
        class="hover:text-slate-900 dark:hover:text-slate-100 px-2 py-1 rounded transition-colors font-medium whitespace-nowrap shrink-0"
        :class="{ 'text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/60': store.currentLevel === 'district' }"
      >
        {{ store.selectedRegency.name }}
      </button>
    </template>

    <template v-if="store.selectedDistrict">
      <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0 mx-0.5" />
      <button 
        @click="store.jumpToLevel('village')"
        class="hover:text-slate-900 dark:hover:text-slate-100 px-2 py-1 rounded transition-colors font-medium whitespace-nowrap shrink-0"
        :class="{ 'text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/60': store.currentLevel === 'village' }"
      >
        Kec. {{ store.selectedDistrict.name }}
      </button>
    </template>

    <template v-if="store.selectedVillage">
      <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0 mx-0.5" />
      <span class="text-slate-900 dark:text-slate-100 font-semibold px-2 py-1 rounded bg-slate-200/60 dark:bg-slate-800 whitespace-nowrap shrink-0">
        {{ store.selectedVillage.name }}
      </span>
    </template>
  </nav>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
