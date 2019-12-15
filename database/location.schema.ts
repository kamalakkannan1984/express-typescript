import { Schema, model } from "mongoose";
import { LocationDocument } from "../models";

export const LocationSchema: Schema = new Schema({
  countryCode: { type: String, required: true },
  cityName: { type: String, required: true },
  provinceName: { type: String, required: true },
  countryName: { type: String, required: true },
  cityCode: { type: String, required: true },
  provinceCode: { type: String, required: true }
});

export const Locations = model<LocationDocument>("locations", LocationSchema);
