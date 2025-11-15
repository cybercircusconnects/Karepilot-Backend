import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import MapBuilding from "../../models/admin/map-management/mapBuilding";
import Organization from "../../models/admin/organization/organization";
import VenueTemplate from "../../models/admin/organization/venueTemplate";
import AdminUser from "../../models/admin/user-management/users";
import { AdminRole } from "../../models/admin/user-management/roles-permissions";
import { MapBuildingStatus } from "../../types/admin/map-management";

interface BuildingSeedData {
  organizationName: string;
  name: string;
  code?: string;
  description?: string;
  tags?: string[];
  status?: MapBuildingStatus;
  venueTemplateName?: string;
  isActive?: boolean;
}

const buildingsToSeed: BuildingSeedData[] = [
  {
    organizationName: "CityCare General Hospital",
    name: "Main Building",
    code: "MB-001",
    description: "Primary building housing administrative offices, reception, and main patient facilities",
    tags: ["main", "administrative", "public-access"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Hospital Template",
    isActive: true,
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Emergency Wing",
    code: "EW-001",
    description: "Emergency wing with patient rooms, operating theaters, and emergency services",
    tags: ["emergency", "medical", "patient-care"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Hospital Template",
    isActive: true,
  },
  {
    organizationName: "CityCare General Hospital",
    name: "Diagnostic Center",
    code: "DC-001",
    description: "Diagnostic center with imaging facilities and laboratories",
    tags: ["diagnostic", "imaging", "laboratory"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Hospital Template",
    isActive: true,
  },
  {
    organizationName: "Lakeside Regional Medical",
    name: "Main Hospital Building",
    code: "MHB-001",
    description: "Main hospital building with all primary medical services",
    tags: ["main", "hospital", "medical"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Hospital Template",
    isActive: true,
  },
  {
    organizationName: "Lakeside Regional Medical",
    name: "Research Center",
    code: "RC-001",
    description: "Research and development center for medical studies",
    tags: ["research", "development", "laboratory"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Hospital Template",
    isActive: true,
  },
  {
    organizationName: "SkyWays International Airport",
    name: "Terminal 1",
    code: "T1",
    description: "Main terminal building with check-in counters and departure gates",
    tags: ["terminal", "check-in", "departures"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Airport Template",
    isActive: true,
  },
  {
    organizationName: "SkyWays International Airport",
    name: "Terminal 2",
    code: "T2",
    description: "Secondary terminal for international flights",
    tags: ["terminal", "international", "flights"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Airport Template",
    isActive: true,
  },
  {
    organizationName: "SkyWays International Airport",
    name: "Cargo Terminal",
    code: "CT-001",
    description: "Cargo handling and storage facility",
    tags: ["cargo", "storage", "logistics"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Airport Template",
    isActive: true,
  },
  {
    organizationName: "Pacific Gateway Airport",
    name: "Main Terminal",
    code: "MT",
    description: "Primary terminal building with all passenger services",
    tags: ["terminal", "passenger", "services"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Airport Template",
    isActive: true,
  },
  {
    organizationName: "Harborfront Shopping Plaza",
    name: "North Wing",
    code: "NW-001",
    description: "North wing with retail stores and food court",
    tags: ["retail", "shopping", "food-court"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Shopping Mall Template",
    isActive: true,
  },
  {
    organizationName: "Harborfront Shopping Plaza",
    name: "South Wing",
    code: "SW-001",
    description: "South wing with entertainment and cinema",
    tags: ["entertainment", "cinema", "retail"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Shopping Mall Template",
    isActive: true,
  },
  {
    organizationName: "Aurora Grand Mall",
    name: "Main Mall Building",
    code: "MMB-001",
    description: "Main shopping mall building with multiple floors",
    tags: ["shopping", "retail", "mall"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Shopping Mall Template",
    isActive: true,
  },
  {
    organizationName: "Greenfield Innovation Campus",
    name: "Innovation Hub",
    code: "IH-001",
    description: "Main innovation hub with offices and meeting spaces",
    tags: ["innovation", "offices", "meetings"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Open Place Template",
    isActive: true,
  },
  {
    organizationName: "Greenfield Innovation Campus",
    name: "Research Labs",
    code: "RL-001",
    description: "Research laboratories and testing facilities",
    tags: ["research", "labs", "testing"],
    status: MapBuildingStatus.ACTIVE,
    venueTemplateName: "Open Place Template",
    isActive: true,
  },
];

const seedBuildings = async () => {
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

    const venueTemplates = await VenueTemplate.find({});
    if (!venueTemplates.length) {
      throw new Error("No venue templates found. Please run the venue template seeder first.");
    }

    const templateMap = new Map<string, mongoose.Types.ObjectId>();
    venueTemplates.forEach((template) => {
      const normalizedName = template.name.trim().toLowerCase();
      templateMap.set(normalizedName, template._id as mongoose.Types.ObjectId);
    });

    const adminUser = await AdminUser.findOne({ role: AdminRole.ADMIN }).select("_id");
    if (!adminUser) {
      console.warn("⚠️  No admin user found. Buildings will be seeded without creator information.");
    }

    const createdBy =
      adminUser && adminUser._id instanceof mongoose.Types.ObjectId ? adminUser._id : null;

    let createdCount = 0;
    let skippedCount = 0;
    let missingOrgCount = 0;

    for (const buildingData of buildingsToSeed) {
      const normalizedOrgName = buildingData.organizationName.trim().toLowerCase();
      const orgId = organizationMap.get(normalizedOrgName);
      if (!orgId) {
        console.warn(
          `⚠️  Organization "${buildingData.organizationName}" not found. Skipping building "${buildingData.name}".`,
        );
        missingOrgCount++;
        continue;
      }

      const normalizedBuildingName = buildingData.name.trim();
      const existing = await MapBuilding.findOne({
        organization: orgId,
        name: { $regex: new RegExp(`^${normalizedBuildingName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      });

      if (existing) {
        console.log(
          `⏭️  Building "${buildingData.name}" for "${buildingData.organizationName}" already exists, skipping...`,
        );
        skippedCount++;
        continue;
      }

      let venueTemplateId: mongoose.Types.ObjectId | null = null;
      if (buildingData.venueTemplateName) {
        const normalizedTemplateName = buildingData.venueTemplateName.trim().toLowerCase();
        const templateId = templateMap.get(normalizedTemplateName);
        if (!templateId) {
          console.warn(
            `⚠️  Venue template "${buildingData.venueTemplateName}" not found for building "${buildingData.name}".`,
          );
        } else {
          venueTemplateId = templateId;
        }
      }

      const building = new MapBuilding({
        organization: orgId as mongoose.Types.ObjectId,
        name: buildingData.name,
        code: buildingData.code || null,
        description: buildingData.description || null,
        tags: buildingData.tags || [],
        status: buildingData.status || MapBuildingStatus.ACTIVE,
        venueTemplate: venueTemplateId,
        isActive: buildingData.isActive ?? true,
        createdBy,
        updatedBy: createdBy,
      });

      await building.save();
      console.log(`✅ Building "${buildingData.name}" created successfully!`);
      console.log(`   Organization: ${buildingData.organizationName}`);
      console.log(`   Code: ${buildingData.code || "N/A"}`);
      console.log(`   Venue Template: ${buildingData.venueTemplateName || "None"}`);
      console.log(`   Status: ${building.status}`);
      createdCount++;
    }

    console.log("\n📊 Buildings Seeding Summary:");
    console.log(`   ✅ Created: ${createdCount} buildings`);
    console.log(`   ⏭️  Skipped: ${skippedCount} buildings`);
    console.log(`   ⚠️  Missing Organization: ${missingOrgCount} buildings`);
    console.log(`   📋 Total: ${buildingsToSeed.length} buildings`);
  } catch (error: any) {
    console.error("❌ Error seeding buildings:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedBuildings()
    .then(() => {
      console.log("\n✅ Buildings seeder completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Buildings seeder failed:", error.message);
      process.exit(1);
    });
}

export default seedBuildings;

