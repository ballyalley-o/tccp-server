import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { Schema, model } from 'mongoose'
import { GLOBAL } from '@config'
import { Key } from '@constant/enum'
import { oneDayFromNow } from '@constant/max-age'
import { REGEX, DATABASE_INDEX } from '@constant'
import { SCHEMA, Role } from '@constant/enum'

const TAG = Key.User

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    firstname: {
      type: String,
      required: [true, SCHEMA.FIRST_NAME],
      min: 3,
      max: 60,
      validate: {
        validator: function (v: string) {
          return v.length >= 3 && v.length <= 60
        },
        message: (props) => `Firstname length (${props.value.length}) exceeds the limit of 60 characters`
      }
    },
    lastname: {
      type: String,
      min: 3,
      max: 60,
      validate: {
        validator: function (v: string) {
          return v.length >= 3 && v.length <= 60
        },
        message: (props) => `Lastname length (${props.value.length}) exceeds the limit of 60 characters`
      }
    },
    email: {
      type: String,
      required: [true, SCHEMA.EMAIL],
      unique: true,
      match: [REGEX.EMAIL, SCHEMA.EMAIL]
    },
    password: {
      type: String,
      required: [true, SCHEMA.PASSWORD],
      minlength: 6,
      select: false
    },
    // TODO: #68
    organization: {
      type: String,
      required: function () {
        return this.role === 'admin'
      }
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.STUDENT
    },
    avatar: {
      type: String,
      default: SCHEMA.DEFAULT_AVATAR
    },
    location: {
      type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    toJSON    : { virtuals: true },
    toObject  : { virtuals: true },
    collection: TAG,
    timestamps: true
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
    expiresIn: GLOBAL.JWT_EXP
  })
}

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString(Key.Hex)

  this.resetPasswordToken = crypto.createHash(Key.CryptoHash).update(resetToken).digest(Key.Hex)

  this.resetPasswordExpire = oneDayFromNow

  return resetToken
}

UserSchema.index(DATABASE_INDEX.USER)

const User = model(TAG, UserSchema)
export default User
