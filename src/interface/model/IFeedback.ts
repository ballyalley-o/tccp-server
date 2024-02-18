import { Schema } from 'mongoose'

interface IFeedback {
  title: string
  body: string
  rating: number
  createdAt: Date
  bootcamp: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
}

interface IFeedbackExtended extends IFeedback {
  getAverageRating: (bootcampId: Schema.Types.ObjectId) => Promise<void>
}

export { IFeedback, IFeedbackExtended }
