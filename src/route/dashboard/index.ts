import { Application } from 'express'
import { PathDir } from '@route/dir'
import dashboardRoute from './dashboard'

const linkDashboardRoute = (app: Application) => {
  app.use(PathDir.DASHBOARD, dashboardRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/dashboard
 */
export { linkDashboardRoute }
