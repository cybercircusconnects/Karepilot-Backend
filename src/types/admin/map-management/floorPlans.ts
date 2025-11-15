export enum MapFloorPlanStatus {
  DRAFT = "Draft",
  PUBLISHED = "Published",
  DISABLED = "Disabled",
  ARCHIVED = "Archived",
}

export interface MapFloorPlanMedia {
  fileUrl?: string | null; 
  fileKey?: string | null; 
  thumbnailUrl?: string | null;
  thumbnailKey?: string | null; 
}

export interface MapFloorPlanMetadata {
  scale?: string | null;
  description?: string | null;
  tags?: string[];
  highlights?: string[];
}

export interface CreateMapFloorPlanPayload {
  organizationId: string;
  buildingId: string;
  title: string;
  floorLabel: string;
  floorNumber?: number | null;
  status?: MapFloorPlanStatus;
  media?: MapFloorPlanMedia;
  metadata?: MapFloorPlanMetadata;
  isTemplate?: boolean;
  versionNotes?: string | null;
}

export interface UpdateMapFloorPlanPayload {
  buildingId?: string;
  title?: string;
  floorLabel?: string;
  floorNumber?: number | null;
  status?: MapFloorPlanStatus;
  media?: MapFloorPlanMedia;
  metadata?: MapFloorPlanMetadata;
  isTemplate?: boolean;
  versionNotes?: string | null;
  incrementVersion?: boolean;
}

export interface MapFloorPlanQuery {
  organizationId?: string;
  buildingId?: string;
  status?: MapFloorPlanStatus | MapFloorPlanStatus[];
  search?: string;
  tags?: string | string[];
  floorLabel?: string;
  page?: number;
  limit?: number;
}

export interface MapFloorPlanOverview {
  id: string;
  title: string;
  floorLabel: string;
  floorNumber?: number | null;
  status: MapFloorPlanStatus;
  building?: {
    id: string;
    name: string;
  } | null;
  metadata: MapFloorPlanMetadata;
  media: MapFloorPlanMedia;
  version: number;
  versionNotes?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MapFloorPlanListResponse {
  floorPlans: MapFloorPlanOverview[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  stats: {
    totalMaps: number;
    publishedMaps: number;
    draftedMaps: number;
    disabledMaps: number;
    archivedMaps: number;
    buildings: number;
  };
  availableFilters: {
    buildings: {
      id: string;
      name: string;
      floors: number;
    }[];
    statuses: MapFloorPlanStatus[];
    tags: string[];
    floorLabels: string[];
  };
}

