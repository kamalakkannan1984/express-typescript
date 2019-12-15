import { Request, Response, NextFunction } from "express";
import { Client } from "../session/redis";
import * as Users from "../queries/users";

/**
 * Check weather session is available or not
 * @param req
 * @param res
 * @param next
 */
export const SessionController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Client.exists(`sess:${req.session.id}`, (err, reply) => {
    if (err) {
      return res
        .status(500)
        .send({ msg: "Unable to complete requested action." });
    }

    if (reply === 0) {
      return res.status(401).send({ msg: "Unauthorized" });
    }

    if (req.body.checkLoggedIn) {
      return res.status(200).send({ username: req.session.user });
    }
    next();
  });
};

/**
 * Check the user session
 */
export function checkSession() {
  return function(req: Request, res: Response, next: NextFunction) {
    if (req.body.checkLoggedIn) {
      return res.status(200).send({ username: req.session.user });
    } else {
      return res.status(403).send({ msg: "Authendication failed" });
    }
  };
}

/**
 * Check the user authendication
 */
export function checkAuthendication() {
  return function(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
      next();
    } else {
      return res.status(403).send({ msg: "Authendication failed" });
    }
  };
}

/**
 * Check the user autherization
 */
export function checkAuthorization() {
  return function(req: Request, res: Response, next: NextFunction) {
    if (req.session.user && findRole(req.session.user, req.params.username)) {
      next();
    } else {
      return res.status(403).send({ msg: "Authorization failed" });
    }
  };
}

/**
 * Find the Role by username
 * @param username
 */
function findRole(sessionUser: any, username: any) {
  const findRole = Users.findOne(username);
  if (sessionUser === findRole.createdBy) {
    return true;
  } else {
    return false;
  }
}
