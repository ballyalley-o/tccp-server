import { ACTION } from "@config/permission"

declare global{
    type ActionType     = (typeof ACTION)[number]
    type PermissionType = `${ActionType}:${ResourceType}`
}

export {}