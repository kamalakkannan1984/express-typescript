import { Request, Response, NextFunction } from "express";
import { UsersModel } from "../models/users";
import { CreateHashedPassword } from "../lib/bcrypt";
import * as Users from "../queries/users";
import { admin } from "../config";

/**
 * Add user
 * @param req
 * @param res
 */
export const register = async (req: Request, res: Response) => {
  const user: UsersModel = req.body;
  const adminUserName = req.session.user;
  try {
    const include = req.session.include[0];
    const exclude = req.session.exclude[0];
    const includeParam = user.include[0];
    const excludeParam = user.exclude[0];
    const includeAllowLocation = await checkAllowLocation(
      include,
      includeParam,
      "Include"
    );

    if (typeof includeAllowLocation === "object") {
      return res.status(401).send(includeAllowLocation);
    }
    const excludeAllowLocation = await checkAllowLocation(
      exclude,
      excludeParam,
      "Exclude"
    );
    if (typeof excludeAllowLocation === "object") {
      return res.status(401).send(excludeAllowLocation);
    }

    Users.isUserNameAvailable(user)
      .then(() => Users.addInfoToUserObject(user, adminUserName))
      .then((userObj: UsersModel) =>
        CreateHashedPassword(userObj)
          .then(userWithHash => Users.createUser(userWithHash))
          .then(newUser => {
            newUser.password = undefined;
            return res.status(200).send(newUser);
          })
      )
      .catch((error: any) => {
        return res.status(500).send({ msg: error });
      });
  } catch (err) {
    console.log(err);
    return res.status(err.status).send(err.msg);
  }
};

/**
 * Itration for find distribution by city name
 * @param cityAuth
 * @param cityArr
 * @param cityName
 */
function findDistribution(
  cityAuth: any[],
  cityArr: string | any[],
  cityName: string
) {
  if (checkEmpty(cityArr)) {
    for (let i = 0; i < cityArr.length; i++) {
      let obj = cityAuth.find(
        o =>
          o.cityName.toLowerCase() === cityName.toLowerCase() &&
          o.cityCode !== cityArr[i]
      );
      if (obj === undefined) {
        return { msg: "NO" };
      }
    }
  } else {
    let obj = cityAuth.find(
      o => o.cityName.toLowerCase() === cityName.toLowerCase()
    );
    if (obj === undefined) {
      return { msg: "NO" };
    }
  }
}

/**
 * Check Distribution by city name
 * @param req
 * @param res
 */
export async function checkDistributionForCity(req: Request, res: Response) {
  const cityName: any = req.params.cityName;
  const include = req.session.include[0];
  const exclude = req.session.exclude[0];
  let cityAuth: any;
  let cityArr: any = exclude.cityCode;
  let findCityStatus = {};

  if (checkEmpty(include.countryCode)) {
    cityAuth = await Users.checkUserAuth({
      countryCode: include.countryCode
    });

    findCityStatus = findDistribution(cityAuth, cityArr, cityName);
    if (typeof findCityStatus === "object") {
      return res.status(401).send(findCityStatus);
    }
  } else if (checkEmpty(include.provinceCode)) {
    cityAuth = await Users.checkUserAuth({
      provinceCode: include.provinceCode
    });

    findCityStatus = findDistribution(cityAuth, cityArr, cityName);
    if (typeof findCityStatus === "object") {
      return res.status(401).send(findCityStatus);
    }
  } else {
    cityAuth = await Users.checkUserAuth({
      cityCode: include.cityCode
    });

    findCityStatus = findDistribution(cityAuth, cityArr, cityName);
    if (typeof findCityStatus === "object") {
      return res.status(401).send(findCityStatus);
    }
  }

  return res.status(200).send({ msg: "YES" });
}

/**
 * Get all distributors
 * @param req
 * @param res
 */
export async function getAll(req: Request, res: Response) {
  try {
    const users = await Users.getAll();
    return res.status(200).send(users);
  } catch (err) {
    return res.status(err.status).send(err.msg);
  }
}

/**
 * Get individual Distribuor
 * @param req
 * @param res
 */
export async function get(req: Request, res: Response) {
  const username = req.params.username;
  console.log(username);
  try {
    const users = await Users.get(username);
    return res.status(200).send(users);
  } catch (err) {
    return res.status(err.status).send(err.msg);
  }
}

/**
 * Get approved location by username
 * @param username
 */
export async function getArroved(username: string) {
  try {
    const users = await Users.getArrovedLocation(username);
    return users[0];
  } catch (err) {
    return err.msg;
  }
}

/**
 * Check object array empty
 * @param arrObj
 */
function checkEmpty(arrObj: string | any[]) {
  return typeof arrObj !== "undefined" && arrObj.length > 0;
}

/**
 * Check allowed for Country, Pprovince, city location
 * @param include
 * @param includeParam
 * @param showText
 */
export async function checkAllowLocation(
  include: any,
  includeParam: any,
  showText: string
) {
  //city
  if (checkEmpty(includeParam.cityCode) && checkEmpty(include.cityCode)) {
    const cityAuth = await Users.checkUserAuth({
      cityCode: include.cityCode
    });

    const cityArr = includeParam.cityCode;
    for (let i = 0; i < cityArr.length; i++) {
      let obj = cityAuth.find(o => o.cityCode === cityArr[i]);
      if (obj === undefined) {
        return { msg: showText + " City Not Allowed!" };
      }
    }
  } else if (checkEmpty(include.provinceCode)) {
    const provinceAuth = await Users.checkUserAuth({
      provinceCode: include.provinceCode
    });

    const cityArr = includeParam.cityCode;
    for (let i = 0; i < cityArr.length; i++) {
      let obj = provinceAuth.find(o => o.cityCode === cityArr[i]);

      if (obj === undefined) {
        return { msg: showText + " City Not Allowed!" };
      }
    }
  } else if (checkEmpty(include.countryCode)) {
    const checkAuth = await Users.checkUserAuth({
      countryCode: include.countryCode
    });
    const cityArr = includeParam.cityCode;
    for (let i = 0; i < cityArr.length; i++) {
      let obj = checkAuth.find(o => o.cityCode === cityArr[i]);

      if (obj === undefined) {
        return { msg: showText + " City Not Allowed!" };
      }
    }
  } else if (checkEmpty(includeParam.cityCode)) {
    return { msg: showText + " City Not Allowed!" };
  }

  //province
  if (
    checkEmpty(includeParam.provinceCode) &&
    checkEmpty(include.provinceCode)
  ) {
    const provinceAuth = await Users.checkUserAuth({
      provinceCode: include.provinceCode
    });

    const provinceArr = includeParam.provinceCode;
    if (typeof provinceArr !== "undefined" && provinceArr.length > 0) {
      for (let i = 0; i < provinceArr.length; i++) {
        let obj = provinceAuth.find(o => o.provinceCode === provinceArr[i]);
        if (obj === undefined) {
          return { msg: showText + " Province Not Allowed!" };
        }
      }
    }
  } else if (checkEmpty(include.countryCode)) {
    const checkAuth = await Users.checkUserAuth({
      countryCode: include.countryCode
    });
    const provinceArr = includeParam.provinceCode;
    if (typeof provinceArr !== "undefined" && provinceArr.length > 0) {
      for (let i = 0; i < provinceArr.length; i++) {
        let obj = checkAuth.find(o => o.provinceCode === provinceArr[i]);
        if (obj === undefined) {
          return { msg: showText + " Province Not Allowed!" };
        }
      }
    }
  } else if (checkEmpty(includeParam.provinceCode)) {
    return { msg: showText + " Province Not Allowed!" };
  }

  //country
  if (checkEmpty(includeParam.countryCode) && checkEmpty(include.countryCode)) {
    const checkAuth = await Users.checkUserAuth({
      countryCode: include.countryCode
    });
    const countryArr = includeParam.countryCode;
    for (let i = 0; i < countryArr.length; i++) {
      let obj = checkAuth.find(o => o.countryCode === countryArr[i]);
      if (obj === undefined) {
        return { msg: showText + " Country Not Allowed!" };
      }
    }
  } else if (checkEmpty(includeParam.countryCode)) {
    return { msg: showText + " Country Not Allowed!" };
  }
  return 1;
}

/**
 * Update user by username
 * @param req
 * @param res
 */
export async function update(req: Request, res: Response) {
  const users: UsersModel = req.body;
  try {
    const user: any = req.params.username;
    const include = req.session.include[0];
    const exclude = req.session.exclude[0];
    const includeParam = users.include[0];
    const excludeParam = users.exclude[0];
    const includeAllowLocation = await checkAllowLocation(
      include,
      includeParam,
      "Include"
    );

    if (typeof includeAllowLocation === "object") {
      return res.status(401).send(includeAllowLocation);
    }
    const excludeAllowLocation = await checkAllowLocation(
      exclude,
      excludeParam,
      "Exclude"
    );
    if (typeof excludeAllowLocation === "object") {
      return res.status(401).send(excludeAllowLocation);
    }

    const userDetails = await Users.updateRequest(req.body, user);
    return res.status(200).send({ msg: "Updated successfully", userDetails });
  } catch (err) {
    console.log(err);
    return res.status(err.status).send(err.msg);
  }
}

/**
 * Delete the user by username
 * @param req
 * @param res
 */
export async function remove(req: Request, res: Response) {
  const username: any = req.params.username;

  if (!username) {
    return res.status(400).send();
  }

  return Users.findOneAndDelete(username)
    .then(() => {
      return res.status(200).send({ msg: "Successfully deleted" });
    })
    .catch((err: any) => {
      console.error(err);
      return res.status(err.status).send(err.msg);
    });
}

/**
 * Create default user (Distributor1)
 */
export const createDefaultDistributor = () => {
  const password = admin.password;
  Users.isUserNameAvailable(admin)
    .then(() =>
      CreateHashedPassword(admin)
        .then(userWithHash => Users.createUser(userWithHash))
        .then(newUser => {
          newUser.password = undefined;
          console.log("Successfully created default user.");
          console.log("username", admin.username);
          console.log("password", password);
          return Promise.resolve();
        })
    )
    .catch((error: any) => {
      return error;
    });
};
