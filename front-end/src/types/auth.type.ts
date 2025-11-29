import type { AccountInfoInterface } from './account.type'
export interface LoginInterface {
  code: number,
  email: string,
  password: string,
  accessToken?: string
  message: string,
  accountAdmin: AccountInfoInterface,
}

export interface LogoutInterface {
  error: Error,
  code: number,
  message: string
}