import { type Types, Schema, model }     from 'mongoose'
import geocoder                          from '@config/geocoder'
import slugify                           from 'slugify'
import goodlog                           from 'good-logs'
import { MODULE_KEY }                    from '@config/module'
import { DATABASE_INDEX }                from '@db'
import { Key }                           from '@constant'
import { REGEX }                         from '@constant/regex'
import RESPONSE                          from '@constant/response'
import { SCHEMA, LOCALE, CareerOptions } from '@constant/enum'
import Audit                             from '@model/audit/Audit'

const TAG = MODULE_KEY.BOOTCAMP

const BootcampSchema = new Schema<IBootcamp>(
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
      type    : Schema.ObjectId,
      ref     : MODULE_KEY.USER,
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

BootcampSchema.statics.getTotalFeedback = async function (bootcampId: Types.ObjectId) {
  try {
    const [result] = await this.aggregate([
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

    await model(TAG).findByIdAndUpdate(bootcampId, {
      totalFeedback: result?.totalFeedback ?? 0
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

// Set slug before validation so required validator for slug passes
BootcampSchema.pre('validate', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

BootcampSchema.pre(Key.Save, async function (_next) {
  // Only geocode when an address is provided to avoid network calls in tests
  if (!this.address) {
    this.address = ''
    return
  }

  const loc = await geocoder.geocode(this.address)
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
  goodlog.custom('inverse', RESPONSE.success.COURSES_DELETED(this.name as string))
  await model(MODULE_KEY.COURSE).deleteMany({ bootcamp: this?._id as Types.ObjectId })
  next()
})

BootcampSchema.virtual(Key.CourseVirtual, {
  ref         : MODULE_KEY.COURSE,
  localField  : Key.id,
  foreignField: Key.BootcampVirtual,
  justOne     : false
})

BootcampSchema.virtual(Key.FeedbackVirtual, {
  ref         : MODULE_KEY.FEEDBACK,
  localField  : Key.id,
  foreignField: Key.BootcampVirtual,
  justOne     : false
})

BootcampSchema.index(DATABASE_INDEX.BOOTCAMP)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BootcampSchema.add(Audit.obj)

BootcampSchema.virtual(Key.TotalFeedback, {}).get(function (this: IBootcamp) {
  return this.feedback?.length
})

const Bootcamp = model(TAG, BootcampSchema)
export default Bootcamp
