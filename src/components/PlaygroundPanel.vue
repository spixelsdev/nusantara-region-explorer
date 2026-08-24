<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRegionStore } from '../stores/regionStore';
import CodeBlock from './CodeBlock.vue';
import { generateCurlSnippet, generateFetchSnippet, generateVueComposableSnippet, downloadJsonFile, downloadCsvFile } from '../utils/codeSnippet';
import { Terminal, Download } from 'lucide-vue-next';

const store = useRegionStore();
const activeTab = ref<'curl' | 'js' | 'vue' | 'raw'>('curl');

const currentApiEndpoint = computed(() => {
  const base = 'https://www.emsifa.com/api-wilayah-indonesia/api';
  switch (store.currentLevel) {
    case 'province': return `${base}/provinces.json`;
    case 'regency': return `${base}/regencies/${store.selectedProvince?.id}.json`;
    case 'district': return `${base}/districts/${store.selectedRegency?.id}.json`;
    case 'village': return `${base}/villages/${store.selectedDistrict?.id}.json`;
    default: return `${base}/provinces.json`;
  }
});

const currentCurlCode = computed(() => {
  const id = store.selectedDistrict?.id || store.selectedRegency?.id || store.selectedProvince?.id;
  return generateCurlSnippet(store.currentLevel, id);
});

const currentJsCode = computed(() => {
  const id = store.selectedDistrict?.id || store.selectedRegency?.id || store.selectedProvince?.id;
  return generateFetchSnippet(store.currentLevel, id);
});

const vueComposableCode = computed(() => generateVueComposableSnippet());

const rawJsonString = computed(() => {
  return JSON.stringify(store.filteredList.slice(0, 10), null, 2) + (store.filteredList.length > 10 ? '\n\n// ... dan ' + (store.filteredList.length - 10) + ' item lainnya' : '');
});

const exportJson = () => {
  const filename = `wilayah_${store.currentLevel}_${Date.now()}.json`;
  downloadJsonFile(filename, store.filteredList);
};

const exportCsv = () => {
  const filename = `wilayah_${store.currentLevel}_${Date.now()}.csv`;
  downloadCsvFile(filename, store.filteredList);
};
</script>

<template>
  <div class="mt-8 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
    <!-- Header Dev Panel -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 gap-3">
      <div class="flex items-center gap-2">
        <Terminal class="w-4 h-4 text-sky-600 dark:text-sky-400" />
        <span class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Developer Tooling & Playground</span>
      </div>

      <!-- Export Buttons -->
      <div class="flex items-center gap-2">
        <button 
          @click="exportJson"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Download class="w-3 h-3 text-sky-500" />
          <span>Export JSON</span>
        </button>
        <button 
          @click="exportCsv"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Download class="w-3 h-3 text-emerald-500" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>

    <!-- Active Endpoint Info Bar -->
    <div class="px-3.5 py-2 bg-slate-100/50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-mono">
      <span class="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-[10px]">GET</span>
      <span class="text-slate-600 dark:text-slate-400 truncate">{{ currentApiEndpoint }}</span>
    </div>

    <!-- Snippet Tabs -->
    <div class="p-3.5 space-y-3">
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button 
          @click="activeTab = 'curl'"
          class="px-2.5 py-1 rounded font-medium transition-colors"
          :class="activeTab === 'curl' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
        >
          cURL
        </button>
        <button 
          @click="activeTab = 'js'"
          class="px-2.5 py-1 rounded font-medium transition-colors"
          :class="activeTab === 'js' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
        >
          Fetch (JS/TS)
        </button>
        <button 
          @click="activeTab = 'vue'"
          class="px-2.5 py-1 rounded font-medium transition-colors"
          :class="activeTab === 'vue' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
        >
          Vue Composable
        </button>
        <button 
          @click="activeTab = 'raw'"
          class="px-2.5 py-1 rounded font-medium transition-colors"
          :class="activeTab === 'raw' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
        >
          Live Preview (JSON)
        </button>
      </div>

      <!-- Tab Contents -->
      <div>
        <CodeBlock v-if="activeTab === 'curl'" :code="currentCurlCode" language="BASH" />
        <CodeBlock v-else-if="activeTab === 'js'" :code="currentJsCode" language="TYPESCRIPT" />
        <CodeBlock v-else-if="activeTab === 'vue'" :code="vueComposableCode" language="TYPESCRIPT" />
        <CodeBlock v-else-if="activeTab === 'raw'" :code="rawJsonString" language="JSON" />
      </div>
    </div>
  </div>
</template>
