export interface UsersModel extends Object {
  distributorName: string;
  username: string;
  password: string;
  createdDate: Date;
  createdBy: string;
  include?: object[];
  exclude?: object[];
}
