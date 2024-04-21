import goodlog from 'good-logs'
import mongoose, { Schema, model } from 'mongoose'
import { IFeedback, IFeedbackExtended } from '@interface/model'
import { SCHEMA, LOCALE, Key, Aggregate } from '@constant/enum'
import { DATABASE_INDEX } from '@constant'

const TAG = Key.Feedback

const FeedbackSchema: Schema<IFeedbackExtended> = new Schema<IFeedbackExtended>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, SCHEMA.FEEDBACK_TITLE],
      maxlength: 100
    },
    body: {
      type: String,
      required: [true, SCHEMA.DESCRIPTION]
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, SCHEMA.FEEDBACK_RATING]
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: Key.Bootcamp,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: Key.User,
      required: true
    }
  },
  {
    timestamps: true,
    collation: { locale: LOCALE.EN, strength: 2 },
    collection: TAG
  }
)

FeedbackSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: Aggregate.Bootcamp,
        averageRating: { $avg: Aggregate.Rating }
      }
    }
  ])
  try {
    await mongoose.model(Key.Bootcamp).findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating
    })
  } catch (error) {
    if (error instanceof Error) {
      goodlog.error(error.message)
    }
  }
}

FeedbackSchema.post(Key.Save, function () {
  ;(this.constructor as any as IFeedbackExtended).getAverageRating(this.bootcamp)
})

FeedbackSchema.pre(new RegExp(Key.Remove), function (this: IFeedback, next: any) {
  ;(this.constructor as any as IFeedbackExtended).getAverageRating(this.bootcamp)
  next()
})

FeedbackSchema.index(DATABASE_INDEX.FEEDBACK)

const Feedback = model(TAG, FeedbackSchema)
export default Feedback
