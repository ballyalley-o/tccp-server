import logger from 'logger'
import mongoose, { Schema, model } from 'mongoose'
// import { IFeedback } from '@interface/model'
import { Key, Aggregate } from '@constant/enum'

interface IFeedback {
  title: string
  body: string
  rating: number
  createdAt: Date
  bootcamp: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
}

const FeedbackSchema = new Schema({
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
    type: mongoose.Schema.ObjectId,
    ref: Key.Bootcamp,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: Key.User,
    required: true,
  },
})

//restriction for some roles to add/edit permissions for feedback users
FeedbackSchema.index(
  {
    bootcamp: 1,
    user: 1,
  },
  { unique: true }
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
      logger.error(err)
    }
  }
}

//Call averageRating after save
FeedbackSchema.post(Key.Save, function () {
  this.constructor.getAverageRating(this.bootcamp)
})

//Call averageRating before remove
FeedbackSchema.pre(
  new RegExp(Key.Remove),
  function (this: IFeedback, next: any) {
    this.constructor.getAverageRating(this.bootcamp)
    next()
  }
)

const Feedback = model('Feedback', FeedbackSchema)
