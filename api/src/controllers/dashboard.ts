import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";

import sendResponse from "../utils/sendResponse";

import { idSchema } from "../schemas/dashboard";

import * as Dashboard from "../models/dashboard";

const getDashboardDataByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = idSchema.validate(req.params).value;

    const dashboardData = await Dashboard.getDashboardDataByUserId(userId);
    if (!dashboardData) {
      return next(boom.unauthorized("Invalid dashboard data"));
    }

    return sendResponse(req, res, dashboardData);
  } catch (e: any) {
    return next(boom.badImplementation(e));
  }
};
export { getDashboardDataByUserId };
