import { Types, Schema, model, type Model } from 'mongoose'
import goodlog                              from 'good-logs'
import slugify                              from 'slugify'
import { MODULE_KEY }                       from '@config/module'
import { DATABASE_INDEX }                   from '@db'
import { SCHEMA, LOCALE, MinimumSkill }     from '@constant/enum'
import Audit                                from '@model/audit/Audit'

const TAG = MODULE_KEY.COURSE

const CourseSchema = new Schema<ICourseExtended>(
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
        ref : MODULE_KEY.SKILL
      }],
      default: []
    },
    modules: {
      type: [{
        type: Schema.Types.ObjectId,
        ref : MODULE_KEY.COURSE_MODULE
      }],
      default: []
    },
    scholarshipAvailable: {
      type   : Boolean,
      default: false
    },
    bootcamp: {
      type    : Schema.ObjectId,
      ref     : MODULE_KEY.BOOTCAMP,
      required: true
    },
    user: {
      type    : Schema.ObjectId,
      ref     : MODULE_KEY.USER,
      required: true
    },
    trainer: {
      type    : Schema.ObjectId,
      ref     : MODULE_KEY.USER,
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

CourseSchema.statics.getAverageCost = async function (bootcampId: Types.ObjectId): Promise<void> {
  const bootcampObjectId = Types.ObjectId.isValid(String(bootcampId))
    ? new Types.ObjectId(String(bootcampId))
    : bootcampId

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampObjectId }
    },
    {
      $group: {
        _id        : '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ])
  try {
    await model(MODULE_KEY.BOOTCAMP).findByIdAndUpdate(bootcampId, {
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

  const existingSlugs = await (this.constructor as Model<ICourseExtended>).distinct('slug', {
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

CourseSchema.post('save', async function () {
  await (this.constructor as any as ICourseExtended).getAverageCost(this.bootcamp)
})

CourseSchema.pre(new RegExp('remove'), function (this: ICourse, next: any) {
  ;(this.constructor as any as ICourseExtended).getAverageCost(this.bootcamp)
  next()
})

CourseSchema.index(DATABASE_INDEX.COURSE)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
CourseSchema.add(Audit.obj)

const Course = model(TAG, CourseSchema)
export default Course
