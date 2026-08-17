import { Application } from 'express'
import { PathDir }     from '@route/dir'
import enrollmentRoute from '@route/enrollment/enrollment'

const linkEnrollmentRoute = (app: Application) => {
  app.use(PathDir.ENROLLMENT, enrollmentRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/enrollment
 */
export { linkEnrollmentRoute }
