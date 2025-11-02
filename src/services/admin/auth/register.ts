import { AdminUser, AdminRole } from "../../../models/admin/user-management";
import { generateToken } from "../../../utils/index";
import { CreateAdminUserData } from "../../../types/admin/auth/register";

export class RegisterService {
  async createAdminUser(data: CreateAdminUserData) {
    const existingAdmin = await AdminUser.findOne({ email: data.email.toLowerCase() });
    if (existingAdmin) {
      throw new Error("Admin user with this email already exists");
    }

    let fullName: string;
    if (data.firstName && data.lastName) {
      fullName = `${data.firstName} ${data.lastName}`.trim();
    } else if (data.firstName) {
      fullName = data.firstName;
    } else if (data.name) {
      fullName = data.name;
    } else {
      throw new Error("Either 'name' or 'firstName' and 'lastName' must be provided");
    }

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.slice(1).join(' ') || fullName;

    const adminUser = new AdminUser({
      firstName,
      lastName,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role || AdminRole.VIEWER,
      department: data.department,
      phoneNumber: data.phoneNumber,
      badgeNumber: data.badgeNumber,
      shift: data.shift,
    });

    await adminUser.save();

    const token = generateToken((adminUser._id as any).toString());

    return {
      user: adminUser,
      token,
    };
  }
}

export default new RegisterService();

