import goodlog from 'good-logs'
import mongoose, { Schema, model } from 'mongoose'
import { ICourse, ICourseExtended } from '@interface/model'
import { SCHEMA, LOCALE, MinimumSkill, Key, Aggregate } from '@constant/enum'
import { DATABASE_INDEX } from '@constant'

const TAG = Key.Course

const CourseSchema = new Schema<ICourseExtended>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, SCHEMA.COURSE_TITLE],
    },
    description: {
      type: String,
      required: [true, SCHEMA.DESCRIPTION],
    },
    duration: {
      type: String,
      required: [true, SCHEMA.COURSE_WEEK],
    },
    tuition: {
      type: Number,
      required: [true, SCHEMA.COURSE_TUITION],
    },
    minimumSkill: {
      type: String,
      required: [true, SCHEMA.MINIMUM_SKILL],
      enum: Object.values(MinimumSkill),
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
    collation: { locale: LOCALE.EN, strength: 2 },
    collection: TAG,
  }
)

CourseSchema.statics.getAverageCost = async function (bootcampId: Schema.Types.ObjectId): Promise<void> {
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
      goodlog.error(error.message)
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

CourseSchema.index(DATABASE_INDEX.COURSE)

const Course = model(TAG, CourseSchema)
export default Course
