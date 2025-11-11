"use strict";

import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import PointOfInterest from "../../models/admin/points-of-interest/pointOfInterest";
import Organization from "../../models/admin/organization/organization";
import AdminUser from "../../models/admin/user-management/users";
import { AdminRole } from "../../models/admin/user-management/roles-permissions";
import { PointOfInterestStatus } from "../../types/admin/points-of-interest";

interface SeedPointOfInterestPayload {
  organizationName: string;
  name: string;
  category: string;
  categoryType?: string;
  building: string;
  floor: string;
  roomNumber?: string;
  description?: string;
  tags?: string[];
  amenities?: string[];
  contact?: {
    phone?: string;
    email?: string;
    operatingHours?: string;
  };
  accessibility?: {
    wheelchairAccessible?: boolean;
    hearingLoop?: boolean;
    visualAidSupport?: boolean;
  };
  status?: PointOfInterestStatus;
  mapCoordinates?: {
    latitude?: number;
    longitude?: number;
  };
  isActive?: boolean;
}

const pointsOfInterestToSeed: SeedPointOfInterestPayload[] = [
  {
    organizationName: "CityCare General Hospital",
    name: "Emergency Department",
    category: "Emergency",
    categoryType: "Medical Services",
    building: "Main Hospital",
    floor: "Ground Floor",
    roomNumber: "ED-001",
    description: "24/7 emergency medical services with on-site trauma care and triage.",
    tags: ["Emergency", "24/7", "Trauma"],
    amenities: ["Helipad Access", "Wheelchair Access"],
    contact: {
      phone: "+1-212-555-0199",
      email: "emergency@citycaregh.com",
      operatingHours: "24/7",
    },
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: true,
      visualAidSupport: false,
    },
    status: PointOfInterestStatus.ACTIVE,
    mapCoordinates: {
      latitude: 40.7419,
      longitude: -73.9894,
    },
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Advanced Imaging Center",
    category: "Radiology",
    categoryType: "Diagnostics",
    building: "Diagnostic Wing",
    floor: "1st Floor",
    roomNumber: "RAD-110",
    description: "Full-service imaging including MRI, CT, and ultrasound diagnostics.",
    tags: ["Radiology", "Diagnostics", "Imaging"],
    amenities: ["Patient Lounge", "Digital Results"],
    contact: {
      phone: "+1-212-555-0184",
      email: "imaging@citycaregh.com",
      operatingHours: "6:00 AM - 10:00 PM",
    },
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: false,
      visualAidSupport: true,
    },
    status: PointOfInterestStatus.ACTIVE,
    mapCoordinates: {
      latitude: 40.7424,
      longitude: -73.9885,
    },
  },
  {
    organizationName: "SkyWays International Airport",
    name: "Terminal 1 Security Checkpoint",
    category: "Security",
    categoryType: "Airport Services",
    building: "Terminal 1",
    floor: "Departures Level",
    roomNumber: "SEC-T1",
    description: "Primary passenger screening with TSA PreCheck and FastTrack lanes.",
    tags: ["Security", "TSA", "PreCheck"],
    amenities: ["FastTrack Lanes", "Priority Screening"],
    contact: {
      phone: "+44 20 7946 0110",
      operatingHours: "24/7",
    },
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: true,
      visualAidSupport: true,
    },
    status: PointOfInterestStatus.ACTIVE,
    mapCoordinates: {
      latitude: 51.4703,
      longitude: -0.4585,
    },
  },
  {
    organizationName: "SkyWays International Airport",
    name: "International Lounge A",
    category: "Lounge",
    categoryType: "Passenger Amenities",
    building: "Terminal 2",
    floor: "Mezzanine",
    roomNumber: "LNG-A",
    description: "Premium lounge with shower suites, dining, and quiet workspaces.",
    tags: ["Lounge", "Premium", "Dining"],
    amenities: ["Showers", "Private Suites", "Buffet"],
    contact: {
      phone: "+44 20 7946 0450",
      email: "loungeA@skywaysairport.com",
      operatingHours: "4:00 AM - 12:00 AM",
    },
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: false,
      visualAidSupport: true,
    },
    status: PointOfInterestStatus.ACTIVE,
    mapCoordinates: {
      latitude: 51.4711,
      longitude: -0.456,
    },
  },
  {
    organizationName: "Harborfront Shopping Plaza",
    name: "Harborfront Food Court",
    category: "Food & Beverage",
    categoryType: "Dining",
    building: "North Concourse",
    floor: "2nd Floor",
    roomNumber: "FC-201",
    description: "Multi-cuisine food court with seating for 300 visitors.",
    tags: ["Food Court", "Dining", "Family Friendly"],
    amenities: ["Free WiFi", "Family Seating", "Charging Stations"],
    contact: {
      phone: "+1-415-555-7712",
      operatingHours: "10:00 AM - 11:00 PM",
    },
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: false,
      visualAidSupport: false,
    },
    status: PointOfInterestStatus.ACTIVE,
    mapCoordinates: {
      latitude: 37.7936,
      longitude: -122.3966,
    },
  },
  {
    organizationName: "Harborfront Shopping Plaza",
    name: "Harbor Cinema",
    category: "Entertainment",
    categoryType: "Leisure",
    building: "South Atrium",
    floor: "3rd Floor",
    roomNumber: "CIN-301",
    description: "Luxury cinema with 8 screens featuring recliners and in-seat service.",
    tags: ["Cinema", "Entertainment", "IMAX"],
    amenities: ["Recliner Seats", "In-seat Dining", "Dolby Atmos"],
    contact: {
      phone: "+1-415-555-7755",
      operatingHours: "11:00 AM - 12:00 AM",
    },
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: true,
      visualAidSupport: true,
    },
    status: PointOfInterestStatus.ACTIVE,
    mapCoordinates: {
      latitude: 37.7929,
      longitude: -122.3952,
    },
  },
];

const seedPointsOfInterest = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const organizationNames = Array.from(
      new Set(pointsOfInterestToSeed.map((poi) => poi.organizationName)),
    );

    const organizations = await Organization.find({
      name: { $in: organizationNames },
    }).select("name _id");

    const organizationMap = new Map<string, mongoose.Types.ObjectId>();
    organizations.forEach((org) => {
      organizationMap.set(org.name.toLowerCase(), org._id as mongoose.Types.ObjectId);
    });

    if (organizations.length === 0) {
      console.warn(
        "⚠️  No organizations found. Please run the organization seeder before the POI seeder.",
      );
    }

    const adminUser = await AdminUser.findOne({ role: AdminRole.ADMIN }).select("_id");

    if (!adminUser) {
      console.warn(
        "⚠️  No admin user found. Points of interest will be seeded without creator information.",
      );
    }

    const createdBy =
      adminUser && adminUser._id instanceof mongoose.Types.ObjectId
        ? adminUser._id
        : undefined;

    let createdCount = 0;
    let skippedCount = 0;
    let missingOrgCount = 0;

    for (const poi of pointsOfInterestToSeed) {
      const organizationId = organizationMap.get(poi.organizationName.toLowerCase());

      if (!organizationId) {
        console.warn(
          `⚠️  Organization "${poi.organizationName}" not found. Skipping POI "${poi.name}".`,
        );
        missingOrgCount++;
        continue;
      }

      const existingPoi = await PointOfInterest.findOne({
        organization: organizationId,
        name: { $regex: new RegExp(`^${poi.name}$`, "i") },
      });

      if (existingPoi) {
        console.log(`⏭️  POI "${poi.name}" already exists for "${poi.organizationName}", skipping...`);
        skippedCount++;
        continue;
      }

      await PointOfInterest.create({
        organization: organizationId,
        name: poi.name,
        category: poi.category,
        categoryType: poi.categoryType,
        building: poi.building,
        floor: poi.floor,
        roomNumber: poi.roomNumber,
        description: poi.description,
        tags: poi.tags ?? [],
        amenities: poi.amenities ?? [],
        contact: poi.contact,
        accessibility: {
          wheelchairAccessible: poi.accessibility?.wheelchairAccessible ?? false,
          hearingLoop: poi.accessibility?.hearingLoop ?? false,
          visualAidSupport: poi.accessibility?.visualAidSupport ?? false,
        },
        status: poi.status ?? PointOfInterestStatus.ACTIVE,
        mapCoordinates: poi.mapCoordinates,
        isActive: poi.isActive ?? true,
        createdBy,
        updatedBy: createdBy,
      });

      console.log(`✅ Point of Interest "${poi.name}" created for "${poi.organizationName}"`);
      createdCount++;
    }

    console.log("\n📊 Points of Interest Seeding Summary:");
    console.log(`   ✅ Created: ${createdCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ⚠️  Missing Organization: ${missingOrgCount}`);
    console.log(`   📋 Total Planned: ${pointsOfInterestToSeed.length}`);
  } catch (error: any) {
    console.error("❌ Error seeding points of interest:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedPointsOfInterest()
    .then(() => {
      console.log("\n✅ Points of Interest seeder completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Points of Interest seeder failed:", error.message);
      process.exit(1);
    });
}

export default seedPointsOfInterest;

