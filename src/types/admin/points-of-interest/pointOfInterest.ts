"use strict";

export enum PointOfInterestStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  MAINTENANCE = "Maintenance",
}

export interface ContactInformation {
  phone?: string | null;
  email?: string | null;
  operatingHours?: string | null;
}

export interface AccessibilityFeatures {
  wheelchairAccessible?: boolean;
  hearingLoop?: boolean;
  visualAidSupport?: boolean;
}

export interface MapCoordinates {
  x?: number | null;
  y?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreatePointOfInterestData {
  organizationId: string;
  name: string;
  category: string;
  categoryType?: string;
  building: string;
  floor: string;
  roomNumber?: string;
  description?: string;
  tags?: string[];
  amenities?: string[];
  contact?: ContactInformation;
  accessibility?: AccessibilityFeatures;
  status?: PointOfInterestStatus;
  mapCoordinates?: MapCoordinates;
  isActive?: boolean;
}

export interface UpdatePointOfInterestData
  extends Partial<
    Omit<CreatePointOfInterestData, "organizationId" | "name" | "category" | "building" | "floor">
  > {
  organizationId?: string;
  name?: string;
  category?: string;
  building?: string;
  floor?: string;
}

export interface PointOfInterestQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: PointOfInterestStatus | PointOfInterestStatus[];
  building?: string;
  floor?: string;
  organizationId?: string;
  isActive?: boolean;
}

export interface PointOfInterestListStats {
  total: number;
  active: number;
  categories: number;
  accessible: number;
}
