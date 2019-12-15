import { Schema, model } from "mongoose";
import { UsersDocument } from "../models";

export const UsersSchema: Schema = new Schema({
  distributorName: { type: String, required: true },
  include: [{ type: Object, required: false }],
  exclude: [{ type: Object, required: false }],
  createdDate: { type: Date, required: false },
  username: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  createdBy: { type: String, required: false }
});

export const User = model<UsersDocument>("users", UsersSchema);
