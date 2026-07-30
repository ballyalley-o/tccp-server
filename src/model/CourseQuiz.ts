import { Schema, model } from 'mongoose'
import { Key, SCHEMA }   from '@constant/enum'

const TAG = Key.CourseQuiz

const QuizQuestionSchema = new Schema(
  {
    prompt: {
      type    : String,
      required: [true, SCHEMA.NAME],
      trim    : true
    },
    type: {
      type   : String,
      trim   : true,
      default: 'multiple_choice'
    },
    options: {
      type   : [String],
      default: []
    },
    answer: {
      type   : Schema.Types.Mixed,
      default: null
    },
    points: {
      type   : Number,
      default: 1
    }
  },
  { _id: false }
)

const CourseQuizSchema = new Schema<ICourseQuiz>(
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
    questions: {
      type   : [QuizQuestionSchema],
      default: []
    },
    passingScore: {
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

CourseQuizSchema.index({ course: 1, module: 1, order: 1 })

const CourseQuiz = model(TAG, CourseQuizSchema)
export default CourseQuiz
