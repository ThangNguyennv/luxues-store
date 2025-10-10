export interface UserInfoInterface {
  _id: string,
  fullName: string,
  email: string,
  address: string,
  password: string,
  tokenUser: string,
  status: string,
  avatar: string,
  phone: string,
}


export interface UsersDetailInterface {
  users: UserInfoInterface[],
}

export interface UserDetailInterface {
  accountUser: UserInfoInterface,
  code: number,
  message: string
}