import { Router }                 from 'express'
import { CourseModuleController } from '@controller/course'
import { protect, authorize }     from '@route/guard'
import { PathDir } from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, CourseModuleController.getCourseModules)
router.get(PathDir.ID, CourseModuleController.getCourseModule)
router.post(PathDir.ROOT, protect, authorize('trainer', 'admin'), CourseModuleController.createCourseModule)
router.put(PathDir.ID, protect, authorize('trainer', 'admin'), CourseModuleController.updateCourseModule)
router.delete(PathDir.ID, protect, authorize('trainer', 'admin'), CourseModuleController.deleteCourseModule)

export default router
