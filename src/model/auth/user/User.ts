import bcrypt                                       from 'bcryptjs'
import crypto                                       from 'crypto'
import jwt                                          from 'jsonwebtoken'
import { Schema, model }                            from 'mongoose'
import GLOBAL                                       from '@config/global.config'
import { MODULE_KEY }                               from '@config/module.config'
import { SECURITY }                                 from '@config/security.config'
import { DATABASE_INDEX }                           from '@db'
import { REGEX }                                    from '@constant/regex'
import { oneDayFromNow }                            from '@constant/max-age'
import { SCHEMA, USER_STATUS, DEFAULT_USER_STATUS } from '@constant/enum'
import Audit                                        from '@model/audit/Audit'

const TAG = MODULE_KEY.USER

const UserSchema = new Schema<IUser>(
  {
    firstname: {
      type    : String,
      required: [true, SCHEMA.FIRST_NAME],
      min     : 3,
      max     : 60,
      validate: {
        validator: function (v: string) {
          return v.length >= 3 && v.length <= 60
        },
        message: (props) => `Firstname length (${props.value.length}) exceeds the limit of 60 characters`
      }
    },
    lastname: {
      type    : String,
      max     : 60,
      validate: {
        validator: function (v: string) {
          return v.length <= 60
        },
        message: (props) => `Lastname length (${props.value.length}) exceeds the limit of 60 characters`
      }
    },
    email: {
      type    : String,
      required: [true, SCHEMA.EMAIL],
      unique  : true,
      match   : [REGEX.EMAIL, SCHEMA.EMAIL]
    },
    password: {
      type     : String,
      required : [true, SCHEMA.PASSWORD],
      minlength: 6,
      select   : false
    },
    // TODO: #68
    organization: {
      type    : String,
    },
    username: {
      type    : String,
      required: true,
      unique  : true
    },
    role: {
      type: Schema.Types.ObjectId,
      ref : 'Role'
    },
    avatar: {
      type   : String,
      default: SCHEMA.DEFAULT_AVATAR
    },
    location: {
      type: String
    },
    status: {
      type   : String,
      enum   : USER_STATUS,
      default: DEFAULT_USER_STATUS
    },
    deletedAt: {
      type   : Date,
      default: null
    },
    deletedBy: {
      type   : Schema.Types.ObjectId,
      ref    : TAG,
      default: null
    },
    deleteScheduledAt: {
      type   : Date,
      default: null
    },
    tokenVersion: {
      type   : Number,
      default: 0
    },
    resetPasswordToken : String,
    resetPasswordExpire: Date
  },
  {
    toJSON    : { virtuals: true },
    toObject  : { virtuals: true },
    collection: TAG,
    timestamps: true
  }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt    = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, tokenVersion: this.tokenVersion }, GLOBAL.JWT_SECRET || '', {
    expiresIn: GLOBAL.JWT_EXP
  })
}

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
  //TODO: refactor this to bcrypt
  const resetToken = crypto.randomBytes(20).toString()

  this.resetPasswordToken  = crypto.createHash(SECURITY.CRYPTO.HASH_256).update(resetToken).digest(SECURITY.HEX)
  this.resetPasswordExpire = oneDayFromNow

  return resetToken
}

UserSchema.index(DATABASE_INDEX.USER)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
UserSchema.add(Audit.obj)

const User = model(TAG, UserSchema)
export default User
