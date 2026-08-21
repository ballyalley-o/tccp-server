import { Schema, model }                                from 'mongoose'
import { MODULE_KEY }                                   from '@config/module.config'
import { DATABASE_INDEX }                               from '@db'
import { ENROLLMENT_STATUS, DEFAULT_ENROLLMENT_STATUS } from '@common/constant'

import AdminAudit from '@module/admin/admin.audit/model/AdminAudit'

const TAG =  MODULE_KEY.ENROLLMENT

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
        type    : Schema.ObjectId,
        ref     : MODULE_KEY.ENROLLMENT,
        required: true,
        index   : true
    },
    bootcamp: {
        type    : Schema.ObjectId,
        ref     : MODULE_KEY.BOOTCAMP,
        required: true,
        index   : true
    },
    course: {
        type    : Schema.ObjectId,
        ref     : MODULE_KEY.COURSE,
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
EnrollmentSchema.add(AdminAudit.obj)

export default model(TAG, EnrollmentSchema)
