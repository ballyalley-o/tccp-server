import type { Types }                                       from "mongoose"
import { type CourseEventSourceType, type CourseEventType } from '@common/constant'

declare global {
    interface ICourseEvent extends IAdminAudit {
        _id       ?: Types.ObjectId
        user       : Types.ObjectId
        course    ?: Types.ObjectId
        bootcamp  ?: Types.ObjectId
        eventType  : CourseEventType
        occurredAt : Date
        metadata  ?: Record<string, any>
        source    ?: CourseEventSourceType
    }
}
export {}