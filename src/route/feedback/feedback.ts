import express from 'express'
import { FeedbackController, bootcampController } from '@controller'
import { advancedResult, protect, authorize } from '@middleware'
import * as PathParam from '@route/dir'
import { Key } from '@constant/enum'
import { Feedback } from '@model'

const router = express.Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v{apiVer}/feedback
 */
router
  .route(PathParam.ROOT)
  .get(
    advancedResult(Feedback, [
      {
        path  : Key.BootcampVirtual,
        select: Key.DefaultSelect
      },
      {
        path  : Key.UserVirtual,
        select: 'firstname email role'
      }
    ]),
    FeedbackController.getFeedbacks
  )
  .post(protect, authorize('user', 'admin'), FeedbackController.addFeedback)

router
  .route(PathParam.ID)
  .get(FeedbackController.getFeedback)
  .put(protect, authorize('user', 'admin'), FeedbackController.updateFeedback)
  .delete(protect, authorize('user', 'admin'), FeedbackController.deleteFeedback)

export default router
