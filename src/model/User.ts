import { Schema, model } from 'mongoose'
import { IUser } from '@interface/model'
import { Key } from '@constant/enum'

const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

//Encryption (password)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

//Match the user entered password to hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//Generate and hash password TOKEN
UserSchema.methods.getResetPasswordToken = function () {
  //generate TOKEN
  const resetToken = crypto.randomBytes(20).toString('hex')

  //hash TOKEN and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  //set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

UserSchema.pre('save', async function (next) {
  try {
    const cohort = await mongoose.model('Cohort').findById(this.cohort)
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

const User = mongoose.model(TAG, UserSchema)

export default User
