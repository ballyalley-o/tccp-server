import { CorsOptions } from 'cors'
import { GLOBAL } from '@config'
import { RESPONSE } from '@constant'

const allowedOrigins = GLOBAL.CORS_ALLOWED_ORIGIN

const corsConfig = {
  origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
    if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error(RESPONSE.error.CORS_NOT_ALLOWED))
    }
  },
} as CorsOptions

export default corsConfig
