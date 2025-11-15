import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import MapManagementSettings from "../../models/admin/map-management/mapSettings";
import Organization from "../../models/admin/organization/organization";
import AdminUser from "../../models/admin/user-management/users";
import { AdminRole } from "../../models/admin/user-management/roles-permissions";

interface SettingsSeedData {
  organizationName: string;
  autoPublishUpdates?: boolean;
  highResolutionThumbnails?: boolean;
  enableVersionControl?: boolean;
}

const settingsToSeed: SettingsSeedData[] = [
  {
    organizationName: "CityCare General Hospital",
    autoPublishUpdates: false,
    highResolutionThumbnails: true,
    enableVersionControl: true,
  },
  {
    organizationName: "Lakeside Regional Medical",
    autoPublishUpdates: false,
    highResolutionThumbnails: true,
    enableVersionControl: true,
  },
  {
    organizationName: "SkyWays International Airport",
    autoPublishUpdates: true,
    highResolutionThumbnails: true,
    enableVersionControl: true,
  },
  {
    organizationName: "Pacific Gateway Airport",
    autoPublishUpdates: true,
    highResolutionThumbnails: true,
    enableVersionControl: true,
  },
  {
    organizationName: "Harborfront Shopping Plaza",
    autoPublishUpdates: false,
    highResolutionThumbnails: false,
    enableVersionControl: true,
  },
  {
    organizationName: "Aurora Grand Mall",
    autoPublishUpdates: false,
    highResolutionThumbnails: false,
    enableVersionControl: true,
  },
  {
    organizationName: "Greenfield Innovation Campus",
    autoPublishUpdates: false,
    highResolutionThumbnails: true,
    enableVersionControl: true,
  },
  {
    organizationName: "Central City Commons",
    autoPublishUpdates: false,
    highResolutionThumbnails: true,
    enableVersionControl: true,
  },
];

const seedSettings = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const organizations = await Organization.find({ isActive: true });
    if (!organizations.length) {
      throw new Error("No active organizations found. Please run the organization seeder first.");
    }

    const organizationMap = new Map<string, mongoose.Types.ObjectId>();
    organizations.forEach((org) => {
      const normalizedName = org.name.trim().toLowerCase();
      organizationMap.set(normalizedName, org._id as mongoose.Types.ObjectId);
    });

    const adminUser = await AdminUser.findOne({ role: AdminRole.ADMIN }).select("_id");
    if (!adminUser) {
      console.warn("⚠️  No admin user found. Settings will be seeded without updater information.");
    }

    const updatedBy =
      adminUser && adminUser._id instanceof mongoose.Types.ObjectId ? adminUser._id : null;

    let createdCount = 0;
    let skippedCount = 0;
    let missingOrgCount = 0;

    for (const settingsData of settingsToSeed) {
      const normalizedOrgName = settingsData.organizationName.trim().toLowerCase();
      const orgId = organizationMap.get(normalizedOrgName);
      if (!orgId) {
        console.warn(
          `⚠️  Organization "${settingsData.organizationName}" not found. Skipping settings.`,
        );
        missingOrgCount++;
        continue;
      }

      const existing = await MapManagementSettings.findOne({
        organization: orgId,
      });

      if (existing) {
        console.log(
          `⏭️  Settings for "${settingsData.organizationName}" already exist, skipping...`,
        );
        skippedCount++;
        continue;
      }

      const settings = new MapManagementSettings({
        organization: orgId as mongoose.Types.ObjectId,
        autoPublishUpdates: settingsData.autoPublishUpdates ?? false,
        highResolutionThumbnails: settingsData.highResolutionThumbnails ?? true,
        enableVersionControl: settingsData.enableVersionControl ?? true,
        updatedBy,
      });

      await settings.save();
      console.log(`✅ Settings for "${settingsData.organizationName}" created successfully!`);
      console.log(`   Auto Publish Updates: ${settings.autoPublishUpdates}`);
      console.log(`   High Resolution Thumbnails: ${settings.highResolutionThumbnails}`);
      console.log(`   Enable Version Control: ${settings.enableVersionControl}`);
      createdCount++;
    }

    console.log("\n📊 Settings Seeding Summary:");
    console.log(`   ✅ Created: ${createdCount} settings`);
    console.log(`   ⏭️  Skipped: ${skippedCount} settings`);
    console.log(`   ⚠️  Missing Organization: ${missingOrgCount} settings`);
    console.log(`   📋 Total: ${settingsToSeed.length} settings`);
  } catch (error: any) {
    console.error("❌ Error seeding settings:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedSettings()
    .then(() => {
      console.log("\n✅ Settings seeder completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Settings seeder failed:", error.message);
      process.exit(1);
    });
}

export default seedSettings;

