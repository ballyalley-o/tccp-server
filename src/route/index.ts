import { Application } from 'express'
import { linkUserRoute } from './user'
import { linkBootcampRoute } from './bootcamp'
import { linkFeedbackRoute } from './feedback'
import { linkCourseRoute } from './course'
import { linkAuthRoute } from './auth'
import { linkSystemRoute } from './system'
import { linkEnrollmentRoute } from './enrollment'
import { linkDashboardRoute } from './dashboard'

const mainRoute = (app: Application) => {
  linkAuthRoute(app)
  linkUserRoute(app)
  linkBootcampRoute(app)
  linkFeedbackRoute(app)
  linkCourseRoute(app)
  linkSystemRoute(app)
  linkEnrollmentRoute(app)
  linkDashboardRoute(app)
}

export { mainRoute }
