"use strict";

import seedPointsOfInterest from "./pointOfInterest.seeder";

const runPointOfInterestSeeders = async () => {
  try {
    console.log("🌱 Starting Points of Interest seeders...\n");

    console.log("📍 Seeding points of interest...");
    await seedPointsOfInterest();

    console.log("\n✅ Points of Interest seeders completed successfully!");
  } catch (error: any) {
    console.error("❌ Error running Points of Interest seeders:", error.message);
    throw error;
  }
};

if (require.main === module) {
  const dbConnect = require("../../config/dbConnect").default;
  dbConnect()
    .then(() => {
      console.log("");
      return runPointOfInterestSeeders();
    })
    .then(() => {
      console.log("\n✅ Points of Interest seeders completed successfully!");
      process.exit(0);
    })
    .catch((error: any) => {
      console.error("\n❌ Points of Interest seeders failed:", error.message);
      process.exit(1);
    });
}

export default runPointOfInterestSeeders;

