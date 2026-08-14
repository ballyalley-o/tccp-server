import { Schema, model }                                                        from 'mongoose'
import { MODULE_KEY }                                                           from '@config/module'
import { DATABASE_INDEX }                                                       from '@db'
import { DEFAULT_LEARNING_EVENT_SOURCE, LEARNING_EVENT, LEARNING_EVENT_SOURCE } from '@constant/enum'
import Audit                                                                    from '@model/audit/Audit'

const TAG = 'LearningEvent'

const LearningEventSchema = new Schema<ILearningEvent>(
  {
    user: {
      type    : Schema.Types.ObjectId,
      ref     : MODULE_KEY.USER,
      required: true,
      index   : true
    },
    course: {
      type : Schema.Types.ObjectId,
      ref  : MODULE_KEY.COURSE,
      index: true
    },
    bootcamp: {
      type : Schema.Types.ObjectId,
      ref  : MODULE_KEY.BOOTCAMP,
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

LearningEventSchema.index(DATABASE_INDEX.LEARNING_EVENT.user)
LearningEventSchema.index(DATABASE_INDEX.LEARNING_EVENT.course)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
LearningEventSchema.add(Audit.obj)

const LearningEvent = model(TAG, LearningEventSchema)
export default LearningEvent
