import { App } from '@config'
import slugify from 'slugify'
import goodlog from 'good-logs'
import mongoose, { Schema, model } from 'mongoose'
import { IBootcamp } from '@interface/model'
import { REGEX, RESPONSE, DATABASE_INDEX } from '@constant'
import { Key, COLOR, SCHEMA, LOCALE, CareerOptions } from '@constant/enum'

const TAG = Key.Bootcamp

const BootcampSchema = new Schema<IBootcamp>(
  {
    name: {
      type: String,
      required: [true, SCHEMA.NAME],
      unique: true,
      trim: true,
      maxlength: [50, SCHEMA.MAX_LENGTH_NAME],
      validate: {
        validator: function (v: string) {
          return v.length <= 50
        },
        message: (props) => `Name length (${props.value.length}) exceeds the limit of 50 characters`
      }
    },
    slug: String,
    description: {
      type: String,
      required: [true, SCHEMA.DESCRIPTION],
      maxlength: [250, SCHEMA.MAX_LENGTH_DESCRIPTION],
      validate: {
        validator: function (v: string) {
          return v.length <= 250
        },
        message: (props) => `Description length (${props.value.length}) exceeds the limit of 250 characters`
      }
    },
    website: {
      type: String,
      match: [REGEX.URL, SCHEMA.URL],
      validate: {
        validator: function (v: string) {
          return v.startsWith('http://') || v.startsWith('https://')
        },
        message: (props) => `Invalid URL: ${props.value}`
      }
    },
    phone: {
      type: String,
      maxlength: [20, SCHEMA.MAX_LENGTH_PHONE]
    },
    email: {
      type: String,
      match: [REGEX.EMAIL, SCHEMA.EMAIL]
    },
    address: {
      type: String,
      required: [true, SCHEMA.ADDRESS]
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: [SCHEMA.LOCATION_TYPE as string]
      },
      coordinates: {
        type: [Number],
        index: SCHEMA.LOCATION_COORDINATES_INDEX as string
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    duration: {
      type: String,
      required: true
    },
    careers: {
      type: [String],
      required: true,
      enum: Object.values(CareerOptions)
    },
    averageRating: {
      type: Number,
      min: [1, SCHEMA.AVERAGE_RATING_MIN],
      max: [10, SCHEMA.AVERAGE_RATING_MAX],
      validate: {
        validator: function (v: number) {
          return v >= 1 && v <= 10
        },
        message: (props) => `Rating must be between 1 and 10`
      }
    },
    averageCost: Number,
    photo: {
      type: String,
      default: SCHEMA.DEFAULT_PHOTO
    },
    badge: {
      type: String,
      default: SCHEMA.DEFAULT_BADGE
    },
    housing: {
      type: Boolean,
      default: false
    },
    jobAssistance: {
      type: Boolean,
      default: false
    },
    jobGuarantee: {
      type: Boolean,
      default: false
    },
    acceptGi: {
      type: Boolean,
      default: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: Key.User,
      required: true
    }
  },
  {
    timestamps: true,
    collation: { locale: LOCALE.EN, strength: 2 },
    collection: TAG,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

BootcampSchema.pre(Key.Save, function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

BootcampSchema.pre(Key.Save, async function (next) {
  const loc = await App.geocoder.geocode(this.address)
  this.location = {
    type: Key.GeocoderType,
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress || '',
    street: loc[0].streetName || '',
    city: loc[0].city || '',
    state: loc[0].stateCode || '',
    zipcode: loc[0].zipcode || '',
    country: loc[0].countryCode || ''
  }

  this.address = ''
})

BootcampSchema.pre(new RegExp(Key.Remove), async function (this: IBootcamp, next) {
  goodlog.custom(COLOR.INVERSE, RESPONSE.success.COURSES_DELETED(this.name as string))
  await mongoose.model(Key.Course).deleteMany({ bootcamp: this?._id as Schema.Types.ObjectId })
  next()
})

BootcampSchema.virtual(Key.CourseVirtual, {
  ref: Key.Course,
  localField: Key.id,
  foreignField: Key.BootcampVirtual,
  justOne: false
})

BootcampSchema.index(DATABASE_INDEX.BOOTCAMP)

const Bootcamp = model(TAG, BootcampSchema)
export default Bootcamp
