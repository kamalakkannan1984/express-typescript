import { UsersModel } from "./models/users";

export class Config {
  static env = process.env.NODE_ENV;
  static httpPort = 4200;
  static sessionSecret = "ssecret";
  static sessionStoreHost = "127.0.0.1";
  static mongoURL = `mongodb://localhost:27017/distributors`;
  static apiPrefix = "/api";
  static allowOriginHost = "http://localhost:3000";
}

/**
 * Configuration for default user
 */
export const admin: UsersModel = {
  distributorName: "Distributor1",
  username: "distributor1",
  password: "1234",
  createdDate: new Date(),
  createdBy: "system",
  include: [{ countryCode: ["IN", "US"], cityCode: [], ProvinceCode: [] }],
  exclude: [
    { countryCode: ["IN"], ProvinceCode: ["TN", "KA"], cityCode: ["CENAI"] }
  ]
};
