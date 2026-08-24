import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Province, Regency, District, Village, RegionLevel, GlobalSearchResult } from '../types/region';
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

  // Command Palette State
  const isCommandPaletteOpen = ref(false);
  const globalSearchQuery = ref('');
  const isGlobalSearching = ref(false);

  // URL Sync Helper
  function updateUrlParams() {
    const params = new URLSearchParams();
    if (selectedProvince.value) params.set('prov', selectedProvince.value.id);
    if (selectedRegency.value) params.set('kab', selectedRegency.value.id);
    if (selectedDistrict.value) params.set('kec', selectedDistrict.value.id);
    if (selectedVillage.value) params.set('des', selectedVillage.value.id);

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }

  // Load Initial Provinces & Parse URL State
  async function loadProvinces() {
    loading.value = true;
    error.value = null;
    try {
      const data = await regionApi.getProvinces();
      // Tag DOB if relevant
      provinces.value = data.map(p => ({
        ...p,
        isDOB: ['92', '93', '95', '96'].includes(p.id)
      }));

      // Check URL Deep Linking params
      const urlParams = new URLSearchParams(window.location.search);
      const provId = urlParams.get('prov');
      const kabId = urlParams.get('kab');
      const kecId = urlParams.get('kec');
      const desId = urlParams.get('des');

      if (provId) {
        const foundProv = provinces.value.find(p => p.id === provId);
        if (foundProv) {
          await selectProvince(foundProv, false);
          if (kabId) {
            const foundReg = regencies.value.find(r => r.id === kabId);
            if (foundReg) {
              await selectRegency(foundReg, false);
              if (kecId) {
                const foundDist = districts.value.find(d => d.id === kecId);
                if (foundDist) {
                  await selectDistrict(foundDist, false);
                  if (desId) {
                    const foundVil = villages.value.find(v => v.id === desId);
                    if (foundVil) {
                      selectVillage(foundVil, false);
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat data provinsi';
    } finally {
      loading.value = false;
    }
  }

  async function selectProvince(prov: Province, updateUrl = true) {
    selectedProvince.value = prov;
    selectedRegency.value = null;
    selectedDistrict.value = null;
    selectedVillage.value = null;
    regencies.value = [];
    districts.value = [];
    villages.value = [];
    currentLevel.value = 'regency';
    searchQuery.value = '';

    if (updateUrl) updateUrlParams();

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

  async function selectRegency(reg: Regency, updateUrl = true) {
    selectedRegency.value = reg;
    selectedDistrict.value = null;
    selectedVillage.value = null;
    districts.value = [];
    villages.value = [];
    currentLevel.value = 'district';
    searchQuery.value = '';

    if (updateUrl) updateUrlParams();

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

  async function selectDistrict(dist: District, updateUrl = true) {
    selectedDistrict.value = dist;
    selectedVillage.value = null;
    villages.value = [];
    currentLevel.value = 'village';
    searchQuery.value = '';

    if (updateUrl) updateUrlParams();

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

  function selectVillage(vil: Village, updateUrl = true) {
    selectedVillage.value = vil;
    if (updateUrl) updateUrlParams();
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
    updateUrlParams();
  }

  // Jump from global search result
  async function jumpToResult(result: GlobalSearchResult) {
    isCommandPaletteOpen.value = false;
    globalSearchQuery.value = '';

    if (result.level === 'province') {
      const p = provinces.value.find(item => item.id === result.id);
      if (p) await selectProvince(p);
    } else if (result.level === 'regency' && result.provinceId) {
      const p = provinces.value.find(item => item.id === result.provinceId);
      if (p) {
        await selectProvince(p, false);
        const r = regencies.value.find(item => item.id === result.id);
        if (r) await selectRegency(r);
      }
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

  const shareableUrl = computed(() => {
    return window.location.href;
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
    isCommandPaletteOpen,
    globalSearchQuery,
    isGlobalSearching,
    filteredList,
    fullAddress,
    shareableUrl,
    loadProvinces,
    selectProvince,
    selectRegency,
    selectDistrict,
    selectVillage,
    jumpToLevel,
    jumpToResult
  };
});
