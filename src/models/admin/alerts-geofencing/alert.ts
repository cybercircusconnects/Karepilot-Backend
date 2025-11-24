"use strict";

import mongoose, { Document, Schema } from "mongoose";
import Organization from "../organization/organization";
import MapBuilding from "../map-management/mapBuilding";
import MapFloorPlan from "../map-management/mapFloorPlan";
import Department from "../user-management/departments";
import Asset from "../asset-tracking/asset";
import AdminUser from "../user-management/users";

export enum AlertType {
  UNAUTHORIZED_ENTRY = "unauthorized-entry",
  LOW_BATTERY = "low-battery",
  EMERGENCY_EXIT = "emergency-exit",
  SYSTEM_ALERT = "system-alert",
  GEOFENCE_TRIGGER = "geofence-trigger",
  EQUIPMENT_FAULT = "equipment-fault",
}

export enum AlertSeverity {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum AlertStatus {
  ACTIVE = "active",
  ACKNOWLEDGED = "acknowledged",
  RESOLVED = "resolved",
}

export interface IAlert extends Document {
  organization: mongoose.Types.ObjectId;
  building?: mongoose.Types.ObjectId | null;
  floor?: mongoose.Types.ObjectId | null;
  department?: mongoose.Types.ObjectId | null;
  asset?: mongoose.Types.ObjectId | null;
  name: string;
  description?: string | null;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  location?: string | null;
  room?: string | null;
  timestamp: Date;
  acknowledgedBy?: mongoose.Types.ObjectId | null;
  acknowledgedAt?: Date | null;
  resolvedBy?: mongoose.Types.ObjectId | null;
  resolvedAt?: Date | null;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
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
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      index: true,
    },
    asset: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
      index: true,
    },
    name: {
      type: String,
      required: [true, "Alert name is required"],
      trim: true,
      minlength: [2, "Alert name must be at least 2 characters long"],
      maxlength: [200, "Alert name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    type: {
      type: String,
      enum: Object.values(AlertType),
      required: [true, "Alert type is required"],
      index: true,
    },
    severity: {
      type: String,
      enum: Object.values(AlertSeverity),
      required: [true, "Alert severity is required"],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(AlertStatus),
      required: [true, "Alert status is required"],
      default: AlertStatus.ACTIVE,
      index: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    room: {
      type: String,
      trim: true,
      maxlength: [100, "Room cannot exceed 100 characters"],
    },
    timestamp: {
      type: Date,
      required: [true, "Timestamp is required"],
      default: Date.now,
      index: true,
    },
    acknowledgedBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    acknowledgedAt: {
      type: Date,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    resolvedAt: {
      type: Date,
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

alertSchema.index({ organization: 1, status: 1 });
alertSchema.index({ organization: 1, severity: 1 });
alertSchema.index({ organization: 1, type: 1 });
alertSchema.index({ organization: 1, timestamp: -1 });
alertSchema.index({ organization: 1, isActive: 1 });

const Alert = mongoose.model<IAlert>("Alert", alertSchema);

export default Alert;

