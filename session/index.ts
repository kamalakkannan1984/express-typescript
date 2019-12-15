import * as session from "express-session";
import * as connectRedis from "connect-redis";

import { Client } from "./redis";
import { Config } from "./../config";

const RedisStore = connectRedis(session);

export const Session = session({
  name: "myStore.id",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  secret: Config.sessionSecret,
  cookie: {
    maxAge: 30 * 60 * 1000 + 10000 // 30 minites for idle + 10 seconds for timeout
  },
  store: new RedisStore({ client: Client })
});
