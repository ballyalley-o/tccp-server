import { linkUserRoute } from '@route/user'
import { linkBootcampRoute } from '@route/bootcamp'
import { linkFeedbackRoute } from '@route/feedback'
import { linkCourseRoute } from '@route/course'
import { linkAuthRoute } from './auth'
import { Application } from 'express'

const mainRoute = (app: Application) => {
  linkAuthRoute(app)
  linkUserRoute(app)
  linkBootcampRoute(app)
  linkFeedbackRoute(app)
  linkCourseRoute(app)
}

export { mainRoute }
