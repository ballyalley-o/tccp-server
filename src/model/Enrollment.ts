import { Schema, model }                                     from 'mongoose'
import { type EnrollmentStatusType }                         from '@constant/enum'
import { Key, ENROLLMENT_STATUS, DEFAULT_ENROLLMENT_STATUS } from '@constant/enum'
import DefaultSchema                                         from './Default'

const TAG = 'Enrollment'

export interface IEnrollment {
  _id           ?: Schema.Types.ObjectId
  user           : Schema.Types.ObjectId
  bootcamp       : Schema.Types.ObjectId
  course         : Schema.Types.ObjectId
  status         : EnrollmentStatusType
  progress       : number
  startDate      : Date
  completedAt    : Date
  lastAccessedAt : Date
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
        type    : Schema.ObjectId,
        ref     : Key.User,
        required: true,
        index   : true
    },
    bootcamp: {
        type    : Schema.ObjectId,
        ref     : Key.Bootcamp,
        required: true,
        index   : true
    },
    course: {
        type    : Schema.ObjectId,
        ref     : Key.Course,
        required: true,
        index   : true
    },
    status: {
        type   : String,
        enum   : ENROLLMENT_STATUS,
        default: DEFAULT_ENROLLMENT_STATUS
    },
    progress: {
        type   : Number,
        min    : 0,
        max    : 100,
        default: 0
    },
    startDate: {
        type    : Date,
        required: true,
    },
    completedAt   : Date,
    lastAccessedAt: Date
  },
  { timestamps: true, collection: TAG  }
)

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true })
EnrollmentSchema.index({ user: 1, updatedAt: -1 })

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
EnrollmentSchema.add(DefaultSchema.obj)

export default model(TAG, EnrollmentSchema)
