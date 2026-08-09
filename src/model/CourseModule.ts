import { Schema, model } from 'mongoose'
import { Key, SCHEMA }   from '@constant/enum'
import DefaultSchema     from './Default'

const TAG = Key.CourseModule

interface ICourseModule {
  _id        ?: Schema.Types.ObjectId
  course      : Schema.Types.ObjectId
  title       : string
  labelKey    : string
  description?: string
  order       : number
}

const CourseModuleSchema = new Schema<ICourseModule>(
  {
    course: {
      type    : Schema.Types.ObjectId,
      ref     : Key.Course,
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

CourseModuleSchema.index({ course: 1, order: 1 })

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
CourseModuleSchema.add(DefaultSchema.obj)

const CourseModule = model(TAG, CourseModuleSchema)
export default CourseModule
