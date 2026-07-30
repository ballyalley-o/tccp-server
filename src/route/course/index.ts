import { Application }    from 'express'
import { PathDir }        from '@route/dir'

import courseRoute        from './course'
import courseLectureRoute from './lecture'
import courseModuleRoute  from './module'
import courseQuizRoute    from './quiz'

const linkCourseRoute = (app: Application) => {
  app.use(PathDir.COURSE, courseRoute)
  app.use(PathDir.COURSE_LECTURE, courseLectureRoute)
  app.use(PathDir.COURSE_MODULE, courseModuleRoute)
  app.use(PathDir.COURSE_QUIZ, courseQuizRoute)
}

export { linkCourseRoute }
