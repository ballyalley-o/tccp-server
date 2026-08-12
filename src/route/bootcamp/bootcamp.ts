import express                from 'express'
import { bootcampController } from '@controller'
import { advancedResult }     from '@middleware'
import { Bootcamp }           from '@model'
import { protect, authorizeAction } from '@route/guard'
import courseRoute            from '@route/course/course'
import feedbackRoute          from '@route/feedback/feedback'
import { PathDir }            from '@route/dir'

const router = express.Router()

/**
 * @path - {baseUrl}/api/v{verNo}/bootcamp
 */
router.use(PathDir.REDIR_COURSE, courseRoute)
router.use(PathDir.REDIR_FEEDBACK, feedbackRoute)

router.route(PathDir.GET_DISTANCE).get(bootcampController.getBootcampsInRadius)
router
  .route(PathDir.ROOT)
  .get(
    advancedResult(Bootcamp, [
      {
        path  : 'user',
        select: 'firstname email role'
      },
      {
        path  : 'course',
        select: 'title duration tuition'
      },
      {
        path  : 'feedback',
        select: 'title rating user'
      }
    ]),
    bootcampController.getBootcamps
  )
  .post(protect, authorizeAction('create:bootcamp'), bootcampController.createBootcamp)
router.route(PathDir.CREATE).post(protect, authorizeAction('create:bootcamp'), bootcampController.createBootcamp)

router.get(PathDir.TOP, bootcampController.getTopBootcamps)
router
  .route(PathDir.SLUG)
  .get(bootcampController.getBootcamp)
  .put(protect, authorizeAction('update:bootcamp'), bootcampController.updateBootcamp)
  .delete(protect, authorizeAction('delete:bootcamp'), bootcampController.deleteBootcamp)

router.put(PathDir.UPLOAD_PHOTO, protect, authorizeAction('update:bootcamp'), bootcampController.uploadBootcampPhoto)
router.put(PathDir.UPLOAD_BADGE, protect, authorizeAction('update:bootcamp'), bootcampController.uploadBootcampBadge)

export default router
