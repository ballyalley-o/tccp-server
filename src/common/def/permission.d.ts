import { ACTION } from "@config/module.config"

declare global {
    type ActionType     = (typeof ACTION)[number]
    type PermissionType = `${ActionType}:${ResourceType | 'any'}`
}

export {}
