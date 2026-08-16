import express                      from 'express'
import { MODULE }                   from '@config/module.config'
import { FeedbackController  }      from '@controller'
import { advancedResult }           from '@middleware'
import { Feedback }                 from '@model'
import { PathDir }                  from '@route/dir'
import { protect, authorizeAction } from '@route/guard'

const router = express.Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/{apiVer}/feedback
 */
router
  .route(PathDir.ROOT)
  .get(
    advancedResult(Feedback, [
      {
        path  : MODULE.Bootcamp.name,
        select: 'name description'
      },
      {
        path  : MODULE.Auth.submodule.User.name,
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
