import path                  from 'path'
import { __dirname, GLOBAL } from '@config'
import { RESPONSE }          from '@constant'
import { Key }               from '@constant/enum'
import { pathBuilder }       from '@util/builder'

  /**
 * @module
 */
export const AUTH       = 'auth'
export const BOOTCAMP   = 'bootcamp'
export const COURSE     = 'course'
export const ENROLLMENT = 'enrollment'
export const USER       = 'user'
export const FEEDBACK   = 'feedback'
export const SYSTEM     = 'system'

  /**
 * @submodule
 */
export const ACCOUNT  = 'account'
export const INFO     = 'info'
export const HEALTH   = 'health'
export const LOG_IN   = 'log-in'
export const LOG_OUT  = 'log-out'
export const REGISTER = 'register'

export const ALL             = '*'
export const ROOT            = '/'
export const AVATAR          = 'avatar'
export const BADGE           = 'badge'
export const CREATE          = 'create'
export const DASHBOARD       = 'dashboard'
export const DIST            = 'dist'
export const EVENT           = 'event'
export const FORGOT_PASSWORD = 'forgot-password'
export const HOME            = 'home'
export const PHOTO           = 'photo'
export const PUBLIC          = 'public'
export const RADIUS          = 'radius'
export const TOP             = 'top'
export const UPDATE          = 'update'
export const UPDATE_PASSWORD = 'update-password'
export const RESET_PASSWORD  = 'reset-password'

export const ADMIN = 'admin'
export const API   = 'api'

export const BOOTCAMP_ID   = ':bootcampId'
export const BOOTCAMP_SLUG = ':bootcampSlug'
export const DISTANCE      = ':distance'
export const ID            = ':id'
export const RESET_TOKEN   = ':resetToken'
export const SLUG          = ':slug'
export const SCH_SEPARATOR = '://'
export const ZIPCODE       = ':zipcode'

  /**
 * @class PathDir
 * @description This class handles all routers/traffic and acts as a path directory
 * @returns void
 */
export class PathDir {
  public path = path

  constructor() {
    throw new Error(RESPONSE.error.NotInstance)
  }

    /**
   * ENDPOINTS
   * @description Path directory for the server
   */

    /**
   *  @path - {baseUrl}/api/{apiVer}
   */
  static get API_ROOT() {
    return pathBuilder(API, GLOBAL.API_VERSION || 'v0')
  }

  static ROOT = ROOT
  static SLUG = pathBuilder(SLUG)
  static ID   = pathBuilder(ID)

  static DASHBOARD = pathBuilder(PathDir.API_ROOT, DASHBOARD)

  static AUTH = pathBuilder(PathDir.API_ROOT, AUTH)
  static USER = pathBuilder(PathDir.AUTH, USER)

  static BOOTCAMP       = pathBuilder(PathDir.API_ROOT, BOOTCAMP)
  static CREATE         = pathBuilder(CREATE)
  static TOP            = pathBuilder(TOP)
  static REDIR_FEEDBACK = pathBuilder(BOOTCAMP_ID, FEEDBACK)
  static REDIR_COURSE   = pathBuilder(BOOTCAMP_ID, COURSE)
  static GET_DISTANCE   = pathBuilder(RADIUS, ZIPCODE, DISTANCE)
  static UPLOAD_PHOTO   = pathBuilder(ID, PHOTO)
  static UPLOAD_BADGE   = pathBuilder(ID, BADGE)
  static UPLOAD_AVATAR  = pathBuilder(ID, AVATAR)

  static COURSE     = pathBuilder(PathDir.API_ROOT, COURSE)
  static ENROLLMENT = pathBuilder(PathDir.API_ROOT, ENROLLMENT)

  static SYSTEM        = pathBuilder(PathDir.API_ROOT, SYSTEM)
  static INFO          = pathBuilder(INFO)
  static HEALTH        = pathBuilder(HEALTH)
  static SYSTEM_INFO   = pathBuilder(PathDir.API_ROOT, SYSTEM, INFO)
  static SYSTEM_HEALTH = pathBuilder(PathDir.API_ROOT, SYSTEM, HEALTH)

  static FEEDBACK = pathBuilder(PathDir.API_ROOT, FEEDBACK)

  static EVENT = pathBuilder(EVENT)

  static REGISTER         = pathBuilder(REGISTER)
  static LOG_IN           = pathBuilder(LOG_IN)
  static LOG_OUT          = pathBuilder(LOG_OUT)
  static ACCOUNT          = pathBuilder(ACCOUNT)
  static ACCOUNT_UPDATE   = pathBuilder(ACCOUNT, UPDATE)
  static UPDATE_PASSWORD  = pathBuilder(UPDATE_PASSWORD)
  static FORGOT_PASSWORD  = pathBuilder(FORGOT_PASSWORD)
  static RESET_URL        = pathBuilder(RESET_PASSWORD)
  static RESET_PASSWORD   = pathBuilder(RESET_PASSWORD, RESET_TOKEN)
  static RESET_FULL_EMAIL = (req: any, resetToken: string) => pathBuilder(`${req.protocol}://${req.get(Key.Host)}`, RESET_PASSWORD, resetToken)

    // @production
    // static BUILD_LOC = path.resolve(__dirname, PathParam.DIST)
    // static BUILD_VIEW = path.resolve(__dirname, PathParam.PUBLIC, Key.IndexHtml)
}
