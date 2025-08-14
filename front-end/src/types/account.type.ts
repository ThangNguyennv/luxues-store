export interface RoleInfoInterface {
  title: string,
}

export interface AccountInfoInterface {
  _id: string,
  avatar: string,
  fullName: string,
  email: string,
  phone: string,
  status: string,
  token: string
}

export interface MyAccountDetailInterface {
  myAccount: AccountInfoInterface,
  role: RoleInfoInterface
}