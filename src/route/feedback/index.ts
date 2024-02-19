import { Application } from 'express'
import { PathDir } from '@constant'
import userRoute from '@route/user/user'

const linkUserRoutes = (app: Application) => {
  app.use(PathDir.USER, userRoute)
}

export { linkUserRoutes }
