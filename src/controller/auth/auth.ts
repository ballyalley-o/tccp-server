import type { Request, Response, NextFunction }                from 'express'
import crypto                                                  from 'crypto'
import goodlog                                                 from 'good-logs'
import { User }                                                from '@model'
import { use, LogRequest }                                     from '@decorator'
import { PathDir }                                             from '@route/dir'
import { RESPONSE, thirtyDaysFromNow, fiveSecFromNow, expire } from '@constant'
import { Code }                                                from '@constant/enum'
import { ErrorResponse, htmlContent, sendEmail }               from '@util'

/**
 * @path {baseUrl}/auth
 */
class AuthController {
  /**
   * _sendTokenResponse - Send Token Response
   *
   * @param user - User
   * @param statusCode - Status Code
   * @param res - Response
   * @returns void
   */
  private static _sendTokenResponse = (user: IUser, statusCode: number, res: any) => {

    if (user.status !== 'active') {
      throw new ErrorResponse(RESPONSE.error.ACCOUNT_DELETED, (res.statusCode = Code.UNAUTHORIZED))
    }

    const token   = user.getSignedJwtToken()
    const options = {
      expires : thirtyDaysFromNow,
      httpOnly: true,
      secure  : process.env.NODE_ENV === 'production'
    }

    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        user
    })
  }

  //@desc   Register user
  //@route  POST /register
  //@access PUBLIC
  @use(LogRequest)
  public static async register(req: Request, res: Response, next: NextFunction) {
    const { email, username, password } = req.body

    try {
      const [emailExists, usernameExists] = await Promise.all([
        User.findOne({ email }).lean(),
        User.findOne({ username }).lean()
      ])

      if (emailExists) {
        return next(new ErrorResponse(RESPONSE.error.ALREADY_EXISTS(email), (res.statusCode = Code.FORBIDDEN)))
      }

      if (usernameExists) {
        return next(new ErrorResponse(RESPONSE.error.ALREADY_EXISTS(username), (res.statusCode = Code.FORBIDDEN)))
      }

      const user = await User.create(req.body)
      AuthController._sendTokenResponse(user, Code.CREATED, res)
    } catch (error: any) {
      goodlog.error(error?.message)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_REGISTER,
        error
      })
    }
  }

  //@desc   Login user
  //@route  POST /api/v1/auth/login
  //@access PUBLIC
  @use(LogRequest)
  public static async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body

    try {
      if (!email || !password) {
        return next(new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, (res.statusCode = Code.BAD_REQUEST)))
      }

      const user = await User.findOne({ email, archivedAt: null }).select('+password')

      if (!user || !(await user.matchPassword(password))) {
        return next(new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, (res.statusCode = Code.UNAUTHORIZED)))
      }

      AuthController._sendTokenResponse(user, Code.OK, res)
    } catch (error: any) {
      if (error instanceof Error) {
        goodlog.log(error.message)
        return next(new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, (res.statusCode = Code.BAD_REQUEST)))
      }
    }
  }

  //@desc     Get Log out User
  //@route    GET /auth/log-out
  //@access   PRIVATE
  @use(LogRequest)
  public static async logout(_req: Request, res: Response, _next: NextFunction) {
    res.cookie('token', 'none', {
      expires: fiveSecFromNow,
      httpOnly: true
    })

    try {
      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.LOGOUT,
        data: {}
      })
    } catch (error: any) {
      goodlog.error(error?.message)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_LOGOUT,
        error
      })
    }
  }

  //@desc   Get current logged in user
  //@route  GET /account
  //@access PRIVATE
  @use(LogRequest)
  public static async myAccount(req: any, res: Response, _next: NextFunction) {
    try {
      const user = (await User.findById(req.user.id)) || null

      if (!user) {
        return new ErrorResponse(RESPONSE.error[404], (res.statusCode = Code.NOT_FOUND))
      }
      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success[200],
        data: user
      })
    } catch (error) {
      if (error instanceof Error) {
        goodlog.log(error.message)
        return new ErrorResponse(RESPONSE.error[500], (res.statusCode = Code.INTERNAL_SERVER_ERROR))
      }
    }
  }

  //@desc   Update user details
  //@route  PUT /update
  //@access PRIVATE
  @use(LogRequest)
  public static async updateAccount(req: Request, res: Response, _next: NextFunction) {
    const userId = req.user.id

    const fieldsToUpdate = {
      firstname: req.body.firstname,
      lastname : req.body.lastname,
      username : req.body.username,
      password : req.body.password,
      email    : req.body.email,
      role     : req.body.role,
      avatar   : req.body.avatar,
      location : req.body.location,
      status   : req.body.status
    }

    try {
      const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
        new          : true,
        runValidators: true
      })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.UPDATED,
        data: user
      })
    } catch (error: any) {
      goodlog.error(error?.message)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_UPDATE,
        error
      })
    }
  }

  //@desc   Update Password
  //@route  PUT /update-password
  //@access PRIVATE
  @use(LogRequest)
  public static async updatePassword(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id
    const user   = await User.findById(userId).select('+password')

    if (!user) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(userId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (!(await user?.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, (res.statusCode = Code.UNAUTHORIZED)))
    }

    try {
      user.password = req.body.password
      await user.save()

      AuthController._sendTokenResponse(user, Code.OK, res)
    } catch (error: any) {
      goodlog.error(error?.message)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_UPDATE,
        error
      })
    }
  }

  //@desc   Forgot Password
  //@route  POST /forgot-password
  //@access PUBLIC
  @use(LogRequest)
  public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const userEmail = req.body.email
    const user      = await User.findOne({ email: req.body.email })

    if (!user) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(userEmail), (res.statusCode = Code.NOT_FOUND)))
    }
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const message = RESPONSE.error.RESET_MESSAGE(PathDir.RESET_FULL_EMAIL(req, resetToken))
    try {
      await sendEmail({
        email  : user.email,
        subject: RESPONSE.error.RESET_SUBJECT,
        html   : htmlContent(user, resetToken)
      })
    } catch (error) {
      if (error instanceof Error) {
        goodlog.log(error.message)
        user.resetPasswordToken = ''
        user.resetPasswordExpire = expire

        await user.save({
          validateBeforeSave: false
        })

        return next(new ErrorResponse(RESPONSE.error.FAILED_EMAIL, (res.statusCode = Code.INTERNAL_SERVER_ERROR)))
      }
    }

    try {
      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.EMAIL_SENT,
        data   : user
      })
    } catch (error: any) {
      goodlog.error(error?.message)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_EMAIL,
        error
      })
    }
  }

  //@desc   Reset Password
  //@route PUT /reset-password/:resetToken
  //@access PUBLIC
  @use(LogRequest)
  public static async resetPassword(req: Request, res: Response, next: NextFunction) {
    let resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      return next(new ErrorResponse(RESPONSE.error.INVALID_TOKEN, (res.statusCode = Code.ALREADY_REPORTED)))
    }

    user.password            = req.body.password
    user.resetPasswordToken  = ''
    user.resetPasswordExpire = expire
    await user.save()

    AuthController._sendTokenResponse(user, Code.OK, res)
  }
}

export default AuthController
