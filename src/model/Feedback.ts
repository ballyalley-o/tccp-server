import goodlog                     from 'good-logs'
import mongoose, { Schema, model } from 'mongoose'
import { SCHEMA, LOCALE, Key }     from '@constant/enum'
import { DATABASE_INDEX }          from '@db'
import DefaultSchema               from './Default'

const TAG = Key.Feedback

export interface IFeedback {
  title   : string
  body    : string
  rating  : number
  bootcamp: Schema.Types.ObjectId
  user    : Schema.Types.ObjectId
}

export interface IFeedbackExtended extends IFeedback {
  getAverageRating: (bootcampId: Schema.Types.ObjectId) => Promise<void>
}

export const FeedbackSchema = new Schema<IFeedback>(
  {
    title: {
      type     : String,
      trim     : true,
      required : [true, SCHEMA.FEEDBACK_TITLE],
      maxlength: 100
    },
    body: {
      type    : String,
      required: [true, SCHEMA.DESCRIPTION]
    },
    rating: {
      type    : Number,
      min     : 1,
      max     : 10,
      required: [true, SCHEMA.FEEDBACK_RATING]
    },
    bootcamp: {
      type    : Schema.Types.ObjectId,
      ref     : Key.Bootcamp,
      required: true
    },
    user: {
      type    : Schema.Types.ObjectId,
      ref     : Key.User,
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
FeedbackSchema.add(DefaultSchema.obj)

const Feedback = model(TAG, FeedbackSchema)
export default Feedback
