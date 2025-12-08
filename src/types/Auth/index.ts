export interface ForgotForm {
  email: string
  newPassword: string
  captcha: string
  password: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  newPassword: string
  captcha: string
}