import createLogger from "../utils/logger";

const reqLogger = (req: any, res: any, next: any) => {
  createLogger.info({
    url: req.originalUrl,
    method: req.method,
    body: req.method === "POST" ? req.body : "",
    params: req.method !== "POST" ? req.params : "",
    query: req.method === "GET" ? req.query : "",
  });
  return next();
};

const resLogger = (req: any, res: any, next: any) => {
  return next();
};

export { reqLogger, resLogger };
