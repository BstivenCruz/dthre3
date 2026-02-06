import { Request, Response, NextFunction } from "express";

import createLogger from "../utils/logger";

const handlerRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  createLogger.info({
    url: req.originalUrl,
    method: req.method,
    body: req.method === "POST" ? req.body : "",
    params: req.method !== "POST" ? req.params : "",
    query: req.method === "GET" ? req.query : "",
  });

  return next();
};

export default handlerRequest;
