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
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Role',
      default: 'Student',
    },
    avatar: {
      type: String,
      default: 'no-photo.jpg',
    },
    cohort: {
      type: Schema.Types.ObjectId,
      ref: 'Cohort',
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

//Sign JWT and return
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

UserSchema.pre(Key.Save, async function (next) {
  try {
    const cohort = await mongoose.model(Key.Cohort).findById(this.cohort)
    // const studentRole = await mongoose.model('Role').find({ type: 'Student' })
    const studentRole = await mongoose
      .model('Role')
      .findOne({ type: 'Student' })

    if (cohort && studentRole) {
      if (this.role && this.role.toString() === studentRole._id.toString()) {
        cohort.students.push(this._id)
      } else {
        cohort.trainers.push(this._id)
      }
      await cohort.save()
    }
    next()
  } catch (error: any) {
    next(error)
  }
})

UserSchema.index({ username: 1 })
UserSchema.index({ firstname: 1 })

const User = model(TAG, UserSchema)
export default User
