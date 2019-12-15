import * as redis from "redis";
import { Config } from "./../config";

const retryStrategy = (opts: redis.RetryStrategyOptions): number => {
  if (opts.attempt === 1) {
    console.log("ERROR: Unable to connect to session store.");
  }
  return 500;
};

const options: redis.ClientOpts = {
  host: `${Config.sessionStoreHost}`,
  retry_strategy: retryStrategy
};

export const Client = new redis.RedisClient(options).on("connect", () => {
  console.log("Connected to session store.");
});
