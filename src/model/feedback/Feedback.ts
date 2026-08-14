import { Schema, model }  from 'mongoose'
import goodlog            from 'good-logs'
import { MODULE_KEY }     from '@config/module'
import { DATABASE_INDEX } from '@db'
import { SCHEMA, LOCALE } from '@constant/enum'
import Audit              from '@model/audit/Audit'

const TAG = MODULE_KEY.FEEDBACK

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
      ref     : MODULE_KEY.BOOTCAMP,
      required: true
    },
    user: {
      type    : Schema.Types.ObjectId,
      ref     : MODULE_KEY.USER,
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
    await model(MODULE_KEY.BOOTCAMP).findByIdAndUpdate(bootcampId, {
      rating: obj[0].rating
    })
  } catch (error) {
    if (error instanceof Error) {
      goodlog.error(error.message)
    }
  }
}

FeedbackSchema.post('save', function () {
  ;(this.constructor as any as IFeedbackExtended).getAverageRating(this.bootcamp)
})

FeedbackSchema.pre(new RegExp('remove'), function (this: IFeedback, next: any) {
  ;(this.constructor as any as IFeedbackExtended).getAverageRating(this.bootcamp)
  next()
})

FeedbackSchema.index(DATABASE_INDEX.FEEDBACK)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
FeedbackSchema.add(Audit.obj)

const Feedback = model(TAG, FeedbackSchema)
export default Feedback
