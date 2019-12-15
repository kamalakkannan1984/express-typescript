import { Document } from "mongoose";
import { UsersModel } from "./users";
import { LocationModel } from "./location";

export interface UsersDocument extends UsersModel, Document {}
export interface LocationDocument extends LocationModel, Document {}
