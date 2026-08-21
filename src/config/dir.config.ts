import path                  from 'path'
import GLOBAL                from '@config/global.config'
import { MODULE as _MODULE } from '@config/module.config'
import { RESPONSE }          from '@common/constant'
import { pathBuilder }       from '@common/util/builder'

/**
 * @module
 */
export const AUTH       = _MODULE.Auth.name
export const BOOTCAMP   = _MODULE.Bootcamp.name
export const COURSE     = _MODULE.Course.name
export const ENROLLMENT = _MODULE.Enrollment.name
export const FEEDBACK   = _MODULE.Feedback.name
export const SKILL      = _MODULE.Skill.name
export const DASHBOARD  = _MODULE.Dashboard.name
export const ADMIN      = _MODULE.Admin.name
/**
 * @submodule
*/
export const USER     = _MODULE.Auth.submodule.AuthUser.name
export const ROLE     = _MODULE.Auth.submodule.AuthRole.name
export const ACCOUNT  = _MODULE.Auth.submodule.Account.name
export const LOG_IN   = _MODULE.Auth.submodule.LogIn.name
export const LOG_OUT  = _MODULE.Auth.submodule.LogOut.name
export const REGISTER = _MODULE.Auth.submodule.Register.name

export const LECTURE = _MODULE.Course.submodule.CourseLecture.name
export const MODULE  = _MODULE.Course.submodule.CourseModule.name
export const QUIZ    = _MODULE.Course.submodule.CourseQuiz.name

export const CATEGORY = _MODULE.Skill.submodule.SkillCategory.name

export const SYSTEM = _MODULE.Admin.submodule.AdminSystem.name
export const INFO   = _MODULE.Admin.submodule.AdminSystem.submodule.AdminSystemInfo.name
export const HEALTH = _MODULE.Admin.submodule.AdminSystem.submodule.AdminSystemHealth.name

export const ALL             = '*'
export const ROOT            = '/'
export const AVATAR          = 'avatar'
export const BADGE           = 'badge'
export const CREATE          = 'create'
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

export const API   = 'api'

export const BOOTCAMP_ID   = `:${BOOTCAMP}Id`
export const BOOTCAMP_SLUG = `:${BOOTCAMP}Slug`
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

  static AUTH      = pathBuilder(PathDir.API_ROOT, AUTH)
  static AUTH_USER = pathBuilder(PathDir.AUTH, USER)
  static AUTH_ROLE = pathBuilder(PathDir.AUTH, ROLE)

  static ROLE = pathBuilder(PathDir.API_ROOT, AUTH, ROLE)

  static BOOTCAMP       = pathBuilder(PathDir.API_ROOT, BOOTCAMP)
  static CREATE         = pathBuilder(CREATE)
  static TOP            = pathBuilder(TOP)
  static REDIR_FEEDBACK = pathBuilder(BOOTCAMP_ID, FEEDBACK)
  static REDIR_COURSE   = pathBuilder(BOOTCAMP_ID, COURSE)
  static GET_DISTANCE   = pathBuilder(RADIUS, ZIPCODE, DISTANCE)
  static UPLOAD_PHOTO   = pathBuilder(ID, PHOTO)
  static UPLOAD_BADGE   = pathBuilder(ID, BADGE)
  static UPLOAD_AVATAR  = pathBuilder(ID, AVATAR)

  static COURSE         = pathBuilder(PathDir.API_ROOT, COURSE)
  static COURSE_LECTURE = pathBuilder(PathDir.API_ROOT, COURSE, LECTURE)
  static COURSE_MODULE  = pathBuilder(PathDir.API_ROOT, COURSE, MODULE)
  static COURSE_QUIZ    = pathBuilder(PathDir.API_ROOT, COURSE, QUIZ)

  static ENROLLMENT     = pathBuilder(PathDir.API_ROOT, ENROLLMENT)

  static SKILL          = pathBuilder(PathDir.API_ROOT, SKILL)
  static SKILL_CATEGORY = pathBuilder(PathDir.API_ROOT, SKILL, CATEGORY)


  static INFO          = pathBuilder(INFO)
  static HEALTH        = pathBuilder(HEALTH)
  static ADMIN         = pathBuilder(PathDir.API_ROOT, ADMIN)
  static SYSTEM        = pathBuilder(PathDir.ADMIN, SYSTEM)
  static SYSTEM_INFO   = pathBuilder(PathDir.SYSTEM, INFO)
  static SYSTEM_HEALTH = pathBuilder(PathDir.SYSTEM, HEALTH)

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
  static RESET_FULL_EMAIL = (req: any, resetToken: string) => pathBuilder(`${req.protocol}://${req.get('host')}`, RESET_PASSWORD, resetToken)
}
