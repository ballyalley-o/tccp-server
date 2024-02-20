import { linkUserRoute } from '@route/user'
import { linkBootcampRoute } from '@route/bootcamp'
import { linkFeedbackRoute } from '@route/feedback'
import { linkCourseRoute } from '@route/course'
import { Application } from 'express'

const mainRoute = (app: Application) => {
  linkUserRoute(app)
  linkBootcampRoute(app)
  linkFeedbackRoute(app)
  linkCourseRoute(app)
}

export { mainRoute }
