export const USER_STATUS                         = ['active', 'suspended', 'archived', 'pending_deletion', 'deleted'] as const
export type UserStatusType                       = (typeof USER_STATUS)[number]
export const DEFAULT_USER_STATUS: UserStatusType = 'active'