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

    const organizations = await Organization.find({ isActive: true });
    organizations.forEach((org) => {
      const normalizedName = org.name.trim().toLowerCase();
      organizationMap.set(normalizedName, org._id as mongoose.Types.ObjectId);
      organizationMap.set(org.name.trim(), org._id as mongoose.Types.ObjectId);
    });

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
      const keyOriginal = `${orgId}-${building.name.trim()}`;
      buildingMap.set(keyOriginal, building._id as mongoose.Types.ObjectId);
    });

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
      const keyOriginal = `${buildingId}-${floor.title.trim()}`;
      floorMap.set(keyOriginal, floor._id as mongoose.Types.ObjectId);
    });

    const departments = await Department.find({ isActive: true });
    departments.forEach((dept) => {
      departmentMap.set(dept.name.trim().toLowerCase(), dept._id as mongoose.Types.ObjectId);
    });

    let createdCount = 0;
    let skippedCount = 0;

    if (organizations.length === 0) {
      console.log(`❌ No organizations found. Please run organization seeder first.`);
      return;
    }

    const seededRandom = (seed: number, min: number, max: number): number => {
      const x = Math.sin(seed) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    console.log(`📋 Found ${organizations.length} organization(s) to seed assets for`);
    
    for (const org of organizations) {
      const orgId = org._id as mongoose.Types.ObjectId;
      const orgName = org.name;
      console.log(`\n🏢 Processing organization: "${orgName}" (${orgId})`);

      const orgSeed = parseInt(orgId.toString().slice(-8), 16);

      const assetCount = seededRandom(orgSeed, 8, 15);
      const selectedAssets = assetsToSeed.slice(0, Math.min(assetCount, assetsToSeed.length));

      for (let i = 0; i < selectedAssets.length; i++) {
        const assetData = selectedAssets[i];
        const itemSeed = orgSeed + i;

        const assetName = `${assetData?.name} #${seededRandom(itemSeed, 1, 99)}`;

        const existingAsset = await Asset.findOne({
          name: assetName,
          organization: orgId,
        });

        if (existingAsset) {
          skippedCount++;
          continue;
        }

        let buildingId: mongoose.Types.ObjectId | null = null;
        if (assetData?.buildingName) {
          const buildingNameTrimmed = assetData?.buildingName.trim();
          const buildingKey = `${orgId.toString()}-${buildingNameTrimmed}`;
          const buildingKeyLower = `${orgId.toString()}-${buildingNameTrimmed.toLowerCase()}`;
          buildingId = buildingMap.get(buildingKey) || buildingMap.get(buildingKeyLower) || null;
          
          if (buildingId) {
            const building = await MapBuilding.findOne({ 
              _id: buildingId,
              organization: orgId,
              isActive: true 
            });
            if (!building) {
              buildingId = null;
            }
          }
          
          if (!buildingId) {
            const orgBuildings = await MapBuilding.find({ 
              organization: orgId, 
              isActive: true 
            }).limit(1);
            if (orgBuildings.length > 0 && orgBuildings[0]) {
              buildingId = orgBuildings[0]._id as mongoose.Types.ObjectId;
            }
          }
        }

        let floorId: mongoose.Types.ObjectId | null = null;
        if (buildingId) {
          if (assetData?.floorTitle) {
            const floorTitleTrimmed = assetData?.floorTitle.trim();
            const floorKey = `${buildingId.toString()}-${floorTitleTrimmed}`;
            const floorKeyLower = `${buildingId.toString()}-${floorTitleTrimmed.toLowerCase()}`;
            floorId = floorMap.get(floorKey) || floorMap.get(floorKeyLower) || null;
            
            if (floorId) {
              const floorPlan = await MapFloorPlan.findOne({ 
                _id: floorId,
                building: buildingId,
                organization: orgId 
              });
              if (!floorPlan) {
                floorId = null;
              }
            }
          }
          if (!floorId) {
            const buildingFloors = await MapFloorPlan.find({ 
              building: buildingId,
              organization: orgId 
            }).limit(1);
            if (buildingFloors.length > 0 && buildingFloors[0]) {
              floorId = buildingFloors[0]._id as mongoose.Types.ObjectId;
            }
          }
        }

        let departmentId: mongoose.Types.ObjectId | null = null;
        if (assetData?.departmentName) {
          const normalizedDeptName = assetData?.departmentName.trim().toLowerCase();
          departmentId = departmentMap.get(normalizedDeptName) || null;
        }

        const batteryLevel = seededRandom(itemSeed, 15, 95);
        const statusSeed = seededRandom(itemSeed, 1, 10);
        let status: AssetStatus;
        if (statusSeed <= 6) {
          status = AssetStatus.ONLINE;
        } else if (statusSeed <= 8) {
          status = AssetStatus.OFFLINE;
        } else {
          status = AssetStatus.LOW_BATTERY;
        }

        const lastSeenMinutesAgo = seededRandom(itemSeed, 1, 30) / 2;
        const lastSeen = new Date(Date.now() - lastSeenMinutesAgo * 60 * 1000);

        const mapCoordinates = assetData?.mapCoordinates ? {
          x: seededRandom(itemSeed, 50, 500),
          y: seededRandom(itemSeed + 100, 50, 500),
          latitude: assetData.mapCoordinates.latitude ? assetData.mapCoordinates.latitude + (seededRandom(itemSeed, -10, 10) / 100) : undefined,
          longitude: assetData.mapCoordinates.longitude ? assetData.mapCoordinates.longitude + (seededRandom(itemSeed + 200, -10, 10) / 100) : undefined,
        } : undefined;

        const asset = new Asset({
          organization: orgId,
          name: assetName,
          type: assetData?.type,
          status: status,
          building: buildingId,
          floor: floorId,
          location: assetData?.location || null,
          department: departmentId,
          batteryLevel: batteryLevel,
          lastSeen: lastSeen,
          mapCoordinates: mapCoordinates,
          description: assetData?.description || null,
          tags: assetData?.tags || [],
          isActive: true,
          createdAt: new Date(Date.now() - seededRandom(itemSeed, 0, 180) * 24 * 60 * 60 * 1000),
          createdBy: adminUser._id,
          updatedBy: adminUser._id,
        });

        await asset.save();
        console.log(`   ✅ Created asset: "${assetName}" (${status}, ${batteryLevel}% battery)`);
        createdCount++;
      }
    }

    console.log(`\n✅ Created ${createdCount} assets across ${organizations.length} organization(s)`);
    if (skippedCount > 0) {
      console.log(`⏭️  Skipped ${skippedCount} assets (already exist or missing dependencies)`);
    }
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

