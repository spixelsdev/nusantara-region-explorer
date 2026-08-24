export interface SchoolItem {
  id: string;
  npsn: string;
  sekolah: string;
  bentuk: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB' | string;
  status: 'N' | 'S' | string; // N = Negeri, S = Swasta
  alamat_jalan: string;
  kecamatan: string;
  kabupaten_kota: string;
  propinsi: string;
  lintang?: string;
  bujur?: string;
}

export interface SchoolApiResponse {
  status: string;
  total_data: number;
  page: number;
  per_page: number;
  dataSekolah: SchoolItem[];
}
