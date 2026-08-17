import { Application }         from 'express'
import { linkAuthRoute }       from './auth'
import { linkBootcampRoute }   from './bootcamp'
import { linkCourseRoute }     from './course'
import { linkDashboardRoute }  from './dashboard'
import { linkEnrollmentRoute } from './enrollment'
import { linkFeedbackRoute }   from './feedback'
import { linkSkillRoute }      from './skill'
import { linkAdminRoute }      from './admin'

const mainRoute = (app: Application) => {
  linkAuthRoute(app)
  linkBootcampRoute(app)
  linkFeedbackRoute(app)
  linkCourseRoute(app)
  linkEnrollmentRoute(app)
  linkDashboardRoute(app)
  linkSkillRoute(app)
  linkAdminRoute(app)
}

/**
 * @path - {baseUrl}/api/{apiVer}/...
 */
export { mainRoute }
