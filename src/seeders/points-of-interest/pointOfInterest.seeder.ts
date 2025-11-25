"use strict";

import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import PointOfInterest from "../../models/admin/points-of-interest/pointOfInterest";
import Organization from "../../models/admin/organization/organization";
import AdminUser from "../../models/admin/user-management/users";
import { AdminRole } from "../../models/admin/user-management/roles-permissions";
import { PointOfInterestStatus } from "../../types/admin/points-of-interest";
import MapBuilding from "../../models/admin/map-management/mapBuilding";
import MapFloorPlan from "../../models/admin/map-management/mapFloorPlan";

interface POITemplate {
  name: string;
  category: string;
  categoryType?: string;
  description?: string;
  tags?: string[];
  amenities?: string[];
  accessibility?: {
    wheelchairAccessible?: boolean;
    hearingLoop?: boolean;
    visualAidSupport?: boolean;
  };
}

const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const randomItem = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error("Cannot get random item from empty array");
  }
  return array[Math.floor(Math.random() * array.length)]!;
};

const seededRandom = (seed: number, min: number, max: number): number => {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
};

const poiTemplates: POITemplate[] = [
  {
    name: "Emergency Department",
    category: "Emergency",
    categoryType: "Medical Services",
    description: "24/7 emergency medical services with on-site trauma care and triage.",
    tags: ["Emergency", "24/7", "Trauma"],
    amenities: ["Helipad Access", "Wheelchair Access"],
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: true,
      visualAidSupport: false,
    },
  },
  {
    name: "Advanced Imaging Center",
    category: "Radiology",
    categoryType: "Diagnostics",
    description: "Full-service imaging including MRI, CT, and ultrasound diagnostics.",
    tags: ["Radiology", "Diagnostics", "Imaging"],
    amenities: ["Patient Lounge", "Digital Results"],
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: false,
      visualAidSupport: true,
    },
  },
  {
    name: "Security Checkpoint",
    category: "Security",
    categoryType: "Security Services",
    description: "Primary passenger screening with security checkpoints.",
    tags: ["Security", "Checkpoint"],
    amenities: ["FastTrack Lanes", "Priority Screening"],
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: true,
      visualAidSupport: true,
    },
  },
  {
    name: "International Lounge",
    category: "Lounge",
    categoryType: "Passenger Amenities",
    description: "Premium lounge with shower suites, dining, and quiet workspaces.",
    tags: ["Lounge", "Premium", "Dining"],
    amenities: ["Showers", "Private Suites", "Buffet"],
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: false,
      visualAidSupport: true,
    },
  },
  {
    name: "Food Court",
    category: "Food & Beverage",
    categoryType: "Dining",
    description: "Multi-cuisine food court with various dining options.",
    tags: ["Food Court", "Dining", "Family Friendly"],
    amenities: ["Free WiFi", "Family Seating", "Charging Stations"],
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: false,
      visualAidSupport: false,
    },
  },
  {
    name: "Cinema",
    category: "Entertainment",
    categoryType: "Leisure",
    description: "Luxury cinema with multiple screens featuring premium seating.",
    tags: ["Cinema", "Entertainment", "IMAX"],
    amenities: ["Recliner Seats", "In-seat Dining", "Dolby Atmos"],
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: true,
      visualAidSupport: true,
    },
  },
  {
    name: "Pharmacy",
    category: "Pharmacy",
    categoryType: "Medical Services",
    description: "Full-service pharmacy with prescription and over-the-counter medications.",
    tags: ["Pharmacy", "Prescriptions", "Health"],
    amenities: ["Consultation", "Health Products"],
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: false,
      visualAidSupport: true,
    },
  },
  {
    name: "Information Desk",
    category: "Information",
    categoryType: "Services",
    description: "Customer service and information desk for visitor assistance.",
    tags: ["Information", "Customer Service", "Help"],
    amenities: ["Multilingual Support", "Maps"],
    accessibility: {
      wheelchairAccessible: true,
      hearingLoop: true,
      visualAidSupport: true,
    },
  },
];

const seedPointsOfInterest = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const organizations = await Organization.find({ isActive: true }).select("name _id email");
    
    if (organizations.length === 0) {
      console.warn(
        "⚠️  No organizations found. Please run the organization seeder before the POI seeder.",
      );
      return;
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

    let totalCreatedCount = 0;
    let totalSkippedCount = 0;

    console.log(`📋 Found ${organizations.length} organization(s) to seed POIs for`);

    for (const org of organizations) {
      const orgId = org._id as mongoose.Types.ObjectId;
      const orgName = org.name;
      console.log(`\n🏢 Processing organization: "${orgName}" (${orgId})`);

      const buildings = await MapBuilding.find({ 
        organization: orgId, 
        isActive: true 
      }).select("name _id");

      if (buildings.length === 0) {
        console.log(`   ⚠️  No buildings found for "${orgName}", skipping...`);
        continue;
      }

      const floors = await MapFloorPlan.find({ 
        building: { $in: buildings.map(b => b._id) } 
      }).select("title building _id");

      const orgSeed = parseInt(orgId.toString().slice(-8), 16);

      const poiCount = seededRandom(orgSeed, 4, 8);
      const selectedTemplates = poiTemplates.slice(0, Math.min(poiCount, poiTemplates.length));

      let orgCreatedCount = 0;
      let orgSkippedCount = 0;

      for (let i = 0; i < selectedTemplates.length; i++) {
        const template = selectedTemplates[i];
        if (!template) continue;
        const itemSeed = orgSeed + i;

        const building = randomItem(buildings);
        const buildingFloors = floors.filter(f => 
          f.building.toString() === (building._id as mongoose.Types.ObjectId).toString()
        );
        const floor = buildingFloors.length > 0 
          ? randomItem(buildingFloors) 
          : null;

        const roomPrefix = template.category.substring(0, 3).toUpperCase();
        const roomNumber = `${roomPrefix}-${seededRandom(itemSeed, 100, 999)}`;

        const baseLat = seededRandom(itemSeed, 30, 60);
        const baseLng = seededRandom(itemSeed + 1000, -120, 20);
        const latOffset = randomFloat(-0.1, 0.1);
        const lngOffset = randomFloat(-0.1, 0.1);

        const status = seededRandom(itemSeed, 1, 10) <= 8 
          ? PointOfInterestStatus.ACTIVE 
          : PointOfInterestStatus.INACTIVE;

        const accessibility = {
          wheelchairAccessible: seededRandom(itemSeed, 1, 10) <= 8,
          hearingLoop: seededRandom(itemSeed + 1, 1, 10) <= 5,
          visualAidSupport: seededRandom(itemSeed + 2, 1, 10) <= 6,
        };

        const phoneArea = seededRandom(itemSeed, 200, 999);
        const phoneNum = seededRandom(itemSeed + 1, 1000, 9999);
        const emailDomain = org.email && org.email.includes('@') ? org.email.split('@')[1] : 'example.com';
        const contactEmail = `${template.name.toLowerCase().replace(/\s+/g, '')}@${emailDomain}`;

        const poiName = `${template.name} ${seededRandom(itemSeed, 1, 5)}`;

        const existingPoi = await PointOfInterest.findOne({
          organization: orgId,
          name: { $regex: new RegExp(`^${poiName}$`, "i") },
        });

        if (existingPoi) {
          orgSkippedCount++;
          continue;
        }

        await PointOfInterest.create({
          organization: orgId,
          name: poiName,
          category: template.category,
          categoryType: template.categoryType,
          building: building.name,
          floor: floor ? floor.title : `${building.name} Ground Floor`,
          roomNumber: roomNumber,
          description: template.description,
          tags: template.tags ?? [],
          amenities: template.amenities ?? [],
          contact: {
            phone: `+1-${phoneArea}-555-${phoneNum}`,
            email: contactEmail,
            operatingHours: seededRandom(itemSeed, 1, 2) === 1 ? "24/7" : "8:00 AM - 10:00 PM",
          },
          accessibility: {
            wheelchairAccessible: accessibility.wheelchairAccessible,
            hearingLoop: accessibility.hearingLoop,
            visualAidSupport: accessibility.visualAidSupport,
          },
          status: status,
          mapCoordinates: {
            latitude: baseLat + latOffset,
            longitude: baseLng + lngOffset,
          },
          isActive: status === PointOfInterestStatus.ACTIVE,
          createdAt: new Date(Date.now() - seededRandom(itemSeed, 0, 180) * 24 * 60 * 60 * 1000),
          createdBy,
          updatedBy: createdBy,
        });

        console.log(`   ✅ Created POI: "${poiName}"`);
        orgCreatedCount++;
      }

      totalCreatedCount += orgCreatedCount;
      totalSkippedCount += orgSkippedCount;
      console.log(`   📊 Created: ${orgCreatedCount}, Skipped: ${orgSkippedCount}`);
    }

    console.log("\n📊 Points of Interest Seeding Summary:");
    console.log(`   ✅ Total Created: ${totalCreatedCount}`);
    console.log(`   ⏭️  Total Skipped: ${totalSkippedCount}`);
    console.log(`   🏢 Organizations Processed: ${organizations.length}`);
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

