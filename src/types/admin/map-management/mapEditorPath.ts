export interface MapEditorPathPoint {
  x: number;
  y: number;
}

export interface CreateMapEditorPathPayload {
  floorPlanId: string;
  name?: string;
  points: MapEditorPathPoint[];
  color?: string;
  strokeWidth?: number;
}

export interface UpdateMapEditorPathPayload {
  name?: string;
  points?: MapEditorPathPoint[];
  color?: string;
  strokeWidth?: number;
  isActive?: boolean;
}

export interface MapEditorPathQuery {
  floorPlanId: string;
  isActive?: boolean | undefined;
  search?: string | undefined;
}

export interface MapEditorPathOverview {
  id: string;
  floorPlan: {
    id: string;
    title: string;
    floorLabel: string;
  };
  name?: string;
  points: MapEditorPathPoint[];
  color?: string;
  strokeWidth?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

