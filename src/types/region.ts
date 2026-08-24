export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  province_id: string;
  name: string;
}

export interface District {
  id: string;
  regency_id: string;
  name: string;
}

export interface Village {
  id: string;
  district_id: string;
  name: string;
}

export type RegionLevel = 'province' | 'regency' | 'district' | 'village';

export interface SelectedRegionState {
  province: Province | null;
  regency: Regency | null;
  district: District | null;
  village: Village | null;
}
