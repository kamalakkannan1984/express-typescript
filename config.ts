export class Config {
  static env = process.env.NODE_ENV;
  static httpPort = 4200;
  static sessionSecret = "ssecret";
  static sessionStoreHost = "127.0.0.1"; // process.env.SURVEY_SESSION_STORE_HOST;
  // static mongoURL = `mongodb://${
  //   process.env.NODE_ENV ? "mongo" : "localhost"
  // }:27017/survey`;
  static mongoURL = `mongodb://localhost:27017/distributors`;
  static apiPrefix = "/api";
  static allowOriginHost = "http://localhost:3000";
}
