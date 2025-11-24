"use strict";

import { Types } from "mongoose";
import Alert, { AlertType, AlertSeverity, AlertStatus } from "../../../models/admin/alerts-geofencing/alert";
import {
  CreateAlertRequest,
  UpdateAlertRequest,
  AlertQuery,
  AlertStats,
  AlertOverviewStats,
  AlertListResponse,
  AlertResponse,
  AlertStatsResponse,
} from "../../../types/admin/alerts-geofencing/alert";
import MapBuilding from "../../../models/admin/map-management/mapBuilding";
import MapFloorPlan from "../../../models/admin/map-management/mapFloorPlan";
import Department from "../../../models/admin/user-management/departments";
import Asset from "../../../models/admin/asset-tracking/asset";

const toObjectId = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }
  return new Types.ObjectId(value);
};

export class AlertService {
  private buildQuery(query: AlertQuery) {
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

    const departmentId = toObjectId(query.departmentId);
    if (departmentId) {
      dbQuery.department = departmentId;
    }

    const assetId = toObjectId(query.assetId);
    if (assetId) {
      dbQuery.asset = assetId;
    }

    if (query.type) {
      dbQuery.type = query.type;
    }

    if (query.severity) {
      dbQuery.severity = query.severity;
    }

    if (query.status) {
      dbQuery.status = query.status;
    }

    if (query.isActive !== undefined) {
      dbQuery.isActive = query.isActive;
    }

    if (query.search) {
      dbQuery.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } },
        { location: { $regex: query.search, $options: "i" } },
      ];
    }

    return dbQuery;
  }

  async createAlert(data: CreateAlertRequest, userId?: string): Promise<AlertResponse> {
    const organizationId = toObjectId(data.organizationId);
    if (!organizationId) {
      throw new Error("Invalid organization ID");
    }

    const alertData: any = {
      organization: organizationId,
      name: data.name.trim(),
      type: data.type,
      severity: data.severity,
      status: AlertStatus.ACTIVE,
      timestamp: data.timestamp || new Date(),
      isActive: true,
    };

    if (data.description) {
      alertData.description = data.description.trim();
    }

    if (data.buildingId) {
      const buildingId = toObjectId(data.buildingId);
      if (buildingId) alertData.building = buildingId;
    }

    if (data.floorId) {
      const floorId = toObjectId(data.floorId);
      if (floorId) alertData.floor = floorId;
    }

    if (data.departmentId) {
      const departmentId = toObjectId(data.departmentId);
      if (departmentId) alertData.department = departmentId;
    }

    if (data.assetId) {
      const assetId = toObjectId(data.assetId);
      if (assetId) alertData.asset = assetId;
    }

    if (data.location) {
      alertData.location = data.location.trim();
    }

    if (data.room) {
      alertData.room = data.room.trim();
    }

    if (userId) {
      const createdBy = toObjectId(userId);
      if (createdBy) alertData.createdBy = createdBy;
    }

    const alert = await Alert.create(alertData);

    const populatedAlert = await Alert.findById(alert._id)
      .populate("organization", "name")
      .populate("building", "name")
      .populate("floor", "title")
      .populate("department", "name")
      .populate("asset", "name")
      .lean();

    return {
      success: true,
      message: "Alert created successfully",
      data: { alert: populatedAlert as any },
    };
  }

  async getAlerts(query: AlertQuery): Promise<AlertListResponse> {
    const dbQuery = this.buildQuery(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [alerts, total] = await Promise.all([
      Alert.find(dbQuery)
        .populate("organization", "name")
        .populate("building", "name")
        .populate("floor", "title")
        .populate("department", "name")
        .populate("asset", "name")
        .sort({ timestamp: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Alert.countDocuments(dbQuery),
    ]);

    const buildings = await MapBuilding.find({
      organization: toObjectId(query.organizationId),
      isActive: true,
    })
      .select("_id name")
      .lean();

    const departments = await Department.find({ isActive: true })
      .select("_id name")
      .lean();

    return {
      success: true,
      message: "Alerts retrieved successfully",
      data: {
        alerts: alerts as any[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        availableFilters: {
          types: Object.values(AlertType),
          severities: Object.values(AlertSeverity),
          statuses: Object.values(AlertStatus),
          buildings: buildings.map((b: any) => ({ id: b._id.toString(), name: b.name })),
          departments: departments.map((d: any) => ({ id: d._id.toString(), name: d.name })),
        },
      },
    };
  }

  async getAlertById(id: string): Promise<AlertResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid alert ID");
    }

    const alert = await Alert.findById(id)
      .populate("organization", "name")
      .populate("building", "name")
      .populate("floor", "title")
      .populate("department", "name")
      .populate("asset", "name")
      .populate("acknowledgedBy", "firstName lastName")
      .populate("resolvedBy", "firstName lastName")
      .lean();

    if (!alert) {
      throw new Error("Alert not found");
    }

    return {
      success: true,
      message: "Alert retrieved successfully",
      data: { alert: alert as any },
    };
  }

  async updateAlert(id: string, data: UpdateAlertRequest, userId?: string): Promise<AlertResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid alert ID");
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

    if (data.severity !== undefined) {
      updateData.severity = data.severity;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.buildingId !== undefined) {
      const buildingId = toObjectId(data.buildingId);
      updateData.building = buildingId;
    }

    if (data.floorId !== undefined) {
      const floorId = toObjectId(data.floorId);
      updateData.floor = floorId;
    }

    if (data.departmentId !== undefined) {
      const departmentId = toObjectId(data.departmentId);
      updateData.department = departmentId;
    }

    if (data.assetId !== undefined) {
      const assetId = toObjectId(data.assetId);
      updateData.asset = assetId;
    }

    if (data.location !== undefined) {
      updateData.location = data.location ? data.location.trim() : null;
    }

    if (data.room !== undefined) {
      updateData.room = data.room ? data.room.trim() : null;
    }

    if (data.timestamp !== undefined) {
      updateData.timestamp = data.timestamp || new Date();
    }

    if (userId) {
      const updatedBy = toObjectId(userId);
      if (updatedBy) updateData.updatedBy = updatedBy;
    }

    const alert = await Alert.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate("organization", "name")
      .populate("building", "name")
      .populate("floor", "title")
      .populate("department", "name")
      .populate("asset", "name")
      .lean();

    if (!alert) {
      throw new Error("Alert not found");
    }

    return {
      success: true,
      message: "Alert updated successfully",
      data: { alert: alert as any },
    };
  }

  async deleteAlert(id: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid alert ID");
    }

    const alert = await Alert.findByIdAndDelete(id);

    if (!alert) {
      throw new Error("Alert not found");
    }

    return {
      success: true,
      message: "Alert deleted successfully",
    };
  }

  async acknowledgeAlert(id: string, userId?: string): Promise<AlertResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid alert ID");
    }

    const updateData: any = {
      status: AlertStatus.ACKNOWLEDGED,
      acknowledgedAt: new Date(),
    };

    if (userId) {
      const acknowledgedBy = toObjectId(userId);
      if (acknowledgedBy) updateData.acknowledgedBy = acknowledgedBy;
    }

    const alert = await Alert.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate("organization", "name")
      .populate("building", "name")
      .populate("floor", "title")
      .populate("department", "name")
      .populate("asset", "name")
      .populate("acknowledgedBy", "firstName lastName")
      .lean();

    if (!alert) {
      throw new Error("Alert not found");
    }

    return {
      success: true,
      message: "Alert acknowledged successfully",
      data: { alert: alert as any },
    };
  }

  async resolveAlert(id: string, userId?: string): Promise<AlertResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid alert ID");
    }

    const updateData: any = {
      status: AlertStatus.RESOLVED,
      resolvedAt: new Date(),
    };

    if (userId) {
      const resolvedBy = toObjectId(userId);
      if (resolvedBy) updateData.resolvedBy = resolvedBy;
    }

    const alert = await Alert.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate("organization", "name")
      .populate("building", "name")
      .populate("floor", "title")
      .populate("department", "name")
      .populate("asset", "name")
      .populate("resolvedBy", "firstName lastName")
      .lean();

    if (!alert) {
      throw new Error("Alert not found");
    }

    return {
      success: true,
      message: "Alert resolved successfully",
      data: { alert: alert as any },
    };
  }

  async getAlertStats(organizationId: string): Promise<AlertStatsResponse> {
    const orgId = toObjectId(organizationId);
    if (!orgId) {
      throw new Error("Invalid organization ID");
    }

    const [activeAlerts, criticalAlerts, unacknowledgedAlerts, zoneTriggers] = await Promise.all([
      Alert.countDocuments({ organization: orgId, status: AlertStatus.ACTIVE, isActive: true }),
      Alert.countDocuments({ organization: orgId, severity: AlertSeverity.HIGH, isActive: true }),
      Alert.countDocuments({
        organization: orgId,
        status: AlertStatus.ACTIVE,
        acknowledgedAt: null,
        isActive: true,
      }),
      Alert.countDocuments({
        organization: orgId,
        type: AlertType.GEOFENCE_TRIGGER,
        isActive: true,
      }),
    ]);

    const [active, acknowledged, resolved] = await Promise.all([
      Alert.countDocuments({ organization: orgId, status: AlertStatus.ACTIVE, isActive: true }),
      Alert.countDocuments({ organization: orgId, status: AlertStatus.ACKNOWLEDGED, isActive: true }),
      Alert.countDocuments({ organization: orgId, status: AlertStatus.RESOLVED, isActive: true }),
    ]);

    const stats: AlertStats = {
      activeAlerts,
      critical: criticalAlerts,
      unacknowledged: unacknowledgedAlerts,
      zoneTriggers,
    };

    const overview: AlertOverviewStats = {
      active,
      acknowledged,
      resolved,
    };

    return {
      success: true,
      message: "Alert stats retrieved successfully",
      data: { stats, overview },
    };
  }
}

export const alertService = new AlertService();

