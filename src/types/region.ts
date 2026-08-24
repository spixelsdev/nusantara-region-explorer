export interface Province {
  id: string;
  name: string;
  isDOB?: boolean;
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

export interface GlobalSearchResult {
  id: string;
  name: string;
  level: RegionLevel;
  parentName?: string;
  provinceId?: string;
  regencyId?: string;
  districtId?: string;
}
