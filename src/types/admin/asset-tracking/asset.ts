import { AssetType, AssetStatus } from "../../../models/admin/asset-tracking/asset";

export interface CreateAssetData {
  organization: string;
  name: string;
  type: AssetType;
  status?: AssetStatus;
  building?: string | null;
  floor?: string | null;
  location?: string | null;
  department?: string | null;
  batteryLevel?: number | null;
  lastSeen?: Date | null;
  mapCoordinates?: {
    x?: number | null;
    y?: number | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  description?: string | null;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateAssetData {
  name?: string;
  type?: AssetType;
  status?: AssetStatus;
  building?: string | null;
  floor?: string | null;
  location?: string | null;
  department?: string | null;
  batteryLevel?: number | null;
  lastSeen?: Date | null;
  mapCoordinates?: {
    x?: number | null;
    y?: number | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  description?: string | null;
  tags?: string[];
  isActive?: boolean;
}

export interface AssetQuery {
  organizationId?: string;
  buildingId?: string;
  floorId?: string;
  departmentId?: string;
  type?: AssetType | AssetType[];
  status?: AssetStatus | AssetStatus[];
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface AssetStats {
  total: number;
  online: number;
  offline: number;
  lowBattery: number;
  byType: {
    device: number;
    equipment: number;
    staff: number;
    personnel: number;
  };
}

export interface AssetListResponse {
  assets: any[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

