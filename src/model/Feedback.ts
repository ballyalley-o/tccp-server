import goodlog from 'good-logs'
import mongoose, { Schema, model } from 'mongoose'
import { IFeedback, IFeedbackExtended } from '@interface/model'
import { Key, Aggregate } from '@constant/enum'

const FeedbackSchema = new Schema<IFeedbackExtended>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title to your Feedback'],
      maxlength: 100,
    },
    body: {
      type: String,
      required: [true, 'Please add a description'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Please rating is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: Key.Bootcamp,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: Key.User,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

//static method to get the average rating
FeedbackSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: Aggregate.Bootcamp,
        averageRating: { $avg: Aggregate.Rating },
      },
    },
  ])
  try {
    await mongoose.model(Key.Bootcamp).findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    })
  } catch (error) {
    if (error instanceof Error) {
      goodlog.error(error.message)
    }
  }
}

FeedbackSchema.post(Key.Save, function () {
  ;(this.constructor as any as IFeedbackExtended).getAverageRating(
    this.bootcamp
  )
})

//Call averageRating before remove
FeedbackSchema.pre(
  new RegExp(Key.Remove),
  function (this: IFeedback, next: any) {
    ;(this.constructor as any as IFeedbackExtended).getAverageRating(
      this.bootcamp
    )
    next()
  }
)

FeedbackSchema.index(
  {
    bootcamp: 1,
    user: 1,
  },
  { unique: true }
)

const Feedback = model(Key.Feedback, FeedbackSchema)
export default Feedback
