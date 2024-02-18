import slugify from 'slugify'
import logger from 'logger'
import mongoose, { Schema, model } from 'mongoose'
import { IBootcamp } from '@interface/model'
import { Key } from '@constant/enum'
import { geocoder } from '@config/app-config'

const TAG = Key.Bootcamp

const BootcampSchema = new Schema<IBootcamp>(
  {
    name: {
      type: String,
      required: [true, 'Please add a bootcamp name/title'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    duration: {
      type: String,
      required: true,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Software Engineering',
        'FRONT-END Web Development',
        'BACK-END Web Development',
        'FULL_STACK Web Development',
        'Dev Ops',
        'Web Design & Development',
        'Data Science Program',
        'Software QA',
        'Mastering Web Designing',
        'Android App Web Development',
        'Meta',
        'IBM Data Science',
        'Apple iOS Web Apps Development',
        'Back-end',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.ObjectId,
      ref: Key.User,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

//Create bootcamp slug from the bootcamp title
BootcampSchema.pre(Key.Save, function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

//Geocode & create location field
BootcampSchema.pre(Key.Save, async function (next) {
  const loc = await geocoder.geocode(this.address)
  this.location = {
    type: Key.GeocoderType,
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress || '',
    street: loc[0].streetName || '',
    city: loc[0].city || '',
    state: loc[0].stateCode || '',
    zipcode: loc[0].zipcode || '',
    country: loc[0].countryCode || '',
  }

  this.address = ''
})

BootcampSchema.pre(
  new RegExp(Key.Remove),
  async function (this: IBootcamp, next) {
    logger.custom(
      'inverse',
      `Courses being deleted from bootcamp ID: ${this.name}. Reload page to see the effect`
    )
    await mongoose
      .model(Key.Course)
      .deleteMany({ bootcamp: this?._id as Schema.Types.ObjectId })
    next()
  }
)

BootcampSchema.virtual(Key.CourseVirtual, {
  ref: Key.Course,
  localField: Key.id,
  foreignField: Key.BootcampVirtual,
  justOne: false,
})

const Bootcamp = model(TAG, BootcampSchema)
export default Bootcamp
