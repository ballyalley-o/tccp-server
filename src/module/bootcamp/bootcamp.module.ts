import { Application }   from 'express'
import { PathDir }       from '@config/dir.config'
import { BootcampRoute } from '@module/bootcamp'

const registerBootcampRoute = (app: Application) => {
  app.use(PathDir.BOOTCAMP, BootcampRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/bootcamp
 */
export { registerBootcampRoute }
