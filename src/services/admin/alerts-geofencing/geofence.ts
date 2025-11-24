"use strict";

import { Types } from "mongoose";
import Geofence, { GeofenceType } from "../../../models/admin/alerts-geofencing/geofence";
import {
  CreateGeofenceRequest,
  UpdateGeofenceRequest,
  GeofenceQuery,
  GeofenceStats,
  GeofenceListResponse,
  GeofenceResponse,
  GeofenceStatsResponse,
} from "../../../types/admin/alerts-geofencing/geofence";
import MapBuilding from "../../../models/admin/map-management/mapBuilding";

const toObjectId = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }
  return new Types.ObjectId(value);
};

export class GeofenceService {
  private buildQuery(query: GeofenceQuery) {
    const dbQuery: Record<string, unknown> = {};

    if (!query.organizationId || query.organizationId.trim() === "") {
      throw new Error("Organization ID is required");
    }

    const organizationId = toObjectId(query.organizationId);
    if (!organizationId) {
      throw new Error("Invalid organization ID format");
    }
    
    dbQuery.organization = organizationId;

    const buildingId = toObjectId(query.buildingId);
    if (buildingId) {
      dbQuery.building = buildingId;
    }

    const floorId = toObjectId(query.floorId);
    if (floorId) {
      dbQuery.floor = floorId;
    }

    if (query.type) {
      dbQuery.type = query.type;
    }

    if (query.isActive !== undefined) {
      dbQuery.isActive = query.isActive;
    }

    if (query.search) {
      dbQuery.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } },
      ];
    }

    return dbQuery;
  }

  async createGeofence(data: CreateGeofenceRequest, userId?: string): Promise<GeofenceResponse> {
    const organizationId = toObjectId(data.organizationId);
    if (!organizationId) {
      throw new Error("Invalid organization ID");
    }

    const geofenceData: any = {
      organization: organizationId,
      name: data.name.trim(),
      type: data.type,
      alertOnEntry: data.alertOnEntry !== undefined ? data.alertOnEntry : true,
      alertOnExit: data.alertOnExit !== undefined ? data.alertOnExit : false,
      notificationSettings: data.notificationSettings || {
        email: false,
        sms: false,
        push: false,
        sound: false,
      },
      isActive: true,
    };

    if (data.description) {
      geofenceData.description = data.description.trim();
    }

    if (data.buildingId) {
      const buildingId = toObjectId(data.buildingId);
      if (buildingId) geofenceData.building = buildingId;
    }

    if (data.floorId) {
      const floorId = toObjectId(data.floorId);
      if (floorId) geofenceData.floor = floorId;
    }

    if (data.coordinates) {
      geofenceData.coordinates = data.coordinates;
    }

    if (userId) {
      const createdBy = toObjectId(userId);
      if (createdBy) geofenceData.createdBy = createdBy;
    }

    const geofence = await Geofence.create(geofenceData);

    const populatedGeofence = await Geofence.findById(geofence._id)
      .populate("organization", "name")
      .populate("building", "name")
      .populate("floor", "title")
      .lean();

    return {
      success: true,
      message: "Geofence created successfully",
      data: { geofence: populatedGeofence as any },
    };
  }

  async getGeofences(query: GeofenceQuery): Promise<GeofenceListResponse> {
    const dbQuery = this.buildQuery(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [geofences, total] = await Promise.all([
      Geofence.find(dbQuery)
        .populate("organization", "name")
        .populate("building", "name")
        .populate("floor", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Geofence.countDocuments(dbQuery),
    ]);

    const buildings = await MapBuilding.find({
      organization: toObjectId(query.organizationId),
      isActive: true,
    })
      .select("_id name")
      .lean();

    return {
      success: true,
      message: "Geofences retrieved successfully",
      data: {
        geofences: geofences as any[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        availableFilters: {
          types: Object.values(GeofenceType),
          buildings: buildings.map((b: any) => ({ id: b._id.toString(), name: b.name })),
        },
      },
    };
  }

  async getGeofenceById(id: string): Promise<GeofenceResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid geofence ID");
    }

    const geofence = await Geofence.findById(id)
      .populate("organization", "name")
      .populate("building", "name")
      .populate("floor", "title")
      .lean();

    if (!geofence) {
      throw new Error("Geofence not found");
    }

    return {
      success: true,
      message: "Geofence retrieved successfully",
      data: { geofence: geofence as any },
    };
  }

  async updateGeofence(id: string, data: UpdateGeofenceRequest, userId?: string): Promise<GeofenceResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid geofence ID");
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description ? data.description.trim() : null;
    }

    if (data.type !== undefined) {
      updateData.type = data.type;
    }

    if (data.buildingId !== undefined) {
      const buildingId = toObjectId(data.buildingId);
      updateData.building = buildingId;
    }

    if (data.floorId !== undefined) {
      const floorId = toObjectId(data.floorId);
      updateData.floor = floorId;
    }

    if (data.coordinates !== undefined) {
      updateData.coordinates = data.coordinates;
    }

    if (data.alertOnEntry !== undefined) {
      updateData.alertOnEntry = data.alertOnEntry;
    }

    if (data.alertOnExit !== undefined) {
      updateData.alertOnExit = data.alertOnExit;
    }

    if (data.notificationSettings !== undefined) {
      updateData.notificationSettings = data.notificationSettings;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    if (userId) {
      const updatedBy = toObjectId(userId);
      if (updatedBy) updateData.updatedBy = updatedBy;
    }

    const geofence = await Geofence.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate("organization", "name")
      .populate("building", "name")
      .populate("floor", "title")
      .lean();

    if (!geofence) {
      throw new Error("Geofence not found");
    }

    return {
      success: true,
      message: "Geofence updated successfully",
      data: { geofence: geofence as any },
    };
  }

  async deleteGeofence(id: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid geofence ID");
    }

    const geofence = await Geofence.findByIdAndDelete(id);

    if (!geofence) {
      throw new Error("Geofence not found");
    }

    return {
      success: true,
      message: "Geofence deleted successfully",
    };
  }

  async toggleGeofence(id: string, isActive: boolean): Promise<GeofenceResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid geofence ID");
    }

    const geofence = await Geofence.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    )
      .populate("organization", "name")
      .populate("building", "name")
      .populate("floor", "title")
      .lean();

    if (!geofence) {
      throw new Error("Geofence not found");
    }

    return {
      success: true,
      message: `Geofence ${isActive ? "activated" : "deactivated"} successfully`,
      data: { geofence: geofence as any },
    };
  }

  async getGeofenceStats(organizationId: string): Promise<GeofenceStatsResponse> {
    const orgId = toObjectId(organizationId);
    if (!orgId) {
      throw new Error("Invalid organization ID");
    }

    const [totalZones, activeZones, inactiveZones] = await Promise.all([
      Geofence.countDocuments({ organization: orgId }),
      Geofence.countDocuments({ organization: orgId, isActive: true }),
      Geofence.countDocuments({ organization: orgId, isActive: false }),
    ]);

    const Alert = require("../../../models/admin/alerts-geofencing/alert").default;
    const { AlertType } = require("../../../models/admin/alerts-geofencing/alert");
    const zoneTriggers = await Alert.countDocuments({
      organization: orgId,
      type: AlertType.GEOFENCE_TRIGGER,
      isActive: true,
    });

    const stats: GeofenceStats = {
      totalZones,
      activeZones,
      inactiveZones,
      zoneTriggers,
    };

    return {
      success: true,
      message: "Geofence stats retrieved successfully",
      data: { stats },
    };
  }
}

export const geofenceService = new GeofenceService();

