import { Router }                   from 'express'
import { MODULE }                   from '@config/module.config'
import { CourseController }         from '@controller'
import { advancedResult }           from '@middleware'
import { Course }                   from '@model'
import { PathDir }                  from '@route/dir'
import { protect, authorizeAction } from '@route/guard'

const router = Router({ mergeParams: true })

router
  .route(PathDir.ROOT)
  .get(
    advancedResult(Course, {
      path  : MODULE.Bootcamp.name,
      select: 'name description'
    }),
    CourseController.getCourses
  )
  .post(protect, authorizeAction('create:course'), CourseController.addCourse)

router
  .route(PathDir.ID)
  .get(CourseController.getCourse)
  .put(protect, authorizeAction('update:course'), CourseController.updateCourse)
  .delete(protect, authorizeAction('delete:course'), CourseController.deleteCourse)

/**
 * @path - {baseUrl}/api/{apiVer}/course/...
 */
export default router