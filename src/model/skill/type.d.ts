import type { Types } from 'mongoose'

declare global {
    interface ISkill {
        _id        ?: Types.ObjectId
        name        : string
        labelKey    : string
        description?: string
        category    : Types.ObjectId
        slug        : string
        order       : number
    }
}

export {}