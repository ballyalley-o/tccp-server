const _RESOURCE = [
    'user',
    'role',
    'dashboard',
    'bootcamp',
    'course',
    'course-lecture',
    'course-module',
    'course-quiz',
    'skill',
    'skill-category',
    'enrollment',
    'feedback',
    'audit_log',
    'setting',
    'any'
] as const

const _ACTION = [
    'create',
    'read',
    'update',
    'delete',
    'view',
    'manage',
    'suspend',
    'restore',
    'archive',
    'reset',
    'change',
    'force'
] as const

type ResourceType = typeof _RESOURCE[number]
type ActionType   = typeof _ACTION[number]

export type PermissionType = `${ActionType}:${ResourceType}`
export const PERMISSION: PermissionType[] = _RESOURCE.flatMap(resource => _ACTION.map(action => `${action}:${resource}` as PermissionType))