import { Application } from 'express'
import { PathDir } from '@constant'
import courseRoute from '@route/course/course'

const linkUserRoutes = (app: Application) => {
  app.use(PathDir.USER, courseRoute)
}

export { linkUserRoutes }
