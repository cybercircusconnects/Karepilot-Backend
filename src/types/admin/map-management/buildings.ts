import { MapFloorPlanStatus } from "./floorPlans";

export enum MapBuildingStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  ARCHIVED = "Archived",
}

export interface MapBuildingSummary {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  tags: string[];
  status: MapBuildingStatus;
  organization: {
    id: string;
    name: string;
  } | null;
  template?: {
    id: string;
    name: string;
  } | null;
  floors: number;
  publishedFloors: number;
  draftedFloors: number;
  disabledFloors: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreateMapBuildingPayload {
  organizationId: string;
  name: string;
  code?: string | null;
  description?: string | null;
  tags?: string[];
  status?: MapBuildingStatus;
  venueTemplateId?: string | null;
  isActive?: boolean;
}

export interface UpdateMapBuildingPayload {
  name?: string;
  code?: string | null;
  description?: string | null;
  tags?: string[];
  status?: MapBuildingStatus;
  venueTemplateId?: string | null;
  isActive?: boolean;
}

export interface MapBuildingQuery {
  organizationId?: string;
  status?: MapBuildingStatus | MapBuildingStatus[];
  search?: string;
  tags?: string | string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface MapBuildingListResponse {
  buildings: MapBuildingSummary[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  stats: {
    totalBuildings: number;
    activeBuildings: number;
    inactiveBuildings: number;
  };
  floorStats: {
    totalFloors: number;
    publishedFloors: number;
    draftedFloors: number;
    disabledFloors: number;
  };
  availableFilters: {
    statuses: MapFloorPlanStatus[];
    tags: string[];
  };
}

