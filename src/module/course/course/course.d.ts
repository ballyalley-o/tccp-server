import type { Types } from "mongoose"

declare global {
    interface ICourse extends IAdminAudit {
        title               : string
        description         : string
        duration            : string
        tuition             : number
        minimumSkill        : string
        scholarshipAvailable: boolean
        slug                : string
        skills              : Types.ObjectId[]
        modules             : Types.ObjectId[]
        bootcamp            : Types.ObjectId
        user                : Types.ObjectId
        trainer             : Types.ObjectId
    }

    interface ICourseExtended extends ICourse {
        getAverageCost(bootcampId: Types.ObjectId): Promise<void>
    }
}
export {}