import { GLOBAL } from '@config'
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
  static readonly SIGN_IN_PARAM = PathParam.SIGN_IN_PARAM
  static readonly SIGN_OUT_PARAM = PathParam.SIGN_OUT_PARAM

  /**
   * Connect the path
   * @returns void
   */
  private static _connex = conNex

  /**
   * ENDPOINTS
   * @description Path directory for the server
   */
  // {baseUrl}/api/{apiVer}
  static API_ROOT = this._connex(
    PathDir.API_PARAM,
    process.env.API_VERSION || ''
  )
  // {baseUrl}/api/{apiVer}/home
  static DASHBOARD = this._connex(PathDir.API_ROOT, this.DASHBOARD_PARAM)
  // {baseUrl}/api/{apiVer}/auth
  static AUTH_ROOT = this._connex(PathDir.API_ROOT, PathDir.AUTH_PARAM)
  // {baseUrl}/api/{apiVer}/auth/user
  static USER = this._connex(PathDir.AUTH_ROOT, PathDir.USER_PARAM)
  // {baseUrl}/api/{apiVer}/auth/sign-in
  static SIGN_IN = this._connex(PathDir.AUTH_ROOT, PathDir.SIGN_IN_PARAM)
  // {baseUrl}/api/{apiVer}/auth/sign-out
  static SIGN_OUT = this._connex(PathDir.AUTH_ROOT, PathDir.SIGN_OUT_PARAM)

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
