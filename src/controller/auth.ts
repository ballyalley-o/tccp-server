import crypto from 'crypto'
import goodlog from 'good-logs'
import { IExpressController } from '@interface/middleware'
import { asyncHandler } from '@middleware'
import { ErrorResponse } from '@util'
import { sendEmail } from '@util'
import { User } from '@model'
import { Key, Code } from '@constant/enum'
import {
  RESPONSE,
  PathDir,
  thirtyDaysFromNow,
  fiveSecFromNow,
  expire,
} from '@constant'

/**
 * @path {baseUrl}/api/v1/auth
 */

class AuthController {
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
    })
  }

  //@desc   Register user
  //@route  POST /register
  //@access PUBLIC
  public static register: IExpressController = asyncHandler(
    async (req, res, next) => {
      const {
        firstName,
        lastName,
        email,
        password,
        username,
        role,
        avatar,
        location,
      } = req.body

      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        username,
        role,
        avatar,
        location,
      })
      this._sendTokenResponse(user, Code.OK, res)
    }
  )

  //@desc   Login user
  //@route  POST /api/v1/auth/login
  //@access PUBLIC
  public static login: IExpressController = asyncHandler(
    async (req, res, next) => {
      const { email, password } = req.body

      if (!email || !password) {
        return next(
          new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, Code.BAD_REQUEST)
        )
      }

      const user = await User.findOne({ email }).select(Key.Password)

      if (!user) {
        return next(
          new ErrorResponse(
            RESPONSE.error.INVALID_CREDENTIAL,
            Code.UNAUTHORIZED
          )
        )
      }

      const isMatch = await user.matchPassword(password)

      if (!isMatch) {
        return next(
          new ErrorResponse(
            RESPONSE.error.INVALID_CREDENTIAL,
            Code.UNAUTHORIZED
          )
        )
      }

      this._sendTokenResponse(user, Code.OK, res)
    }
  )

  //@desc   Get Log out User
  //@route GET /api/v0.1/auth/logout
  //@access Private
  public static logout: IExpressController = asyncHandler(
    async (req, res, next) => {
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
  )

  //@desc   Get current logged in user
  //@route  GET /account
  //@access PRIVATE
  public static myAccount: IExpressController = asyncHandler(
    async (req: any, res, next) => {
      const user = (await User.findById(req.user.id)) || null

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success[200],
        data: user,
      })
    }
  )

  //@desc   Update user details
  //@route  PUT /update
  //@access PRIVATE
  public static updateAccount: IExpressController = asyncHandler(
    async (req, res, next) => {
      const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      }

      const user = await User.findByIdAndUpdate(
        req.body.user.id,
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
  )

  //@desc   Update Password
  //@route  PUT /update-password
  //@access PRIVATE
  public static updatePassword: IExpressController = asyncHandler(
    async (req, res, next) => {
      const user = await User.findById(req.body.user.id).select(Key.Password)

      if (!(await user?.matchPassword(req.body.currentPassword))) {
        return next(
          new ErrorResponse(
            RESPONSE.error.INVALID_CREDENTIAL,
            Code.UNAUTHORIZED
          )
        )
      }

      if (user) {
        user.password = req.body.password
      }
      await user?.save()

      this._sendTokenResponse(user, Code.OK, res)
    }
  )

  //@desc   Forgot Password
  //@route  POST /forgot-password
  //@access PUBLIC
  public static forgotPassword: IExpressController = asyncHandler(
    async (req, res, next) => {
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
          message,
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

      res.status(200).json({
        success: true,
        message: RESPONSE.success.EMAIL_SENT,
        data: user,
      })
    }
  )

  //@desc   Reset Password
  //@method PUT /reset-password/:resetToken
  //@access PUBLIC
  public static resetPassword: IExpressController = asyncHandler(
    async (req, res, next) => {
      let resetPasswordToken = crypto
        .createHash(Key.CryptoHash)
        .update(req.params.resetToken)
        .digest(Key.Hex)

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      })

      if (!user) {
        return next(new ErrorResponse(RESPONSE.error.INVALID_TOKEN, 400))
      }

      user.password = req.body.password
      user.resetPasswordToken = ''
      user.resetPasswordExpire = expire
      await user.save()

      this._sendTokenResponse(user, 200, res)
    }
  )
}

export default AuthController
