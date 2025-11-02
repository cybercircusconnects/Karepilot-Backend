import Department from "../../../models/admin/user-management/departments";
import { CreateDepartmentData, UpdateDepartmentData, DepartmentQuery } from "../../../types/admin/user-management/departments";

export class DepartmentsService {
  async getAllDepartments(query: DepartmentQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const dbQuery: any = { isActive: true };

    if (query.search) {
      dbQuery.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { description: { $regex: query.search, $options: "i" } },
      ];
    }

    if (query.isActive !== undefined) {
      dbQuery.isActive = query.isActive;
    }

    const skip = (page - 1) * limit;

    const departments = await Department.find(dbQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Department.countDocuments(dbQuery);

    return {
      departments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    };
  }

  async getDepartmentById(id: string) {
    const department = await Department.findById(id);
    if (!department || !department.isActive) {
      throw new Error("Department not found");
    }
    return department;
  }

  async createDepartment(data: CreateDepartmentData) {
    const existingDepartment = await Department.findOne({
      name: { $regex: new RegExp(`^${data.name}$`, "i") },
    });
    if (existingDepartment) {
      throw new Error("Department with this name already exists");
    }

    const department = new Department({
      name: data.name,
      description: data.description,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    await department.save();

    return department;
  }

  async updateDepartment(id: string, data: UpdateDepartmentData) {
    const department = await Department.findById(id);
    if (!department) {
      throw new Error("Department not found");
    }

    if (data.name && data.name.toLowerCase() !== department.name.toLowerCase()) {
      const existingDepartment = await Department.findOne({
        name: { $regex: new RegExp(`^${data.name}$`, "i") },
        _id: { $ne: id },
      });
      if (existingDepartment) {
        throw new Error("Department with this name already exists");
      }
    }

    const updatedDepartment = await Department.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updatedDepartment!;
  }

  async deleteDepartment(id: string) {
    const department = await Department.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!department) {
      throw new Error("Department not found");
    }

    return department;
  }
}

export default new DepartmentsService();

