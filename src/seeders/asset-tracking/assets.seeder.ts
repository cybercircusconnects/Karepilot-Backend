import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import Asset, { AssetType, AssetStatus } from "../../models/admin/asset-tracking/asset";
import Organization from "../../models/admin/organization/organization";
import MapBuilding from "../../models/admin/map-management/mapBuilding";
import MapFloorPlan from "../../models/admin/map-management/mapFloorPlan";
import Department from "../../models/admin/user-management/departments";
import AdminUser from "../../models/admin/user-management/users";
import { AdminRole } from "../../models/admin/user-management/roles-permissions";

interface AssetSeedData {
  organizationName: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  buildingName?: string;
  floorTitle?: string;
  location?: string;
  departmentName?: string;
  batteryLevel?: number;
  lastSeenMinutesAgo?: number;
  mapCoordinates?: {
    x?: number;
    y?: number;
    latitude?: number;
    longitude?: number;
  };
  description?: string;
  tags?: string[];
}

const assetsToSeed: AssetSeedData[] = [
  {
    organizationName: "CityCare General Hospital",
    name: "Radiology Department Scanner",
    type: AssetType.DEVICE,
    status: AssetStatus.ONLINE,
    buildingName: "Main Building",
    floorTitle: "Main Building Ground Floor",
    location: "Emergency Department",
    departmentName: "Emergency",
    batteryLevel: 83,
    lastSeenMinutesAgo: 2,
    mapCoordinates: { x: 150, y: 200 },
    description: "Portable X-ray scanner for emergency department",
    tags: ["radiology", "portable", "emergency"],
  },
  {
    organizationName: "CityCare General Hospital",
    name: "ICU Monitoring System",
    type: AssetType.DEVICE,
    status: AssetStatus.ONLINE,
    buildingName: "Main Building",
    floorTitle: "Main Building 1st Floor",
    location: "Intensive Care Unit",
    departmentName: "ICU",
    batteryLevel: 78,
    lastSeenMinutesAgo: 1,
    mapCoordinates: { x: 300, y: 150 },
    description: "Patient monitoring system for ICU",
    tags: ["monitoring", "icu", "patient-care"],
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Pharmacy Inventory Tracker",
    type: AssetType.DEVICE,
    status: AssetStatus.ONLINE,
    buildingName: "Main Building",
    floorTitle: "Main Building Ground Floor",
    location: "Pharmacy",
    departmentName: "Pharmacy",
    batteryLevel: 92,
    lastSeenMinutesAgo: 0.75,
    mapCoordinates: { x: 100, y: 100 },
    description: "RFID tracking system for pharmacy inventory",
    tags: ["pharmacy", "inventory", "tracking"],
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Laboratory Equipment Monitor",
    type: AssetType.DEVICE,
    status: AssetStatus.OFFLINE,
    buildingName: "Diagnostic Center",
    floorTitle: "Diagnostic Center 2nd Floor",
    location: "Laboratory",
    departmentName: "Administration",
    batteryLevel: 45,
    lastSeenMinutesAgo: 10,
    mapCoordinates: { x: 250, y: 300 },
    description: "Equipment monitoring device for laboratory",
    tags: ["laboratory", "monitoring", "equipment"],
  },

  {
    organizationName: "CityCare General Hospital",
    name: "Radiology Department Equipment",
    type: AssetType.EQUIPMENT,
    status: AssetStatus.ONLINE,
    buildingName: "Main Building",
    floorTitle: "Main Building Ground Floor",
    location: "Emergency Department",
    departmentName: "Emergency",
    batteryLevel: 80,
    lastSeenMinutesAgo: 2,
    mapCoordinates: { x: 155, y: 205 },
    description: "Radiology equipment in emergency department",
    tags: ["radiology", "equipment", "emergency"],
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Cardiology Department Equipment",
    type: AssetType.EQUIPMENT,
    status: AssetStatus.OFFLINE,
    buildingName: "Emergency Wing",
    floorTitle: "Emergency Wing 1st Floor",
    location: "Intensive Care Unit",
    departmentName: "ICU",
    batteryLevel: 67,
    lastSeenMinutesAgo: 5,
    mapCoordinates: { x: 400, y: 250 },
    description: "Cardiology equipment in ICU",
    tags: ["cardiology", "equipment", "icu"],
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Pediatrics Department Equipment",
    type: AssetType.EQUIPMENT,
    status: AssetStatus.LOW_BATTERY,
    buildingName: "Main Building",
    floorTitle: "Main Building 2nd Floor",
    location: "General Ward",
    departmentName: "Emergency",
    batteryLevel: 20,
    lastSeenMinutesAgo: 1,
    mapCoordinates: { x: 200, y: 400 },
    description: "Pediatrics equipment in general ward",
    tags: ["pediatrics", "equipment", "ward"],
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Laboratory Equipment",
    type: AssetType.EQUIPMENT,
    status: AssetStatus.OFFLINE,
    buildingName: "Diagnostic Center",
    floorTitle: "Diagnostic Center 2nd Floor",
    location: "Laboratory",
    departmentName: "Administration",
    batteryLevel: 45,
    lastSeenMinutesAgo: 10,
    mapCoordinates: { x: 255, y: 305 },
    description: "Laboratory analysis equipment",
    tags: ["laboratory", "equipment", "analysis"],
  },

  {
    organizationName: "CityCare General Hospital",
    name: "Emergency Response Team",
    type: AssetType.STAFF,
    status: AssetStatus.ONLINE,
    buildingName: "Main Building",
    floorTitle: "Main Building Ground Floor",
    location: "Emergency Department",
    departmentName: "Emergency",
    batteryLevel: 95,
    lastSeenMinutesAgo: 0.5,
    mapCoordinates: { x: 160, y: 210 },
    description: "Emergency response team on duty",
    tags: ["staff", "emergency", "response"],
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Security Patrol",
    type: AssetType.STAFF,
    status: AssetStatus.LOW_BATTERY,
    buildingName: "Main Building",
    floorTitle: "Main Building Ground Floor",
    location: "Main Entrance",
    departmentName: "Security",
    batteryLevel: 15,
    lastSeenMinutesAgo: 3,
    mapCoordinates: { x: 50, y: 50 },
    description: "Security patrol team",
    tags: ["staff", "security", "patrol"],
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Maintenance Team",
    type: AssetType.STAFF,
    status: AssetStatus.ONLINE,
    buildingName: "Main Building",
    floorTitle: "Main Building Ground Floor",
    location: "Maintenance Room",
    departmentName: "Maintenance",
    batteryLevel: 88,
    lastSeenMinutesAgo: 2,
    mapCoordinates: { x: 500, y: 100 },
    description: "Maintenance team on duty",
    tags: ["staff", "maintenance", "facilities"],
  },

  {
    organizationName: "Lakeside Regional Medical",
    name: "Main Hospital Monitoring System",
    type: AssetType.DEVICE,
    status: AssetStatus.ONLINE,
    buildingName: "Main Hospital Building",
    floorTitle: "Main Hospital Building Ground Floor",
    location: "Emergency Department",
    departmentName: "Emergency",
    batteryLevel: 85,
    lastSeenMinutesAgo: 1,
    mapCoordinates: { x: 200, y: 200 },
    description: "Central monitoring system for main hospital",
    tags: ["monitoring", "central", "hospital"],
  },
  {
    organizationName: "Lakeside Regional Medical",
    name: "Research Lab Equipment",
    type: AssetType.DEVICE,
    status: AssetStatus.ONLINE,
    buildingName: "Research Center",
    floorTitle: "Research Center 1st Floor",
    location: "Research Laboratory",
    departmentName: "Administration",
    batteryLevel: 75,
    lastSeenMinutesAgo: 2,
    mapCoordinates: { x: 300, y: 250 },
    description: "Research laboratory equipment tracking",
    tags: ["research", "laboratory", "equipment"],
  },

  {
    organizationName: "Lakeside Regional Medical",
    name: "ICU Equipment Set",
    type: AssetType.EQUIPMENT,
    status: AssetStatus.ONLINE,
    buildingName: "Main Hospital Building",
    floorTitle: "Main Hospital Building 1st Floor",
    location: "Intensive Care Unit",
    departmentName: "ICU",
    batteryLevel: 70,
    lastSeenMinutesAgo: 3,
    mapCoordinates: { x: 250, y: 300 },
    description: "Complete ICU equipment set",
    tags: ["icu", "equipment", "patient-care"],
  },
  {
    organizationName: "Lakeside Regional Medical",
    name: "Emergency Equipment Cart",
    type: AssetType.EQUIPMENT,
    status: AssetStatus.LOW_BATTERY,
    buildingName: "Main Hospital Building",
    floorTitle: "Main Hospital Building Ground Floor",
    location: "Emergency Department",
    departmentName: "Emergency",
    batteryLevel: 18,
    lastSeenMinutesAgo: 1,
    mapCoordinates: { x: 205, y: 205 },
    description: "Mobile emergency equipment cart",
    tags: ["emergency", "equipment", "mobile"],
  },

  {
    organizationName: "Lakeside Regional Medical",
    name: "Nursing Team Alpha",
    type: AssetType.STAFF,
    status: AssetStatus.ONLINE,
    buildingName: "Main Hospital Building",
    floorTitle: "Main Hospital Building 1st Floor",
    location: "Patient Ward",
    departmentName: "Emergency",
    batteryLevel: 90,
    lastSeenMinutesAgo: 0.5,
    mapCoordinates: { x: 255, y: 305 },
    description: "Nursing team on patient ward",
    tags: ["staff", "nursing", "patient-care"],
  },
  {
    organizationName: "Lakeside Regional Medical",
    name: "Research Team",
    type: AssetType.STAFF,
    status: AssetStatus.ONLINE,
    buildingName: "Research Center",
    floorTitle: "Research Center 1st Floor",
    location: "Research Laboratory",
    departmentName: "Administration",
    batteryLevel: 82,
    lastSeenMinutesAgo: 1,
    mapCoordinates: { x: 305, y: 255 },
    description: "Research team in laboratory",
    tags: ["staff", "research", "laboratory"],
  },
];

const seedAssets = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const adminUser = await AdminUser.findOne({ role: AdminRole.ADMIN });
    if (!adminUser) {
      throw new Error("Admin user not found. Please run user seeders first.");
    }

    const organizationMap = new Map<string, mongoose.Types.ObjectId>();
    const buildingMap = new Map<string, mongoose.Types.ObjectId>();
    const floorMap = new Map<string, mongoose.Types.ObjectId>();
    const departmentMap = new Map<string, mongoose.Types.ObjectId>();

    // Build organization map (case-insensitive like building seeder)
    const organizations = await Organization.find({ isActive: true });
    organizations.forEach((org) => {
      const normalizedName = org.name.trim().toLowerCase();
      organizationMap.set(normalizedName, org._id as mongoose.Types.ObjectId);
      // Also store with original case for exact matches
      organizationMap.set(org.name.trim(), org._id as mongoose.Types.ObjectId);
    });

    // Build building map - key format: "orgId-buildingName" (case-insensitive building name)
    const buildings = await MapBuilding.find({ isActive: true }).populate("organization", "name");
    buildings.forEach((building) => {
      let orgId: string;
      if (building.organization instanceof mongoose.Types.ObjectId) {
        orgId = building.organization.toString();
      } else if (typeof building.organization === "object" && building.organization !== null) {
        orgId = (building.organization as any)._id?.toString() || String(building.organization);
      } else {
        orgId = String(building.organization);
      }
      const buildingName = building.name.trim().toLowerCase();
      const key = `${orgId}-${buildingName}`;
      buildingMap.set(key, building._id as mongoose.Types.ObjectId);
      // Also store with original case
      const keyOriginal = `${orgId}-${building.name.trim()}`;
      buildingMap.set(keyOriginal, building._id as mongoose.Types.ObjectId);
    });

    // Build floor map
    const floors = await MapFloorPlan.find().populate("building", "name organization");
    floors.forEach((floor) => {
      let buildingId: string;
      if (floor.building instanceof mongoose.Types.ObjectId) {
        buildingId = floor.building.toString();
      } else if (typeof floor.building === "object" && floor.building !== null) {
        buildingId = (floor.building as any)._id?.toString() || String(floor.building);
      } else {
        buildingId = String(floor.building);
      }
      const floorTitle = floor.title.trim().toLowerCase();
      const key = `${buildingId}-${floorTitle}`;
      floorMap.set(key, floor._id as mongoose.Types.ObjectId);
      // Also store with original case
      const keyOriginal = `${buildingId}-${floor.title.trim()}`;
      floorMap.set(keyOriginal, floor._id as mongoose.Types.ObjectId);
    });

    // Build department map (case-insensitive)
    const departments = await Department.find({ isActive: true });
    departments.forEach((dept) => {
      departmentMap.set(dept.name.trim().toLowerCase(), dept._id as mongoose.Types.ObjectId);
    });

    let createdCount = 0;
    let skippedCount = 0;

    for (const assetData of assetsToSeed) {
      const existingAsset = await Asset.findOne({
        name: assetData.name,
        organization: organizationMap.get(assetData.organizationName),
      });

      if (existingAsset) {
        console.log(`⏭️  Asset "${assetData.name}" already exists, skipping...`);
        skippedCount++;
        continue;
      }

      // Get organization ID (try both exact and case-insensitive)
      let organizationId = organizationMap.get(assetData.organizationName.trim());
      if (!organizationId) {
        organizationId = organizationMap.get(assetData.organizationName.trim().toLowerCase());
      }
      if (!organizationId) {
        console.warn(`⚠️  Organization "${assetData.organizationName}" not found for asset "${assetData.name}", skipping...`);
        skippedCount++;
        continue;
      }

      // Get building ID (try both exact and case-insensitive)
      let buildingId: mongoose.Types.ObjectId | null = null;
      if (assetData.buildingName) {
        const buildingNameTrimmed = assetData.buildingName.trim();
        const buildingKey = `${organizationId.toString()}-${buildingNameTrimmed}`;
        const buildingKeyLower = `${organizationId.toString()}-${buildingNameTrimmed.toLowerCase()}`;
        buildingId = buildingMap.get(buildingKey) || buildingMap.get(buildingKeyLower) || null;
        if (!buildingId) {
          console.warn(`⚠️  Building "${assetData.buildingName}" not found for asset "${assetData.name}" in organization "${assetData.organizationName}"`);
        }
      }

      // Get floor ID (try both exact and case-insensitive)
      let floorId: mongoose.Types.ObjectId | null = null;
      if (assetData.floorTitle && buildingId) {
        const floorTitleTrimmed = assetData.floorTitle.trim();
        const floorKey = `${buildingId.toString()}-${floorTitleTrimmed}`;
        const floorKeyLower = `${buildingId.toString()}-${floorTitleTrimmed.toLowerCase()}`;
        floorId = floorMap.get(floorKey) || floorMap.get(floorKeyLower) || null;
        if (!floorId) {
          console.warn(`⚠️  Floor "${assetData.floorTitle}" not found for asset "${assetData.name}" in building "${assetData.buildingName}"`);
        }
      }

      let departmentId: mongoose.Types.ObjectId | null = null;
      if (assetData.departmentName) {
        const normalizedDeptName = assetData.departmentName.trim().toLowerCase();
        departmentId = departmentMap.get(normalizedDeptName) || null;
        if (!departmentId) {
          console.warn(`⚠️  Department "${assetData.departmentName}" not found for asset "${assetData.name}"`);
        }
      }

      const lastSeen = assetData.lastSeenMinutesAgo
        ? new Date(Date.now() - assetData.lastSeenMinutesAgo * 60 * 1000)
        : new Date();

      const asset = new Asset({
        organization: organizationId,
        name: assetData.name,
        type: assetData.type,
        status: assetData.status,
        building: buildingId,
        floor: floorId,
        location: assetData.location || null,
        department: departmentId,
        batteryLevel: assetData.batteryLevel || null,
        lastSeen: lastSeen,
        mapCoordinates: assetData.mapCoordinates || undefined,
        description: assetData.description || null,
        tags: assetData.tags || [],
        isActive: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
      });

      await asset.save();
      console.log(`✅ Asset "${assetData.name}" created successfully!`);
      console.log(`   Type: ${assetData.type}, Status: ${assetData.status}, Battery: ${assetData.batteryLevel || "N/A"}%`);
      createdCount++;
    }

    console.log("\n📊 Assets Seeding Summary:");
    console.log(`   ✅ Created: ${createdCount} assets`);
    console.log(`   ⏭️  Skipped: ${skippedCount} assets`);
  } catch (error: any) {
    console.error("❌ Error seeding assets:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedAssets()
    .then(() => {
      console.log("\n✅ Asset seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Asset seeding failed:", error);
      process.exit(1);
    });
}

export default seedAssets;

