import express from 'express'
import { feedbackController } from '@controller'
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
    feedbackController.getFeedbacks
  )
  .post(
    protect,
    authorize(Key.Student, Key.Admin),
    feedbackController.addFeedback
  )

router
  .route(PathParam.ID)
  .get(feedbackController.getFeedback)
  .put(
    protect,
    authorize(Key.Student, Key.Admin),
    feedbackController.updateFeedback
  )
  .delete(
    protect,
    authorize(Key.Student, Key.Admin),
    feedbackController.deleteFeedback
  )

const feedbackRoute = router
export default feedbackRoute
