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
  static readonly ORIGIN_PARAM = PathParam.ORIGIN_PARAM
  static readonly HOME_PARAM = PathParam.HOME_PARAM
  static readonly DASHBOARD_PARAM = PathParam.DASHBOARD_PARAM
  static readonly API_PARAM = PathParam.API_PARAM
  static readonly AUTH_PARAM = PathParam.AUTH_PARAM
  static readonly USER_PARAM = PathParam.USER_PARAM
  static readonly COURSE_PARAM = PathParam.COURSE_PARAM
  static readonly FEEDBACK_PARAM = PathParam.FEEDBACK_PARAM
  static readonly BOOTCAMP_PARAM = PathParam.BOOTCAMP_PARAM
  static readonly LOG_IN_PARAM = PathParam.LOG_IN_PARAM
  static readonly LOG_OUT_PARAM = PathParam.LOG_OUT_PARAM

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
  static AUTH_ROOT = this._connex(PathDir.API_ROOT, this.AUTH_PARAM)
  //  /auth/user
  static USER = this._connex(PathDir.AUTH_ROOT, this.USER_PARAM)
  //  /bootcamp
  static BOOTCAMP = this._connex(PathDir.API_ROOT, this.BOOTCAMP_PARAM)
  // /course
  static COURSE = this._connex(PathDir.API_ROOT, this.COURSE_PARAM)
  // /feedback
  static FEEDBACK = this._connex(PathDir.AUTH_ROOT, this.FEEDBACK_PARAM)
  // /auth/log-in
  static LOG_IN = this._connex(PathDir.AUTH_ROOT, this.LOG_IN_PARAM)
  // /auth/log-out
  static LOG_OUT = this._connex(PathDir.AUTH_ROOT, this.LOG_OUT_PARAM)

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
