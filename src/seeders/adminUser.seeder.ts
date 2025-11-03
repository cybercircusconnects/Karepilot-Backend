import mongoose from "mongoose";
import dbConnect from "../config/dbConnect";
import { AdminUser, AdminRole } from "../models/admin/user-management";

const seedAdminUser = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const existingAdmin = await AdminUser.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      console.log("⏭️  Admin user already exists with email: admin@gmail.com");
      return;
    }

    const adminUser = new AdminUser({
      firstName: "admin",
      lastName: "khan",
      email: "admin@gmail.com",
      password: "Admin@123",
      role: AdminRole.ADMIN,
      isActive: true,
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`   Role: ${adminUser.role}`);
  } catch (error: any) {
    console.error("❌ Error seeding admin user:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedAdminUser()
    .then(() => {
      console.log("\n✅ Seeder completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Seeder failed:", error.message);
      process.exit(1);
    });
}

export default seedAdminUser;

