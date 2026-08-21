import type { Types } from 'mongoose'

declare global {
        interface ICourseLecture extends IAdminAudit {
            _id            ?: Types.ObjectId
            course          : Types.ObjectId
            module          : Types.ObjectId
            title           : string
            labelKey        : string
            description    ?: string
            content        ?: string
            resources      ?: string[]
            durationMinutes : number
            order           : number
    }
}
export {}