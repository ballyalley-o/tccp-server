import { Document, Schema } from 'mongoose'

interface ICourse extends Document {
  title: string
  description: string
  weeks: string
  tuition: number
  minimumSkill: string
  scholarshipAvailable: boolean
  bootcamp: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
}

interface ICourseExtended extends ICourse {
  getAverageCost(bootcampId: Schema.Types.ObjectId): Promise<void>
}

export { ICourse, ICourseExtended }
