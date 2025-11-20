import { Types } from "mongoose";

export interface MapEditorAnnotationCoordinates {
  x: number;
  y: number;
}

export interface MapEditorAnnotation {
  id: string;
  floorPlan: string;
  name: string;
  description?: string;
  type: string;
  coordinates: MapEditorAnnotationCoordinates;
  color?: string;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMapEditorAnnotationPayload {
  floorPlanId: string;
  name: string;
  description?: string;
  type: string;
  coordinates: MapEditorAnnotationCoordinates;
  color?: string;
}

export interface UpdateMapEditorAnnotationPayload {
  name?: string;
  description?: string;
  type?: string;
  coordinates?: MapEditorAnnotationCoordinates;
  color?: string;
  isActive?: boolean;
}

export interface MapEditorAnnotationQuery {
  floorPlanId?: string;
  isActive?: boolean;
}

export interface MapEditorAnnotationResponse {
  success: boolean;
  message: string;
  data: MapEditorAnnotation;
}

export interface MapEditorAnnotationListResponse {
  success: boolean;
  message: string;
  data: MapEditorAnnotation[];
}

