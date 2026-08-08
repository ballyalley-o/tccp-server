import { Router }               from 'express'
import { CourseQuizController } from '@controller/course'
import { protect, authorizeAction }   from '@route/guard'
import { PathDir }              from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, CourseQuizController.getCourseQuizzes)
router.get(PathDir.ID, CourseQuizController.getCourseQuiz)
router.post(PathDir.ROOT, protect, authorizeAction('create:course-quiz'), CourseQuizController.createCourseQuiz)
router.put(PathDir.ID, protect, authorizeAction('update:course-quiz'), CourseQuizController.updateCourseQuiz)
router.delete(PathDir.ID, protect, authorizeAction('delete:course-quiz'), CourseQuizController.deleteCourseQuiz)

export default router
