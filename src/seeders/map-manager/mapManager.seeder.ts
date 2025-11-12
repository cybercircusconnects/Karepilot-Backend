import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import Organization from "../../models/admin/organization/organization";
import MapBuilding from "../../models/admin/map-manager/mapBuilding";
import MapFloor from "../../models/admin/map-manager/mapFloor";
import MapManagerSettings from "../../models/admin/map-manager/mapSettings";
import AdminUser from "../../models/admin/user-management/users";
import { AdminRole } from "../../models/admin/user-management/roles-permissions";
import { MapLayerType } from "../../models/admin/map-manager";

interface FloorSeedData {
  name: string;
  code: string;
  level: number;
  sequence: number;
  description: string;
  isBasement?: boolean;
  isDefault?: boolean;
  tags?: string[];
  attributes?: Record<string, any>;
}

interface BuildingSeedData {
  name: string;
  code: string;
  description: string;
  tags: string[];
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  geoLocation?: {
    latitude?: number;
    longitude?: number;
  };
  metadata?: Record<string, any>;
  floors: FloorSeedData[];
}

interface MapManagerSeedPayload {
  organizationName: string;
  buildings: BuildingSeedData[];
  settings?: Partial<Omit<Parameters<typeof MapManagerSettings.create>[0], "organization">>;
}

const mapManagerSeedData: MapManagerSeedPayload[] = [
  {
    organizationName: "CityCare General Hospital",
    settings: {
      autoPublishUpdates: false,
      highResThumbnails: true,
      enableVersionControl: true,
      defaultGridSize: 25,
      defaultGridUnit: "ft",
      defaultSnapToGrid: true,
      defaultShowGrid: true,
      defaultZoom: 150,
      defaultMapScale: "1:150",
      allowedFileTypes: ["pdf", "png", "jpg", "svg", "dwg"],
      maxUploadSizeMb: 120,
      defaultLayerVisibility: {
        [MapLayerType.FLOOR_PLAN]: true,
        [MapLayerType.POI]: true,
        [MapLayerType.PATH]: true,
        [MapLayerType.ZONE]: true,
        [MapLayerType.LABEL]: true,
        [MapLayerType.ENTRANCE]: true,
        [MapLayerType.ELEVATOR]: true,
        [MapLayerType.RESTRICTED_ZONE]: true,
        [MapLayerType.TAG]: true,
        [MapLayerType.RULER]: false,
        [MapLayerType.MEASUREMENT]: false,
        [MapLayerType.ANNOTATION]: true,
        [MapLayerType.MESSAGE]: true,
        [MapLayerType.MEDIA]: false,
      },
      notificationPreferences: {
        publishSuccess: true,
        publishFailure: true,
        approvalRequired: true,
      },
      retentionPolicy: {
        keepDraftVersions: 15,
        keepPublishedSnapshots: 8,
      },
    },
    buildings: [
      {
        name: "North Tower",
        code: "CC-NORTH",
        description:
          "Primary inpatient facility with surgical suites, specialty clinics, and a rooftop helipad.",
        tags: ["inpatient", "surgery", "critical-care"],
        address: {
          line1: "123 Madison Ave",
          line2: "North Wing",
          city: "New York",
          state: "NY",
          postalCode: "10010",
          country: "USA",
        },
        geoLocation: {
          latitude: 40.744,
          longitude: -73.9876,
        },
        metadata: {
          totalBeds: 420,
          traumaLevel: "Level 1",
          rooftopHelipad: true,
        },
        floors: [
          {
            name: "Ground Floor",
            code: "NT-G0",
            level: 0,
            sequence: 0,
            description: "Main lobby, admissions, radiology imaging, and ambulance bay access.",
            tags: ["lobby", "imaging", "admissions"],
            isDefault: true,
          },
          {
            name: "Surgical Level",
            code: "NT-L2",
            level: 2,
            sequence: 20,
            description: "Operating theaters, recovery suites, and sterile processing center.",
            tags: ["surgery", "recovery"],
          },
          {
            name: "Intensive Care",
            code: "NT-L5",
            level: 5,
            sequence: 50,
            description: "Critical care units and specialized cardiac monitoring pods.",
            tags: ["ICU", "cardiac"],
          },
        ],
      },
      {
        name: "Emergency Pavilion",
        code: "CC-ER",
        description:
          "24/7 emergency and trauma pavilion with rapid triage and diagnostic capabilities.",
        tags: ["emergency", "trauma", "diagnostics"],
        address: {
          line1: "125 Madison Ave",
          city: "New York",
          state: "NY",
          postalCode: "10010",
          country: "USA",
        },
        geoLocation: {
          latitude: 40.7444,
          longitude: -73.9883,
        },
        metadata: {
          traumaBays: 12,
          isolationRooms: 6,
          pediatricWing: true,
        },
        floors: [
          {
            name: "Emergency Intake",
            code: "EP-L1",
            level: 1,
            sequence: 10,
            description: "Rapid triage, trauma bays, and advanced diagnostics.",
            tags: ["triage", "diagnostics"],
            isDefault: true,
          },
          {
            name: "Observation & Step-Down",
            code: "EP-L2",
            level: 2,
            sequence: 20,
            description: "Step-down unit with telemetry and observation suites.",
            tags: ["observation"],
          },
          {
            name: "Critical Isolation",
            code: "EP-LB1",
            level: -1,
            sequence: -10,
            description: "Negative-pressure isolation units and decontamination vestibules.",
            tags: ["isolation", "negative-pressure"],
            isBasement: true,
          },
        ],
      },
    ],
  },
  {
    organizationName: "SkyWays International Airport",
    settings: {
      autoPublishUpdates: true,
      highResThumbnails: true,
      enableVersionControl: true,
      defaultGridSize: 10,
      defaultGridUnit: "m",
      defaultSnapToGrid: false,
      defaultShowGrid: false,
      defaultZoom: 120,
      defaultMapScale: "1:250",
      allowedFileTypes: ["pdf", "svg", "png"],
      maxUploadSizeMb: 80,
      defaultLayerVisibility: {
        [MapLayerType.FLOOR_PLAN]: true,
        [MapLayerType.POI]: true,
        [MapLayerType.PATH]: true,
        [MapLayerType.ZONE]: true,
        [MapLayerType.LABEL]: true,
        [MapLayerType.ENTRANCE]: true,
        [MapLayerType.ELEVATOR]: true,
        [MapLayerType.RESTRICTED_ZONE]: true,
        [MapLayerType.TAG]: true,
        [MapLayerType.RULER]: true,
        [MapLayerType.MEASUREMENT]: true,
        [MapLayerType.ANNOTATION]: true,
        [MapLayerType.MESSAGE]: false,
        [MapLayerType.MEDIA]: true,
      },
      notificationPreferences: {
        publishSuccess: true,
        publishFailure: true,
        approvalRequired: false,
      },
      retentionPolicy: {
        keepDraftVersions: 10,
        keepPublishedSnapshots: 6,
      },
    },
    buildings: [
      {
        name: "Terminal 1",
        code: "SKY-T1",
        description:
          "International departures terminal with long-haul gates, lounges, and customs.",
        tags: ["terminal", "departures", "international"],
        address: {
          line1: "1 Aviation Ave",
          city: "London",
          state: "London",
          postalCode: "TW6 1RU",
          country: "United Kingdom",
        },
        geoLocation: {
          latitude: 51.4706,
          longitude: -0.461941,
        },
        metadata: {
          gates: 24,
          premiumLounges: 5,
          hourlyPassengerCapacity: 8600,
        },
        floors: [
          {
            name: "Arrivals Hall",
            code: "T1-ARR",
            level: 0,
            sequence: 0,
            description: "Immigration, baggage claim, ground transport hub.",
            tags: ["arrivals", "baggage"],
            isDefault: true,
          },
          {
            name: "Departures Concourse",
            code: "T1-DEP",
            level: 1,
            sequence: 10,
            description: "Security screening, duty free retail, premium lounges.",
            tags: ["departures", "retail"],
          },
          {
            name: "Gate Level",
            code: "T1-GATE",
            level: 2,
            sequence: 20,
            description: "Jet bridges, boarding gates, aircraft access monitoring.",
            tags: ["gates"],
          },
        ],
      },
      {
        name: "Cargo & Logistics Center",
        code: "SKY-CARGO",
        description:
          "Dedicated cargo operations hub with cold chain storage and customs inspection.",
        tags: ["cargo", "logistics", "operations"],
        address: {
          line1: "18 Freight Road",
          city: "London",
          state: "London",
          postalCode: "TW6 3XA",
          country: "United Kingdom",
        },
        geoLocation: {
          latitude: 51.473,
          longitude: -0.4502,
        },
        metadata: {
          bondedWarehouses: 3,
          coldChainCapacityCubicMeters: 12000,
          customsInspectionLanes: 8,
        },
        floors: [
          {
            name: "Operations Floor",
            code: "CG-L1",
            level: 1,
            sequence: 10,
            description: "Cargo handling, sorting belts, customs processing.",
            tags: ["operations"],
            isDefault: true,
          },
          {
            name: "Cold Storage Level",
            code: "CG-LB1",
            level: -1,
            sequence: -10,
            description: "Temperature-controlled storage for pharmaceuticals and perishables.",
            tags: ["cold-chain", "storage"],
            isBasement: true,
          },
        ],
      },
    ],
  },
  {
    organizationName: "Harborfront Shopping Plaza",
    settings: {
      autoPublishUpdates: true,
      highResThumbnails: false,
      enableVersionControl: false,
      defaultGridSize: 15,
      defaultGridUnit: "m",
      defaultSnapToGrid: true,
      defaultShowGrid: true,
      defaultZoom: 135,
      defaultMapScale: "1:120",
      allowedFileTypes: ["pdf", "png", "jpg"],
      maxUploadSizeMb: 60,
      defaultLayerVisibility: {
        [MapLayerType.FLOOR_PLAN]: true,
        [MapLayerType.POI]: true,
        [MapLayerType.PATH]: true,
        [MapLayerType.ZONE]: true,
        [MapLayerType.LABEL]: true,
        [MapLayerType.ENTRANCE]: true,
        [MapLayerType.ELEVATOR]: true,
        [MapLayerType.RESTRICTED_ZONE]: false,
        [MapLayerType.TAG]: true,
        [MapLayerType.RULER]: false,
        [MapLayerType.MEASUREMENT]: false,
        [MapLayerType.ANNOTATION]: true,
        [MapLayerType.MESSAGE]: false,
        [MapLayerType.MEDIA]: true,
      },
      notificationPreferences: {
        publishSuccess: true,
        publishFailure: false,
        approvalRequired: false,
      },
      retentionPolicy: {
        keepDraftVersions: 5,
        keepPublishedSnapshots: 3,
      },
    },
    buildings: [
      {
        name: "Retail Pavilion",
        code: "HF-RET",
        description: "Flagship retail building with anchor stores and experiential zones.",
        tags: ["retail", "experiential"],
        address: {
          line1: "450 Market St",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "USA",
        },
        geoLocation: {
          latitude: 37.7936,
          longitude: -122.3957,
        },
        metadata: {
          anchorStores: 4,
          totalRetailUnits: 180,
          atriumHeightMeters: 22,
        },
        floors: [
          {
            name: "Atrium Level",
            code: "RP-L1",
            level: 1,
            sequence: 10,
            description: "High-street retail, flagship stores, interactive media walls.",
            tags: ["retail", "experiential"],
            isDefault: true,
          },
          {
            name: "Lifestyle Terrace",
            code: "RP-L2",
            level: 2,
            sequence: 20,
            description: "Boutique stores, cafes, green rooftop access.",
            tags: ["lifestyle", "food"],
          },
          {
            name: "Tech Commons",
            code: "RP-L3",
            level: 3,
            sequence: 30,
            description: "Technology pop-ups, AR experiences, co-working pods.",
            tags: ["tech"],
          },
        ],
      },
      {
        name: "Harbor Conference Center",
        code: "HF-CONF",
        description: "Conference halls, event venues, and cinema multiplex.",
        tags: ["conference", "events", "cinema"],
        address: {
          line1: "460 Market St",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "USA",
        },
        geoLocation: {
          latitude: 37.7941,
          longitude: -122.395,
        },
        metadata: {
          cinemas: 8,
          ballroomCapacity: 1200,
          rooftopGarden: true,
        },
        floors: [
          {
            name: "Event Concourse",
            code: "HC-L1",
            level: 1,
            sequence: 10,
            description: "Main ballroom, breakout rooms, registration lobby.",
            tags: ["events", "ballroom"],
            isDefault: true,
          },
          {
            name: "Cinema Level",
            code: "HC-L2",
            level: 2,
            sequence: 20,
            description: "Dolby cinemas, VIP lounges, concession areas.",
            tags: ["cinema", "VIP"],
          },
          {
            name: "Service & Screening",
            code: "HC-B1",
            level: -1,
            sequence: -10,
            description: "Projection rooms, catering support, logistics dock.",
            tags: ["service"],
            isBasement: true,
          },
        ],
      },
    ],
  },
];

const seedMapManagerData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const adminUser = await AdminUser.findOne({ role: AdminRole.ADMIN }).select("_id");
    const createdBy =
      adminUser && adminUser._id instanceof mongoose.Types.ObjectId ? adminUser._id : null;

    let buildingsCreated = 0;
    let buildingsUpdated = 0;
    let floorsCreated = 0;
    let floorsUpdated = 0;
    let settingsUpserted = 0;
    let skippedOrganizations = 0;

    for (const payload of mapManagerSeedData) {
      const organization = await Organization.findOne({
        name: { $regex: new RegExp(`^${payload.organizationName}$`, "i") },
      }).select("_id name");

      if (!organization?._id) {
        console.warn(
          `⚠️  Organization "${payload.organizationName}" not found. Skipping map manager seed for this entry.`,
        );
        skippedOrganizations++;
        continue;
      }

      const organizationId = new mongoose.Types.ObjectId(String(organization._id));

      for (const buildingData of payload.buildings) {
        let building = await MapBuilding.findOne({
          organization: organizationId,
          name: { $regex: new RegExp(`^${buildingData.name}$`, "i") },
        });

        if (!building) {
          building = await MapBuilding.create({
            organization: organizationId,
            name: buildingData.name,
            code: buildingData.code,
            description: buildingData.description,
            tags: buildingData.tags,
            address: buildingData.address,
            geoLocation: buildingData.geoLocation,
            metadata: buildingData.metadata,
            isActive: true,
            createdBy,
            updatedBy: createdBy,
          });
          console.log(`🏗️  Created building "${buildingData.name}" for ${payload.organizationName}`);
          buildingsCreated++;
        } else {
          building.description = buildingData.description;
          building.tags = buildingData.tags;
          building.address = buildingData.address ?? {};
          building.geoLocation = buildingData.geoLocation ?? {};
          building.metadata = buildingData.metadata ?? {};
          building.isActive = true;
          building.updatedBy = createdBy ?? building.updatedBy ?? null;
          await building.save();
          buildingsUpdated++;
        }

        const floorsData = buildingData.floors ?? [];
        let defaultFloorId: mongoose.Types.ObjectId | null =
          building.defaultFloor instanceof mongoose.Types.ObjectId
            ? building.defaultFloor
            : null;

        for (const floorData of floorsData) {
          let floor = await MapFloor.findOne({
            organization: organizationId,
            building: building._id,
            name: { $regex: new RegExp(`^${floorData.name}$`, "i") },
          });

          if (!floor) {
            floor = await MapFloor.create({
              organization: organizationId,
              building: building._id,
              name: floorData.name,
              code: floorData.code,
              level: floorData.level,
              sequence: floorData.sequence,
              description: floorData.description,
              isBasement: floorData.isBasement ?? false,
              isDefault: floorData.isDefault ?? false,
              tags: floorData.tags ?? [],
              attributes: floorData.attributes,
              isActive: true,
              createdBy,
              updatedBy: createdBy,
            });
            floorsCreated++;
          } else {
            floor.code = floorData.code;
            floor.level = floorData.level;
            floor.sequence = floorData.sequence;
            floor.description = floorData.description;
            floor.isBasement = floorData.isBasement ?? false;
            floor.isDefault = floorData.isDefault ?? false;
            floor.tags = floorData.tags ?? [];
            floor.attributes = floorData.attributes ?? {};
            floor.isActive = true;
            floor.updatedBy = createdBy ?? floor.updatedBy ?? null;
            await floor.save();
            floorsUpdated++;
          }

          if (floorData.isDefault) {
            defaultFloorId = new mongoose.Types.ObjectId(String(floor._id));
          }
        }

        const activeFloorCount = await MapFloor.countDocuments({
          organization: organizationId,
          building: building._id,
          isActive: true,
        });

        if (defaultFloorId) {
          await MapFloor.updateMany(
            {
              organization: organizationId,
              building: building._id,
              _id: { $ne: defaultFloorId },
            },
            { $set: { isDefault: false } },
          );
        }

        building.floorCount = activeFloorCount;
        building.defaultFloor = defaultFloorId;
        building.updatedBy = createdBy ?? building.updatedBy ?? null;
        await building.save();
      }

      if (payload.settings) {
        await MapManagerSettings.findOneAndUpdate(
          { organization: organizationId },
          {
            $set: {
              ...payload.settings,
              organization: organizationId,
              updatedBy: createdBy ?? undefined,
            },
            $setOnInsert: {
              createdBy: createdBy ?? undefined,
            },
          },
          { upsert: true, new: true },
        );
        settingsUpserted++;
      }
    }

    console.log("\n📊 Map Manager Seeding Summary:");
    console.log(`   ✅ Buildings created: ${buildingsCreated}`);
    console.log(`   🔄 Buildings updated: ${buildingsUpdated}`);
    console.log(`   ✅ Floors created: ${floorsCreated}`);
    console.log(`   🔄 Floors updated: ${floorsUpdated}`);
    console.log(`   ⚙️  Settings upserted: ${settingsUpserted}`);
    console.log(`   ⚠️  Organizations skipped: ${skippedOrganizations}`);
  } catch (error: any) {
    console.error("❌ Error seeding map manager data:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedMapManagerData()
    .then(() => {
      console.log("\n✅ Map Manager seeder completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Map Manager seeder failed:", error.message);
      process.exit(1);
    });
}

export default seedMapManagerData;


