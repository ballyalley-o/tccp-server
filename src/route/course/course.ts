import { Router } from 'express'
import { CourseController } from '@controller'
import { Course } from '@model'
import { advancedResult, authorize, protect } from '@middleware'
import { Key, PathParam } from '@constant/enum'

const router = Router({ mergeParams: true })
/**
 * @path - {baseUrl}/api/v0.1/course
 */
router
  .route(PathParam.F_SLASH)
  .get(
    advancedResult(Course, {
      path: Key.BootcampVirtual,
      select: Key.DefaultSelect,
    }),
    CourseController.getCourses
  )
  .post(protect, authorize(Key.Trainer, Key.Admin), CourseController.addCourse)

router
  .route(PathParam.ID)
  .get(CourseController.getCourse)
  .put(
    protect,
    authorize(Key.Trainer, Key.Admin),
    CourseController.updateCourse
  )
  .delete(
    protect,
    authorize(Key.Trainer, Key.Admin),
    CourseController.deleteCourse
  )

const courseRoute = router
export default courseRoute
