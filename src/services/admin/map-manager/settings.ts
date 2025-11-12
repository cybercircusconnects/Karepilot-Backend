import { Types } from "mongoose";
import MapManagerSettings, {
  IMapManagerSettings,
} from "../../../models/admin/map-manager/mapSettings";
import { UpdateSettingsDTO } from "../../../types/admin/map-manager";

const ensureOrganizationId = (organizationId: string) => {
  if (!Types.ObjectId.isValid(organizationId)) {
    throw new Error("Invalid organization id");
  }

  return new Types.ObjectId(organizationId);
};

export const mapManagerSettingsService = {
  async getSettings(organizationId: string) {
    const orgObjectId = ensureOrganizationId(organizationId);

    const existing = await MapManagerSettings.findOne({
      organization: orgObjectId,
    }).lean<IMapManagerSettings | null>();

    if (existing) {
      return existing;
    }

    const created = await MapManagerSettings.create({
      organization: orgObjectId,
    });

    return created.toObject();
  },

  async updateSettings(payload: UpdateSettingsDTO, userId?: string) {
    const orgObjectId = ensureOrganizationId(payload.organization);

    const updateData = {
      ...payload,
      updatedBy: userId ? new Types.ObjectId(userId) : undefined,
    };

    const settings = await MapManagerSettings.findOneAndUpdate(
      { organization: orgObjectId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true },
    ).lean<IMapManagerSettings | null>();

    if (!settings) {
      throw new Error("Failed to update settings");
    }

    return settings;
  },
};

export type MapManagerSettingsService = typeof mapManagerSettingsService;


