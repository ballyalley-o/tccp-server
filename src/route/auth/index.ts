import { Application } from 'express'
import { PathDir } from '@constant'
import authRoute from '@route/auth/auth'

const linkAuthRoute = (app: Application) => {
  app.use(PathDir.AUTH, authRoute)
}

export { linkAuthRoute }
