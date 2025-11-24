import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import Geofence, { GeofenceType } from "../../models/admin/alerts-geofencing/geofence";
import Organization from "../../models/admin/organization/organization";
import MapBuilding from "../../models/admin/map-management/mapBuilding";
import MapFloorPlan from "../../models/admin/map-management/mapFloorPlan";
import AdminUser from "../../models/admin/user-management/users";
import { AdminRole } from "../../models/admin/user-management/roles-permissions";

interface GeofenceSeedData {
  name: string;
  description?: string;
  type: GeofenceType;
  buildingName?: string;
  floorTitle?: string;
  alertOnEntry: boolean;
  alertOnExit: boolean;
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
  };
  isActive: boolean;
}

const geofencesToSeed: GeofenceSeedData[] = [
  {
    name: "ICU Restricted Area",
    description: "Restricted access to ICU ward",
    type: GeofenceType.RESTRICTED,
    buildingName: "Main Building",
    floorTitle: "Main Building 1st Floor",
    alertOnEntry: true,
    alertOnExit: false,
    notificationSettings: {
      email: true,
      sms: false,
      push: true,
      sound: true,
    },
    isActive: true,
  },
  {
    name: "Emergency Exit Zone",
    description: "Monitor emergency exit usage",
    type: GeofenceType.ALERT,
    buildingName: "Main Building",
    floorTitle: "Main Building Ground Floor",
    alertOnEntry: true,
    alertOnExit: true,
    notificationSettings: {
      email: true,
      sms: false,
      push: false,
      sound: false,
    },
    isActive: true,
  },
  {
    name: "Pharmacy Area",
    description: "Notification zone for pharmacy access",
    type: GeofenceType.NOTIFICATION,
    buildingName: "Main Building",
    floorTitle: "Main Building Ground Floor",
    alertOnEntry: true,
    alertOnExit: false,
    notificationSettings: {
      email: false,
      sms: false,
      push: true,
      sound: false,
    },
    isActive: false,
  },
];

const seedGeofences = async () => {
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

    let createdCount = 0;
    let skippedCount = 0;

    if (organizations.length === 0) {
      console.log(`❌ No organizations found. Please run organization seeder first.`);
      return;
    }

    console.log(`📋 Found ${organizations.length} organization(s) to seed geofences for`);
    
    for (const org of organizations) {
      const orgId = org._id as mongoose.Types.ObjectId;
      const orgName = org.name;
      console.log(`\n🏢 Processing organization: "${orgName}" (${orgId})`);

      for (const geofenceData of geofencesToSeed) {
        const existingGeofence = await Geofence.findOne({
          name: geofenceData.name,
          organization: orgId,
        });

        if (existingGeofence) {
          skippedCount++;
          continue;
        }

        let buildingId: mongoose.Types.ObjectId | null = null;
        if (geofenceData.buildingName) {
          const buildingKey = `${orgId.toString()}-${geofenceData.buildingName.trim().toLowerCase()}`;
          buildingId = buildingMap.get(buildingKey) || null;
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
          if (geofenceData.floorTitle) {
            const floorKey = `${buildingId.toString()}-${geofenceData.floorTitle.trim().toLowerCase()}`;
            floorId = floorMap.get(floorKey) || null;
          }
          if (!floorId) {
            const buildingFloors = await MapFloorPlan.find({ 
              building: buildingId 
            }).limit(1);
            if (buildingFloors.length > 0 && buildingFloors[0]) {
              floorId = buildingFloors[0]._id as mongoose.Types.ObjectId;
            }
          }
        }

        const newGeofence = await Geofence.create({
          organization: orgId,
          building: buildingId,
          floor: floorId,
          name: geofenceData.name,
          description: geofenceData.description || null,
          type: geofenceData.type,
          alertOnEntry: geofenceData.alertOnEntry,
          alertOnExit: geofenceData.alertOnExit,
          notificationSettings: geofenceData.notificationSettings,
          isActive: geofenceData.isActive,
          createdBy: adminUser._id,
          updatedBy: adminUser._id,
        });

        console.log(`   ✅ Created geofence: "${geofenceData.name}" (${newGeofence._id})`);
        createdCount++;
      }
    }

    console.log(`✅ Created ${createdCount} geofences across ${organizations.length} organization(s)`);
    if (skippedCount > 0) {
      console.log(`⏭️  Skipped ${skippedCount} geofences (already exist or missing dependencies)`);
    }
  } catch (error: any) {
    console.error("❌ Error seeding geofences:", error.message);
    throw error;
  }
};

export default seedGeofences;

