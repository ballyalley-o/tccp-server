import goodlog from 'good-logs'
import mongoose, { Schema, model } from 'mongoose'
import { SCHEMA, LOCALE, Key, Aggregate } from '@constant/enum'
import { DATABASE_INDEX } from '@constant'

const TAG = Key.Feedback

export const FeedbackSchema: Schema<IFeedbackExtended> = new Schema<IFeedbackExtended>(
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
        _id: '$bootcamp',
        rating: { $avg: '$rating' }
      }
    },
    {
      $project: {
        _id: 1,
        rating: { $round: ['$rating', 2] }
      }
    }
  ])
  try {
    await mongoose.model(Key.Bootcamp).findByIdAndUpdate(bootcampId, {
      rating: obj[0].rating
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
