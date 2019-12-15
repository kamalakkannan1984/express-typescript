import { Request, Response } from "express";

/**
 * Logout
 * @param req
 * @param res
 */
export const LogoutController = async (req: Request, res: Response) => {
  try {
    await new Promise((resolve, reject) => {
      req.session.destroy(err => {
        return err ? reject("Unable to complete user logout.") : resolve();
      });
    });
    return res.status(200).send();
  } catch (error) {
    console.error(`USER:${req.session.user}]`, `Logout failed: ${error}`);
    return res.status(500).send({ msg: "Failed to logout." });
  }
};
