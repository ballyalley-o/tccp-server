import { Application } from 'express'
import { PathDir } from '@constant'
import courseRoute from '@route/course/course'

const linkCourseRoute = (app: Application) => {
  app.use(PathDir.COURSE, courseRoute)
}

export { linkCourseRoute }
