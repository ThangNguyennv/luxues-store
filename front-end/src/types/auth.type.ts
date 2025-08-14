export interface LoginInterface {
  code: number,
  email: string,
  password: string,
  token: string,
  message: string
}

export interface LogoutInterface {
  error: Error,
  code: number,
  message: string
}