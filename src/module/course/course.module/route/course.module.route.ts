import { Router }                   from 'express'
import { PathDir }                  from '@config/dir.config'
import { authorizeAction }          from '@common/security/guard'
import { protect }                  from '@common/security/protect'
import CourseModuleController       from '@module/course/course.module/controller/course.module.controller'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, CourseModuleController.getCourseModules)
router.get(PathDir.ID, CourseModuleController.getCourseModule)
router.post(PathDir.ROOT, protect, authorizeAction('create:course-module'), CourseModuleController.createCourseModule)
router.put(PathDir.ID, protect, authorizeAction('update:course-module'), CourseModuleController.updateCourseModule)
router.delete(PathDir.ID, protect, authorizeAction('delete:course-module'), CourseModuleController.deleteCourseModule)


/**
 * @path - {baseUrl}/api/{apiVer}/course/module/...
 */
export default router
