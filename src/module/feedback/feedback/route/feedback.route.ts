import express                          from 'express'
import { Feedback, FeedbackController } from '@module/feedback'
import { MODULE }                       from '@config/module.config'
import { PathDir }                      from '@config/dir.config'
import { advancedResult }               from '@common/middleware'
import { authorizeAction }              from '@common/security/guard'
import { protect }                      from '@common/security/protect'

const router = express.Router({ mergeParams: true })

router
  .route(PathDir.ROOT)
  .get(
    advancedResult(Feedback, [
      {
        path  : MODULE.Bootcamp.name,
        select: 'name description'
      },
      {
        path  : MODULE.Auth.submodule.AuthUser.name,
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

/**
 * @path - {baseUrl}/api/{apiVer}/feedback/...
 */
export default router
