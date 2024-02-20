import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import mongoose, { Schema, model } from 'mongoose'
import { GLOBAL } from '@config'
import { IUser } from '@interface/model'
import { Key } from '@constant/enum'
import { oneDayFromNow } from '@constant/max-age'

const TAG = Key.User

const UserSchema = new Schema<IUser>(
  {
    firstname: {
      type: String,
      required: [true, 'Please provide your first name'],
      min: 3,
      max: 60,
    },
    lastname: {
      type: String,
      required: [true, 'Please provide your family/last name'],
      min: 3,
      max: 60,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['student', 'trainer'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: 'no-photo.jpg',
    },
    location: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: TAG,
    timestamps: true,
  }
)

UserSchema.pre(Key.Save, async function (next) {
  if (!this.isModified(Key.Password)) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, GLOBAL.JWT_SECRET || '', {
    expiresIn: GLOBAL.JWT_EXP,
  })
}

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString(Key.Hex)

  this.resetPasswordToken = crypto
    .createHash(Key.CryptoHash)
    .update(resetToken)
    .digest(Key.Hex)

  //set expire
  this.resetPasswordExpire = oneDayFromNow

  return resetToken
}

UserSchema.index({ username: 1 })
UserSchema.index({ firstname: 1 })

const User = model(TAG, UserSchema)
export default User
