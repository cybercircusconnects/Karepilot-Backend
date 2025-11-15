"use strict";

import mongoose, { Document, Schema } from "mongoose";
import Organization from "../organization/organization";
import AdminUser from "../user-management/users";

export interface IMapManagementSettings extends Document {
  organization: mongoose.Types.ObjectId;
  autoPublishUpdates: boolean;
  highResolutionThumbnails: boolean;
  enableVersionControl: boolean;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const mapManagementSettingsSchema = new Schema<IMapManagementSettings>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
      unique: true,
      index: true,
    },
    autoPublishUpdates: {
      type: Boolean,
      default: false,
    },
    highResolutionThumbnails: {
      type: Boolean,
      default: true,
    },
    enableVersionControl: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

mapManagementSettingsSchema.pre("save", async function (next) {
  const organization = await Organization.findById(this.organization);
  if (!organization) {
    return next(new Error("Organization not found"));
  }

  if (this.updatedBy) {
    const updater = await AdminUser.findById(this.updatedBy);
    if (!updater) {
      return next(new Error("Updated by admin not found"));
    }
  }

  next();
});

mapManagementSettingsSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate() as any;
  if (update?.organization) {
    const organization = await Organization.findById(update.organization);
    if (!organization) {
      return next(new Error("Organization not found"));
    }
  }

  if (update?.updatedBy) {
    const updater = await AdminUser.findById(update.updatedBy);
    if (!updater) {
      return next(new Error("Updated by admin not found"));
    }
  }

  next();
});

const MapManagementSettings = mongoose.model<IMapManagementSettings>(
  "MapManagementSettings",
  mapManagementSettingsSchema,
);

export default MapManagementSettings;

