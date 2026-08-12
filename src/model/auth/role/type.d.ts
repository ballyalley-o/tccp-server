import type { Types }          from "mongoose"
import type { PermissionType } from "@constant"

declare global {
    interface IRole {
        name    : string
        label   : string
        metadata: Record<string, any>
        actions : PermissionType[]
    }
}

export {}