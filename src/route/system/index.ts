import { Application } from 'express'
import { PathDir } from '@route/dir'
import systemRoute from '@route/system/system'

const linkSystemRoute = (app: Application) => {
  app.use(PathDir.SYSTEM, systemRoute)
}

export { linkSystemRoute }
