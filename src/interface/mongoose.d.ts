declare global {
  namespace Mongoose {
    interface Schema {
      Types: {
        ObjectId: any
      }
    }
  }
}

type Model = IBootcamp | IUser | IDefault | ICourse | ICourseExtended | IFeedback | IFeedbackExtended

declare interface IDefault {
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
  isArchived: boolean
  isActive: boolean
}

declare interface IUser {
  _id?: Mongoose.Schema.Types.ObjectId
  firstname: string
  lastname: string
  email: string
  role: Schema.Types.ObjectId
  password: string
  location: string
  username: string
  avatar: string
  cohort: Schema.Types.ObjectId
  progress: Schema.Types.ObjectId
  organization?: string
  resetPasswordToken: string
  resetPasswordExpire: Date
  getSignedJwtToken(): string
  getResetPasswordToken(): string
  matchPassword(enteredPassword: string): Promise<boolean>
}

declare interface IFeedback {
  title: string
  body: string
  rating: number
  createdAt: Date
  bootcamp: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
}

declare interface IFeedbackExtended extends IFeedback {
  getAverageRating: (bootcampId: Schema.Types.ObjectId) => Promise<void>
}

declare interface ICourse extends Document {
  title: string
  description: string
  duration: string
  tuition: number
  minimumSkill: string
  scholarshipAvailable: boolean
  bootcamp: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
}

declare interface ICourseExtended extends ICourse {
  getAverageCost(bootcampId: Schema.Types.ObjectId): Promise<void>
}

declare interface IBootcamp {
  _id: Mongoose.Schema.Types.ObjectId
  name: string
  slug: string
  description: string
  website: string
  phone: string
  email: string
  address: string
  location: {
    type: string
    coordinates: [number | undefined, number | undefined]
    formattedAddress: string
    street: string
    city: string
    state: string
    zipcode: string
    country: string
  }
  careers: [string]
  duration: string
  averageRating: number
  averageCost: number
  photo: string
  badge: string
  housing: boolean
  jobAssistance: boolean
  jobGuarantee: boolean
  acceptGi: boolean
  createdAt: Date
  course: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
}
