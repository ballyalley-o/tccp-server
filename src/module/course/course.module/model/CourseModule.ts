import { Schema, model }  from 'mongoose'
import { MODULE_KEY }     from '@config'
import { DATABASE_INDEX } from '@db'
import { SCHEMA }         from '@common/constant'

import AdminAudit         from '@module/admin/admin.audit/model/AdminAudit'

const TAG    = MODULE_KEY.COURSE_MODULE

const CourseModuleSchema = new Schema<ICourseModule>(
  {
    course: {
      type    : Schema.Types.ObjectId,
      ref     : MODULE_KEY.COURSE,
      required: true,
      index   : true
    },
    title: {
      type    : String,
      required: [true, SCHEMA.NAME],
      trim    : true
    },
    labelKey: {
      type    : String,
      required: [true, SCHEMA.NAME],
      trim    : true
    },
    description: {
      type   : String,
      trim   : true,
      default: ''
    },
    order: {
      type   : Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: TAG
  }
)

CourseModuleSchema.index(DATABASE_INDEX.COURSE_MODULE)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
CourseModuleSchema.add(AdminAudit.obj)

const CourseModule = model(TAG, CourseModuleSchema)
export default CourseModule
