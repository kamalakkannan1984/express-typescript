import { Request, Response, NextFunction } from "express";
import { Client } from "../session/redis";
import * as Users from "../queries/users";

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

export function checkAuthendication() {
  return function(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
      next();
    } else {
      return res.status(403).send();
    }
  };
}

export function checkAuthorization() {
  return function(req: Request, res: Response, next: NextFunction) {
    if (req.session.user && findRole(req.params.username)) {
      next();
    } else {
      return res.status(403).send();
    }
  };
}

async function findRole(username: any) {
  const findRole = await Users.findOne(username);
  if (username === findRole.createdBy) {
    return true;
  } else {
    return false;
  }
}
