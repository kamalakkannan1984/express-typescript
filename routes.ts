import { Router } from "express";
import * as SessionController from "./controllers/session";
import { LoginController } from "./controllers/login";
import { LogoutController } from "./controllers/logout";

import * as Users from "./controllers/users";

const LOGIN = "/login";
const IS_LOGGED_IN = "/logged-in";
const LOGOUT = "/logout";
const DISTRIBTORS = "/distribtors";

export const Routes = Router()
  .post(LOGIN, LoginController)
  .post(IS_LOGGED_IN)
  .get(LOGOUT, LogoutController)
  .post(DISTRIBTORS, SessionController.checkAuthendication(), Users.register)
  .get(DISTRIBTORS, SessionController.checkAuthendication(), Users.getAll)
  .get(
    "/distribtors/checkDistribtionCityName/:cityName",
    SessionController.checkAuthendication(),
    Users.checkDistributionForCity
  )
  .get(
    `${DISTRIBTORS}/:username`,
    SessionController.checkAuthorization(),
    Users.get
  )
  .put(
    `${DISTRIBTORS}/:username`,
    SessionController.checkAuthorization(),
    Users.update
  )
  .delete(
    `${DISTRIBTORS}/:username`,
    SessionController.checkAuthorization(),
    Users.remove
  );
