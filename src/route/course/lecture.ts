import { Router }                  from 'express'
import { CourseLectureController } from '@controller/course'
import { ID, PathDir }             from '@route/dir'
import { protect, authorize }      from '@route/guard'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, CourseLectureController.getCourseLectures)
router.get(PathDir.ID, CourseLectureController.getCourseLecture)
router.post(PathDir.ROOT, protect, authorize('trainer', 'admin'), CourseLectureController.createCourseLecture)
router.put(PathDir.ID, protect, authorize('trainer', 'admin'), CourseLectureController.updateCourseLecture)
router.delete(ID, protect, authorize('trainer', 'admin'), CourseLectureController.deleteCourseLecture)

export default router
