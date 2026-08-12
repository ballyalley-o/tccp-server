import type { Types }                                           from "mongoose"
import { type LearningEventSourceType, type LearningEventType } from '@constant/enum'

declare global {
    interface ILearningEvent {
        _id       ?: Types.ObjectId
        user       : Types.ObjectId
        course    ?: Types.ObjectId
        bootcamp  ?: Types.ObjectId
        eventType  : LearningEventType
        occurredAt : Date
        metadata  ?: Record<string, any>
        source    ?: LearningEventSourceType
    }
}
export {}