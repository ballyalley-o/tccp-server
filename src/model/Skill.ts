import { Schema, model } from 'mongoose'
import { Key } from '@constant/enum'

const TAG = 'Skill'

const SkillSchema = new Schema<ISkill>(
  {
    course: {
      type    : Schema.Types.ObjectId,
      ref     : Key.Course,
      required: true,
      index   : true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: Key.Category,
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
      enum: learningEvent,
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

SkillSchema.index({ user: 1, occurredAt: -1 })
SkillSchema.index({ course: 1, occurredAt: -1 })

const Skill = model(TAG, SkillSchema)
export default Skill
