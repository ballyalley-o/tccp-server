import { Router } from 'express'
import courseRoute from '@route/course/course'
import feedbackRoute from '@route/feedback/feedback'
import { bootcampController } from '@controller'
import { advancedResult } from '@middleware'
import { Bootcamp } from '@model'
import { Key, PathParam } from '@constant/enum'
import { protect, authorize } from '@middleware'

const router = Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v0.1/bootcamp
 */
router.use(PathParam.REDIR_COURSE, courseRoute)
router.use(PathParam.REDIR_FEEDBACK, feedbackRoute)

router.route(PathParam.DISTANCE).get(bootcampController.getBootcampsInRadius)

router
  .route(PathParam.ORIGIN)
  .get(bootcampController.getBootcamps)
  .post(bootcampController.createBootcamp)

router
  .route(PathParam.ORIGIN)
  .get(
    advancedResult(Bootcamp, Key.CourseVirtual),
    bootcampController.getBootcamps
  )

router
  .route(PathParam.CREATE)
  .post(
    protect,
    authorize(Key.Trainer, Key.Admin),
    bootcampController.createBootcamp
  )

router
  .route(PathParam.ID)
  .get(bootcampController.getBootcamp)
  .put(
    protect,
    authorize(Key.Trainer, Key.Admin),
    bootcampController.updateBootcamp
  )
  .delete(
    protect,
    authorize(Key.Trainer, Key.Admin),
    bootcampController.deleteBootcamp
  )

const bootcampRoute = router
export default bootcampRoute
