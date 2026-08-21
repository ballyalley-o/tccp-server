import { Application }      from 'express'
import { PathDir }          from '@config/dir.config'
import { AdminSystemRoute } from '@module/admin/admin.system'

const registerAdminRoute = (app: Application) => {
  app.use(PathDir.SYSTEM, AdminSystemRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/admin
 */
export { registerAdminRoute }
