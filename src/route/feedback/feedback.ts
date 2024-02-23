import express from 'express'
import { FeedbackController } from '@controller'
import { advancedResult, protect, authorize } from '@middleware'
import { PathParam } from '@constant/enum'
import { Key } from '@constant/enum'
import { Feedback } from '@model'

const router = express.Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v0.1/feedback
 */
router
  .route(PathParam.F_SLASH)
  .get(
    advancedResult(Feedback, {
      path: Key.BootcampVirtual,
      select: Key.DefaultSelect,
    }),
    FeedbackController.getFeedbacks
  )
  .post(
    protect,
    authorize(Key.Student, Key.Admin),
    FeedbackController.addFeedback
  )

router
  .route(PathParam.ID)
  .get(FeedbackController.getFeedback)
  .put(
    protect,
    authorize(Key.Student, Key.Admin),
    FeedbackController.updateFeedback
  )
  .delete(
    protect,
    authorize(Key.Student, Key.Admin),
    FeedbackController.deleteFeedback
  )

const feedbackRoute = router
export default feedbackRoute
