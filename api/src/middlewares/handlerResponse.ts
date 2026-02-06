import { Request, Response, NextFunction } from "express";

import createLogger from "../utils/logger";

const handlerResponse = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  createLogger.error({
    url: req.originalUrl,
    method: req.method,
    body: req.method === "POST" ? req.body : "",
    params: req.method !== "POST" ? req.params : "",
    query: req.method === "GET" ? req.query : "",
    error: "Not found",
  });

  res.json({
    success: false,
    data: null,
    error: {
      status: 404,
      message: "not found",
    },
  });

  return next();
};

export default handlerResponse;
