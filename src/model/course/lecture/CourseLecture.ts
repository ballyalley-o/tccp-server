import { Schema, model }  from 'mongoose'
import { MODULE_KEY }     from '@config/module.config'
import { DATABASE_INDEX } from '@db'
import { SCHEMA }         from '@constant/enum'
import Audit              from '@model/audit/Audit'

const TAG = MODULE_KEY.COURSE_LECTURE

const CourseLectureSchema = new Schema<ICourseLecture>(
  {
    course: {
      type    : Schema.Types.ObjectId,
      ref     : MODULE_KEY.COURSE,
      required: true,
      index   : true
    },
    module: {
      type    : Schema.Types.ObjectId,
      ref     : MODULE_KEY.COURSE_MODULE,
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
    content: {
      type   : String,
      trim   : true,
      default: ''
    },
    resources: {
      type   : [String],
      default: []
    },
    durationMinutes: {
      type   : Number,
      default: 0
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

CourseLectureSchema.index(DATABASE_INDEX.COURSE_LECTURE)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
CourseLectureSchema.add(Audit.obj)

const CourseLecture = model(TAG, CourseLectureSchema)
export default CourseLecture
