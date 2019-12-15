import { UsersModel } from "../models/users";
import { User } from "../database/users.schema";
import { Locations } from "../database/location.schema";

export async function createUser(userData: UsersModel): Promise<UsersModel> {
  const user = new User(userData);
  try {
    const newUser = await user.save();
    return await Promise.resolve(newUser);
  } catch (err) {
    return Promise.reject(err.message);
  }
}

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
      console.log(requestsArray);
      resolve(requestsArray);
    })
      .select("include exclude")
      .sort({ date: -1 });
  });
}

export function isUserNameAvailable(requestedUser: any): any {
  return User.findOne({ username: requestedUser.username }).then(userModel => {
    if (userModel) {
      return Promise.reject("User Exists, try another username");
    }
    return Promise.resolve("");
  });
}

export function addInfoToUserObject(
  user: UsersModel,
  adminUserName: string
): Promise<UsersModel> {
  user.createdBy = adminUserName;
  user.createdDate = new Date();
  return Promise.resolve(user);
}

export function FindByIdAndUpdate(userObject: any): Promise<UsersModel> {
  return new Promise((resolve, reject) => {
    const query = {
      username: userObject.username
    };
    return User.findOneAndUpdate(
      query,
      userObject,
      {
        new: true
      },
      (err, updatedUser) => {
        if (err) {
          console.error("User Error findByIdAndUpdate ", err);
          return reject({
            status: 400,
            msg: "Bad Request"
          });
        }
        return resolve(updatedUser);
      }
    ).select(
      "_id distributorName username include exclude createdDate createdBy"
    );
  });
}

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

export async function checkUserAuth(code: any) {
  return Locations.find(code, (error, requestsArray) => {
    return requestsArray;
  });
}

export function findOneAndDelete(username: any): any {
  return User.findByIdAndDelete({ username: username })
    .then()
    .catch(err =>
      Promise.reject({
        status: 400,
        message: `User:  findByIdAndDelete User with username "${username}" couldn't be deleted.`
      })
    );
}
