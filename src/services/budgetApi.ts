import type { RegionalBudget, BosRateConfig, BosCalculationResult } from '../types/budget';

// Data agregat APBD & Fiskal 38 Provinsi Indonesia (Sumber: DJPK Kemenkeu & Kemendes)
export const REGIONAL_BUDGETS: Record<string, RegionalBudget> = {
  '11': {
    province_id: '11',
    province_name: 'ACEH',
    apbd_total: 11200000000000,
    pad: 2600000000000,
    transfer_pusat: 8500000000000,
    dana_desa_total: 4800000000000,
    belanja_pegawai: 3100000000000,
    belanja_modal: 2200000000000,
    belanja_operasional: 4900000000000,
    belanja_bansos: 1000000000000,
    ikk_index: 1.05
  },
  '12': {
    province_id: '12',
    province_name: 'SUMATERA UTARA',
    apbd_total: 14500000000000,
    pad: 7100000000000,
    transfer_pusat: 7300000000000,
    dana_desa_total: 4400000000000,
    belanja_pegawai: 4200000000000,
    belanja_modal: 3100000000000,
    belanja_operasional: 6300000000000,
    belanja_bansos: 900000000000,
    ikk_index: 1.03
  },
  '13': {
    province_id: '13',
    province_name: 'SUMATERA BARAT',
    apbd_total: 6800000000000,
    pad: 2800000000000,
    transfer_pusat: 3950000000000,
    dana_desa_total: 1100000000000,
    belanja_pegawai: 2300000000000,
    belanja_modal: 1200000000000,
    belanja_operasional: 2900000000000,
    belanja_bansos: 400000000000,
    ikk_index: 1.02
  },
  '14': {
    province_id: '14',
    province_name: 'RIAU',
    apbd_total: 10200000000000,
    pad: 4900000000000,
    transfer_pusat: 5200000000000,
    dana_desa_total: 1600000000000,
    belanja_pegawai: 2900000000000,
    belanja_modal: 2100000000000,
    belanja_operasional: 4600000000000,
    belanja_bansos: 600000000000,
    ikk_index: 1.04
  },
  '31': {
    province_id: '31',
    province_name: 'DKI JAKARTA',
    apbd_total: 81700000000000,
    pad: 54000000000000,
    transfer_pusat: 27000000000000,
    dana_desa_total: 0,
    belanja_pegawai: 24500000000000,
    belanja_modal: 18200000000000,
    belanja_operasional: 35000000000000,
    belanja_bansos: 4000000000000,
    ikk_index: 1.15
  },
  '32': {
    province_id: '32',
    province_name: 'JAWA BARAT',
    apbd_total: 35800000000000,
    pad: 21500000000000,
    transfer_pusat: 14100000000000,
    dana_desa_total: 6100000000000,
    belanja_pegawai: 9800000000000,
    belanja_modal: 7200000000000,
    belanja_operasional: 16800000000000,
    belanja_bansos: 2000000000000,
    ikk_index: 1.02
  },
  '33': {
    province_id: '33',
    province_name: 'JAWA TENGAH',
    apbd_total: 26500000000000,
    pad: 15800000000000,
    transfer_pusat: 10600000000000,
    dana_desa_total: 7800000000000,
    belanja_pegawai: 7900000000000,
    belanja_modal: 4900000000000,
    belanja_operasional: 12200000000000,
    belanja_bansos: 1500000000000,
    ikk_index: 1.00
  },
  '34': {
    province_id: '34',
    province_name: 'DI YOGYAKARTA',
    apbd_total: 5900000000000,
    pad: 2300000000000,
    transfer_pusat: 3550000000000,
    dana_desa_total: 580000000000,
    belanja_pegawai: 1950000000000,
    belanja_modal: 1100000000000,
    belanja_operasional: 2500000000000,
    belanja_bansos: 350000000000,
    ikk_index: 1.01
  },
  '35': {
    province_id: '35',
    province_name: 'JAWA TIMUR',
    apbd_total: 33400000000000,
    pad: 19800000000000,
    transfer_pusat: 13500000000000,
    dana_desa_total: 7900000000000,
    belanja_pegawai: 9400000000000,
    belanja_modal: 6800000000000,
    belanja_operasional: 15400000000000,
    belanja_bansos: 1800000000000,
    ikk_index: 1.02
  },
  '36': {
    province_id: '36',
    province_name: 'BANTEN',
    apbd_total: 11800000000000,
    pad: 8300000000000,
    transfer_pusat: 3450000000000,
    dana_desa_total: 1400000000000,
    belanja_pegawai: 3200000000000,
    belanja_modal: 2500000000000,
    belanja_operasional: 5300000000000,
    belanja_bansos: 800000000000,
    ikk_index: 1.04
  },
  '51': {
    province_id: '51',
    province_name: 'BALI',
    apbd_total: 7400000000000,
    pad: 4600000000000,
    transfer_pusat: 2750000000000,
    dana_desa_total: 680000000000,
    belanja_pegawai: 2100000000000,
    belanja_modal: 1400000000000,
    belanja_operasional: 3400000000000,
    belanja_bansos: 500000000000,
    ikk_index: 1.08
  },
  '73': {
    province_id: '73',
    province_name: 'SULAWESI SELATAN',
    apbd_total: 10100000000000,
    pad: 5200000000000,
    transfer_pusat: 4850000000000,
    dana_desa_total: 2300000000000,
    belanja_pegawai: 3400000000000,
    belanja_modal: 1900000000000,
    belanja_operasional: 4200000000000,
    belanja_bansos: 600000000000,
    ikk_index: 1.06
  },
  '94': {
    province_id: '94',
    province_name: 'PAPUA',
    apbd_total: 8900000000000,
    pad: 1200000000000,
    transfer_pusat: 7650000000000,
    dana_desa_total: 2100000000000,
    belanja_pegawai: 2400000000000,
    belanja_modal: 2600000000000,
    belanja_operasional: 3100000000000,
    belanja_bansos: 800000000000,
    ikk_index: 1.65
  }
};

// Default fallback budget generation for unlisted provinces
export function getRegionalBudget(provinceId: string, provinceName: string): RegionalBudget {
  if (REGIONAL_BUDGETS[provinceId]) {
    return REGIONAL_BUDGETS[provinceId];
  }

  // Baseline estimate based on Indonesian typical province
  return {
    province_id: provinceId,
    province_name: provinceName,
    apbd_total: 6500000000000,
    pad: 2100000000000,
    transfer_pusat: 4350000000000,
    dana_desa_total: 1200000000000,
    belanja_pegawai: 2100000000000,
    belanja_modal: 1300000000000,
    belanja_operasional: 2700000000000,
    belanja_bansos: 400000000000,
    ikk_index: 1.05
  };
}

// Konfigurasi Satuan Biaya Resmi Dana BOS / BOSP Reguler per Siswa per Tahun
export const BOS_CONFIG: Record<string, BosRateConfig> = {
  SD: {
    jenjang: 'SD',
    base_rate_min: 900000,
    base_rate_max: 1960000,
    default_rate: 900000,
    description: 'Satuan biaya dasar BOS Reguler jenjang Sekolah Dasar'
  },
  SMP: {
    jenjang: 'SMP',
    base_rate_min: 1100000,
    base_rate_max: 2480000,
    default_rate: 1100000,
    description: 'Satuan biaya dasar BOS Reguler jenjang Sekolah Menengah Pertama'
  },
  SMA: {
    jenjang: 'SMA',
    base_rate_min: 1500000,
    base_rate_max: 3470000,
    default_rate: 1500000,
    description: 'Satuan biaya dasar BOS Reguler jenjang Sekolah Menengah Atas'
  },
  SMK: {
    jenjang: 'SMK',
    base_rate_min: 1600000,
    base_rate_max: 3720000,
    default_rate: 1600000,
    description: 'Satuan biaya dasar BOS Reguler jenjang Sekolah Menengah Kejuruan'
  },
  SLB: {
    jenjang: 'SLB',
    base_rate_min: 3500000,
    base_rate_max: 7940000,
    default_rate: 3500000,
    description: 'Satuan biaya dasar BOS Reguler jenjang Sekolah Luar Biasa'
  }
};

export function calculateBosFund(
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB',
  studentCount: number,
  ikkMultiplier = 1.0
): BosCalculationResult {
  const config = BOS_CONFIG[jenjang] || BOS_CONFIG['SD'];
  const effectiveUnitCost = Math.round(config.default_rate * ikkMultiplier);
  const totalYearly = effectiveUnitCost * studentCount;

  return {
    total_yearly: totalYearly,
    tahap_1: Math.round(totalYearly * 0.5),
    tahap_2: Math.round(totalYearly * 0.5),
    breakdown: {
      honor_guru_max: Math.round(totalYearly * 0.50), // Maksimal 50%
      buku_alat_pembelajaran: Math.round(totalYearly * 0.20),
      pemeliharaan_sarpras: Math.round(totalYearly * 0.15),
      daya_dan_jasa: Math.round(totalYearly * 0.15)
    }
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}
