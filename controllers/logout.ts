import { Request, Response } from "express";

export const LogoutController = (req: Request, res: Response) => {
  return new Promise((resolve, reject) => {
    req.session.destroy(err => {
      return err ? reject("Unable to complete user logout.") : resolve();
    });
  })
    .then(() => {
      return res.status(200).send();
    })
    .catch(error => {
      console.error(`USER:${req.session.user}]`, `Logout failed: ${error}`);
      return res.status(500).send({ msg: "Failed to logout." });
    });
};
