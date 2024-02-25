import crypto from 'crypto'
import goodlog from 'good-logs'
import { Request, Response, NextFunction } from 'express'
import { IUserRequest } from '@interface/middleware'
import { ErrorResponse, htmlContent } from '@util'
import { sendEmail } from '@util'
import { User } from '@model'
import { Key, Code } from '@constant/enum'
import { use, LogRequest } from '@decorator'
import {
  RESPONSE,
  PathDir,
  thirtyDaysFromNow,
  fiveSecFromNow,
  expire,
} from '@constant'

/**
 * @path {baseUrl}/auth
 */
class AuthController {
  private static _userId: string

  static setUserId(req: IUserRequest) {
    this._userId = req.user.id
  }
  /**
   * _sendTokenResponse - Send Token Response
   *
   * @param user - User
   * @param statusCode - Status Code
   * @param res - Response
   * @returns void
   */
  private static _sendTokenResponse = (
    user: any,
    statusCode: number,
    res: any
  ) => {
    const token = user.getSignedJwtToken()
    const options = {
      expires: thirtyDaysFromNow,
      httpOnly: true,
      secure: false,
    }

    if (process.env.NODE_ENV === Key.Production) {
      options.secure = true
    }

    res.status(statusCode).cookie(Key.Token, token, options).json({
      success: true,
      token,
      user,
    })
  }

  //@desc   Register user
  //@route  POST /register
  //@access PUBLIC
  @use(LogRequest)
  public static async register(
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const user = await User.create(req.body)

    AuthController._sendTokenResponse(user, Code.OK, res)
  }

  //@desc   Login user
  //@route  POST /api/v1/auth/login
  //@access PUBLIC
  @use(LogRequest)
  public static async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body

    if (!email || !password) {
      return next(
        new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, Code.BAD_REQUEST)
      )
    }

    const user = await User.findOne({ email }).select(Key.Password)

    if (!user) {
      return next(
        new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, Code.UNAUTHORIZED)
      )
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return next(
        new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, Code.UNAUTHORIZED)
      )
    }

    AuthController._sendTokenResponse(user, Code.OK, res)
  }

  //@desc     Get Log out User
  //@route    GET /auth/log-out
  //@access   PRIVATE
  @use(LogRequest)
  public static async logout(
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    res.cookie(Key.Token, Key.None, {
      expires: fiveSecFromNow,
      httpOnly: true,
    })

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success.LOGOUT,
      data: {},
    })
  }

  //@desc   Get current logged in user
  //@route  GET /account
  //@access PRIVATE
  @use(LogRequest)
  public static async myAccount(req: any, res: Response, _next: NextFunction) {
    const user = (await User.findById(req.user.id)) || null

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success[200],
      data: user,
    })
  }

  //@desc   Update user details
  //@route  PUT /update
  //@access PRIVATE
  @use(LogRequest)
  public static async updateAccount(
    req: any,
    res: Response,
    _next: NextFunction
  ) {
    AuthController.setUserId(req)

    const fieldsToUpdate = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: req.body.role,
      avatar: req.body.avatar,
      location: req.body.location,
    }

    const user = await User.findByIdAndUpdate(
      AuthController._userId,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    )

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success.UPDATED,
      data: user,
    })
  }

  //@desc   Update Password
  //@route  PUT /update-password
  //@access PRIVATE
  @use(LogRequest)
  public static async updatePassword(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    AuthController.setUserId(req)

    const user = await User.findById(AuthController._userId).select(
      Key.Password
    )

    if (!(await user?.matchPassword(req.body.currentPassword))) {
      return next(
        new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, Code.UNAUTHORIZED)
      )
    }

    if (user) {
      user.password = req.body.password
    }

    await user?.save()

    AuthController._sendTokenResponse(user, Code.OK, res)
  }

  //@desc   Forgot Password
  //@route  POST /forgot-password
  //@access PUBLIC
  @use(LogRequest)
  public static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userEmail = req.body.email
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_FOUND(userEmail), Code.NOT_FOUND)
      )
    }
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const message = RESPONSE.error.RESET_MESSAGE(
      PathDir.RESET_FULL_EMAIL(req, resetToken)
    )
    try {
      await sendEmail({
        email: user.email,
        subject: RESPONSE.error.RESET_SUBJECT,
        html: htmlContent(user, resetToken),
      })
    } catch (error) {
      if (error instanceof Error) {
        goodlog.log(error.message)
        user.resetPasswordToken = ''
        user.resetPasswordExpire = expire

        await user.save({
          validateBeforeSave: false,
        })

        return next(
          new ErrorResponse(
            RESPONSE.error.FAILED_EMAIL,
            Code.INTERNAL_SERVER_ERROR
          )
        )
      }
    }

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success.EMAIL_SENT,
      data: user,
    })
  }

  //@desc   Reset Password
  //@route PUT /reset-password/:resetToken
  //@access PUBLIC
  @use(LogRequest)
  public static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let resetPasswordToken = crypto
      .createHash(Key.CryptoHash)
      .update(req.params.resetToken)
      .digest(Key.Hex)

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return next(
        new ErrorResponse(RESPONSE.error.INVALID_TOKEN, Code.ALREADY_REPORTED)
      )
    }

    user.password = req.body.password
    user.resetPasswordToken = ''
    user.resetPasswordExpire = expire
    await user.save()

    AuthController._sendTokenResponse(user, Code.OK, res)
  }
}

export default AuthController
