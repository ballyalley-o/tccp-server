import { Application } from 'express'
import { PathDir } from '@constant'
import userRoute from '@route/user/user'

const linkUserRoute = (app: Application) => {
  app.use(PathDir.USER, userRoute)
}

export { linkUserRoute }
