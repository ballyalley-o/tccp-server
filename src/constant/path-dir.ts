import { __dirname } from '@config'
import { conNex } from '@util'
import { RESPONSE } from '@constant'
import { PathParam, Key } from '@constant/enum'

/**
 * @class PathDir
 * @description This class handles all routers/traffic and acts as a path directory
 * @returns void
 */
class PathDir {
  constructor() {
    throw new Error(RESPONSE.error.NotInstance)
  }

  // path parameters
  static readonly ORIGIN_PARAM = PathParam.F_SLASH
  static readonly HOME_PARAM = PathParam.HOME
  static readonly DASHBOARD_PARAM = PathParam.DASHBOARD
  static readonly API_PARAM = PathParam.API
  static readonly AUTH_PARAM = PathParam.AUTH
  static readonly USER_PARAM = PathParam.USER
  static readonly COURSE_PARAM = PathParam.COURSE
  static readonly FEEDBACK_PARAM = PathParam.FEEDBACK
  static readonly BOOTCAMP_PARAM = PathParam.BOOTCAMP
  static readonly LOG_IN_PARAM = PathParam.LOG_IN
  static readonly LOG_OUT_PARAM = PathParam.LOG_OUT
  static readonly RESET_PASSWORD_PARAM = PathParam.RESET_PASSWORD
  static readonly RESET_TOKEN_PARAM = PathParam.RESET_TOKEN

  /**
   * Connect the path
   * @returns void
   */
  private static _connex = conNex

  /**
   * ENDPOINTS
   * @description Path directory for the server
   */

  /**
   *  @path - {baseUrl}/api/{apiVer}
   */
  static API_ROOT = this._connex(
    PathDir.API_PARAM,
    process.env.API_VERSION || ''
  )
  //  /dashboard
  static DASHBOARD = this._connex(PathDir.API_ROOT, this.DASHBOARD_PARAM)
  //  /auth
  static AUTH = this._connex(PathDir.API_ROOT, this.AUTH_PARAM)
  //  /auth/user
  static USER = this._connex(PathDir.AUTH, this.USER_PARAM)
  //  /bootcamp
  static BOOTCAMP = this._connex(PathDir.API_ROOT, this.BOOTCAMP_PARAM)
  // /course
  static COURSE = this._connex(PathDir.API_ROOT, this.COURSE_PARAM)
  // /feedback
  static FEEDBACK = this._connex(PathDir.API_ROOT, this.FEEDBACK_PARAM)
  // /auth/log-in
  static LOG_IN = this._connex(PathDir.AUTH, this.LOG_IN_PARAM)
  // /auth/log-out
  static LOG_OUT = this._connex(PathDir.AUTH, this.LOG_OUT_PARAM)
  // /auth/reset-password/
  static RESET_URL = this._connex(PathDir.AUTH, this.RESET_PASSWORD_PARAM)
  // /auth/reset-password/:resetToken
  static RESET_PASSWORD = this._connex(
    PathDir.AUTH,
    this.RESET_PASSWORD_PARAM,
    this.RESET_TOKEN_PARAM
  )

  static RESET_FULL_EMAIL = (req: any, resetToken: string) =>
    // {protocol}://{host}/api/{apiVer}/reset-password/:resetToken`
    this._connex(
      req.protocol,
      PathParam.SCH_SEPARATOR,
      req.get(Key.Host),
      this.RESET_URL,
      PathParam.F_SLASH,
      resetToken
    )

  // @production
  // static BUILD_LOC = this._connex(__dirname, Key.Client, PathParam.DIST)
  // static BUILD_VIEW = this._connex(
  //   __dirname,
  //   Key.Client,
  //   PathParam.DIST,
  //   Key.IndexHtml
  // )
}

export default PathDir
