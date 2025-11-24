"use strict";

import mongoose, { Document, Schema } from "mongoose";
import Organization from "../organization/organization";
import MapBuilding from "../map-management/mapBuilding";
import MapFloorPlan from "../map-management/mapFloorPlan";
import AdminUser from "../user-management/users";

export enum GeofenceType {
  MONITORING = "monitoring",
  RESTRICTED = "restricted",
  ALERT = "alert",
  NOTIFICATION = "notification",
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  sound: boolean;
}

export interface IGeofence extends Document {
  organization: mongoose.Types.ObjectId;
  building?: mongoose.Types.ObjectId | null;
  floor?: mongoose.Types.ObjectId | null;
  name: string;
  description?: string | null;
  type: GeofenceType;
  coordinates?: {
    x?: number | null;
    y?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    radius?: number | null;
  };
  alertOnEntry: boolean;
  alertOnExit: boolean;
  notificationSettings: NotificationSettings;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSettingsSchema = new Schema(
  {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    sound: { type: Boolean, default: false },
  },
  { _id: false }
);

const coordinatesSchema = new Schema(
  {
    x: { type: Number },
    y: { type: Number },
    latitude: { type: Number },
    longitude: { type: Number },
    radius: { type: Number },
  },
  { _id: false }
);

const geofenceSchema = new Schema<IGeofence>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
      index: true,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: "MapBuilding",
      index: true,
    },
    floor: {
      type: Schema.Types.ObjectId,
      ref: "MapFloorPlan",
      index: true,
    },
    name: {
      type: String,
      required: [true, "Geofence name is required"],
      trim: true,
      minlength: [2, "Geofence name must be at least 2 characters long"],
      maxlength: [200, "Geofence name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    type: {
      type: String,
      enum: Object.values(GeofenceType),
      required: [true, "Geofence type is required"],
      index: true,
    },
    coordinates: {
      type: coordinatesSchema,
    },
    alertOnEntry: {
      type: Boolean,
      default: true,
    },
    alertOnExit: {
      type: Boolean,
      default: false,
    },
    notificationSettings: {
      type: notificationSettingsSchema,
      required: true,
      default: () => ({
        email: false,
        sms: false,
        push: false,
        sound: false,
      }),
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
    },
  },
  {
    timestamps: true,
  }
);

geofenceSchema.index({ organization: 1, type: 1 });
geofenceSchema.index({ organization: 1, isActive: 1 });
geofenceSchema.index({ building: 1, floor: 1 });

const Geofence = mongoose.model<IGeofence>("Geofence", geofenceSchema);

export default Geofence;

