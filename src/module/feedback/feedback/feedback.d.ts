import type { Types } from 'mongoose'

declare global {
    interface IFeedback {
        title   : string
        body    : string
        rating  : number
        bootcamp: Types.ObjectId
        user    : Types.ObjectId
    }

    interface IFeedbackExtended extends IFeedback {
        getAverageRating: (bootcampId: Types.ObjectId) => Promise<void>
    }
}
export {}