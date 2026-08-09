import { Schema, model } from 'mongoose'
import { Key, SCHEMA }   from '@constant/enum'
import DefaultSchema     from './Default'

const TAG = Key.CourseLecture

interface ICourseLecture {
  _id            ?: Schema.Types.ObjectId
  course          : Schema.Types.ObjectId
  module          : Schema.Types.ObjectId
  title           : string
  labelKey        : string
  description    ?: string
  content        ?: string
  resources      ?: string[]
  durationMinutes : number
  order           : number
}

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
CourseLectureSchema.add(DefaultSchema.obj)

const CourseLecture = model(TAG, CourseLectureSchema)
export default CourseLecture
