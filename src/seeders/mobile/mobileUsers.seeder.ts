import mongoose from "mongoose";
import dbConnect from "../../config/dbConnect";
import MobileUser from "../../models/mobile/mobileUser";
import { MobileUserStatus } from "../../types/mobile/mobileUser";
import Organization from "../../models/admin/organization/organization";

const seededRandom = (seed: number, min: number, max: number): number => {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
};

const firstNames = [
  "John", "Jane", "Michael", "Sarah", "David", "Emily", "James", "Jessica",
  "Robert", "Ashley", "William", "Amanda", "Richard", "Melissa", "Joseph", "Deborah",
  "Thomas", "Michelle", "Charles", "Carol", "Christopher", "Lisa", "Daniel", "Nancy",
  "Matthew", "Karen", "Anthony", "Betty", "Mark", "Helen", "Donald", "Sandra",
  "Steven", "Donna", "Paul", "Carolyn", "Andrew", "Ruth", "Joshua", "Sharon",
  "Kenneth", "Michelle", "Kevin", "Laura", "Brian", "Emily", "George", "Kimberly",
  "Edward", "Deborah", "Ronald", "Angela", "Timothy", "Brenda", "Jason", "Emma",
  "Jeffrey", "Olivia", "Ryan", "Cynthia", "Jacob", "Marie", "Gary", "Janet",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor",
  "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Clark",
  "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott",
  "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker",
  "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips",
  "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
  "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz",
];

const seedMobileUsers = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await dbConnect();
    }

    const organizations = await Organization.find({ isActive: true }).select("_id name");
    
    if (organizations.length === 0) {
      console.warn("⚠️  No organizations found. Please run the organization seeder first.");
      return;
    }

    const existingUsersCount = await MobileUser.countDocuments();
    if (existingUsersCount > 0) {
      console.log(`⏭️  ${existingUsersCount} mobile users already exist. Skipping seeder.`);
      return;
    }

    let totalCreatedCount = 0;

    console.log(`📋 Creating mobile users for ${organizations.length} organization(s)`);

    for (const org of organizations) {
      const orgId = org._id as mongoose.Types.ObjectId;
      const orgSeed = parseInt(orgId.toString().slice(-8), 16);
    }

    const totalUsers = 50;
    const usersToCreate: Array<{
      fullName: string;
      email: string;
      password: string;
      status: MobileUserStatus;
      isEmailVerified: boolean;
      lastLogin: Date | null;
      createdAt: Date;
    }> = [];

    for (let i = 0; i < totalUsers; i++) {
      const seed = i * 1000;
      const firstName = firstNames[seededRandom(seed, 0, firstNames.length - 1)];
      const lastName = lastNames[seededRandom(seed + 1, 0, lastNames.length - 1)];
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName?.toLowerCase()}.${lastName?.toLowerCase()}${i}@example.com`;

      const statusSeed = seededRandom(seed + 2, 1, 10);
      let status: MobileUserStatus;
      if (statusSeed <= 7) {
        status = MobileUserStatus.ACTIVE;
      } else if (statusSeed <= 9) {
        status = MobileUserStatus.PENDING;
      } else {
        status = MobileUserStatus.INACTIVE;
      }

      const isEmailVerified = status === MobileUserStatus.ACTIVE;

      let lastLogin: Date | null = null;
      if (status === MobileUserStatus.ACTIVE) {
        const loginDaysAgo = seededRandom(seed + 3, 0, 90);
        if (loginDaysAgo < 30) {
          const hoursAgo = seededRandom(seed + 4, 0, loginDaysAgo * 24);
          lastLogin = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
        } else if (loginDaysAgo < 60) {
          lastLogin = new Date(Date.now() - loginDaysAgo * 24 * 60 * 60 * 1000);
        } else {
          lastLogin = new Date(Date.now() - loginDaysAgo * 24 * 60 * 60 * 1000);
        }
      }

      const createdDaysAgo = seededRandom(seed + 5, 0, 180);
      const createdAt = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000);

      usersToCreate.push({
        fullName,
        email,
        password: "MobileUser@123", 
        status,
        isEmailVerified,
        lastLogin,
        createdAt,
      });
    }

    for (const userData of usersToCreate) {
      try {
        const mobileUser = new MobileUser({
          fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        status: userData.status,
        isEmailVerified: userData.isEmailVerified,
        lastLogin: userData.lastLogin,
        createdAt: userData.createdAt,
      });

        await mobileUser.save();
        totalCreatedCount++;
      } catch (error: any) {
        if (error.code === 11000) {
          continue;
        }
        throw error;
      }
    }

    console.log(`\n✅ Created ${totalCreatedCount} mobile users`);
    console.log(`   📊 Users with recent logins: ${usersToCreate.filter(u => u.lastLogin && u.lastLogin > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}`);
    console.log(`   📊 Active users: ${usersToCreate.filter(u => u.status === MobileUserStatus.ACTIVE).length}`);
    console.log(`   📊 Verified users: ${usersToCreate.filter(u => u.isEmailVerified).length}`);
  } catch (error: any) {
    console.error("❌ Error seeding mobile users:", error.message);
    throw error;
  }
};

if (require.main === module) {
  seedMobileUsers()
    .then(() => {
      console.log("\n✅ Mobile users seeder completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Mobile users seeder failed:", error.message);
      process.exit(1);
    });
}

export default seedMobileUsers;

