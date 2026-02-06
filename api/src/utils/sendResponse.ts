import { Request, Response } from "express";

import createLogger from "./logger";

const sendResponse = (
  req: Request,
  res: Response,
  json: any,
  statusCode = 200,
  error = null
) => {
  createLogger.info({
    url: req.originalUrl,
    method: req.method,
    body: req.method === "POST" ? req.body : "",
    params: req.method !== "POST" ? req.params : "",
    query: req.method === "GET" ? req.query : "",
  });

  res.status(statusCode).json({
    success: error ? false : true,
    data: json,
    error,
  });
};

export default sendResponse;
