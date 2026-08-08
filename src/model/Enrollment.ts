import { Schema, model } from 'mongoose'
import DefaultSchema         from './Default'
import { Key }           from '@constant/enum'

const TAG = 'Enrollment'

const EnrollmentSchema = new Schema(
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
        enum   : ['enrolled', 'in_progress', 'completed', 'dropped'],
        default: 'enrolled'
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

// attach default metadata fields (createdBy, updatedBy, isActive, isArchived)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
EnrollmentSchema.add(DefaultSchema.obj)
 
export default model(TAG, EnrollmentSchema)
