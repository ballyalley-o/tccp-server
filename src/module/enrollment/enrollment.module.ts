import { Application }     from 'express'
import { PathDir }         from '@config/dir.config'
import { EnrollmentRoute } from '@module/enrollment/enrollment'

const registerEnrollmentRoute = (app: Application) => {
  app.use(PathDir.ENROLLMENT, EnrollmentRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/enrollment
 */
export { registerEnrollmentRoute }
