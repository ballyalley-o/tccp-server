import { Application }    from 'express'
import { PathDir }        from '@config/dir.config'

import { CourseRoute }        from './course'
import { CourseLectureRoute } from './course.lecture'
import { CourseModuleRoute }  from './course.module'
import { CourseQuizRoute }    from './course.quiz'

const registerCourseRoute = (app: Application) => {
  app.use(PathDir.COURSE_LECTURE, CourseLectureRoute)
  app.use(PathDir.COURSE_MODULE, CourseModuleRoute)
  app.use(PathDir.COURSE_QUIZ, CourseQuizRoute)
  app.use(PathDir.COURSE, CourseRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/course
 */
export { registerCourseRoute }
