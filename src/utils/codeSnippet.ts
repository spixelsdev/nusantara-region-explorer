export function generateCurlSnippet(type: string, id?: string): string {
  const base = 'https://www.emsifa.com/api-wilayah-indonesia/api';
  switch (type) {
    case 'province':
      return `curl -s "${base}/provinces.json"`;
    case 'regency':
      return `curl -s "${base}/regencies/${id || '{province_id}'}.json"`;
    case 'district':
      return `curl -s "${base}/districts/${id || '{regency_id}'}.json"`;
    case 'village':
      return `curl -s "${base}/villages/${id || '{district_id}'}.json"`;
    default:
      return '';
  }
}

export function generateFetchSnippet(type: string, id?: string): string {
  const base = 'https://www.emsifa.com/api-wilayah-indonesia/api';
  const endpoint = type === 'province' 
    ? `${base}/provinces.json`
    : type === 'regency'
    ? `${base}/regencies/${id || '32'}.json`
    : type === 'district'
    ? `${base}/districts/${id || '3201'}.json`
    : `${base}/villages/${id || '3201010'}.json`;

  return `// JavaScript / TypeScript Fetch Example
async function getRegionData() {
  const res = await fetch("${endpoint}");
  if (!res.ok) throw new Error("Gagal mengambil data wilayah");
  const data = await res.json();
  console.log(data);
  return data;
}

getRegionData();`;
}

export function generateVueComposableSnippet(): string {
  return `// useIndonesiaRegion.ts
import { ref } from 'vue';

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

export function useIndonesiaRegion() {
  const provinces = ref([]);
  const regencies = ref([]);
  const districts = ref([]);
  const villages = ref([]);

  const fetchProvinces = async () => {
    const res = await fetch(\`\${BASE_URL}/provinces.json\`);
    provinces.value = await res.json();
  };

  const fetchRegencies = async (provinceId: string) => {
    const res = await fetch(\`\${BASE_URL}/regencies/\${provinceId}.json\`);
    regencies.value = await res.json();
  };

  const fetchDistricts = async (regencyId: string) => {
    const res = await fetch(\`\${BASE_URL}/districts/\${regencyId}.json\`);
    districts.value = await res.json();
  };

  const fetchVillages = async (districtId: string) => {
    const res = await fetch(\`\${BASE_URL}/villages/\${districtId}.json\`);
    villages.value = await res.json();
  };

  return {
    provinces,
    regencies,
    districts,
    villages,
    fetchProvinces,
    fetchRegencies,
    fetchDistricts,
    fetchVillages
  };
}`;
}

export function downloadJsonFile(filename: string, data: any) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCsvFile(filename: string, data: Array<Record<string, any>>) {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => `"${(obj[header] ?? '').toString().replace(/"/g, '""')}"`).join(','));
  const csvContent = [headers.join(','), ...rows].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
