import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";

import sendResponse from "../utils/sendResponse";

import { idSchema } from "../schemas/record";

import * as Record from "../models/record";



const getRecordDataByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = idSchema.validate(req.params).value;
      const recordData = await Record.getRecordDataByUserId(userId);
      if (!recordData) {
        return next(boom.notFound("No se encontraron datos del record"));
      }
      return sendResponse(req, res, recordData);
    } catch (e: any) {
      return next(boom.badImplementation(e));
    }
  };
  
  export { getRecordDataByUserId };
  