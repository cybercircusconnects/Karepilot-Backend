import seedAssets from "./assets.seeder";

const runAssetTrackingSeeders = async () => {
  try {
    console.log("🌱 Starting Asset Tracking seeders...\n");

    console.log("📦 Seeding assets...");
    await seedAssets();

    console.log("\n✅ All Asset Tracking seeders completed successfully!");
  } catch (error: any) {
    console.error("❌ Error running Asset Tracking seeders:", error.message);
    throw error;
  }
};

if (require.main === module) {
  const dbConnect = require("../../config/dbConnect");
  dbConnect.default().then(() => {
    runAssetTrackingSeeders()
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Seeder failed:", error);
        process.exit(1);
      });
  });
}

export default runAssetTrackingSeeders;

