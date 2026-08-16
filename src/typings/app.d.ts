declare global {
    type AppHealthStatus         = 'healthy' | 'degraded' | 'unhealthy'
    type AppUserRoleType         = 'user' | 'trainer' | 'admin'
    type AppUserRoleExtendedType = AppUserRoleType | 'guest'
    type AppEnrollmentType       = 'enrolled' | 'in_progress' | 'completed' | 'dropped'
    type AppThemeType            = 'primary' | 'success' | 'info' | 'warning' | 'error'
    type AppEnvType              = 'production' | 'development' | 'test'
}


export {}