import { Application }   from 'express'
import { PathDir }       from '@config/dir.config'
import { AuthRoleRoute } from '@module/auth/auth.role'
import { AuthUserRoute } from '@module/auth/auth.user'
import { AuthRoute }     from '@module/auth'

const registerAuthRoute = (app: Application) => {
  app.use(PathDir.AUTH_ROLE, AuthRoleRoute)
  app.use(PathDir.AUTH_USER, AuthUserRoute)
  app.use(PathDir.AUTH, AuthRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/auth
 */
export { registerAuthRoute }
