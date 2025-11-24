import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import Alert, { AlertType, AlertSeverity, AlertStatus } from "../../models/admin/alerts-geofencing/alert";
import Organization from "../../models/admin/organization/organization";
import MapBuilding from "../../models/admin/map-management/mapBuilding";
import MapFloorPlan from "../../models/admin/map-management/mapFloorPlan";
import Department from "../../models/admin/user-management/departments";
import Asset from "../../models/admin/asset-tracking/asset";
import AdminUser from "../../models/admin/user-management/users";
import { AdminRole } from "../../models/admin/user-management/roles-permissions";

interface AlertSeedData {
  name: string;
  description?: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  buildingName?: string;
  floorTitle?: string;
  location?: string;
  room?: string;
  departmentName?: string;
  assetName?: string;
  timestampMinutesAgo?: number;
}

const alertsToSeed: AlertSeedData[] = [
  {
    name: "Unauthorized entry detected in ICU Restricted Area",
    description: "Unauthorized entry detected in ICU Restricted Area",
    type: AlertType.UNAUTHORIZED_ENTRY,
    severity: AlertSeverity.HIGH,
    status: AlertStatus.ACTIVE,
    buildingName: "Main Building",
    floorTitle: "Main Building 1st Floor",
    location: "Main Hospital - ICU Ward",
    room: "ICU-301",
    departmentName: "ICU",
    timestampMinutesAgo: 2,
  },
  {
    name: "Mobile Tablet #MT-15 battery critically low (5%)",
    description: "Mobile Tablet #MT-15 battery critically low (5%)",
    type: AlertType.LOW_BATTERY,
    severity: AlertSeverity.MEDIUM,
    status: AlertStatus.ACKNOWLEDGED,
    buildingName: "Main Building",
    floorTitle: "Main Building 1st Floor",
    location: "Main Hospital - ICU Ward",
    departmentName: "ICU",
    assetName: "Mobile Tablet #MT-15",
    timestampMinutesAgo: 5,
  },
  {
    name: "Emergency exit usage detected",
    description: "Emergency exit usage detected",
    type: AlertType.EMERGENCY_EXIT,
    severity: AlertSeverity.LOW,
    status: AlertStatus.RESOLVED,
    buildingName: "Main Building",
    floorTitle: "Main Building Ground Floor",
    location: "Main Hospital - Ground Floor",
    timestampMinutesAgo: 30,
  },
  {
    name: "Map rendering service experiencing delays",
    description: "Map rendering service experiencing delays",
    type: AlertType.SYSTEM_ALERT,
    severity: AlertSeverity.MEDIUM,
    status: AlertStatus.ACKNOWLEDGED,
    location: "System Wide",
    timestampMinutesAgo: 60,
  },
  {
    name: "Geofence trigger: ICU Restricted Area entry",
    description: "Asset entered restricted geofence zone",
    type: AlertType.GEOFENCE_TRIGGER,
    severity: AlertSeverity.HIGH,
    status: AlertStatus.ACTIVE,
    buildingName: "Main Building",
    floorTitle: "Main Building 1st Floor",
    location: "Main Hospital - ICU Ward",
    timestampMinutesAgo: 1,
  },
];

const seedAlerts = async () => {
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
    const assetMap = new Map<string, mongoose.Types.ObjectId>();

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

    const assets = await Asset.find({ isActive: true });
    assets.forEach((asset) => {
      assetMap.set(asset.name.trim().toLowerCase(), asset._id as mongoose.Types.ObjectId);
    });

    let createdCount = 0;
    let skippedCount = 0;

    if (organizations.length === 0) {
      console.log(`❌ No organizations found. Please run organization seeder first.`);
      return;
    }

    console.log(`📋 Found ${organizations.length} organization(s) to seed alerts for`);
    
    for (const org of organizations) {
      const orgId = org._id as mongoose.Types.ObjectId;
      const orgName = org.name;
      console.log(`\n🏢 Processing organization: "${orgName}" (${orgId})`);

      for (const alertData of alertsToSeed) {
        const existingAlert = await Alert.findOne({
          name: alertData.name,
          organization: orgId,
        });

        if (existingAlert) {
          skippedCount++;
          continue;
        }

        let buildingId: mongoose.Types.ObjectId | null = null;
        if (alertData.buildingName) {
          const buildingKey = `${orgId.toString()}-${alertData.buildingName.trim().toLowerCase()}`;
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
          if (alertData.floorTitle) {
            const floorKey = `${buildingId.toString()}-${alertData.floorTitle.trim().toLowerCase()}`;
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

        let departmentId: mongoose.Types.ObjectId | null = null;
        if (alertData.departmentName) {
          departmentId = departmentMap.get(alertData.departmentName.trim().toLowerCase()) || null;
        }

        let assetId: mongoose.Types.ObjectId | null = null;
        if (alertData.assetName) {
          assetId = assetMap.get(alertData.assetName.trim().toLowerCase()) || null;
        }

        const timestamp = alertData.timestampMinutesAgo
          ? new Date(Date.now() - alertData.timestampMinutesAgo * 60 * 1000)
          : new Date();

        const newAlert = await Alert.create({
          organization: orgId,
          building: buildingId,
          floor: floorId,
          department: departmentId,
          asset: assetId,
          name: alertData.name,
          description: alertData.description || null,
          type: alertData.type,
          severity: alertData.severity,
          status: alertData.status,
          location: alertData.location || null,
          room: alertData.room || null,
          timestamp,
          isActive: true,
          createdBy: adminUser._id,
          updatedBy: adminUser._id,
        });

        console.log(`   ✅ Created alert: "${alertData.name}" (${newAlert._id})`);
        createdCount++;
      }
    }

    console.log(`✅ Created ${createdCount} alerts across ${organizations.length} organization(s)`);
    if (skippedCount > 0) {
      console.log(`⏭️  Skipped ${skippedCount} alerts (already exist or missing dependencies)`);
    }
  } catch (error: any) {
    console.error("❌ Error seeding alerts:", error.message);
    throw error;
  }
};

export default seedAlerts;

