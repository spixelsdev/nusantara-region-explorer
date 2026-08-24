import type { Province, Regency, District, Village } from '../types/region';

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

const memoryCache = new Map<string, any>();

async function fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey) as T;
  }

  try {
    const cached = localStorage.getItem(`nre_${cacheKey}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      memoryCache.set(cacheKey, parsed);
      return parsed;
    }
  } catch (e) {
    // localStorage disabled/unavailable
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Gagal mengambil data dari ${url}: ${res.statusText}`);
  }
  const data = await res.json();
  memoryCache.set(cacheKey, data);

  try {
    localStorage.setItem(`nre_${cacheKey}`, JSON.stringify(data));
  } catch (e) {
    // quota exceeded or disabled
  }

  return data;
}

export const regionApi = {
  getProvinces: (): Promise<Province[]> => {
    return fetchWithCache<Province[]>(`${BASE_URL}/provinces.json`, 'provinces');
  },

  getRegencies: (provinceId: string): Promise<Regency[]> => {
    return fetchWithCache<Regency[]>(`${BASE_URL}/regencies/${provinceId}.json`, `regencies_${provinceId}`);
  },

  getDistricts: (regencyId: string): Promise<District[]> => {
    return fetchWithCache<District[]>(`${BASE_URL}/districts/${regencyId}.json`, `districts_${regencyId}`);
  },

  getVillages: (districtId: string): Promise<Village[]> => {
    return fetchWithCache<Village[]>(`${BASE_URL}/villages/${districtId}.json`, `villages_${districtId}`);
  }
};
