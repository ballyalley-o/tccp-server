import { Application } from 'express'
import { PathDir } from '@route/dir'
import courseRoute from '@route/course/course'

const linkCourseRoute = (app: Application) => {
  app.use(PathDir.COURSE, courseRoute)
}

export { linkCourseRoute }
