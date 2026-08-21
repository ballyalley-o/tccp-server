import { Application }    from 'express'
import { PathDir }        from '@config/dir.config'
import { DashboardRoute } from '@module/dashboard/dashboard'

const registerDashboardRoute = (app: Application) => {
  app.use(PathDir.DASHBOARD, DashboardRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/dashboard
 */
export { registerDashboardRoute }
