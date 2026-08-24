export interface RegionalBudget {
  province_id: string;
  province_name: string;
  apbd_total: number; // in Rupiah
  pad: number; // Pendapatan Asli Daerah
  transfer_pusat: number; // DAU + DAK + DBH
  dana_desa_total?: number; // Total alokasi dana desa di wilayah tsb
  belanja_pegawai: number;
  belanja_modal: number;
  belanja_operasional: number;
  belanja_bansos: number;
  ikk_index: number; // Indeks Kemahalan Konstruksi / Daerah (multiplier BOS)
}

export interface BosRateConfig {
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB';
  base_rate_min: number;
  base_rate_max: number;
  default_rate: number;
  description: string;
}

export interface BosCalculationResult {
  total_yearly: number;
  tahap_1: number; // 50%
  tahap_2: number; // 50%
  breakdown: {
    honor_guru_max: number; // 50%
    buku_alat_pembelajaran: number; // 20%
    pemeliharaan_sarpras: number; // 15%
    daya_dan_jasa: number; // 15%
  };
}
