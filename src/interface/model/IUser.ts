import { Schema } from 'mongoose'

interface IUser {
  firstname: string
  lastname: string
  email: string
  role: Schema.Types.ObjectId
  password: string
  location: string
  username: string
  avatar: string
  cohort: Schema.Types.ObjectId
  progress: Schema.Types.ObjectId
  resetPasswordToken: string
  resetPasswordExpire: Date
  getSignedJwtToken(): string
  getResetPasswordToken(): string
  matchPassword(enteredPassword: string): Promise<boolean>
}

export default IUser
