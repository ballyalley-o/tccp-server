import { Router }          from 'express'
import { MODULE }          from '@config/module.config'
import { PathDir }         from '@config/dir.config'
import { advancedResult }  from '@common/middleware'
import { protect }         from '@common/security/protect'
import { authorizeAction } from '@common/security/guard'

import Course              from '@module/course/course/model/Course'
import CourseController    from '@module/course/course/controller/course.controller'

const router = Router({ mergeParams: true })

router
  .route(PathDir.ROOT)
  .get(
    advancedResult(Course, {
      path  : MODULE.Bootcamp.name,
      select: 'name description'
    }, {
      select : ['_id', 'title', 'slug', 'description', 'duration', 'tuition', 'minimumSkill', 'skills', 'modules', 'scholarshipAvailable', 'bootcamp', 'trainer', 'createdAt', 'updatedAt'],
      sort   : ['title', 'duration', 'tuition', 'minimumSkill', 'createdAt', 'updatedAt'],
      include: {
        bootcamp: {
          path  : MODULE.Bootcamp.name,
          select: '_id name description'
        }
      }
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
