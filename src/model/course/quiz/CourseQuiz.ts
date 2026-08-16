import { Schema, model }  from 'mongoose'
import { MODULE_KEY }     from '@config/module.config'
import { DATABASE_INDEX } from '@db'
import { SCHEMA }         from '@constant/enum'
import Audit              from '@model/audit/Audit'

const TAG = MODULE_KEY.COURSE_QUIZ

const QuizQuestionSchema = new Schema<ICourseQuizQuestion>(
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

CourseQuizSchema.index(DATABASE_INDEX.COURSE_QUIZ)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
CourseQuizSchema.add(Audit.obj)

const CourseQuiz = model(TAG, CourseQuizSchema)
export default CourseQuiz
