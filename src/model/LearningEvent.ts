import { Schema, model }                                                             from 'mongoose'
import { type LearningEventSourceType, type LearningEventType }                                              from '@constant/enum'
import { Key, DEFAULT_LEARNING_EVENT_SOURCE, LEARNING_EVENT, LEARNING_EVENT_SOURCE } from '@constant/enum'
import DefaultSchema                                                                 from './Default'

const TAG = 'LearningEvent'

declare interface ILearningEvent {
  _id       ?: Schema.Types.ObjectId
  user       : Schema.Types.ObjectId
  course    ?: Schema.Types.ObjectId
  bootcamp  ?: Schema.Types.ObjectId
  eventType  : LearningEventType
  occurredAt : Date
  metadata  ?: Record<string, any>
  source    ?: LearningEventSourceType
}

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
      enum   : LEARNING_EVENT_SOURCE,
      default: DEFAULT_LEARNING_EVENT_SOURCE
    }
  },
  {
    timestamps: true,
    collection: TAG
  }
)

LearningEventSchema.index({ user: 1, occurredAt: -1 })
LearningEventSchema.index({ course: 1, occurredAt: -1 })

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
LearningEventSchema.add(DefaultSchema.obj)

const LearningEvent = model(TAG, LearningEventSchema)
export default LearningEvent
