import { Schema, model }       from 'mongoose'
import DefaultSchema            from './Default'
import { Key, LEARNING_EVENT } from '@constant/enum'

const TAG = 'LearningEvent'

const LearningEventSchema = new Schema<ILearningEvent>(
  {
    user: {
      type    : Schema.Types.ObjectId,
      ref     : Key.User,
      required: true,
      index   : true
    },
    course: {
      type : Schema.Types.ObjectId,
      ref  : Key.Course,
      index: true
    },
    bootcamp: {
      type : Schema.Types.ObjectId,
      ref  : Key.Bootcamp,
      index: true
    },
    eventType: {
      type    : String,
      required: true,
      enum    : LEARNING_EVENT,
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
      default: 'web',
      enum   : ['web', 'mobile', 'api']
    }
  },
  {
    timestamps: true,
    collection: TAG
  }
)

LearningEventSchema.index({ user: 1, occurredAt: -1 })
LearningEventSchema.index({ course: 1, occurredAt: -1 })

// attach default metadata fields (createdBy, updatedBy, isActive, isArchived)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
LearningEventSchema.add(DefaultSchema.obj)
 
const LearningEvent = model(TAG, LearningEventSchema)
export default LearningEvent
