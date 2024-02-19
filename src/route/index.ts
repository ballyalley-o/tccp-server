import { linkUserRoutes } from '@route/user'
import { Application } from 'express'
import { PathDir } from '@constant'

const mainRoute = (app: Application) => {
  linkUserRoutes(app)
}

export { mainRoute }
