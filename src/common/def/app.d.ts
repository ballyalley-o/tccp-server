declare global {
    type AppHealthStatus         = 'healthy' | 'degraded' | 'unhealthy'
    type AppUserRoleType         = 'user' | 'trainer' | 'admin'
    type AppUserRoleExtendedType = AppUserRoleType | 'guest'
    type AppEnrollmentType       = 'enrolled' | 'in_progress' | 'completed' | 'dropped'
    type AppLocaleLangType       = 'en' | 'th' | 'ja' | 'kr' | 'cn' | 'vn' | 'fr' | 'de'
    type AppThemeType            = 'primary' | 'success' | 'info' | 'warning' | 'error'
    type AppEnvType              = 'production' | 'development' | 'test'
    type AppVariantType          = 'contained' | 'outlined' | 'text'

    interface IAppDbTarget {
        isConnected  : boolean
        [key: string]: any
    }

    interface IAppUrlBuilder {
        (base: string, ...parts: string[])
    }
}


export {}