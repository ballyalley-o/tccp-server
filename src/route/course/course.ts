import { Router } from 'express'
import { courseController } from '@controller'
import { Course } from '@model'
import { advancedResult, authorize, protect } from '@middleware'
import { Key, PathParam } from '@constant/enum'

const router = Router({ mergeParams: true })

router
  .route(PathParam.ORIGIN_PARAM)
  .get(
    advancedResult(Course, {
      path: Key.BootcampVirtual,
      select: Key.DefaultSelect,
    }),
    courseController.getCourses
  )
  .post(protect, authorize(Key.Trainer, Key.Admin), courseController.addCourse)

router
  .route(PathParam.ID_PARAM)
  .get(courseController.getCourse)
  .put(
    protect,
    authorize(Key.Trainer, Key.Admin),
    courseController.updateCourse
  )
  .delete(
    protect,
    authorize(Key.Trainer, Key.Admin),
    courseController.deleteCourse
  )

const courseRoute = router
export default courseRoute
