import { Request, Response, NextFunction } from "express";
import { Config } from "./config";

export const Settings = (req: Request, res: Response, next: NextFunction) => {
  const allowOrigin = {
    key: "Access-Control-Allow-Origin",
    value: Config.allowOriginHost
  };
  const allowHeaders = {
    key: "Access-Control-Allow-Headers",
    value: "Content-Type"
  };
  const allowCredentials = {
    key: "Access-Control-Allow-Credentials",
    value: "true"
  };
  const allowMethods = {
    key: "Access-Control-Allow-Methods",
    value: "GET, PUT, POST, DELETE, OPTIONS"
  };

  res.setHeader(allowOrigin.key, allowOrigin.value);
  res.setHeader(allowHeaders.key, allowHeaders.value);
  res.setHeader(allowCredentials.key, allowCredentials.value);
  res.setHeader(allowMethods.key, allowMethods.value);

  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
