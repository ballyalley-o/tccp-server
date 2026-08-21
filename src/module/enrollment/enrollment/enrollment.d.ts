import type { Types }                from 'mongoose'
import type { EnrollmentStatusType } from '@common/constant/enum'

declare global {
    interface IEnrollment {
        _id           ?: Types.ObjectId
        user           : Types.ObjectId
        bootcamp       : Types.ObjectId
        course         : Types.ObjectId
        status         : EnrollmentStatusType
        progress       : number
        startDate      : Date
        completedAt    : Date
        lastAccessedAt : Date
    }
}

export {}