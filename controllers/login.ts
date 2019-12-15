import { Request, Response, NextFunction } from "express";
import { Authentication } from "../lib/bcrypt";
import { UsersModel } from "../models/users";
import * as user from "../queries/users";
import * as Users from "./users";

/**
 * User login
 * @param req
 * @param res
 * @param next
 */
export const LoginController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const onlineUser: UsersModel = req.body;
  user
    .findOne(onlineUser.username)
    .then((userFromDB: any) => Authentication(onlineUser, userFromDB))
    .then(() => saveSession(req))
    .then(() => Users.getArroved(onlineUser.username))
    .then((location: any) => {
      req.session.user = onlineUser.username;
      req.session.include = location.include;
      req.session.exclude = location.exclude;
      return res.status(200).send({
        username: req.session.user,
        include: req.session.include,
        exclude: req.session.exclude
      });
    })
    .catch((error: any) => {
      return res.status(401).send({ msg: "Wrong username or password" });
    });
};

/**
 * Save the session
 * @param req
 */
function saveSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.save(err => {
      return err ? reject("Unable to complete user login.") : resolve();
    });
  });
}
