import { LOCATION } from "./location";
import { Config } from "../../config";

let LOCATIONS: any;
LOCATIONS = new LOCATION();

export enum FileError {
  FileNotFound = "File not found",
  InvalidFileType = "Invalid File Type",
  ConnectionTimedOut = "Connection timed out"
}

export const LocationInstance = LOCATIONS;
