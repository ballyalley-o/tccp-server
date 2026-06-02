import { Application } from 'express'
import { PathDir } from '@route/dir'
import feedbackRoute from '@route/feedback/feedback'

const linkFeedbackRoute = (app: Application) => {
  app.use(PathDir.FEEDBACK, feedbackRoute)
}

export { linkFeedbackRoute }
