import { Schema, model } from 'mongoose'
import { Key, SCHEMA }   from '@constant/enum'

const TAG = Key.CourseLecture

const CourseLectureSchema = new Schema<ICourseLecture>(
  {
    course: {
      type    : Schema.Types.ObjectId,
      ref     : Key.Course,
      required: true,
      index   : true
    },
    module: {
      type    : Schema.Types.ObjectId,
      ref     : Key.CourseModule,
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

CourseLectureSchema.index({ course: 1, module: 1, order: 1 })

const CourseLecture = model(TAG, CourseLectureSchema)
export default CourseLecture
