import { Application }   from 'express'
import { PathDir }       from '@config/dir.config'
import { FeedbackRoute } from '@module/feedback/feedback'

const registerFeedbackRoute = (app: Application) => {
  app.use(PathDir.FEEDBACK, FeedbackRoute)
}

export { registerFeedbackRoute }
