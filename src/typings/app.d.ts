declare type AppHealthStatus         = 'healthy' | 'degraded' | 'unhealthy'
declare type AppUserRoleType         = 'user' | 'trainer' | 'admin'
declare type AppUserRoleExtendedType = AppUserRoleType | 'guest'
declare type AppEnrollmentType       = 'enrolled' | 'in_progress'| 'completed' | 'dropped'