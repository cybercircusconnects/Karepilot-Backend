import { Request, Response } from "express";
import { departmentsService } from "../../../services/admin/user-management";

export const getAllDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    if (req.query.page) query.page = parseInt(req.query.page as string);
    if (req.query.limit) query.limit = parseInt(req.query.limit as string);
    if (req.query.search) query.search = req.query.search as string;
    if (req.query.name) query.name = req.query.name as string;
    if (req.query.isActive !== undefined && req.query.isActive !== null) {
      if (typeof req.query.isActive === 'boolean') {
        query.isActive = req.query.isActive;
      } else {
        const strValue = String(req.query.isActive).toLowerCase().trim();
        query.isActive = strValue === 'true' || strValue === '1';
      }
    }

    const result = await departmentsService.getAllDepartments(query);

    res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
      data: {
        departments: result.departments.map((department) => ({
          id: department._id,
          name: department.name,
          description: department.description,
          isActive: department.isActive,
          createdAt: department.createdAt,
          updatedAt: department.updatedAt,
        })),
        pagination: result.pagination,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving departments",
    });
  }
};

export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const department = await departmentsService.getDepartmentById(id as string);

    res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data: {
        department: {
          id: department._id,
          name: department.name,
          description: department.description,
          isActive: department.isActive,
          createdAt: department.createdAt,
          updatedAt: department.updatedAt,
        },
      },
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Department not found",
    });
  }
};

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await departmentsService.createDepartment(req.body);

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: {
        department: {
          id: result._id,
          name: result.name,
          description: result.description,
          isActive: result.isActive,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error creating department",
    });
  }
};

export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const department = await departmentsService.updateDepartment(id as string, updateData);

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: {
        department: {
          id: department._id,
          name: department.name,
          description: department.description,
          isActive: department.isActive,
          createdAt: department.createdAt,
          updatedAt: department.updatedAt,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating department",
    });
  }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await departmentsService.deleteDepartment(id as string);

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error deleting department",
    });
  }
};

