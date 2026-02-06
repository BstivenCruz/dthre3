import { Request, Response, NextFunction } from "express";
import boom from "@hapi/boom";

import sendResponse from "../utils/sendResponse";
import { upsertSchema } from "../schemas/classes";

import * as Classes from "../models/classes";


const getAllClasses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const classes = await Classes.getAllClasses();
        if (!classes) {
            return next(boom.notFound("No se encontraron clases"));
        }

        return sendResponse(req, res, classes);
    } catch (e: any) {
        return next(boom.badImplementation(e));
    }
};


const upsert = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = JSON.stringify(upsertSchema.validate(req.body).value);
        const classes = await Classes.upsert(data);
        if (!classes) {
            return next(boom.notFound("No se encontraron clases"));
        }

        return sendResponse(req, res, classes);
    } catch (e: any) {
        return next(boom.badImplementation(e));
    }
};

export { getAllClasses, upsert };