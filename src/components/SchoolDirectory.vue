<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRegionStore } from '../stores/regionStore';
import { schoolApi } from '../services/schoolApi';
import type { SchoolItem } from '../types/school';
import { 
  GraduationCap, 
  Search, 
  ExternalLink, 
  Download, 
  Loader2, 
  Check, 
  Copy,
  ChevronLeft,
  ChevronRight,
  Calculator
} from 'lucide-vue-next';
import { downloadJsonFile, downloadCsvFile } from '../utils/codeSnippet';

const store = useRegionStore();
const emit = defineEmits(['calculate-bos']);

const schools = ref<SchoolItem[]>([]);
const totalData = ref(0);
const currentPage = ref(1);
const perPage = ref(12);
const loading = ref(false);
const error = ref<string | null>(null);

const searchQuery = ref('');
const selectedBentuk = ref<string>('ALL'); // ALL, SD, SMP, SMA, SMK, SLB
const selectedStatus = ref<string>('ALL'); // ALL, N, S
const copiedNpsn = ref<string | null>(null);

const activeSearchContext = computed(() => {
  if (searchQuery.value.trim()) return searchQuery.value.trim();
  if (store.selectedDistrict) return store.selectedDistrict.name;
  if (store.selectedRegency) return store.selectedRegency.name.replace(/(KABUPATEN|KOTA)\s+/i, '');
  if (store.selectedProvince) return store.selectedProvince.name;
  return 'Jakarta';
});

const loadSchools = async (page = 1) => {
  loading.value = true;
  error.value = null;
  currentPage.value = page;

  try {
    const res = await schoolApi.searchSchool(activeSearchContext.value, page, perPage.value);
    schools.value = res.dataSekolah || [];
    totalData.value = res.total_data || 0;
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat data sekolah.';
    schools.value = [];
    totalData.value = 0;
  } finally {
    loading.value = false;
  }
};

watch([() => store.selectedDistrict, () => store.selectedRegency, () => store.selectedProvince], () => {
  searchQuery.value = '';
  loadSchools(1);
}, { immediate: true });

const handleManualSearch = () => {
  loadSchools(1);
};

const filteredSchools = computed(() => {
  return schools.value.filter(s => {
    const matchBentuk = selectedBentuk.value === 'ALL' || s.bentuk.toUpperCase() === selectedBentuk.value;
    const matchStatus = selectedStatus.value === 'ALL' || s.status.toUpperCase() === selectedStatus.value;
    return matchBentuk && matchStatus;
  });
});

const totalPages = computed(() => Math.ceil(totalData.value / perPage.value));

const copyNpsn = async (npsn: string) => {
  await navigator.clipboard.writeText(npsn);
  copiedNpsn.value = npsn;
  setTimeout(() => {
    if (copiedNpsn.value === npsn) copiedNpsn.value = null;
  }, 2000);
};

const exportSchoolJson = () => {
  const filename = `data_sekolah_${activeSearchContext.value}_${Date.now()}.json`;
  downloadJsonFile(filename, filteredSchools.value);
};

const exportSchoolCsv = () => {
  const filename = `data_sekolah_${activeSearchContext.value}_${Date.now()}.csv`;
  downloadCsvFile(filename, filteredSchools.value);
};

const getMapsUrl = (s: SchoolItem) => {
  if (s.lintang && s.bujur && parseFloat(s.lintang) !== 0) {
    return `https://www.google.com/maps/search/?api=1&query=${s.lintang},${s.bujur}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.sekolah + ' ' + s.kabupaten_kota)}`;
};
</script>

<template>
  <div class="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden font-sans space-y-0">
    <!-- Header Tooling -->
    <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
            <GraduationCap class="w-4 h-4" />
          </div>
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
            <span>Direktori Sekolah & NPSN</span>
            <span class="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-900 shrink-0">
              215.000+
            </span>
          </h3>
        </div>
        <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
          Sekitar <strong class="text-slate-800 dark:text-slate-200">{{ activeSearchContext }}</strong> (Total: {{ totalData.toLocaleString('id-ID') }})
        </p>
      </div>

      <!-- Action Buttons (Export & BOS) -->
      <div class="flex items-center gap-2 shrink-0">
        <button 
          @click="emit('calculate-bos', null)"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-600 text-white transition-colors"
          title="Buka Kalkulator BOS"
        >
          <Calculator class="w-3.5 h-3.5" />
          <span>Kalkulator BOS</span>
        </button>

        <button 
          @click="exportSchoolJson"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          title="Download JSON"
        >
          <Download class="w-3 h-3 text-sky-500" />
          <span>JSON</span>
        </button>
        <button 
          @click="exportSchoolCsv"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          title="Download CSV"
        >
          <Download class="w-3 h-3 text-emerald-500" />
          <span>CSV</span>
        </button>
      </div>
    </div>

    <!-- Filter & Search Bar (Responsive Wrapped) -->
    <div class="p-3 sm:p-3.5 bg-slate-100/50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
      <!-- Search Input -->
      <form @submit.prevent="handleManualSearch" class="relative flex-1 flex items-center gap-2">
        <div class="relative w-full">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari nama sekolah, kecamatan, atau NPSN..."
            class="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white"
          />
        </div>
        <button 
          type="submit"
          class="px-3 py-1.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs shrink-0 active:scale-95"
        >
          Cari
        </button>
      </form>

      <!-- Filter Controls -->
      <div class="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto no-scrollbar">
        <!-- Jenjang Filter -->
        <div class="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded border border-slate-300 dark:border-slate-700 text-[10px] sm:text-[11px] shrink-0">
          <button 
            v-for="b in ['ALL', 'SD', 'SMP', 'SMA', 'SMK']" 
            :key="b"
            @click="selectedBentuk = b"
            class="px-1.5 sm:px-2 py-0.5 rounded transition-colors"
            :class="selectedBentuk === b ? 'bg-slate-200 dark:bg-slate-800 font-bold text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
          >
            {{ b }}
          </button>
        </div>

        <!-- Status Filter -->
        <div class="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded border border-slate-300 dark:border-slate-700 text-[10px] sm:text-[11px] shrink-0">
          <button 
            @click="selectedStatus = 'ALL'"
            class="px-1.5 sm:px-2 py-0.5 rounded transition-colors"
            :class="selectedStatus === 'ALL' ? 'bg-slate-200 dark:bg-slate-800 font-bold text-slate-900 dark:text-white' : 'text-slate-500'"
          >
            Semua
          </button>
          <button 
            @click="selectedStatus = 'N'"
            class="px-1.5 sm:px-2 py-0.5 rounded transition-colors"
            :class="selectedStatus === 'N' ? 'bg-emerald-100 dark:bg-emerald-950 font-bold text-emerald-700 dark:text-emerald-300' : 'text-slate-500'"
          >
            Negeri
          </button>
          <button 
            @click="selectedStatus = 'S'"
            class="px-1.5 sm:px-2 py-0.5 rounded transition-colors"
            :class="selectedStatus === 'S' ? 'bg-amber-100 dark:bg-amber-950 font-bold text-amber-700 dark:text-amber-300' : 'text-slate-500'"
          >
            Swasta
          </button>
        </div>
      </div>
    </div>

    <!-- School List Content -->
    <div class="p-3 sm:p-4 space-y-3 sm:space-y-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12 sm:py-16 text-slate-400 gap-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-md">
        <Loader2 class="w-6 h-6 animate-spin text-amber-500" />
        <span class="text-xs">Mengambil data direktori sekolah...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-3 sm:p-4 border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-md text-xs">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredSchools.length === 0" class="py-10 sm:py-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800 rounded-md text-xs px-4">
        Tidak ditemukan sekolah dengan kata kunci "{{ activeSearchContext }}". Coba gunakan pencarian nama sekolah lain di atas.
      </div>

      <!-- School Cards Grid (Mobile 1-col, Tablet 2-col, Desktop 3-col) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        <div 
          v-for="s in filteredSchools" 
          :key="s.id || s.npsn"
          class="p-3 sm:p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between space-y-2.5"
        >
          <div class="space-y-1.5">
            <!-- Top Badges -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5">
                <span 
                  class="px-1.5 py-0.2 rounded text-[10px] font-bold font-mono uppercase"
                  :class="[
                    s.bentuk === 'SMK' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' :
                    s.bentuk === 'SMA' ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300' :
                    s.bentuk === 'SMP' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                    'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  ]"
                >
                  {{ s.bentuk }}
                </span>
                <span 
                  class="px-1.5 py-0.2 rounded text-[10px] font-semibold"
                  :class="s.status === 'N' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
                >
                  {{ s.status === 'N' ? 'Negeri' : 'Swasta' }}
                </span>
              </div>

              <!-- NPSN Pill with Copy -->
              <button 
                @click="copyNpsn(s.npsn)"
                class="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 active:scale-95"
                title="Salin NPSN"
              >
                <span>NPSN: {{ s.npsn }}</span>
                <Check v-if="copiedNpsn === s.npsn" class="w-3 h-3 text-emerald-500" />
                <Copy v-else class="w-2.5 h-2.5" />
              </button>
            </div>

            <!-- School Name -->
            <h4 class="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {{ s.sekolah }}
            </h4>

            <!-- Address & Location -->
            <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {{ s.alamat_jalan || 'Alamat tidak tertera' }}, {{ s.kecamatan }}, {{ s.kabupaten_kota }}
            </p>
          </div>

          <!-- Card Footer (Google Maps & Hitung BOS Link) -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] gap-2">
            <button 
              @click="emit('calculate-bos', s)"
              class="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-semibold text-[11px]"
            >
              <Calculator class="w-3 h-3" />
              <span>Estimasi BOS</span>
            </button>

            <a 
              :href="getMapsUrl(s)" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline font-semibold shrink-0"
            >
              <span>Maps</span>
              <ExternalLink class="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <!-- Pagination (Mobile friendly) -->
      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
        <span class="text-slate-500 dark:text-slate-400 text-center sm:text-left">
          Halaman {{ currentPage }} dari {{ totalPages }} ({{ totalData.toLocaleString('id-ID') }} sekolah)
        </span>

        <div class="flex items-center gap-1.5">
          <button 
            @click="loadSchools(currentPage - 1)" 
            :disabled="currentPage <= 1"
            class="p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-95"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>
          <span class="px-2 font-mono font-semibold">{{ currentPage }}</span>
          <button 
            @click="loadSchools(currentPage + 1)" 
            :disabled="currentPage >= totalPages"
            class="p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:scale-95"
          >
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
