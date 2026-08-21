import { Application }             from 'express'
import { registerAuthRoute }       from './auth'
import { registerBootcampRoute }   from './bootcamp'
import { registerCourseRoute }     from './course'
import { registerDashboardRoute }  from './dashboard'
import { registerEnrollmentRoute } from './enrollment'
import { registerFeedbackRoute }   from './feedback'
import { registerSkillRoute }      from './skill'
import { registerAdminRoute }      from './admin'

const mainRoute = (app: Application) => {
  registerAuthRoute(app)
  registerBootcampRoute(app)
  registerFeedbackRoute(app)
  registerCourseRoute(app)
  registerEnrollmentRoute(app)
  registerDashboardRoute(app)
  registerSkillRoute(app)
  registerAdminRoute(app)
}

/**
 * @path - {baseUrl}/api/{apiVer}/...
 */
export { mainRoute }
