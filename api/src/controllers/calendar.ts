import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";

import sendResponse from "../utils/sendResponse";

import { idSchema } from "../schemas/calendar";

import * as Calendar from "../models/calendar";

const getCalendarClasses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = idSchema.validate(req.params).value;
    const calendarClasses = await Calendar.getCalendarClassesByUserId(userId);
    if (!calendarClasses) {
      return next(boom.notFound("No se encontraron clases"));
    }
    return sendResponse(req, res, calendarClasses);
  } catch (e: any) {
    return next(boom.badImplementation(e));
  }
};

export { getCalendarClasses };
