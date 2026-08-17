import { Application } from 'express'
import { PathDir } from '@route/dir'
import systemRoute from '@route/admin/system/system'

const linkSystemRoute = (app: Application) => {
  app.use(PathDir.SYSTEM, systemRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/system
 */
export { linkSystemRoute }
