import { Request, Response, NextFunction } from "express";
import boom, { Boom } from "@hapi/boom";

import createLogger from "../utils/logger";

const handlerError = (
  err: Boom,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    const wrapperError = err.isBoom ? err : boom.badImplementation(err);
    createLogger.error({
      url: req.originalUrl,
      method: req.method,
      body: req.method === "POST" ? req.body : "",
      params: req.method !== "POST" ? req.params : "",
      query: req.method === "GET" ? req.query : "",
      error: err.message,
    });

    return res.status(wrapperError.output.statusCode).json({
      success: false,
      data: null,
      error: wrapperError.output.payload.message,
    });
  }

  next();
};

export default handlerError;
