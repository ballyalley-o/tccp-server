import express                 from 'express'
import { FeedbackController  } from '@controller'
import { advancedResult }      from '@middleware'
import { Feedback }            from '@model'
import { Key }                 from '@constant/enum'
import { PathDir }             from '@route/dir'
import { protect, authorizeAction }  from '@route/guard'

const router = express.Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v{apiVer}/feedback
 */
router
  .route(PathDir.ROOT)
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
  .post(protect, authorizeAction('create:feedback'), FeedbackController.addFeedback)

router
  .route(PathDir.ID)
  .get(FeedbackController.getFeedback)
  .put(protect, authorizeAction('update:feedback'), FeedbackController.updateFeedback)
  .delete(protect, authorizeAction('delete:feedback'), FeedbackController.deleteFeedback)

export default router
