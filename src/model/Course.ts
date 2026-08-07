import goodlog                                          from 'good-logs'
import mongoose, { Schema, model }                      from 'mongoose'
import slugify                                          from 'slugify'
import { SCHEMA, LOCALE, MinimumSkill, Key, Aggregate } from '@constant/enum'
import { DATABASE_INDEX }                               from '@db'

const TAG = Key.Course

const CourseSchema: Schema<ICourseExtended> = new Schema<ICourseExtended>(
  {
    title: {
      type    : String,
      trim    : true,
      required: [true, SCHEMA.COURSE_TITLE]
    },
    slug: {
      type    : String,
      unique  : true,
      required: true,
      index   : true
    },
    description: {
      type     : String,
      trim     : true,
      required : [true, SCHEMA.DESCRIPTION],
      minlength: [20, SCHEMA.MIN_LENGTH_DESCRIPTION],
      maxlength: [250, SCHEMA.MAX_LENGTH_DESCRIPTION]
    },
    duration: {
      type    : String,
      required: [true, SCHEMA.COURSE_WEEK]
    },
    tuition: {
      type    : Number,
      required: [true, SCHEMA.COURSE_TUITION]
    },
    minimumSkill: {
      type    : String,
      required: [true, SCHEMA.MINIMUM_SKILL],
      enum    : Object.values(MinimumSkill)
    },
     skills: {
      type: [{
        type: Schema.Types.ObjectId,
        ref : Key.Skill
      }],
      default: []
    },
    modules: {
      type: [{
        type: Schema.Types.ObjectId,
        ref : Key.CourseModule
      }],
      default: []
    },
    scholarshipAvailable: {
      type   : Boolean,
      default: false
    },
    bootcamp: {
      type    : Schema.ObjectId,
      ref     : Key.Bootcamp,
      required: true
    },
    user: {
      type    : Schema.ObjectId,
      ref     : Key.User,
      required: true
    },
    trainer: {
      type    : Schema.ObjectId,
      ref     : Key.User,
      required: true,
      index   : true
    }
  },
  {
    timestamps: true,
    collation : { locale: LOCALE.EN, strength: 2 },
    collection: TAG
  }
)

CourseSchema.statics.getAverageCost = async function (bootcampId: Schema.Types.ObjectId): Promise<void> {
  const bootcampObjectId = mongoose.Types.ObjectId.isValid(String(bootcampId))
    ? new mongoose.Types.ObjectId(String(bootcampId))
    : bootcampId

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampObjectId }
    },
    {
      $group: {
        _id        : Aggregate.Bootcamp,
        averageCost: { $avg: Aggregate.Tuition }
      }
    }
  ])
  try {
    await mongoose.model(Key.Bootcamp).findByIdAndUpdate(bootcampId, {
      averageCost: obj[0]?.averageCost ? Math.ceil(obj[0].averageCost / 10) * 10 : 0
    })
  } catch (error) {
    if (error instanceof Error) {
      goodlog.error(error.message)
    }
  }
}

CourseSchema.pre('validate', async function (next) {
  if (!this.isModified('title') && this.slug) {
    return next()
  }

  const baseSlug = slugify(this.title, { lower: true, strict: true })
  let   slug     = baseSlug

  const existingSlugs = await (this.constructor as mongoose.Model<ICourseExtended>).distinct('slug', {
    slug: new RegExp(`^${baseSlug}(-[0-9]+)?$`, 'i'),
    _id : { $ne: this._id }
  })

  if (existingSlugs.length > 0) {
    let count = 1
    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${count}`
      count++
    }
  }

  this.slug = slug
  next()
})

CourseSchema.post(Key.Save, async function () {
  await (this.constructor as any as ICourseExtended).getAverageCost(this.bootcamp)
})

CourseSchema.pre(new RegExp(Key.Remove), function (this: ICourse, next: any) {
  ;(this.constructor as any as ICourseExtended).getAverageCost(this.bootcamp)
  next()
})

CourseSchema.index(DATABASE_INDEX.COURSE)

const Course = model(TAG, CourseSchema)
export default Course
