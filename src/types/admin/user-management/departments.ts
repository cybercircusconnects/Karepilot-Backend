import { IDepartment } from '../../../models/admin/user-management/departments';

export interface CreateDepartmentData {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateDepartmentData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface DepartmentQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface DepartmentsListResult {
  departments: IDepartment[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

