import { Schema, model } from 'mongoose'
import { Key } from '@constant/enum'

const TAG = 'LearningEvent'

const learningEventTypes = [
  'lesson_started',
  'lesson_completed',
  'quiz_passed',
  'assignment_submitted',
  'resource_viewed',
  'discussion_posted',
  'login',
  'badge_earned'
] as const

const LearningEventSchema = new Schema<ILearningEvent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: Key.User,
      required: true,
      index: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: Key.Course,
      index: true
    },
    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: Key.Bootcamp,
      index: true
    },
    eventType: {
      type: String,
      required: true,
      enum: learningEventTypes,
      index: true
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    source: {
      type: String,
      default: 'web',
      enum: ['web', 'mobile', 'api']
    }
  },
  {
    timestamps: true,
    collection: TAG
  }
)

LearningEventSchema.index({ user: 1, occurredAt: -1 })
LearningEventSchema.index({ course: 1, occurredAt: -1 })

const LearningEvent = model(TAG, LearningEventSchema)
export default LearningEvent
