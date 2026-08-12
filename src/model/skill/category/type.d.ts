import type { Types } from 'mongoose'

declare global {
    interface ISkillCategory {
        _id        ?: Schema.Types.ObjectId
        name        : string
        labelKey    : string
        description?: string
        slug        : string
        order       : number
    }
}

export {}