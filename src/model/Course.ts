import logger from 'logger'
import mongoose, { Schema, model } from 'mongoose'
import { Key, Aggregate } from '@constant/enum'
import { ICourse, ICourseExtended } from '@interface/model'

const TAG = Key.Course

const CourseSchema = new Schema<ICourseExtended>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a Course Title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a Course description'],
    },
    weeks: {
      type: String,
      required: [true, 'Please add number of weeks'],
    },
    tuition: {
      type: Number,
      required: [true, 'Please add a tuition Cost'],
    },
    minimumSkill: {
      type: String,
      required: [true, 'Please add a minimum Skill'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    bootcamp: {
      type: Schema.ObjectId,
      ref: Key.Bootcamp,
      required: true,
    },
    user: {
      type: Schema.ObjectId,
      ref: Key.User,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

//static method to get the average cost of tuitions
CourseSchema.statics.getAverageCost = async function (
  bootcampId: Schema.Types.ObjectId
): Promise<void> {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: Aggregate.Bootcamp,
        averageCost: { $avg: Aggregate.Tuition },
      },
    },
  ])
  try {
    await mongoose.model(Key.Bootcamp).findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    }
  }
}

CourseSchema.post(Key.Save, function () {
  ;(this.constructor as any as ICourseExtended).getAverageCost(this.bootcamp)
})

CourseSchema.pre(new RegExp(Key.Remove), function (this: ICourse, next: any) {
  ;(this.constructor as any as ICourseExtended).getAverageCost(this.bootcamp)
  next()
})

const Course = model(TAG, CourseSchema)
export default Course
