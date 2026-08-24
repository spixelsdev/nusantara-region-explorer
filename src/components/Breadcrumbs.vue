<script setup lang="ts">
import { useRegionStore } from '../stores/regionStore';
import { ChevronRight, Home } from 'lucide-vue-next';

const store = useRegionStore();
</script>

<template>
  <nav class="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 dark:text-slate-400 overflow-x-auto py-2 border-b border-slate-200 dark:border-slate-800">
    <button 
      @click="store.jumpToLevel('province')"
      class="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 px-1.5 py-1 rounded transition-colors font-medium"
      :class="{ 'text-sky-600 dark:text-sky-400 font-semibold': store.currentLevel === 'province' }"
    >
      <Home class="w-3.5 h-3.5" />
      <span>Indonesia</span>
    </button>

    <template v-if="store.selectedProvince">
      <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <button 
        @click="store.jumpToLevel('regency')"
        class="hover:text-slate-900 dark:hover:text-slate-100 px-1.5 py-1 rounded transition-colors font-medium whitespace-nowrap"
        :class="{ 'text-sky-600 dark:text-sky-400 font-semibold': store.currentLevel === 'regency' }"
      >
        {{ store.selectedProvince.name }}
      </button>
    </template>

    <template v-if="store.selectedRegency">
      <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <button 
        @click="store.jumpToLevel('district')"
        class="hover:text-slate-900 dark:hover:text-slate-100 px-1.5 py-1 rounded transition-colors font-medium whitespace-nowrap"
        :class="{ 'text-sky-600 dark:text-sky-400 font-semibold': store.currentLevel === 'district' }"
      >
        {{ store.selectedRegency.name }}
      </button>
    </template>

    <template v-if="store.selectedDistrict">
      <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <button 
        @click="store.jumpToLevel('village')"
        class="hover:text-slate-900 dark:hover:text-slate-100 px-1.5 py-1 rounded transition-colors font-medium whitespace-nowrap"
        :class="{ 'text-sky-600 dark:text-sky-400 font-semibold': store.currentLevel === 'village' }"
      >
        Kec. {{ store.selectedDistrict.name }}
      </button>
    </template>

    <template v-if="store.selectedVillage">
      <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span class="text-slate-900 dark:text-slate-100 font-semibold px-1.5 py-1 whitespace-nowrap">
        {{ store.selectedVillage.name }}
      </span>
    </template>
  </nav>
</template>
