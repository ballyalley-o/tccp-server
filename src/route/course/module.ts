import { Router }                 from 'express'
import { CourseModuleController } from '@controller/course'
import { protect, authorizeAction } from '@route/guard'
import { PathDir } from '@route/dir'

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
