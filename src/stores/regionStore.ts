import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Province, Regency, District, Village, RegionLevel } from '../types/region';
import { regionApi } from '../services/api';

export const useRegionStore = defineStore('region', () => {
  // State
  const provinces = ref<Province[]>([]);
  const regencies = ref<Regency[]>([]);
  const districts = ref<District[]>([]);
  const villages = ref<Village[]>([]);

  const selectedProvince = ref<Province | null>(null);
  const selectedRegency = ref<Regency | null>(null);
  const selectedDistrict = ref<District | null>(null);
  const selectedVillage = ref<Village | null>(null);

  const currentLevel = ref<RegionLevel>('province');
  const searchQuery = ref('');
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function loadProvinces() {
    loading.value = true;
    error.value = null;
    try {
      provinces.value = await regionApi.getProvinces();
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat data provinsi';
    } finally {
      loading.value = false;
    }
  }

  async function selectProvince(prov: Province) {
    selectedProvince.value = prov;
    selectedRegency.value = null;
    selectedDistrict.value = null;
    selectedVillage.value = null;
    regencies.value = [];
    districts.value = [];
    villages.value = [];
    currentLevel.value = 'regency';
    searchQuery.value = '';

    loading.value = true;
    error.value = null;
    try {
      regencies.value = await regionApi.getRegencies(prov.id);
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat kabupaten/kota';
    } finally {
      loading.value = false;
    }
  }

  async function selectRegency(reg: Regency) {
    selectedRegency.value = reg;
    selectedDistrict.value = null;
    selectedVillage.value = null;
    districts.value = [];
    villages.value = [];
    currentLevel.value = 'district';
    searchQuery.value = '';

    loading.value = true;
    error.value = null;
    try {
      districts.value = await regionApi.getDistricts(reg.id);
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat kecamatan';
    } finally {
      loading.value = false;
    }
  }

  async function selectDistrict(dist: District) {
    selectedDistrict.value = dist;
    selectedVillage.value = null;
    villages.value = [];
    currentLevel.value = 'village';
    searchQuery.value = '';

    loading.value = true;
    error.value = null;
    try {
      villages.value = await regionApi.getVillages(dist.id);
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat kelurahan/desa';
    } finally {
      loading.value = false;
    }
  }

  function selectVillage(vil: Village) {
    selectedVillage.value = vil;
  }

  function jumpToLevel(level: RegionLevel) {
    currentLevel.value = level;
    searchQuery.value = '';
    if (level === 'province') {
      selectedProvince.value = null;
      selectedRegency.value = null;
      selectedDistrict.value = null;
      selectedVillage.value = null;
    } else if (level === 'regency') {
      selectedRegency.value = null;
      selectedDistrict.value = null;
      selectedVillage.value = null;
    } else if (level === 'district') {
      selectedDistrict.value = null;
      selectedVillage.value = null;
    }
  }

  // Filtered lists based on search
  const filteredList = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (currentLevel.value === 'province') {
      return provinces.value.filter(p => !q || p.name.toLowerCase().includes(q));
    }
    if (currentLevel.value === 'regency') {
      return regencies.value.filter(r => !q || r.name.toLowerCase().includes(q));
    }
    if (currentLevel.value === 'district') {
      return districts.value.filter(d => !q || d.name.toLowerCase().includes(q));
    }
    if (currentLevel.value === 'village') {
      return villages.value.filter(v => !q || v.name.toLowerCase().includes(q));
    }
    return [];
  });

  const fullAddress = computed(() => {
    const parts = [];
    if (selectedVillage.value) parts.push(selectedVillage.value.name);
    if (selectedDistrict.value) parts.push(`Kec. ${selectedDistrict.value.name}`);
    if (selectedRegency.value) parts.push(selectedRegency.value.name);
    if (selectedProvince.value) parts.push(`Prov. ${selectedProvince.value.name}`);
    return parts.join(', ');
  });

  return {
    provinces,
    regencies,
    districts,
    villages,
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    selectedVillage,
    currentLevel,
    searchQuery,
    loading,
    error,
    filteredList,
    fullAddress,
    loadProvinces,
    selectProvince,
    selectRegency,
    selectDistrict,
    selectVillage,
    jumpToLevel
  };
});
