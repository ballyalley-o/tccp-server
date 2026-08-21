import { Router }                   from 'express'
import { authorizeAction }          from '@common/security/guard'
import { protect }                  from '@common/security/protect'
import { PathDir }                  from '@config/dir.config'
import CourseQuizController         from '@module/course/course.quiz/controller/course.quiz.controller'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, CourseQuizController.getCourseQuizzes)
router.get(PathDir.ID, CourseQuizController.getCourseQuiz)
router.post(PathDir.ROOT, protect, authorizeAction('create:course-quiz'), CourseQuizController.createCourseQuiz)
router.put(PathDir.ID, protect, authorizeAction('update:course-quiz'), CourseQuizController.updateCourseQuiz)
router.delete(PathDir.ID, protect, authorizeAction('delete:course-quiz'), CourseQuizController.deleteCourseQuiz)

/**
 * @path - {baseUrl}/api/{apiVer}/course/quiz/...
 */
export default router
