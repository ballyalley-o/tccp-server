import type { Types } from 'mongoose'

declare global {
    export interface ICourseQuizQuestion {
        prompt  : string
        type   ?: string
        options?: string[]
        answer ?: any
        points ?: number
    }

    export interface ICourseQuiz extends IAdminAudit {
        _id         ?: Types.ObjectId
        course       : Types.ObjectId
        module       : Types.ObjectId
        title        : string
        labelKey     : string
        description ?: string
        questions    : ICourseQuizQuestion[]
        passingScore : number
        order        : number
    }
}

export {}