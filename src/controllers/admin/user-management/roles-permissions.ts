import { Request, Response } from "express";
import { rolesPermissionsService } from "../../../services/admin/user-management";

export const getAllRolesPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    
    if (req.query.search) query.search = req.query.search as string;
    if (req.query.role) query.role = req.query.role as string;
    if (req.query.isActive !== undefined && req.query.isActive !== null) {
      if (typeof req.query.isActive === 'boolean') {
        query.isActive = req.query.isActive;
      } else {
        const strValue = String(req.query.isActive).toLowerCase().trim();
        query.isActive = strValue === 'true' || strValue === '1';
      }
    }

    const result = await rolesPermissionsService.getAllRolesPermissions(query);

    res.status(200).json({
      success: true,
      message: "Roles and permissions retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving roles and permissions",
    });
  }
};

export const getRolePermissionsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rolePermissions = await rolesPermissionsService.getRolePermissionsById(id as string);

    res.status(200).json({
      success: true,
      message: "Role permissions retrieved successfully",
      data: {
        rolePermissions: {
          id: rolePermissions._id,
          role: rolePermissions.role,
          permissions: rolePermissions.permissions,
          isActive: rolePermissions.isActive,
          createdAt: rolePermissions.createdAt,
          updatedAt: rolePermissions.updatedAt,
        },
      },
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Role permissions not found",
    });
  }
};

export const createRolePermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await rolesPermissionsService.createRolePermissions(req.body);

    res.status(201).json({
      success: true,
      message: "Role permissions created successfully",
      data: {
        rolePermissions: {
          id: result._id,
          role: result.role,
          permissions: result.permissions,
          isActive: result.isActive,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error creating role permissions",
    });
  }
};

export const updateRolePermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const rolePermissions = await rolesPermissionsService.updateRolePermissions(id as string, updateData);

    res.status(200).json({
      success: true,
      message: "Role permissions updated successfully",
      data: {
        rolePermissions: {
          id: rolePermissions._id,
          role: rolePermissions.role,
          permissions: rolePermissions.permissions,
          isActive: rolePermissions.isActive,
          createdAt: rolePermissions.createdAt,
          updatedAt: rolePermissions.updatedAt,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating role permissions",
    });
  }
};

export const deleteRolePermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await rolesPermissionsService.deleteRolePermissions(id as string);

    res.status(200).json({
      success: true,
      message: "Role permissions deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error deleting role permissions",
    });
  }
};

