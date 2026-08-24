<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRegionStore } from '../stores/regionStore';
import CodeBlock from './CodeBlock.vue';
import { 
  generateCurlSnippet, 
  generateFetchSnippet, 
  generateVueComposableSnippet, 
  downloadJsonFile, 
  downloadCsvFile 
} from '../utils/codeSnippet';
import {
  generateSqlInsert,
  generatePrismaSeedSnippet,
  generateReactComponentSnippet,
  generateVueComponentSnippet,
  generateVanillaHtmlSnippet,
  downloadSqlFile
} from '../utils/generators';
import { 
  Terminal, 
  Download, 
  Share2, 
  Check, 
  Database, 
  Code2, 
  FileCode2 
} from 'lucide-vue-next';

const store = useRegionStore();
const activeSection = ref<'api' | 'components' | 'db'>('api');
const activeTab = ref<string>('curl');
const copiedShare = ref(false);

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

const currentSqlCode = computed(() => {
  const table = store.currentLevel === 'province' 
    ? 'provinces' 
    : store.currentLevel === 'regency' 
    ? 'regencies' 
    : store.currentLevel === 'district' 
    ? 'districts' 
    : 'villages';
  return generateSqlInsert(table, store.filteredList);
});

const currentPrismaCode = computed(() => {
  const table = store.currentLevel === 'province' 
    ? 'provinces' 
    : store.currentLevel === 'regency' 
    ? 'regencies' 
    : store.currentLevel === 'district' 
    ? 'districts' 
    : 'villages';
  return generatePrismaSeedSnippet(table, store.filteredList);
});

const reactComponentCode = computed(() => generateReactComponentSnippet());
const vueComponentCode = computed(() => generateVueComponentSnippet());
const vanillaHtmlCode = computed(() => generateVanillaHtmlSnippet());

const rawJsonString = computed(() => {
  return JSON.stringify(store.filteredList.slice(0, 10), null, 2) + 
    (store.filteredList.length > 10 ? '\n\n// ... dan ' + (store.filteredList.length - 10) + ' item lainnya' : '');
});

const exportJson = () => {
  const filename = `wilayah_${store.currentLevel}_${Date.now()}.json`;
  downloadJsonFile(filename, store.filteredList);
};

const exportCsv = () => {
  const filename = `wilayah_${store.currentLevel}_${Date.now()}.csv`;
  downloadCsvFile(filename, store.filteredList);
};

const exportSql = () => {
  const table = store.currentLevel === 'province' ? 'provinces' : store.currentLevel === 'regency' ? 'regencies' : store.currentLevel === 'district' ? 'districts' : 'villages';
  const filename = `seed_${table}_${Date.now()}.sql`;
  downloadSqlFile(filename, currentSqlCode.value);
};

const copyShareLink = async () => {
  await navigator.clipboard.writeText(store.shareableUrl);
  copiedShare.value = true;
  setTimeout(() => {
    copiedShare.value = false;
  }, 2000);
};
</script>

<template>
  <div class="mt-8 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden font-sans">
    <!-- Main Toolbar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 gap-3">
      <!-- Section Selector Tabs -->
      <div class="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-md text-xs font-semibold">
        <button 
          @click="activeSection = 'api'; activeTab = 'curl'"
          class="flex items-center gap-1.5 px-3 py-1 rounded transition-colors"
          :class="activeSection === 'api' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
        >
          <Terminal class="w-3.5 h-3.5 text-sky-500" />
          <span>API & SDK</span>
        </button>
        <button 
          @click="activeSection = 'components'; activeTab = 'vue-comp'"
          class="flex items-center gap-1.5 px-3 py-1 rounded transition-colors"
          :class="activeSection === 'components' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
        >
          <Code2 class="w-3.5 h-3.5 text-indigo-500" />
          <span>UI Components</span>
        </button>
        <button 
          @click="activeSection = 'db'; activeTab = 'sql'"
          class="flex items-center gap-1.5 px-3 py-1 rounded transition-colors"
          :class="activeSection === 'db' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
        >
          <Database class="w-3.5 h-3.5 text-emerald-500" />
          <span>SQL & ORM</span>
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <button 
          @click="copyShareLink"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          title="Salin URL dengan filter wilayah aktif"
        >
          <Check v-if="copiedShare" class="w-3 h-3 text-emerald-500" />
          <Share2 v-else class="w-3 h-3 text-slate-500" />
          <span>{{ copiedShare ? 'Link Tersalin' : 'Share Link' }}</span>
        </button>

        <button 
          @click="exportJson"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Download class="w-3 h-3 text-sky-500" />
          <span>JSON</span>
        </button>

        <button 
          @click="exportCsv"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Download class="w-3 h-3 text-emerald-500" />
          <span>CSV</span>
        </button>

        <button 
          @click="exportSql"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <FileCode2 class="w-3 h-3 text-amber-500" />
          <span>SQL Dump</span>
        </button>
      </div>
    </div>

    <!-- Active Endpoint Info Bar -->
    <div class="px-3.5 py-2 bg-slate-100/50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
      <div class="flex items-center gap-2 truncate">
        <span class="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-[10px]">GET</span>
        <span class="text-slate-600 dark:text-slate-400 truncate">{{ currentApiEndpoint }}</span>
      </div>
      <span class="text-[11px] text-slate-400 shrink-0 font-sans">
        {{ store.filteredList.length }} baris aktif
      </span>
    </div>

    <!-- Sub Navigation Tabs -->
    <div class="p-3.5 space-y-3">
      <!-- API Tabs -->
      <div v-if="activeSection === 'api'" class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
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

      <!-- Component Tabs -->
      <div v-else-if="activeSection === 'components'" class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button 
          @click="activeTab = 'vue-comp'"
          class="px-2.5 py-1 rounded font-medium transition-colors"
          :class="activeTab === 'vue-comp' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
        >
          Vue 3 Component
        </button>
        <button 
          @click="activeTab = 'react-comp'"
          class="px-2.5 py-1 rounded font-medium transition-colors"
          :class="activeTab === 'react-comp' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
        >
          React Component
        </button>
        <button 
          @click="activeTab = 'vanilla-comp'"
          class="px-2.5 py-1 rounded font-medium transition-colors"
          :class="activeTab === 'vanilla-comp' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
        >
          HTML Vanilla
        </button>
      </div>

      <!-- DB Tabs -->
      <div v-else-if="activeSection === 'db'" class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button 
          @click="activeTab = 'sql'"
          class="px-2.5 py-1 rounded font-medium transition-colors"
          :class="activeTab === 'sql' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
        >
          SQL INSERT
        </button>
        <button 
          @click="activeTab = 'prisma'"
          class="px-2.5 py-1 rounded font-medium transition-colors"
          :class="activeTab === 'prisma' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
        >
          Prisma Seed
        </button>
      </div>

      <!-- Code Contents -->
      <div>
        <CodeBlock v-if="activeTab === 'curl'" :code="currentCurlCode" language="BASH" />
        <CodeBlock v-else-if="activeTab === 'js'" :code="currentJsCode" language="TYPESCRIPT" />
        <CodeBlock v-else-if="activeTab === 'vue'" :code="vueComposableCode" language="TYPESCRIPT" />
        <CodeBlock v-else-if="activeTab === 'raw'" :code="rawJsonString" language="JSON" />
        
        <CodeBlock v-else-if="activeTab === 'vue-comp'" :code="vueComponentCode" language="VUE" />
        <CodeBlock v-else-if="activeTab === 'react-comp'" :code="reactComponentCode" language="TSX" />
        <CodeBlock v-else-if="activeTab === 'vanilla-comp'" :code="vanillaHtmlCode" language="HTML" />

        <CodeBlock v-else-if="activeTab === 'sql'" :code="currentSqlCode" language="SQL" />
        <CodeBlock v-else-if="activeTab === 'prisma'" :code="currentPrismaCode" language="TYPESCRIPT" />
      </div>
    </div>
  </div>
</template>
