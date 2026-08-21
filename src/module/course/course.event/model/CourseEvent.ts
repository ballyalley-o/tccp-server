import { Schema, model }                                                  from 'mongoose'
import { MODULE_KEY }                                                     from '@config/module.config'
import { DATABASE_INDEX }                                                 from '@db'
import { DEFAULT_COURSE_EVENT_SOURCE, COURSE_EVENT, COURSE_EVENT_SOURCE } from '@common/constant'

import AdminAudit from '@module/admin/admin.audit/model/AdminAudit'

const TAG = MODULE_KEY.LEARNING_EVENT

const CourseEventSchema = new Schema<ICourseEvent>(
  {
    user: {
      type    : Schema.Types.ObjectId,
      ref     : MODULE_KEY.AUTH_USER,
      required: true,
      index   : true
    },
    course: {
      type : Schema.Types.ObjectId,
      ref  : MODULE_KEY.COURSE,
      index: true
    },
    bootcamp: {
      type : Schema.Types.ObjectId,
      ref  : MODULE_KEY.BOOTCAMP,
      index: true
    },
    eventType: {
      type    : String,
      required: true,
      enum    : COURSE_EVENT,
      index   : true
    },
    occurredAt: {
      type   : Date,
      default: Date.now,
      index  : true
    },
    metadata: {
      type   : Schema.Types.Mixed,
      default: {}
    },
    source: {
      type   : String,
      enum   : COURSE_EVENT_SOURCE,
      default: DEFAULT_COURSE_EVENT_SOURCE
    }
  },
  {
    timestamps: true,
    collection: TAG
  }
)

CourseEventSchema.index(DATABASE_INDEX.COURSE_EVENT.user)
CourseEventSchema.index(DATABASE_INDEX.COURSE_EVENT.course)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
CourseEventSchema.add(AdminAudit.obj)

const CourseEvent = model(TAG, CourseEventSchema)
export default CourseEvent
