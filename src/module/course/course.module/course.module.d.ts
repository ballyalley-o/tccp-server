import type { Types } from 'mongoose'

declare global {
    interface ICourseModule extends IAdminAudit {
        _id        ?: Types.ObjectId
        course      : Types.ObjectId
        title       : string
        labelKey    : string
        description?: string
        order       : number
    }
}

export {}