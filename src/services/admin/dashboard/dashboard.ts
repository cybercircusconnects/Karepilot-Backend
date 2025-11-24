"use strict";

import { Types } from "mongoose";
import Organization from "../../../models/admin/organization/organization";
import MapBuilding from "../../../models/admin/map-management/mapBuilding";
import MapFloorPlan from "../../../models/admin/map-management/mapFloorPlan";
import Asset from "../../../models/admin/asset-tracking/asset";
import {
  DashboardStats,
  SystemHealthItem,
  DashboardActivity,
  DashboardResponse,
  DashboardQuery,
} from "../../../types/admin/dashboard/dashboard";

const toObjectId = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }
  return new Types.ObjectId(value);
};

export class DashboardService {
  async getDashboardData(query: DashboardQuery): Promise<DashboardResponse> {
    const organizationId = toObjectId(query.organizationId);
    if (!organizationId) {
      throw new Error("Invalid organization ID");
    }

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const stats = await this.getDashboardStats(organizationId, lastWeek, twoWeeksAgo);

    const systemHealth = await this.getSystemHealth(organizationId);

    const recentActivities = await this.getRecentActivities(organizationId);

    return {
      stats,
      systemHealth,
      recentActivities,
    };
  }

  private async getDashboardStats(
    organizationId: Types.ObjectId,
    lastWeek: Date,
    twoWeeksAgo: Date
  ): Promise<DashboardStats> {
    const activePatients = await Asset.countDocuments({
      organization: organizationId,
      type: { $in: ["staff", "personnel"] },
      status: "online",
      isActive: true,
    });
    const activePatientsLastWeek = await Asset.countDocuments({
      organization: organizationId,
      type: { $in: ["staff", "personnel"] },
      status: "online",
      isActive: true,
      createdAt: { $gte: lastWeek },
    });
    const activePatientsTwoWeeksAgo = await Asset.countDocuments({
      organization: organizationId,
      type: { $in: ["staff", "personnel"] },
      status: "online",
      isActive: true,
      createdAt: { $gte: twoWeeksAgo, $lt: lastWeek },
    });
    const activePatientsChange = this.calculatePercentageChange(
      activePatientsLastWeek,
      activePatientsTwoWeeksAgo
    );

    const emergencyAlerts = await Asset.countDocuments({
      organization: organizationId,
      status: { $in: ["offline", "low-battery"] },
      isActive: true,
    });
    const emergencyAlertsLastWeek = await Asset.countDocuments({
      organization: organizationId,
      status: { $in: ["offline", "low-battery"] },
      isActive: true,
      createdAt: { $gte: lastWeek },
    });
    const emergencyAlertsTwoWeeksAgo = await Asset.countDocuments({
      organization: organizationId,
      status: { $in: ["offline", "low-battery"] },
      isActive: true,
      createdAt: { $gte: twoWeeksAgo, $lt: lastWeek },
    });
    const emergencyAlertsChange = this.calculatePercentageChange(
      emergencyAlertsLastWeek,
      emergencyAlertsTwoWeeksAgo
    );

    const equipmentTracked = await Asset.countDocuments({
      organization: organizationId,
      isActive: true,
    });
    const equipmentTrackedLastWeek = await Asset.countDocuments({
      organization: organizationId,
      isActive: true,
      createdAt: { $gte: lastWeek },
    });
    const equipmentTrackedTwoWeeksAgo = await Asset.countDocuments({
      organization: organizationId,
      isActive: true,
      createdAt: { $gte: twoWeeksAgo, $lt: lastWeek },
    });
    const equipmentTrackedChange = this.calculatePercentageChange(
      equipmentTrackedLastWeek,
      equipmentTrackedTwoWeeksAgo
    );

    const navigationRequests = await MapFloorPlan.countDocuments({
      building: { $in: await this.getBuildingIds(organizationId) },
    });
    const navigationRequestsLastWeek = await MapFloorPlan.countDocuments({
      building: { $in: await this.getBuildingIds(organizationId) },
      createdAt: { $gte: lastWeek },
    });
    const navigationRequestsTwoWeeksAgo = await MapFloorPlan.countDocuments({
      building: { $in: await this.getBuildingIds(organizationId) },
      createdAt: { $gte: twoWeeksAgo, $lt: lastWeek },
    });
    const navigationRequestsChange = this.calculatePercentageChange(
      navigationRequestsLastWeek,
      navigationRequestsTwoWeeksAgo
    );

    return {
      activePatients: activePatients || 0,
      activePatientsChange,
      emergencyAlerts: emergencyAlerts || 0,
      emergencyAlertsChange,
      equipmentTracked: equipmentTracked || 0,
      equipmentTrackedChange,
      navigationRequests: navigationRequests || 0,
      navigationRequestsChange,
    };
  }

  private async getSystemHealth(organizationId: Types.ObjectId): Promise<SystemHealthItem[]> {
    const dbHealth = await this.checkDatabaseHealth(organizationId);

    const locationHealth = await this.checkLocationServicesHealth(organizationId);

    const mapRenderingHealth = await this.checkMapRenderingHealth(organizationId);

    const trackingHealth = await this.checkTrackingHealth(organizationId);

    const notificationHealth = await this.checkNotificationHealth(organizationId);

    return [
      {
        name: "Database",
        health: dbHealth,
        status: dbHealth >= 95 ? "Healthy" : dbHealth >= 70 ? "Warning" : "Critical",
        time: "Uptime",
      },
      {
        name: "Location Services",
        health: locationHealth,
        status: locationHealth >= 95 ? "Healthy" : locationHealth >= 70 ? "Warning" : "Critical",
        time: "Uptime",
      },
      {
        name: "Map Rendering",
        health: mapRenderingHealth,
        status:
          mapRenderingHealth >= 95 ? "Healthy" : mapRenderingHealth >= 70 ? "Warning" : "Critical",
        time: "Uptime",
      },
      {
        name: "Tracking",
        health: trackingHealth,
        status: trackingHealth >= 95 ? "Healthy" : trackingHealth >= 70 ? "Warning" : "Critical",
        time: "Uptime",
      },
      {
        name: "Notification System",
        health: notificationHealth,
        status:
          notificationHealth >= 95 ? "Healthy" : notificationHealth >= 70 ? "Warning" : "Critical",
        time: "Uptime",
      },
    ];
  }

  private async checkDatabaseHealth(organizationId: Types.ObjectId): Promise<number> {
    try {
      const org = await Organization.findById(organizationId);
      return org ? 99 : 0;
    } catch {
      return 0;
    }
  }

  private async checkLocationServicesHealth(organizationId: Types.ObjectId): Promise<number> {
    const totalAssets = await Asset.countDocuments({
      organization: organizationId,
      isActive: true,
    });
    if (totalAssets === 0) return 100;

    const assetsWithLocation = await Asset.countDocuments({
      organization: organizationId,
      isActive: true,
      $or: [
        { location: { $exists: true, $ne: null } },
        { "mapCoordinates.x": { $exists: true } },
        { "mapCoordinates.latitude": { $exists: true } },
      ],
    });

    return Math.round((assetsWithLocation / totalAssets) * 100);
  }

  private async checkMapRenderingHealth(organizationId: Types.ObjectId): Promise<number> {
    const buildingIds = await this.getBuildingIds(organizationId);
    const totalFloors = await MapFloorPlan.countDocuments({
      building: { $in: buildingIds },
    });
    if (totalFloors === 0) return 100;

    const floorsWithImages = await MapFloorPlan.countDocuments({
      building: { $in: buildingIds },
      imageUrl: { $exists: true, $ne: null },
    });

    return Math.round((floorsWithImages / totalFloors) * 100);
  }

  private async checkTrackingHealth(organizationId: Types.ObjectId): Promise<number> {
    const totalAssets = await Asset.countDocuments({
      organization: organizationId,
      isActive: true,
    });
    if (totalAssets === 0) return 100;

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentlyTracked = await Asset.countDocuments({
      organization: organizationId,
      isActive: true,
      lastSeen: { $gte: fifteenMinutesAgo },
    });

    return Math.round((recentlyTracked / totalAssets) * 100);
  }

  private async checkNotificationHealth(organizationId: Types.ObjectId): Promise<number> {
    const recentAssets = await Asset.countDocuments({
      organization: organizationId,
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      isActive: true,
    });

    return recentAssets > 0 ? 99 : 95;
  }

  private async getRecentActivities(
    organizationId: Types.ObjectId
  ): Promise<DashboardActivity[]> {
    const activities: DashboardActivity[] = [];

    const recentAssets = await Asset.find({
      organization: organizationId,
      isActive: true,
    })
      .populate("createdBy", "firstName lastName")
      .populate("building", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    recentAssets.forEach((asset) => {
      const author =
        asset.createdBy && typeof asset.createdBy === "object"
          ? `${(asset.createdBy as any).firstName || ""} ${(asset.createdBy as any).lastName || ""}`.trim() ||
            "System"
          : "System";

      const location =
        asset.building && typeof asset.building === "object"
          ? (asset.building as any).name
          : asset.location || "Unknown Location";

      activities.push({
        id: asset._id.toString(),
        text: `Asset "${asset.name}" tracked at ${location}`,
        author,
        time: this.formatTimeAgo(asset.createdAt),
        color: this.getAssetActivityColor(asset.status),
        type: "asset",
        createdAt: asset.createdAt,
      });
    });

    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 6);
  }

  private async getBuildingIds(organizationId: Types.ObjectId): Promise<Types.ObjectId[]> {
    const buildings = await MapBuilding.find({
      organization: organizationId,
      isActive: true,
    }).select("_id");
     return (buildings as { _id: Types.ObjectId }[]).map((b) => b._id);
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }


  private getAssetActivityColor(status: string): string {
    if (status === "online") return "bg-green-500";
    if (status === "offline") return "bg-red-500";
    if (status === "low-battery") return "bg-yellow-500";
    return "bg-blue-500";
  }
}

export default new DashboardService();

