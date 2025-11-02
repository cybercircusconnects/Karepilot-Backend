import { Router } from "express";
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../../controllers/admin/user-management";
import { authenticateAdmin } from "../../../../middlewares/auth";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentQuerySchema,
  departmentIdParamSchema,
} from "../../../../validations/admin/user-management";
import { validate } from "../../../../utils";

const departmentsRouter = Router();

departmentsRouter.use(authenticateAdmin);

departmentsRouter.get(
  "/",
  validate(departmentQuerySchema, "query"),
  getAllDepartments
);

departmentsRouter.get(
  "/:id",
  validate(departmentIdParamSchema, "params"),
  getDepartmentById
);

departmentsRouter.post(
  "/",
  validate(createDepartmentSchema),
  createDepartment
);

departmentsRouter.put(
  "/:id",
  validate(departmentIdParamSchema, "params"),
  validate(updateDepartmentSchema),
  updateDepartment
);

departmentsRouter.delete(
  "/:id",
  validate(departmentIdParamSchema, "params"),
  deleteDepartment
);

export default departmentsRouter;

