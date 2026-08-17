import { Router }                  from 'express'
import { CourseLectureController } from '@controller/course'
import { ID, PathDir }             from '@route/dir'
import { protect, authorizeAction } from '@route/guard'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, CourseLectureController.getCourseLectures)
router.get(PathDir.ID, CourseLectureController.getCourseLecture)
router.post(PathDir.ROOT, protect, authorizeAction('create:course-lecture'), CourseLectureController.createCourseLecture)
router.put(PathDir.ID, protect, authorizeAction('update:course-lecture'), CourseLectureController.updateCourseLecture)
router.delete(ID, protect, authorizeAction('delete:course-lecture'), CourseLectureController.deleteCourseLecture)

/**
 * @path - {baseUrl}/api/{apiVer}/course/lecture/...
 */
export default router
