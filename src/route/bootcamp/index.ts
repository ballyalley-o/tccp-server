import { Application } from 'express'
import { PathDir } from '@route/dir'
import bootcampRoute from '@route/bootcamp/bootcamp'

const linkBootcampRoute = (app: Application) => {
  app.use(PathDir.BOOTCAMP, bootcampRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/bootcamp
 */
export { linkBootcampRoute }