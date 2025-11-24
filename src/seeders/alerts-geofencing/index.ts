import seedAlerts from "./alerts.seeder";
import seedGeofences from "./geofences.seeder";

const runAlertsGeofencingSeeders = async () => {
  try {
    console.log("🚨 Running Alerts & Geofencing seeders...\n");

    console.log("📢 Seeding alerts...");
    await seedAlerts();
    console.log("");

    console.log("📍 Seeding geofences...");
    await seedGeofences();

    console.log("\n✅ Alerts & Geofencing seeders completed successfully!");
  } catch (error: any) {
    console.error("❌ Error running alerts-geofencing seeders:", error.message);
    throw error;
  }
};

if (require.main === module) {
  const dbConnect = require("../../config/dbConnect").default;
  dbConnect()
    .then(() => {
      console.log("");
      return runAlertsGeofencingSeeders();
    })
    .then(() => {
      console.log("\n✅ Alerts & Geofencing seeders completed successfully!");
      process.exit(0);
    })
    .catch((error: any) => {
      console.error("\n❌ Alerts & Geofencing seeders failed:", error.message);
      process.exit(1);
    });
}

export default runAlertsGeofencingSeeders;

