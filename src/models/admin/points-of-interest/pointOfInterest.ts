"use strict";

import mongoose, { Document, Schema } from "mongoose";
import Organization from "../organization/organization";
import AdminUser from "../user-management/users";
import { PointOfInterestStatus } from "../../../types/admin/points-of-interest";

export interface IPointOfInterest extends Document {
  organization: mongoose.Types.ObjectId;
  name: string;
  category: string;
  categoryType?: string;
  building: string;
  floor: string;
  roomNumber?: string;
  description?: string;
  tags: string[];
  amenities: string[];
  contact?: {
    phone?: string | null;
    email?: string | null;
    operatingHours?: string | null;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    hearingLoop: boolean;
    visualAidSupport: boolean;
  };
  status: PointOfInterestStatus;
  mapCoordinates?: {
    x?: number | null;
    y?: number | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const contactInformationSchema = new Schema(
  {
    phone: {
      type: String,
      trim: true,
      maxlength: [50, "Phone cannot exceed 50 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
    },
    operatingHours: {
      type: String,
      trim: true,
      maxlength: [100, "Operating hours cannot exceed 100 characters"],
    },
  },
  { _id: false },
);

const accessibilityFeaturesSchema = new Schema(
  {
    wheelchairAccessible: {
      type: Boolean,
      default: false,
    },
    hearingLoop: {
      type: Boolean,
      default: false,
    },
    visualAidSupport: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const mapCoordinatesSchema = new Schema(
  {
    x: { 
      type: Number,
      default: null,
    },
    y: { 
      type: Number,
      default: null,
    },
    latitude: { 
      type: Number,
      default: null,
      min: [-90, "Latitude must be between -90 and 90"],
      max: [90, "Latitude must be between -90 and 90"],
    },
    longitude: { 
      type: Number,
      default: null,
      min: [-180, "Longitude must be between -180 and 180"],
      max: [180, "Longitude must be between -180 and 180"],
    },
  },
  { _id: false },
);

const pointOfInterestSchema = new Schema<IPointOfInterest>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
    },
    name: {
      type: String,
      trim: true,
      required: [true, "POI name is required"],
      minlength: [2, "POI name must be at least 2 characters long"],
      maxlength: [150, "POI name cannot exceed 150 characters"],
    },
    category: {
      type: String,
      trim: true,
      required: [true, "Category is required"],
      maxlength: [120, "Category cannot exceed 120 characters"],
    },
    categoryType: {
      type: String,
      trim: true,
      maxlength: [120, "Category type cannot exceed 120 characters"],
    },
    building: {
      type: String,
      trim: true,
      required: [true, "Building is required"],
      maxlength: [120, "Building cannot exceed 120 characters"],
    },
    floor: {
      type: String,
      trim: true,
      required: [true, "Floor is required"],
      maxlength: [120, "Floor cannot exceed 120 characters"],
    },
    roomNumber: {
      type: String,
      trim: true,
      maxlength: [120, "Room number cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.every((tag) => typeof tag === "string" && tag.trim().length > 0),
        message: "All tags must be non-empty strings",
      },
    },
    amenities: {
      type: [String],
      default: [],
      validate: {
        validator: (amenities: string[]) =>
          amenities.every((amenity) => typeof amenity === "string" && amenity.trim().length > 0),
        message: "All amenities must be non-empty strings",
      },
    },
    contact: {
      type: contactInformationSchema,
      default: undefined,
    },
    accessibility: {
      type: accessibilityFeaturesSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: Object.values(PointOfInterestStatus),
      default: PointOfInterestStatus.ACTIVE,
    },
    mapCoordinates: {
      type: mapCoordinatesSchema,
      default: undefined,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
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

pointOfInterestSchema.index({ organization: 1, name: 1 }, { unique: true });
pointOfInterestSchema.index({ organization: 1, category: 1 });
pointOfInterestSchema.index({ organization: 1, status: 1 });
pointOfInterestSchema.index({ "mapCoordinates.latitude": 1, "mapCoordinates.longitude": 1 });
pointOfInterestSchema.index({ isActive: 1 });

pointOfInterestSchema.pre("save", async function (next) {
  if (this.isModified("organization")) {
    const organization = await Organization.findById(this.organization);
    if (!organization) {
      return next(new Error("Organization not found"));
    }
  }

  if (this.isModified("createdBy") && this.createdBy) {
    const user = await AdminUser.findById(this.createdBy);
    if (!user) {
      return next(new Error("Created by user not found"));
    }
  }

  if (this.isModified("updatedBy") && this.updatedBy) {
    const user = await AdminUser.findById(this.updatedBy);
    if (!user) {
      return next(new Error("Updated by user not found"));
    }
  }

  next();
});

pointOfInterestSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate() as any;

  if (update?.organization) {
    const organization = await Organization.findById(update.organization);
    if (!organization) {
      return next(new Error("Organization not found"));
    }
  }

  if (update?.createdBy) {
    const user = await AdminUser.findById(update.createdBy);
    if (!user) {
      return next(new Error("Created by user not found"));
    }
  }

  if (update?.updatedBy) {
    const user = await AdminUser.findById(update.updatedBy);
    if (!user) {
      return next(new Error("Updated by user not found"));
    }
  }

  next();
});

const PointOfInterest = mongoose.model<IPointOfInterest>("PointOfInterest", pointOfInterestSchema);

export default PointOfInterest;

