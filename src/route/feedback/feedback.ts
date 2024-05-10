import express from 'express'
import { FeedbackController, bootcampController } from '@controller'
import { advancedResult, protect, authorize } from '@middleware'
import { PathParam } from '@constant/enum'
import { Key } from '@constant/enum'
import { Feedback } from '@model'

const router = express.Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v{apiVer}/feedback
 */
router
  .route(PathParam.F_SLASH)
  .get(
    advancedResult(Feedback, [
      {
        path: Key.BootcampVirtual,
        select: Key.DefaultSelect
      },
      {
        path: Key.UserVirtual,
        select: 'firstname email role'
      }
    ]),
    FeedbackController.getFeedbacks
  )
  // .post(protect, authorize(Key.Student, Key.Admin), bootcampController.createBootcampFeedback)
  .post(protect, authorize(Key.Student, Key.Admin), FeedbackController.addFeedback)

router
  .route(PathParam.ID)
  .get(FeedbackController.getFeedback)
  .put(protect, authorize(Key.Student, Key.Admin), FeedbackController.updateFeedback)
  .delete(protect, authorize(Key.Student, Key.Admin), FeedbackController.deleteFeedback)

const feedbackRoute = router
export default feedbackRoute
