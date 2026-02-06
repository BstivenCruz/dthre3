import config from "../utils/config";
import { NextFunction, Request, Response } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { apiKey } = config;

  if (req.headers.id !== apiKey) {
    res.status(401).json({ message: "Incorrect api key" });
    return;
  }

  return next();
};

export default auth;
