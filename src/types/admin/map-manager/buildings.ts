export interface BuildingAddressInput {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface BuildingGeoLocationInput {
  latitude?: number;
  longitude?: number;
}

export interface CreateBuildingDTO {
  organization: string;
  name: string;
  code?: string;
  description?: string;
  tags?: string[];
  address?: BuildingAddressInput;
  geoLocation?: BuildingGeoLocationInput;
  defaultFloor?: string | null;
  metadata?: Record<string, any>;
  isActive?: boolean;
}

export interface UpdateBuildingDTO {
  name?: string;
  code?: string;
  description?: string;
  tags?: string[];
  address?: BuildingAddressInput | null;
  geoLocation?: BuildingGeoLocationInput | null;
  defaultFloor?: string | null;
  metadata?: Record<string, any> | null;
  isActive?: boolean;
}

export interface BuildingQuery {
  page?: number | undefined;
  limit?: number | undefined;
  organization?: string | undefined;
  search?: string | undefined;
  isActive?: boolean | undefined;
  tag?: string | undefined;
}

export interface BuildingStats {
  total: number;
  active: number;
  inactive: number;
  totalFloors: number;
}


