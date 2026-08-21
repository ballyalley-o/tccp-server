import { Router }                   from 'express'
import { PathDir }                  from '@config/dir.config'
import { authorizeAction }          from '@common/security/guard'
import { protect }                  from '@common/security/protect'
import CourseLectureController      from '@module/course/course.lecture/controller/course.lecture.controller'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, CourseLectureController.getCourseLectures)
router.get(PathDir.ID, CourseLectureController.getCourseLecture)
router.post(PathDir.ROOT, protect, authorizeAction('create:course-lecture'), CourseLectureController.createCourseLecture)
router.put(PathDir.ID, protect, authorizeAction('update:course-lecture'), CourseLectureController.updateCourseLecture)
router.delete(PathDir.ID, protect, authorizeAction('delete:course-lecture'), CourseLectureController.deleteCourseLecture)

/**
 * @path - {baseUrl}/api/{apiVer}/course/lecture/...
 */
export default router
