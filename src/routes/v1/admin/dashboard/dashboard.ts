"use strict";

import { Router } from "express";
import { getDashboardData } from "../../../../controllers/admin/dashboard/dashboard";
import { organizationIdParamSchema } from "../../../../validations/admin/dashboard/dashboard";
import { validate } from "../../../../utils";
import { authenticateAdmin } from "../../../../middlewares";

const router = Router();

router.use(authenticateAdmin);

router.get(
  "/:id",
  validate(organizationIdParamSchema, "params"),
  getDashboardData
);

export default router;

