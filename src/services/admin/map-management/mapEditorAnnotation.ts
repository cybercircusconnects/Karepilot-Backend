import MapEditorAnnotation from "../../../models/admin/map-management/mapEditorAnnotation";
import {
  CreateMapEditorAnnotationPayload,
  UpdateMapEditorAnnotationPayload,
  MapEditorAnnotationQuery,
  MapEditorAnnotation as MapEditorAnnotationType,
} from "../../../types/admin/map-management/mapEditorAnnotation";
import { IMapEditorAnnotation } from "../../../models/admin/map-management/mapEditorAnnotation";

const serializeAnnotation = (annotation: IMapEditorAnnotation): MapEditorAnnotationType => {
  const result: MapEditorAnnotationType = {
    id: (annotation as any)._id.toString(),
    floorPlan: annotation.floorPlan.toString(),
    name: annotation.name,
    type: annotation.type,
    coordinates: annotation.coordinates,
    isActive: annotation.isActive,
    createdAt: annotation.createdAt.toISOString(),
    updatedAt: annotation.updatedAt.toISOString(),
  };

  if (annotation.description) {
    result.description = annotation.description;
  }
  if (annotation.color) {
    result.color = annotation.color;
  }
  if (annotation.createdBy) {
    result.createdBy = annotation.createdBy.toString();
  }
  if (annotation.updatedBy) {
    result.updatedBy = annotation.updatedBy.toString();
  }

  return result;
};

export const getAnnotationsByFloorPlan = async (
  query: MapEditorAnnotationQuery
): Promise<MapEditorAnnotationType[]> => {
  const filter: any = {};

  if (query.floorPlanId) {
    filter.floorPlan = query.floorPlanId;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }

  const annotations = await MapEditorAnnotation.find(filter).sort({ createdAt: -1 });

  return annotations.map(serializeAnnotation);
};

export const getAnnotationById = async (
  annotationId: string
): Promise<MapEditorAnnotationType | null> => {
  const annotation = await MapEditorAnnotation.findById(annotationId);

  if (!annotation) {
    return null;
  }

  return serializeAnnotation(annotation);
};

export const createAnnotation = async (
  payload: CreateMapEditorAnnotationPayload,
  userId?: string
): Promise<MapEditorAnnotationType> => {
  const annotation = await MapEditorAnnotation.create({
    floorPlan: payload.floorPlanId,
    name: payload.name,
    description: payload.description,
    type: payload.type,
    coordinates: payload.coordinates,
    color: payload.color || "#F59E0B",
    isActive: true,
    createdBy: userId,
    updatedBy: userId,
  });

  return serializeAnnotation(annotation);
};

export const updateAnnotation = async (
  annotationId: string,
  payload: UpdateMapEditorAnnotationPayload,
  userId?: string
): Promise<MapEditorAnnotationType | null> => {
  const updateData: any = {
    ...payload,
    updatedBy: userId,
  };

  const annotation = await MapEditorAnnotation.findByIdAndUpdate(
    annotationId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!annotation) {
    return null;
  }

  return serializeAnnotation(annotation);
};

export const deleteAnnotation = async (
  annotationId: string,
  userId?: string
): Promise<MapEditorAnnotationType | null> => {
  const annotation = await MapEditorAnnotation.findByIdAndUpdate(
    annotationId,
    { isActive: false, updatedBy: userId },
    { new: true }
  );

  if (!annotation) {
    return null;
  }

  return serializeAnnotation(annotation);
};

