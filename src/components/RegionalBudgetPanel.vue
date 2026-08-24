<script setup lang="ts">
import { computed } from 'vue';
import { useRegionStore } from '../stores/regionStore';
import { getRegionalBudget, formatRupiah } from '../services/budgetApi';
import type { RegionalBudget } from '../types/budget';
import { 
  Coins, 
  Building2, 
  Briefcase, 
  TreePine, 
  Download, 
  PieChart, 
  HelpCircle,
  Calculator
} from 'lucide-vue-next';
import { downloadJsonFile, downloadCsvFile } from '../utils/codeSnippet';

const store = useRegionStore();
const emit = defineEmits(['open-bos-calc']);

// Selected province for budget analysis
const selectedProvId = computed(() => {
  return store.selectedProvince?.id || '32'; // Default Jawa Barat
});

const selectedProvName = computed(() => {
  return store.selectedProvince?.name || 'JAWA BARAT';
});

const currentBudget = computed<RegionalBudget>(() => {
  return getRegionalBudget(selectedProvId.value, selectedProvName.value);
});

// Percentages
const padPercent = computed(() => {
  if (!currentBudget.value.apbd_total) return 0;
  return Math.round((currentBudget.value.pad / currentBudget.value.apbd_total) * 100);
});

const transferPercent = computed(() => {
  if (!currentBudget.value.apbd_total) return 0;
  return Math.round((currentBudget.value.transfer_pusat / currentBudget.value.apbd_total) * 100);
});

const belanjaPegawaiPercent = computed(() => {
  if (!currentBudget.value.apbd_total) return 0;
  return Math.round((currentBudget.value.belanja_pegawai / currentBudget.value.apbd_total) * 100);
});

const belanjaModalPercent = computed(() => {
  if (!currentBudget.value.apbd_total) return 0;
  return Math.round((currentBudget.value.belanja_modal / currentBudget.value.apbd_total) * 100);
});

const exportBudgetJson = () => {
  const filename = `apbd_${currentBudget.value.province_name}_${Date.now()}.json`;
  downloadJsonFile(filename, currentBudget.value);
};

const exportBudgetCsv = () => {
  const filename = `apbd_${currentBudget.value.province_name}_${Date.now()}.csv`;
  downloadCsvFile(filename, [currentBudget.value]);
};
</script>

<template>
  <div class="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden font-sans space-y-0">
    <!-- Header Postur Anggaran -->
    <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Coins class="w-4 h-4" />
          </div>
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
            <span>Postur APBD & Alokasi Fiskal Daerah</span>
            <span class="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-900 shrink-0">
              DJPK Kemenkeu
            </span>
          </h3>
        </div>
        <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
          Provinsi: <strong class="text-slate-800 dark:text-slate-200">{{ currentBudget.province_name }}</strong> • Indeks Kemahalan: <strong>{{ currentBudget.ikk_index }}x</strong>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 shrink-0">
        <button 
          @click="emit('open-bos-calc')"
          class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-600 text-white transition-colors"
        >
          <Calculator class="w-3.5 h-3.5" />
          <span>Kalkulator BOS</span>
        </button>

        <button 
          @click="exportBudgetJson"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Download class="w-3 h-3 text-sky-500" />
          <span>JSON</span>
        </button>

        <button 
          @click="exportBudgetCsv"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Download class="w-3 h-3 text-emerald-500" />
          <span>CSV</span>
        </button>
      </div>
    </div>

    <!-- Main Highlight APBD Cards -->
    <div class="p-3.5 sm:p-5 space-y-4">
      <!-- 3 Key Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Total APBD -->
        <div class="p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-1">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="font-semibold uppercase tracking-wider text-[10px]">Total Anggaran (APBD)</span>
            <Building2 class="w-4 h-4 text-sky-500" />
          </div>
          <div class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {{ formatRupiah(currentBudget.apbd_total) }}
          </div>
          <p class="text-[10px] text-slate-400">
            Pagu total pendapatan & belanja provinsi
          </p>
        </div>

        <!-- PAD (Kemandirian Fiskal) -->
        <div class="p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-1">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="font-semibold uppercase tracking-wider text-[10px]">Pendapatan Asli Daerah</span>
            <span class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{{ padPercent }}%</span>
          </div>
          <div class="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {{ formatRupiah(currentBudget.pad) }}
          </div>
          <p class="text-[10px] text-slate-400">
            Pajak daerah, retribusi, & hasil BUMD
          </p>
        </div>

        <!-- Transfer Pusat (TKD) -->
        <div class="p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-1">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="font-semibold uppercase tracking-wider text-[10px]">Transfer Pusat (TKD)</span>
            <span class="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{{ transferPercent }}%</span>
          </div>
          <div class="text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {{ formatRupiah(currentBudget.transfer_pusat) }}
          </div>
          <p class="text-[10px] text-slate-400">
            Dana Alokasi Umum (DAU), DAK, & DBH
          </p>
        </div>
      </div>

      <!-- Structural Progress Bars -->
      <div class="p-4 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
        <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <PieChart class="w-3.5 h-3.5 text-emerald-500" />
            <span>Struktur Belanja & Kemandirian Fiskal</span>
          </span>
          <span class="font-mono text-[11px] text-slate-400">Tahun Anggaran Berjalan</span>
        </h4>

        <!-- Visual Bar -->
        <div class="h-4 rounded overflow-hidden flex bg-slate-200 dark:bg-slate-800 text-[9px] font-bold text-white text-center leading-4 font-mono">
          <div :style="{ width: `${padPercent}%` }" class="bg-emerald-500 truncate" title="PAD">PAD {{ padPercent }}%</div>
          <div :style="{ width: `${transferPercent}%` }" class="bg-indigo-500 truncate" title="Transfer Pusat">TKD {{ transferPercent }}%</div>
        </div>

        <!-- Breakdown Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
          <!-- Belanja Pegawai -->
          <div class="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
            <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Belanja Pegawai</span>
              <span class="font-mono font-bold">{{ belanjaPegawaiPercent }}%</span>
            </div>
            <div class="text-xs font-bold text-slate-900 dark:text-white">
              {{ formatRupiah(currentBudget.belanja_pegawai) }}
            </div>
            <p class="text-[9px] text-slate-400">Gaji ASN, tunjangan & honorarium</p>
          </div>

          <!-- Belanja Modal -->
          <div class="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
            <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Belanja Modal</span>
              <span class="font-mono font-bold">{{ belanjaModalPercent }}%</span>
            </div>
            <div class="text-xs font-bold text-slate-900 dark:text-white">
              {{ formatRupiah(currentBudget.belanja_modal) }}
            </div>
            <p class="text-[9px] text-slate-400">Infrastruktur, jalan, & gedung</p>
          </div>

          <!-- Belanja Operasional -->
          <div class="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
            <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Belanja Barang/Jasa</span>
              <Briefcase class="w-3 h-3 text-slate-400" />
            </div>
            <div class="text-xs font-bold text-slate-900 dark:text-white">
              {{ formatRupiah(currentBudget.belanja_operasional) }}
            </div>
            <p class="text-[9px] text-slate-400">Pengadaan barang operasional dinas</p>
          </div>

          <!-- Dana Desa Provinsi -->
          <div class="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
            <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Alokasi Dana Desa</span>
              <TreePine class="w-3 h-3 text-emerald-500" />
            </div>
            <div class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {{ currentBudget.dana_desa_total ? formatRupiah(currentBudget.dana_desa_total) : 'N/A (Khusus DKI)' }}
            </div>
            <p class="text-[9px] text-slate-400">Pagu penyaluran langsung ke desa</p>
          </div>
        </div>
      </div>

      <!-- Quick Tips / Guide -->
      <div class="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
        <HelpCircle class="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <p class="leading-relaxed">
            Data anggaran bersumber dari agregasi resmi <strong>Direktorat Jenderal Perimbangan Keuangan (DJPK) Kemenkeu</strong>. Rasio kemandirian fiskal dihitung dari proporsi PAD terhadap total APBD.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
