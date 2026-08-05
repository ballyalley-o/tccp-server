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
  createdBy : Schema.Types.ObjectId
  updatedBy : Schema.Types.ObjectId
  isArchived: boolean
  isActive  : boolean
}

declare interface IUser {
  _id                                   ?: Mongoose.Schema.Types.ObjectId
  firstname                              : string
  lastname                               : string
  email                                  : string
  role                                   : Schema.Types.ObjectId
  password                               : string
  location                               : string
  username                               : string
  avatar                                 : string
  cohort                                 : Schema.Types.ObjectId
  progress                               : Schema.Types.ObjectId
  organization                          ?: string
  resetPasswordToken                     : string
  resetPasswordExpire                    : Date
  getSignedJwtToken()                    : string
  getResetPasswordToken()                : string
  matchPassword(enteredPassword: string) : Promise<boolean>
}

declare interface IFeedback {
  title   : string
  body    : string
  rating  : number
  bootcamp: Schema.Types.ObjectId
  user    : Schema.Types.ObjectId
}

declare interface IFeedbackExtended extends IFeedback {
  getAverageRating: (bootcampId: Schema.Types.ObjectId) => Promise<void>
}

declare interface ILearningEvent {
  _id       ?: Mongoose.Schema.Types.ObjectId
  user       : Schema.Types.ObjectId
  course    ?: Schema.Types.ObjectId
  bootcamp  ?: Schema.Types.ObjectId
  eventType  : string
  occurredAt : Date
  metadata  ?: Record<string, any>
  source    ?: string
}

declare interface ICategory {
  _id      ?: Mongoose.Schema.Types.ObjectId
  name      : string
  createdBy : Schema.Types.ObjectId
}

declare interface ISkill {
  _id      ?: Mongoose.Schema.Types.ObjectId
  name      : string
  course    : Schema.Types.ObjectId
  category  : Schema.Types.ObjectId
  createdBy : Schema.Types.ObjectId
  metadata ?: Record<string, any>
}


declare interface ICourse extends Document {
  title               : string
  description         : string
  duration            : string
  tuition             : number
  minimumSkill        : string
  scholarshipAvailable: boolean
  slug                : string
  skills              : Schema.Types.ObjectId[]
  modules             : Schema.Types.ObjectId[]
  bootcamp            : Schema.Types.ObjectId
  user                : Schema.Types.ObjectId
  trainer             : Schema.Types.ObjectId
}

declare interface ICourseExtended extends ICourse {
  getAverageCost(bootcampId: Schema.Types.ObjectId): Promise<void>
}

declare interface ILearningEvent {
  _id       ?: Mongoose.Schema.Types.ObjectId
  user       : Schema.Types.ObjectId
  course    ?: Schema.Types.ObjectId
  bootcamp  ?: Schema.Types.ObjectId
  eventType  : string
  occurredAt : Date
  metadata  ?: Record<string, any>
  source    ?: string
}


declare interface ISkillCategory {
  _id        ?: Mongoose.Schema.Types.ObjectId
  name        : string
  labelKey    : string
  description?: string
  slug        : string
  order       : number
}

declare interface ISkill {
  _id        ?: Mongoose.Schema.Types.ObjectId
  name        : string
  labelKey    : string
  description?: string
  category    : Schema.Types.ObjectId
  slug        : string
  order       : number
}

declare interface ICourseModule {
  _id        ?: Mongoose.Schema.Types.ObjectId
  course      : Schema.Types.ObjectId
  title       : string
  labelKey    : string
  description?: string
  order       : number
}

declare interface ICourseLecture {
  _id            ?: Mongoose.Schema.Types.ObjectId
  course          : Schema.Types.ObjectId
  module          : Schema.Types.ObjectId
  title           : string
  labelKey        : string
  description    ?: string
  content        ?: string
  resources      ?: string[]
  durationMinutes : number
  order           : number
}

declare interface ICourseQuizQuestion {
  prompt  : string
  type   ?: string
  options?: string[]
  answer ?: any
  points ?: number
}

declare interface ICourseQuiz {
  _id         ?: Mongoose.Schema.Types.ObjectId
  course       : Schema.Types.ObjectId
  module       : Schema.Types.ObjectId
  title        : string
  labelKey     : string
  description ?: string
  questions    : ICourseQuizQuestion[]
  passingScore : number
  order        : number
}

declare interface IBootcamp {
  _id        : Mongoose.Schema.Types.ObjectId
  name       : string
  slug       : string
  description: string
  website    : string
  phone      : string
  email      : string
  address    : string
  location   : {
    type            : string
    coordinates     : [number | undefined, number | undefined]
    formattedAddress: string
    street          : string
    city            : string
    state           : string
    zipcode         : string
    country         : string
  }
  careers      : [string]
  duration     : string
  averageCost  : number
  photo        : string
  badge        : string
  housing      : boolean
  jobAssistance: boolean
  jobGuarantee : boolean
  acceptGi     : boolean
  rating       : number
  totalFeedback: number
  feedback     : [Schema.Types.ObjectId]
  course       : Schema.Types.ObjectId
  user         : Schema.Types.ObjectId
}

declare interface IBootcampExtended extends IBootcamp {
  getTotalFeedback(bootcampId: Schema.Types.ObjectId): Promise<void>
}
