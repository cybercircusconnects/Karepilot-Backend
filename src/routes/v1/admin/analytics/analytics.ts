"use strict";

import { Router } from "express";
import {
  getAnalyticsOverview,
  getUserEngagement,
  getPerformance,
  getVenueAnalytics,
} from "../../../../controllers/admin/analytics";
import { authenticateAdmin } from "../../../../middlewares/auth";
import { analyticsQuerySchema, organizationIdParamSchema } from "../../../../validations/admin/analytics";
import { validate } from "../../../../utils";

const analyticsRouter = Router();

analyticsRouter.use(authenticateAdmin);

analyticsRouter.get("/overview", validate(analyticsQuerySchema, "query"), getAnalyticsOverview);

analyticsRouter.get("/user-engagement", validate(analyticsQuerySchema, "query"), getUserEngagement);

analyticsRouter.get("/performance", validate(analyticsQuerySchema, "query"), getPerformance);

analyticsRouter.get(
  "/venue/:id",
  validate(organizationIdParamSchema, "params"),
  validate(analyticsQuerySchema, "query"),
  getVenueAnalytics
);

export default analyticsRouter;

