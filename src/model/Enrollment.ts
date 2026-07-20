import { Schema, model } from 'mongoose'
import { Key }           from '@constant/enum'

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
  { timestamps: true }
)

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true })
EnrollmentSchema.index({ user: 1, updatedAt: -1 })

export default model('Enrollment', EnrollmentSchema)
