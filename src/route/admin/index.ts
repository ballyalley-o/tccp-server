import { Application } from 'express'
import { PathDir } from '@route/dir'
import systemRoute from '@route/admin/system/system'

const linkAdminRoute = (app: Application) => {
  app.use(PathDir.SYSTEM, systemRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/admin/system
 */
export { linkAdminRoute }
