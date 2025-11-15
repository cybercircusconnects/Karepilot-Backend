import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import { AdminUser, AdminRole, UserStatus } from "../../models/admin/user-management";
import Department from "../../models/admin/user-management/departments";

const seedUsers = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const departments = await Department.find({ isActive: true });
    const departmentMap = new Map<string, mongoose.Types.ObjectId>();
    departments.forEach((dept) => {
      const normalizedName = dept.name.trim().toLowerCase();
      departmentMap.set(normalizedName, dept._id as mongoose.Types.ObjectId);
    });

    const usersToSeed = [
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@gmail.com",
        password: "Admin@123",
        role: AdminRole.ADMIN,
        status: UserStatus.ACTIVE,
        departmentName: null,
        currentLocation: "Main Office",
      },
      {
        firstName: "Manager",
        lastName: "User",
        email: "manager@gmail.com",
        password: "Admin@123",
        role: AdminRole.MANAGER,
        status: UserStatus.ACTIVE,
        departmentName: "ICU",
        currentLocation: "ICU Level 3",
      },
      {
        firstName: "Technician",
        lastName: "User",
        email: "technician@gmail.com",
        password: "Admin@123",
        role: AdminRole.TECHNICIAN,
        status: UserStatus.ACTIVE,
        departmentName: "Emergency",
        currentLocation: "Emergency Ward",
      },
      {
        firstName: "Staff",
        lastName: "User",
        email: "staff@gmail.com",
        password: "Admin@123",
        role: AdminRole.STAFF,
        status: UserStatus.ACTIVE,
        departmentName: "Pharmacy",
        currentLocation: "Pharmacy Counter",
      },
      {
        firstName: "Security",
        lastName: "User",
        email: "security@gmail.com",
        password: "Admin@123",
        role: AdminRole.SECURITY,
        status: UserStatus.ACTIVE,
        departmentName: "Security",
        currentLocation: "Main Entrance",
      },
      {
        firstName: "Viewer",
        lastName: "User",
        email: "viewer@gmail.com",
        password: "Admin@123",
        role: AdminRole.VIEWER,
        status: UserStatus.ACTIVE,
        departmentName: "Administration",
        currentLocation: "Admin Office",
      },
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of usersToSeed) {
      const existingUser = await AdminUser.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`⏭️  User with email "${userData.email}" already exists, skipping...`);
        skippedCount++;
        continue;
      }

      let departmentId: mongoose.Types.ObjectId | null = null;
      if (userData.departmentName) {
        const normalizedDeptName = userData.departmentName.trim().toLowerCase();
        const deptId = departmentMap.get(normalizedDeptName);
        if (!deptId) {
          console.warn(`⚠️  Department "${userData.departmentName}" not found for user ${userData.email}`);
        } else {
          departmentId = deptId;
        }
      }

      const user = new AdminUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        status: userData.status,
        isActive: true,
        department: departmentId,
        currentLocation: userData.currentLocation,
      });

      await user.save();
      console.log(`✅ User "${userData.firstName} ${userData.lastName}" created successfully!`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Department: ${userData.departmentName || "None (Admin)"}`);
      console.log(`   Location: ${userData.currentLocation}`);
      createdCount++;
    }

    console.log("\n📊 Users Seeding Summary:");
    console.log(`   ✅ Created: ${createdCount} users`);
    console.log(`   ⏭️  Skipped: ${skippedCount} users`);
    console.log(`   📋 Total: ${usersToSeed.length} users`);
  } catch (error: any) {
    console.error("❌ Error seeding users:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log("\n✅ Users seeder completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Users seeder failed:", error.message);
      process.exit(1);
    });
}

export default seedUsers;

