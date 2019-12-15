import * as mongoose from "mongoose";
import { Config } from "../config";
const options: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

mongoose.connect(Config.mongoURL, options);

export const DBConn = mongoose.connection
  .on("connected", () => {
    console.log("Connected to the App.");
  })
  .on("disconnected", () => console.log("Disconnection from the App."))
  .on("error", error => console.error(`Mongoose connection error: ${error}`))
  .on("error", error => {
    if (
      error.message &&
      error.message.match(/failed to connect to server .* on first connect/)
    ) {
      setTimeout(() => {
        mongoose.connect(Config.mongoURL, options).catch(() => {});
      }, 5 * 1000);
    } else {
      console.error(error);
    }
  })
  .on("close", () => {
    console.log("Shutting down App.");
  });
