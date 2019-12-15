import { UsersModel } from "../models/users";
import { User } from "../database/users.schema";
import { Locations } from "../database/location.schema";

/**
 * Query for create user
 * @param userData
 */
export async function createUser(userData: UsersModel): Promise<UsersModel> {
  const user = new User(userData);
  try {
    const newUser = await user.save();
    return await Promise.resolve(newUser);
  } catch (err) {
    return Promise.reject(err.message);
  }
}

/**
 * Query for find user
 * @param username
 */
export function findOne(username: any): any {
  return User.findOne({ username: username }).then((userModel: any) => {
    if (userModel === null) {
      return Promise.reject({
        status: 400,
        message: `User: "${username}" does not exist.`
      });
    }
    return userModel;
  });
}

/**
 * Query for get all users
 */
export function getAll(): Promise<UsersModel[]> {
  return new Promise((resolve, reject) => {
    User.find({}, (error, requestsArray) => {
      if (error) {
        console.error("Error ", error);
        reject({
          status: 400,
          msg: "[getAll] Error getting all users"
        });
      }
      resolve(requestsArray);
    })
      .select(
        "_id distributorName username include exclude createdDate createdBy"
      )
      .sort({ date: -1 });
  });
}

/**
 * Query for user details
 * @param users
 */
export async function get(users: string): Promise<UsersModel[]> {
  try {
    const userModel = await User.findOne({ username: users }, { _id: 0 })
      .select("distributorName username include exclude createdDate createdBy")
      .lean();
    if (userModel === null) {
      throw new Error();
    }
    return Promise.resolve(userModel);
  } catch (error) {
    return await Promise.reject({
      status: 400,
      msg: `Request: ${users} does not exist.`
    });
  }
}

/**
 * Get Approved location
 * @param username
 */
export function getArrovedLocation(username: string): Promise<UsersModel[]> {
  return new Promise((resolve, reject) => {
    User.find({ username: username }, (error, requestsArray) => {
      if (error) {
        console.error("Error ", error);
        reject({
          status: 400,
          msg: "Error getting"
        });
      }
      resolve(requestsArray);
    })
      .select("include exclude")
      .sort({ date: -1 });
  });
}

/**
 * Find user exist
 * @param requestedUser
 */
export function isUserNameAvailable(requestedUser: any): any {
  return User.findOne({ username: requestedUser.username }).then(userModel => {
    if (userModel) {
      return Promise.reject("User Exists, try another username");
    }
    return Promise.resolve("");
  });
}

/**
 * Assign user object
 * @param user
 * @param adminUserName
 */
export function addInfoToUserObject(
  user: UsersModel,
  adminUserName: string
): Promise<UsersModel> {
  user.createdBy = adminUserName;
  user.createdDate = new Date();
  return Promise.resolve(user);
}

/**
 * Query for update the user
 * @param requestDetails
 * @param user
 */
export async function updateRequest(
  requestDetails: UsersModel,
  user: any
): Promise<UsersModel> {
  const query = {
    username: user
  };

  try {
    const userModel = await User.findOneAndUpdate(query, requestDetails, {
      new: true
    });
    if (userModel === null) {
      throw new Error();
    }
    return Promise.resolve(userModel);
  } catch (error) {
    return await Promise.reject({
      status: 400,
      msg: `Bad request`
    });
  }
}

/**
 * Query for check location by location code
 * @param code
 */
export async function checkUserAuth(code: any) {
  return Locations.find(code, (error, requestsArray) => {
    return requestsArray;
  });
}

/**
 * Delete query
 * @param username
 */
export async function findOneAndDelete(username: any) {
  try {
    await User.findOneAndDelete({ username: username });
  } catch (err) {
    return await Promise.reject({
      status: 400,
      message: `User:  findByIdAndDelete User with username "${username}" couldn't be deleted.`
    });
  }
}
