import { Schema, model }                                     from 'mongoose'
import { DATABASE_INDEX }                                    from '@db'
import DefaultSchema                                         from '@model/default/Default'
import { Key, ENROLLMENT_STATUS, DEFAULT_ENROLLMENT_STATUS } from '@constant/enum'

const TAG = 'Enrollment'

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

EnrollmentSchema.index(DATABASE_INDEX.ENROLLMENT.user_course, { unique: true })
EnrollmentSchema.index(DATABASE_INDEX.ENROLLMENT.user)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
EnrollmentSchema.add(DefaultSchema.obj)

export default model(TAG, EnrollmentSchema)
