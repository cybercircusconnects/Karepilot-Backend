"use strict";

import { Types } from "mongoose";
import { MapManagementSettings } from "../../../models/admin/map-management";
import {
  MapManagementSettingsPayload,
  MapManagementSettingsResponse,
} from "../../../types/admin/map-management";

const toObjectId = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }
  return new Types.ObjectId(value);
};

class MapManagementSettingsService {
  private serialize(settings: any): MapManagementSettingsResponse {
    return {
      organizationId: settings.organization?.toString() ?? "",
      autoPublishUpdates: settings.autoPublishUpdates ?? false,
      highResolutionThumbnails: settings.highResolutionThumbnails ?? false,
      enableVersionControl: settings.enableVersionControl ?? false,
      updatedAt: settings.updatedAt,
    };
  }

  async getSettings(organizationId: string): Promise<MapManagementSettingsResponse> {
    const orgId = toObjectId(organizationId);
    if (!orgId) {
      throw new Error("Valid organization ID is required");
    }

    let settings = await MapManagementSettings.findOne({ organization: orgId });
    if (!settings) {
      settings = new MapManagementSettings({
        organization: orgId,
      });
      await settings.save();
    }

    return this.serialize(settings);
  }

  async updateSettings(
    payload: MapManagementSettingsPayload,
    adminId: string,
  ): Promise<MapManagementSettingsResponse> {
    const orgId = toObjectId(payload.organizationId);
    if (!orgId) {
      throw new Error("Valid organization ID is required");
    }

    let settings = await MapManagementSettings.findOne({ organization: orgId });
    if (!settings) {
      settings = new MapManagementSettings({
        organization: orgId,
      });
    }

    if (typeof payload.autoPublishUpdates === "boolean") {
      settings.autoPublishUpdates = payload.autoPublishUpdates;
    }

    if (typeof payload.highResolutionThumbnails === "boolean") {
      settings.highResolutionThumbnails = payload.highResolutionThumbnails;
    }

    if (typeof payload.enableVersionControl === "boolean") {
      settings.enableVersionControl = payload.enableVersionControl;
    }

    const adminObjectId = toObjectId(adminId);
    if (adminObjectId) {
      settings.updatedBy = adminObjectId;
    }

    await settings.save();

    return this.serialize(settings);
  }
}

export const mapManagementSettingsService = new MapManagementSettingsService();

