import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import MapEditorLabel from "../../models/admin/map-management/mapEditorLabel";
import MapFloorPlan from "../../models/admin/map-management/mapFloorPlan";
import AdminUser from "../../models/admin/user-management/users";
import { AdminRole } from "../../models/admin/user-management/roles-permissions";

interface LabelTemplate {
  text: string;
  coordinates: {
    x: number;
    y: number;
  };
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}

const groundFloorLabelTemplate: LabelTemplate[] = [
  {
    text: "Main Entry",
    coordinates: { x: 100, y: 50 },
    fontSize: "16px",
    fontWeight: "Bold",
    color: "#000000",
  },
  {
    text: "Reception",
    coordinates: { x: 300, y: 150 },
    fontSize: "14px",
    fontWeight: "Normal",
    color: "#000000",
  },
  {
    text: "Emergency Exit",
    coordinates: { x: 500, y: 400 },
    fontSize: "14px",
    fontWeight: "Bold",
    color: "#DC2626",
  },
];

const upperFloorLabelTemplate: LabelTemplate[] = [
  {
    text: "Main Entry",
    coordinates: { x: 100, y: 50 },
    fontSize: "16px",
    fontWeight: "Bold",
    color: "#000000",
  },
  {
    text: "Reception",
    coordinates: { x: 300, y: 150 },
    fontSize: "14px",
    fontWeight: "Normal",
    color: "#000000",
  },
  {
    text: "Staff Area",
    coordinates: { x: 200, y: 300 },
    fontSize: "14px",
    fontWeight: "Normal",
    color: "#000000",
  },
];

const getLabelTemplate = (
  floorNumber: number | null | undefined,
): LabelTemplate[] => {
  if (floorNumber === 0 || floorNumber === null || floorNumber === undefined) {
    return groundFloorLabelTemplate;
  }
  return upperFloorLabelTemplate;
};

const seedMapEditorLabels = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const floorPlans = await MapFloorPlan.find({ isActive: true });
    if (!floorPlans.length) {
      throw new Error("No active floor plans found. Please run the floor plans seeder first.");
    }

    const adminUser = await AdminUser.findOne({ role: AdminRole.ADMIN }).select("_id");
    if (!adminUser) {
      console.warn(
        "⚠️  No admin user found. Labels will be seeded without creator information.",
      );
    }

    const createdBy =
      adminUser && adminUser._id instanceof mongoose.Types.ObjectId ? adminUser._id : null;

    let totalCreatedCount = 0;
    let totalSkippedCount = 0;
    let floorPlansProcessed = 0;
    let floorPlansSkipped = 0;

    console.log(`\n📋 Processing ${floorPlans.length} floor plans...\n`);

    for (const floorPlan of floorPlans) {
      const floorPlanId = floorPlan._id as mongoose.Types.ObjectId;
      const floorNumber = floorPlan.floorNumber;
      const floorPlanTitle = floorPlan.title;

      const labelTemplate = getLabelTemplate(floorNumber);

      const existingLabelCount = await MapEditorLabel.countDocuments({
        floorPlan: floorPlanId,
      });

      if (existingLabelCount > 0) {
        console.log(
          `⏭️  Floor plan "${floorPlanTitle}" already has ${existingLabelCount} labels, skipping...`,
        );
        floorPlansSkipped++;
        continue;
      }

      let floorCreatedCount = 0;
      let floorSkippedCount = 0;

      console.log(
        `\n🏷️  Processing floor plan: "${floorPlanTitle}" (Floor ${floorNumber ?? "Ground"})`,
      );

      for (const labelTemplateData of labelTemplate) {
        const existing = await MapEditorLabel.findOne({
          floorPlan: floorPlanId,
          text: labelTemplateData.text.trim(),
        });

        if (existing) {
          floorSkippedCount++;
          continue;
        }

        const coordinateOffset = Math.floor(Math.random() * 20) - 10;
        const x = Math.max(50, labelTemplateData.coordinates.x + coordinateOffset);
        const y = Math.max(50, labelTemplateData.coordinates.y + coordinateOffset);

        const label = new MapEditorLabel({
          floorPlan: floorPlanId,
          text: labelTemplateData.text.trim(),
          coordinates: {
            x,
            y,
          },
          fontSize: labelTemplateData.fontSize || "16px",
          fontWeight: labelTemplateData.fontWeight || "Normal",
          color: labelTemplateData.color || "#000000",
          isActive: true,
          createdBy,
          updatedBy: createdBy,
        });

        await label.save();
        floorCreatedCount++;
        totalCreatedCount++;
      }

      if (floorCreatedCount > 0) {
        console.log(
          `   ✅ Created ${floorCreatedCount} labels for "${floorPlanTitle}"`,
        );
        if (floorSkippedCount > 0) {
          console.log(`   ⏭️  Skipped ${floorSkippedCount} existing labels`);
        }
        floorPlansProcessed++;
      } else {
        console.log(
          `   ⏭️  No new labels created (${floorSkippedCount} already exist)`,
        );
        floorPlansSkipped++;
      }

      totalSkippedCount += floorSkippedCount;
    }

    console.log("\n📊 Map Editor Labels Seeding Summary:");
    console.log(`   ✅ Created: ${totalCreatedCount} labels`);
    console.log(`   ⏭️  Skipped: ${totalSkippedCount} labels`);
    console.log(`   📍 Floor Plans Processed: ${floorPlansProcessed}`);
    console.log(`   ⏭️  Floor Plans Skipped: ${floorPlansSkipped}`);
    console.log(`   📋 Total Floor Plans: ${floorPlans.length}`);
  } catch (error: any) {
    console.error("❌ Error seeding map editor labels:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedMapEditorLabels()
    .then(() => {
      console.log("\n✅ Map Editor Labels seeder completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Map Editor Labels seeder failed:", error.message);
      process.exit(1);
    });
}

export default seedMapEditorLabels;

