import { Router }                             from 'express'
import { CourseController }                   from '@controller'
import { advancedResult, authorize, protect } from '@middleware'
import { Course }                             from '@model'
import { PathDir }                            from '@route/dir'
import { Key }                                from '@constant/enum'

const router = Router({ mergeParams: true })

router
  .route(PathDir.ROOT)
  .get(
    advancedResult(Course, {
      path  : Key.BootcampVirtual,
      select: Key.DefaultSelect
    }),
    CourseController.getCourses
  )
  .post(protect, authorize('trainer', 'admin'), CourseController.addCourse)

router
  .route(PathDir.ID)
  .get(CourseController.getCourse)
  .put(protect, authorize('trainer', 'admin'), CourseController.updateCourse)
  .delete(protect, authorize('trainer', 'admin'), CourseController.deleteCourse)

/**
 * @path - {baseUrl}/api/v0.1/course
 */
export default router
