import express                from 'express'
import { bootcampController } from '@controller'
import { advancedResult }     from '@middleware'
import { Bootcamp }           from '@model'
import courseRoute            from '@route/course/course'
import feedbackRoute          from '@route/feedback/feedback'
import { PathDir }            from '@route/dir'
import * as PathParam         from '@route/dir'
import { Key }                from '@constant/enum'
import { protect, authorize } from '@middleware'

const router = express.Router()

/**
 * @path - {baseUrl}/api/v{verNo}/bootcamp
 */
router.use(PathDir.REDIR_COURSE, courseRoute)
router.use(PathDir.REDIR_FEEDBACK, feedbackRoute)

router.route(PathDir.DISTANCE).get(bootcampController.getBootcampsInRadius)
router
  .route(PathParam.ROOT)
  .get(
    advancedResult(Bootcamp, [
      {
        path  : Key.UserVirtual,
        select: 'firstname email role'
      },
      {
        path  : Key.CourseVirtual,
        select: 'title duration'
      },
      {
        path  : Key.FeedbackVirtual,
        select: 'title rating user'
      }
    ]),
    bootcampController.getBootcamps
  )
  .post(bootcampController.createBootcamp)
router.route(PathDir.CREATE).post(protect, authorize(Key.Trainer, Key.Admin), bootcampController.createBootcamp)

router.get(PathDir.TOP, bootcampController.getTopBootcamps)
router
  .route(PathDir.SLUG)
  .get(bootcampController.getBootcamp)
  .put(protect, authorize(Key.Trainer, Key.Admin), bootcampController.updateBootcamp)
  .delete(protect, authorize(Key.Trainer, Key.Admin), bootcampController.deleteBootcamp)

router.put(PathDir.UPLOAD_PHOTO, protect, bootcampController.uploadBootcampPhoto)
router.put(PathDir.UPLOAD_BADGE, protect, bootcampController.uploadBootcampBadge)

export default router