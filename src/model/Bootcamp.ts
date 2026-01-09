import { App } from '@config'
import slugify from 'slugify'
import goodlog from 'good-logs'
import mongoose, { Schema, model } from 'mongoose'
import { DATABASE_INDEX } from '@db'
import { REGEX, RESPONSE } from '@constant'
import { Key, COLOR, SCHEMA, LOCALE, CareerOptions } from '@constant/enum'

const TAG = Key.Bootcamp

const BootcampSchema: Schema<IBootcamp> = new Schema<IBootcamp>(
  {
    name: {
      type     : String,
      required : [true, SCHEMA.NAME],
      unique   : true,
      trim     : true,
      maxlength: [30, SCHEMA.MAX_LENGTH_NAME]
    },
    slug       : {
      type    : String,
      unique  : true,
      required: true,
      index   : true
    },
    description: {
      type     : String,
      required : [true, SCHEMA.DESCRIPTION],
      maxlength: [250, SCHEMA.MAX_LENGTH_DESCRIPTION]
    },
    website: {
      type : String,
      match: [REGEX.URL, SCHEMA.URL]
    },
    phone: {
      type     : String,
      maxlength: [20, SCHEMA.MAX_LENGTH_PHONE]
    },
    email: {
      type : String,
      match: [REGEX.EMAIL, SCHEMA.EMAIL]
    },
    location: {
        // GeoJSON Point
      type: {
        type: String,
        enum: [SCHEMA.LOCATION_TYPE as string]
      },
      coordinates: {
        type : [Number],
        index: SCHEMA.LOCATION_COORDINATES_INDEX as string
      },
      formattedAddress: String,
      street          : String,
      city            : String,
      state           : String,
      zipcode         : String,
      country         : String
    },
    duration: {
      type    : String,
      required: true
    },
    careers: {
      type    : [String],
      required: true,
      enum    : Object.values(CareerOptions)
    },
    averageCost: {
      type   : Number,
      default: 8000
    },
    photo: {
      type   : String,
      default: SCHEMA.DEFAULT_PHOTO
    },
    badge: {
      type   : String,
      default: SCHEMA.DEFAULT_BADGE
    },
    housing: {
      type   : Boolean,
      default: false
    },
    jobAssistance: {
      type   : Boolean,
      default: false
    },
    jobGuarantee: {
      type   : Boolean,
      default: false
    },
    acceptGi: {
      type   : Boolean,
      default: false
    },
    rating: {
      type   : Number,
      default: 0
    },
    user: {
      type    : Schema.Types.ObjectId,
      ref     : Key.User,
      required: true
    }
  },
  {
    timestamps: true,
    collation : { locale: LOCALE.EN, strength: 2 },
    collection: TAG,
    toJSON    : { virtuals: true },
    toObject  : { virtuals: true }
  }
)

BootcampSchema.statics.getTotalFeedback = async function (bootcampId: Schema.Types.ObjectId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id          : '$bootcamp',
        totalFeedback: { $sum: 1 }
      }
    }
  ])
  try {
    await mongoose.model(Key.Bootcamp).findByIdAndUpdate(bootcampId, {
      totalFeedback: obj[0].totalFeedback
    })
  } catch (error) {
    if (error instanceof Error) {
      goodlog.error(error.message)
    }
  }
}

BootcampSchema.post(Key.Save, function () {
  ;(this.constructor as any as IBootcampExtended).getTotalFeedback(this._id)
})

BootcampSchema.pre(Key.Save, function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

BootcampSchema.pre(Key.Save, async function (next) {
  const loc           = await App.geocoder.geocode(this.address)
        this.location = {
    type            : Key.GeocoderType,
    coordinates     : [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress || '',
    street          : loc[0].streetName || '',
    city            : loc[0].city || '',
    state           : loc[0].stateCode || '',
    zipcode         : loc[0].zipcode || '',
    country         : loc[0].countryCode || ''
  }

  this.address = ''
})

BootcampSchema.pre(new RegExp(Key.Remove), async function (this: IBootcamp, next) {
  goodlog.custom(COLOR.INVERSE, RESPONSE.success.COURSES_DELETED(this.name as string))
  await mongoose.model(Key.Course).deleteMany({ bootcamp: this?._id as Schema.Types.ObjectId })
  next()
})

BootcampSchema.virtual(Key.CourseVirtual, {
  ref         : Key.Course,
  localField  : Key.id,
  foreignField: Key.BootcampVirtual,
  justOne     : false
})

BootcampSchema.virtual(Key.FeedbackVirtual, {
  ref         : Key.Feedback,
  localField  : Key.id,
  foreignField: Key.BootcampVirtual,
  justOne     : false
})

BootcampSchema.index(DATABASE_INDEX.BOOTCAMP)

BootcampSchema.virtual(Key.TotalFeedback, {}).get(function (this: IBootcamp) {
  return this.feedback?.length
})

const Bootcamp = model(TAG, BootcampSchema)
export default Bootcamp
