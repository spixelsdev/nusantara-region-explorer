<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRegionStore } from '../stores/regionStore';
import { getRegionalBudget, calculateBosFund, formatRupiah, BOS_CONFIG } from '../services/budgetApi';
import type { SchoolItem } from '../types/school';
import { 
  Calculator, 
  X, 
  Check, 
  Copy, 
  ShieldAlert, 
  PieChart,
  Users
} from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  targetSchool: SchoolItem | null;
}>();

const emit = defineEmits(['close']);
const store = useRegionStore();

const customJenjang = ref<'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB'>('SD');
const selectedScale = ref<'small' | 'medium' | 'large'>('medium');
const studentCount = ref(280);
const copiedBreakdown = ref(false);

// Preset mapping based on official Permendikbud rombel capacity
const ROMBEL_PRESETS: Record<'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB', Record<'small' | 'medium' | 'large', number>> = {
  SD: { small: 168, medium: 280, large: 504 },       // 6 rombel vs 10 rombel vs 18 rombel
  SMP: { small: 288, medium: 480, large: 768 },      // 9 rombel vs 15 rombel vs 24 rombel
  SMA: { small: 324, medium: 648, large: 972 },      // 9 rombel vs 18 rombel vs 27 rombel
  SMK: { small: 432, medium: 756, large: 1296 },     // 12 rombel vs 21 rombel vs 36 rombel
  SLB: { small: 30, medium: 60, large: 120 }
};

const applyPreset = (scale: 'small' | 'medium' | 'large') => {
  selectedScale.value = scale;
  studentCount.value = ROMBEL_PRESETS[customJenjang.value][scale];
};

// Switch jenjang & auto set realistic default student count
const selectJenjang = (j: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB') => {
  customJenjang.value = j;
  studentCount.value = ROMBEL_PRESETS[j][selectedScale.value];
};

// When modal opens with targetSchool, detect its level and preset student count
watch(() => props.targetSchool, (school) => {
  if (school) {
    const b = school.bentuk?.toUpperCase() as any;
    if (['SD', 'SMP', 'SMA', 'SMK', 'SLB'].includes(b)) {
      customJenjang.value = b;
    } else {
      customJenjang.value = 'SD';
    }
    // Set auto default capacity
    studentCount.value = ROMBEL_PRESETS[customJenjang.value][selectedScale.value];
  }
}, { immediate: true });

// Get active IKK multiplier from current province
const currentBudgetInfo = computed(() => {
  const provId = store.selectedProvince?.id || '32';
  const provName = store.selectedProvince?.name || 'JAWA BARAT';
  return getRegionalBudget(provId, provName);
});

const ikkMultiplier = computed(() => currentBudgetInfo.value.ikk_index);

const calculation = computed(() => {
  return calculateBosFund(customJenjang.value, studentCount.value, ikkMultiplier.value);
});

const activeConfig = computed(() => BOS_CONFIG[customJenjang.value] || BOS_CONFIG['SD']);

// Estimated rombel count display
const estimatedRombel = computed(() => {
  const maxPerClass = customJenjang.value === 'SD' ? 28 : customJenjang.value === 'SLB' ? 8 : 36;
  return Math.max(1, Math.ceil(studentCount.value / maxPerClass));
});

const formattedSummaryText = computed(() => {
  const schoolName = props.targetSchool ? props.targetSchool.sekolah : `Sekolah ${customJenjang.value}`;
  const c = calculation.value;
  return `=== ESTIMASI ALOKASI DANA BOS / BOSP REGULER ===
Nama: ${schoolName} (${customJenjang.value})
Jumlah Siswa: ${studentCount.value} Siswa (Est. ${estimatedRombel.value} Rombel)
Indeks Daerah (IKK): ${ikkMultiplier.value}x (${currentBudgetInfo.value.province_name})

TOTAL ALOKASI TAHUNAN: ${formatRupiah(c.total_yearly)}
- Penyaluran Tahap 1 (50%): ${formatRupiah(c.tahap_1)}
- Penyaluran Tahap 2 (50%): ${formatRupiah(c.tahap_2)}

BREAKDOWN BELANJA RESMI (Permendikbudristek):
1. Honor Guru Non-ASN (Maks 50%): ${formatRupiah(c.breakdown.honor_guru_max)}
2. Buku & Alat Pembelajaran (Est. 20%): ${formatRupiah(c.breakdown.buku_alat_pembelajaran)}
3. Pemeliharaan Sarana Prasarana (Est. 15%): ${formatRupiah(c.breakdown.pemeliharaan_sarpras)}
4. Langganan Daya & Jasa (Est. 15%): ${formatRupiah(c.breakdown.daya_dan_jasa)}
*Sumber Formula: Standar Satuan Biaya Majemuk Kemendikbudristek`;
});

const copySummary = async () => {
  await navigator.clipboard.writeText(formattedSummaryText.value);
  copiedBreakdown.value = true;
  setTimeout(() => copiedBreakdown.value = false, 2000);
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shrink-0">
        <div class="flex items-center gap-2 min-w-0">
          <div class="p-1.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
            <Calculator class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              Kalkulator & Estimator Alokasi Dana BOS (BOSP)
            </h3>
            <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Formula Satuan Biaya Majemuk Daerah & Standar Rombel Dapodik Kemendikbud
            </p>
          </div>
        </div>
        <button 
          @click="emit('close')"
          class="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-3.5 sm:p-5 space-y-4 overflow-y-auto flex-1">
        <!-- Target School Info (if opened from a specific card) -->
        <div v-if="targetSchool" class="p-2.5 sm:p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <div class="text-[10px] font-mono uppercase font-bold text-amber-700 dark:text-amber-400">
              Sekolah Terpilih • NPSN: {{ targetSchool.npsn }}
            </div>
            <div class="text-xs font-bold text-slate-900 dark:text-white truncate">
              {{ targetSchool.sekolah }}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {{ targetSchool.kecamatan }}, {{ targetSchool.kabupaten_kota }}
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 shrink-0">
            {{ targetSchool.bentuk }}
          </span>
        </div>

        <!-- Controls: Jenjang & Student Count -->
        <div class="space-y-3 p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Jenjang Pendidikan
              </label>
              <div class="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded border border-slate-300 dark:border-slate-700">
                <button 
                  v-for="j in (['SD', 'SMP', 'SMA', 'SMK', 'SLB'] as const)" 
                  :key="j"
                  @click="selectJenjang(j)"
                  class="flex-1 py-1 text-[11px] font-semibold rounded transition-colors"
                  :class="customJenjang === j ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
                >
                  {{ j }}
                </button>
              </div>
            </div>

            <!-- Quick Capacity Presets -->
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Preset Skala Rombel (Dapodik)
              </label>
              <div class="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded border border-slate-300 dark:border-slate-700">
                <button 
                  @click="applyPreset('small')"
                  class="flex-1 py-1 text-[10px] font-semibold rounded transition-colors"
                  :class="selectedScale === 'small' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
                >
                  Kecil (1 Rombel)
                </button>
                <button 
                  @click="applyPreset('medium')"
                  class="flex-1 py-1 text-[10px] font-semibold rounded transition-colors"
                  :class="selectedScale === 'medium' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
                >
                  Sedang (2-3 Rombel)
                </button>
                <button 
                  @click="applyPreset('large')"
                  class="flex-1 py-1 text-[10px] font-semibold rounded transition-colors"
                  :class="selectedScale === 'large' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'"
                >
                  Besar (4+ Rombel)
                </button>
              </div>
            </div>
          </div>

          <!-- Student Slider & Exact Input -->
          <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div class="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              <span class="flex items-center gap-1">
                <Users class="w-3.5 h-3.5 text-amber-500" />
                <span>Jumlah Peserta Didik Riil / Estimasi:</span>
              </span>
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-slate-400 font-normal">Est. ~{{ estimatedRombel }} Rombel</span>
                <span class="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">{{ studentCount }} Siswa</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <input 
                v-model.number="studentCount" 
                type="range" 
                min="10" 
                max="1800" 
                step="5" 
                class="flex-1 accent-amber-500 cursor-pointer"
              />
              <input 
                v-model.number="studentCount" 
                type="number" 
                min="1" 
                max="3000" 
                class="w-20 text-xs px-2 py-1 text-center font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <!-- Calculated Totals (Highlight Card) -->
        <div class="p-3.5 sm:p-4 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white space-y-2 shadow-xs">
          <div class="flex items-center justify-between text-xs opacity-90">
            <span>Estimasi Dana BOS / BOSP Reguler per Tahun</span>
            <span class="font-mono text-[11px] bg-white/20 px-1.5 py-0.5 rounded">
              Rate: {{ formatRupiah(Math.round(activeConfig.default_rate * ikkMultiplier)) }}/siswa
            </span>
          </div>
          <div class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {{ formatRupiah(calculation.total_yearly) }}
          </div>

          <!-- Disbursement Stages -->
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-xs">
            <div>
              <div class="opacity-80 text-[10px]">Penyaluran Tahap 1 (50%)</div>
              <div class="font-bold font-mono">{{ formatRupiah(calculation.tahap_1) }}</div>
            </div>
            <div>
              <div class="opacity-80 text-[10px]">Penyaluran Tahap 2 (50%)</div>
              <div class="font-bold font-mono">{{ formatRupiah(calculation.tahap_2) }}</div>
            </div>
          </div>
        </div>

        <!-- Allocation Breakdown According to Regulations -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart class="w-3.5 h-3.5 text-amber-500" />
              <span>Simulasi Alokasi Penggunaan Dana (Permendikbud)</span>
            </h4>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <!-- Honor Guru -->
            <div class="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
              <div class="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
                <span>Honor Guru Non-ASN (Maks 50%)</span>
                <span class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">50%</span>
              </div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">
                {{ formatRupiah(calculation.breakdown.honor_guru_max) }}
              </div>
              <p class="text-[10px] text-slate-400 leading-tight">
                Batas plafon maksimal pembayaran guru/tenaga honorer terdaftar Dapodik.
              </p>
            </div>

            <!-- Buku & Pembelajaran -->
            <div class="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
              <div class="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
                <span>Buku & Alat Belajar (Est. 20%)</span>
                <span class="font-mono text-sky-600 dark:text-sky-400 font-bold">20%</span>
              </div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">
                {{ formatRupiah(calculation.breakdown.buku_alat_pembelajaran) }}
              </div>
              <p class="text-[10px] text-slate-400 leading-tight">
                Pengadaan buku teks utama kurikulum, modul praktik, dan evaluasi asesmen.
              </p>
            </div>

            <!-- Sarpras -->
            <div class="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
              <div class="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
                <span>Pemeliharaan Sarpras (Est. 15%)</span>
                <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold">15%</span>
              </div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">
                {{ formatRupiah(calculation.breakdown.pemeliharaan_sarpras) }}
              </div>
              <p class="text-[10px] text-slate-400 leading-tight">
                Perbaikan ringan ruang kelas, sanitasi, dan alat sanitasi/kebersihan.
              </p>
            </div>

            <!-- Daya & Jasa -->
            <div class="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
              <div class="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
                <span>Langganan Daya & Jasa (Est. 15%)</span>
                <span class="font-mono text-amber-600 dark:text-amber-400 font-bold">15%</span>
              </div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">
                {{ formatRupiah(calculation.breakdown.daya_dan_jasa) }}
              </div>
              <p class="text-[10px] text-slate-400 leading-tight">
                Pembayaran listrik, air, internet sekolah, dan administrasi ARKAS.
              </p>
            </div>
          </div>
        </div>

        <!-- Note on IKK / Kemahalan Daerah -->
        <div class="p-2.5 rounded bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <ShieldAlert class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p class="leading-relaxed">
            Satuan biaya BOS telah disesuaikan dengan <strong>Indeks Kemahalan Konstruksi (IKK)</strong> daerah aktif ({{ ikkMultiplier }}x). Penyaluran riil langsung ditransfer ke rekening sekolah dalam 2 tahap pencairan per tahun anggaran.
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-end gap-2 shrink-0">
        <button 
          @click="copySummary"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs transition-opacity hover:opacity-90 active:scale-95"
        >
          <Check v-if="copiedBreakdown" class="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <Copy v-else class="w-3.5 h-3.5" />
          <span>{{ copiedBreakdown ? 'Ringkasan Tersalin!' : 'Salin Rekapitulasi BOS' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
