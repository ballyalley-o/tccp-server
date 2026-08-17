import { ACTION } from "@config/permission.config"

declare global{
    type ActionType     = (typeof ACTION)[number]
    type PermissionType = `${ActionType}:${ResourceType | 'any'}`
}

export {}