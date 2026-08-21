import type { Types }          from "mongoose"
import type { PermissionType } from "@common/constant"

declare global {
    interface IAuthRole {
        name    : string
        label   : string
        metadata: Record<string, any>
        actions : PermissionType[]
    }
}

export {}