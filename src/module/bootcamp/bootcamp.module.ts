import { Application }   from 'express'
import { PathDir }       from '@config/dir.config'
import { BootcampRoute } from '@module/bootcamp'

const registerBootcampRoute = (app: Application) => {
  app.use(PathDir.BOOTCAMP, BootcampRoute)
}

const BOOTCAMP_CONFIG = {
  LOCATION_TYPE             : 'Point',
  LOCATION_COORDINATES_INDEX: '2dsphere',
  DEFAULT_PHOTO             : '/upload/no-photo.jpeg',
  DEFAULT_BADGE             : '/upload/badge/no-badge.png',
  DEFAULT_AVATAR            : '/upload/avatar/no-avatar.jpeg'
} as const

/**
 * @path - {baseUrl}/api/{apiVer}/bootcamp
 */
export { registerBootcampRoute, BOOTCAMP_CONFIG }
