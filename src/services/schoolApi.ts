import type { SchoolApiResponse } from '../types/school';

const SCHOOL_API_BASE = 'https://api-sekolah-indonesia.vercel.app';

export const schoolApi = {
  searchSchool: async (query: string, page = 1, perPage = 20): Promise<SchoolApiResponse> => {
    const encoded = encodeURIComponent(query);
    const res = await fetch(`${SCHOOL_API_BASE}/sekolah/s?sekolah=${encoded}&page=${page}&perPage=${perPage}`);
    if (!res.ok) {
      throw new Error(`Gagal mengambil data sekolah: ${res.statusText}`);
    }
    return res.json();
  },

  getSchoolsByLevel: async (level: 'sd' | 'smp' | 'sma' | 'smk' | 'slb', page = 1, perPage = 20): Promise<SchoolApiResponse> => {
    const res = await fetch(`${SCHOOL_API_BASE}/sekolah/${level}?page=${page}&perPage=${perPage}`);
    if (!res.ok) {
      throw new Error(`Gagal mengambil data sekolah: ${res.statusText}`);
    }
    return res.json();
  }
};
