<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRegionStore } from '../stores/regionStore';
import { 
  Building2, 
  Copy, 
  Truck, 
  FileJson, 
  X, 
  RotateCcw,
  Check
} from 'lucide-vue-next';

const store = useRegionStore();
const props = defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits(['close']);

// Form inputs
const recipientName = ref('Budi Santoso');
const recipientPhone = ref('081234567890');
const streetAddress = ref('Jl. Sudirman Kav. 52-53');
const houseNumber = ref('No. 12A');
const rtNumber = ref('003');
const rwNumber = ref('005');
const landmark = ref('Sebelah Bank Mandiri');
const postalCode = ref('12190');

// Internal cascading select state for sandbox
const selectedProvId = ref(store.selectedProvince?.id || '');
const selectedRegId = ref(store.selectedRegency?.id || '');
const selectedDistId = ref(store.selectedDistrict?.id || '');
const selectedVilId = ref(store.selectedVillage?.id || '');

const provList = computed(() => store.provinces);
const regList = ref<any[]>([]);
const distList = ref<any[]>([]);
const vilList = ref<any[]>([]);

const copiedText = ref(false);
const copiedJson = ref(false);

// Load nested dropdowns if user changes selections in sandbox
const onProvChange = async () => {
  selectedRegId.value = '';
  selectedDistId.value = '';
  selectedVilId.value = '';
  regList.value = [];
  distList.value = [];
  vilList.value = [];
  if (selectedProvId.value) {
    const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvId.value}.json`);
    regList.value = await res.json();
  }
};

const onRegChange = async () => {
  selectedDistId.value = '';
  selectedVilId.value = '';
  distList.value = [];
  vilList.value = [];
  if (selectedRegId.value) {
    const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegId.value}.json`);
    distList.value = await res.json();
  }
};

const onDistChange = async () => {
  selectedVilId.value = '';
  vilList.value = [];
  if (selectedDistId.value) {
    const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistId.value}.json`);
    vilList.value = await res.json();
  }
};

// If store already has selected values when opened, initialize them
const initFromStore = async () => {
  if (store.selectedProvince) {
    selectedProvId.value = store.selectedProvince.id;
    await onProvChange();
    if (store.selectedRegency) {
      selectedRegId.value = store.selectedRegency.id;
      await onRegChange();
      if (store.selectedDistrict) {
        selectedDistId.value = store.selectedDistrict.id;
        await onDistChange();
        if (store.selectedVillage) {
          selectedVilId.value = store.selectedVillage.id;
        }
      }
    }
  }
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    initFromStore();
  }
});

// Computed Formatted Address
const provName = computed(() => provList.value.find(p => p.id === selectedProvId.value)?.name || '');
const regName = computed(() => regList.value.find(r => r.id === selectedRegId.value)?.name || '');
const distName = computed(() => distList.value.find(d => d.id === selectedDistId.value)?.name || '');
const vilName = computed(() => vilList.value.find(v => v.id === selectedVilId.value)?.name || '');

const formattedStandardAddress = computed(() => {
  const parts = [];
  if (streetAddress.value) parts.push(streetAddress.value);
  if (houseNumber.value) parts.push(houseNumber.value);
  
  const rtrw = [];
  if (rtNumber.value) rtrw.push(`RT ${rtNumber.value}`);
  if (rwNumber.value) rtrw.push(`RW ${rwNumber.value}`);
  if (rtrw.length) parts.push(rtrw.join('/'));

  if (landmark.value) parts.push(`(Patokan: ${landmark.value})`);
  if (vilName.value) parts.push(`Kel. ${vilName.value}`);
  if (distName.value) parts.push(`Kec. ${distName.value}`);
  if (regName.value) parts.push(regName.value);
  if (provName.value) parts.push(`Prov. ${provName.value}`);
  if (postalCode.value) parts.push(postalCode.value);

  return parts.join(', ');
});

const courierFormatText = computed(() => {
  return `Penerima: ${recipientName.value} (${recipientPhone.value})
Alamat: ${formattedStandardAddress.value}`;
});

const addressJsonPayload = computed(() => {
  return JSON.stringify({
    recipient: {
      name: recipientName.value,
      phone: recipientPhone.value
    },
    location: {
      street: streetAddress.value,
      house_number: houseNumber.value,
      rt: rtNumber.value,
      rw: rwNumber.value,
      landmark: landmark.value,
      postal_code: postalCode.value
    },
    administrative: {
      village_id: selectedVilId.value,
      village_name: vilName.value,
      district_id: selectedDistId.value,
      district_name: distName.value,
      regency_id: selectedRegId.value,
      regency_name: regName.value,
      province_id: selectedProvId.value,
      province_name: provName.value
    },
    formatted_address: formattedStandardAddress.value
  }, null, 2);
});

const copyCourier = async () => {
  await navigator.clipboard.writeText(courierFormatText.value);
  copiedText.value = true;
  setTimeout(() => copiedText.value = false, 2000);
};

const copyJson = async () => {
  await navigator.clipboard.writeText(addressJsonPayload.value);
  copiedJson.value = true;
  setTimeout(() => copiedJson.value = false, 2000);
};

const resetForm = () => {
  streetAddress.value = '';
  houseNumber.value = '';
  rtNumber.value = '';
  rwNumber.value = '';
  landmark.value = '';
  postalCode.value = '';
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 shrink-0">
        <div class="flex items-center gap-2 min-w-0">
          <div class="p-1.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 shrink-0">
            <Building2 class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              Live Address Sandbox & RT/RW Formatter
            </h3>
            <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Simulator form pengiriman & standar formatting alamat ekspedisi
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

      <!-- Modal Body (2 Columns on Desktop, 1 Column on Mobile) -->
      <div class="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto flex-1">
        <!-- Left: Form Inputs -->
        <div class="space-y-2.5 sm:space-y-3">
          <div class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span>Input Form Alamat</span>
            <button @click="resetForm" class="text-[10px] lowercase text-slate-400 hover:text-slate-600 flex items-center gap-1 font-normal">
              <RotateCcw class="w-3 h-3" />
              <span>Reset text</span>
            </button>
          </div>

          <!-- Recipient -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Penerima</label>
              <input v-model="recipientName" type="text" class="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">No. Telepon</label>
              <input v-model="recipientPhone" type="text" class="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 focus:outline-none" />
            </div>
          </div>

          <!-- Cascading Dropdowns -->
          <div class="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">1. Provinsi</label>
                <select v-model="selectedProvId" @change="onProvChange" class="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white truncate">
                  <option value="">-- Pilih Provinsi --</option>
                  <option v-for="p in provList" :key="p.id" :value="p.id">{{ p.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">2. Kab / Kota</label>
                <select v-model="selectedRegId" @change="onRegChange" :disabled="!selectedProvId" class="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white disabled:opacity-50 truncate">
                  <option value="">-- Pilih Kab/Kota --</option>
                  <option v-for="r in regList" :key="r.id" :value="r.id">{{ r.name }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">3. Kecamatan</label>
                <select v-model="selectedDistId" @change="onDistChange" :disabled="!selectedRegId" class="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white disabled:opacity-50 truncate">
                  <option value="">-- Pilih Kecamatan --</option>
                  <option v-for="d in distList" :key="d.id" :value="d.id">{{ d.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">4. Kelurahan / Desa</label>
                <select v-model="selectedVilId" :disabled="!selectedDistId" class="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white disabled:opacity-50 truncate">
                  <option value="">-- Pilih Kel/Desa --</option>
                  <option v-for="v in vilList" :key="v.id" :value="v.id">{{ v.name }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Street & House Number -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Jalan / Blok</label>
              <input v-model="streetAddress" type="text" placeholder="Jl. Merdeka" class="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">No. Rumah</label>
              <input v-model="houseNumber" type="text" placeholder="No. 12" class="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 focus:outline-none" />
            </div>
          </div>

          <!-- RT, RW, Postal Code -->
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">RT</label>
              <input v-model="rtNumber" type="text" placeholder="001" class="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">RW</label>
              <input v-model="rwNumber" type="text" placeholder="002" class="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Kode Pos</label>
              <input v-model="postalCode" type="text" placeholder="10110" class="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 focus:outline-none" />
            </div>
          </div>

          <!-- Landmark -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Patokan / Catatan Kurir</label>
            <input v-model="landmark" type="text" placeholder="Pagar hitam depan pos satpam" class="w-full text-xs px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-sky-500 focus:outline-none" />
          </div>
        </div>

        <!-- Right: Live Formatted Output -->
        <div class="space-y-3 bg-slate-50 dark:bg-slate-950 p-3 sm:p-3.5 rounded border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div class="space-y-2.5 sm:space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Truck class="w-3.5 h-3.5 text-sky-500" />
                <span>Format Label Ekspedisi</span>
              </span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                Siap Kirim
              </span>
            </div>

            <!-- Standard Courier Label Box -->
            <div class="p-2.5 sm:p-3 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 font-sans text-xs space-y-1 text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
              <div class="font-bold text-sky-600 dark:text-sky-400 break-words">
                {{ recipientName || '[Nama Penerima]' }} ({{ recipientPhone || '[No Telp]' }})
              </div>
              <div class="text-[11px] text-slate-600 dark:text-slate-300 break-words">
                {{ formattedStandardAddress || 'Lengkapi form di sebelah kiri untuk melihat output alamat terformat.' }}
              </div>
            </div>

            <!-- JSON Payload View -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <FileJson class="w-3 h-3 text-amber-500" />
                <span>Database / API JSON Payload</span>
              </div>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800 text-slate-100 font-mono text-[10px] max-h-32 sm:max-h-40 overflow-y-auto leading-relaxed">
                <pre><code>{{ addressJsonPayload }}</code></pre>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button 
              @click="copyCourier"
              class="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors active:scale-[0.98]"
            >
              <Check v-if="copiedText" class="w-3.5 h-3.5 text-emerald-300" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedText ? 'Tersalin!' : 'Salin Label Ekspedisi' }}</span>
            </button>

            <button 
              @click="copyJson"
              class="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2 px-3 rounded border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors active:scale-[0.98]"
            >
              <Check v-if="copiedJson" class="w-3.5 h-3.5 text-emerald-500" />
              <FileJson v-else class="w-3.5 h-3.5" />
              <span>{{ copiedJson ? 'JSON Tersalin!' : 'Copy JSON' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
