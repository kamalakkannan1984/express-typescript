import * as bcrypt from "bcryptjs";
import { UsersModel } from "../models/users";

const BCRYPT_SALT_ROUNDS = 12;
export function CreateHashedPassword(user: UsersModel): Promise<any> {
  if (!user.hasOwnProperty("password")) {
    return Promise.resolve(user);
  }
  return bcrypt
    .hash(user.password, BCRYPT_SALT_ROUNDS)
    .then(function(hashedPassword) {
      user.password = hashedPassword;
      return user;
    })
    .catch(function(error) {
      console.error("Error bcrypt: ", error);
    });
}

export function Authentication(
  user1: UsersModel,
  user2: UsersModel
): Promise<boolean> {
  return bcrypt.compare(user1.password, user2.password).then(canAccess => {
    if (canAccess) {
      return Promise.resolve(canAccess);
    }
    return Promise.reject("Adding new user failed");
  });
}
