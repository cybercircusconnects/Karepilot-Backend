export interface MapEditorLabelCoordinates {
  x: number;
  y: number;
}

export interface CreateMapEditorLabelPayload {
  floorPlanId: string;
  text: string;
  coordinates: MapEditorLabelCoordinates;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}

export interface UpdateMapEditorLabelPayload {
  text?: string;
  coordinates?: MapEditorLabelCoordinates;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  isActive?: boolean;
}

export interface MapEditorLabelQuery {
  floorPlanId: string;
  isActive?: boolean | undefined;
  search?: string | undefined;
}

export interface MapEditorLabelOverview {
  id: string;
  floorPlan: {
    id: string;
    title: string;
    floorLabel: string;
  };
  text: string;
  coordinates: MapEditorLabelCoordinates;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

