import { Router }               from 'express'
import { CourseQuizController } from '@controller/course'
import { protect, authorize }   from '@route/guard'
import { PathDir }              from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, CourseQuizController.getCourseQuizzes)
router.get(PathDir.ID, CourseQuizController.getCourseQuiz)
router.post(PathDir.ROOT, protect, authorize('trainer', 'admin'), CourseQuizController.createCourseQuiz)
router.put(PathDir.ID, protect, authorize('trainer', 'admin'), CourseQuizController.updateCourseQuiz)
router.delete(PathDir.ID, protect, authorize('trainer', 'admin'), CourseQuizController.deleteCourseQuiz)

export default router
