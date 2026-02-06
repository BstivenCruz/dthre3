import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";

import sendResponse from "../utils/sendResponse";

import { idSchema } from "../schemas/packages";

import * as Packages from "../models/packages";

const getPackagesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = idSchema.validate(req.params).value;
    const packages = await Packages.getPackagesByUserId(userId);
    if (!packages) {
      return next(boom.notFound("No se encontraron paquetes"));
    }
    return sendResponse(req, res, packages);
  } catch (e: any) {
    return next(boom.badImplementation(e));
  }
};

export { getPackagesByUserId };
