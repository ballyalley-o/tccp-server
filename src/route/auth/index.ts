import { Application } from 'express'
import { PathDir }     from '@route/dir'
import authRoute       from './auth'
import roleRoute       from './role'
import userRoute       from './user'

const linkAuthRoute = (app: Application) => {
  app.use(PathDir.AUTH_ROLE, roleRoute)
  app.use(PathDir.AUTH_USER, userRoute)
  app.use(PathDir.AUTH, authRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/auth
 */
export { linkAuthRoute }
