import crypto from 'crypto'
import goodlog from 'good-logs'
import { asyncHandler } from '@middleware'
import { ErrorResponse } from '@util'
import { sendEmail } from '@util'
import { User } from '@model'
import { RESPONSE } from '@constant'
import { Key, PathParam } from '@constant/enum'
import { thirtyDays } from '@constant'
import { GLOBAL } from '@config'
import { expire } from '@constant/max-age'
import { PathDir } from '@constant'

/**
 * @path {baseUrl}/api/v1/auth
 */
//@desc   Register user
//@route  POST /register
//@access PUBLIC
const register = asyncHandler(async (req, res, next) => {
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

  sendTokenResponse(user, 200, res)
})

//@desc   Login user
//@route  POST /api/v1/auth/login
//@access PUBLIC
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, 400))
  }

  const user = await User.findOne({ email }).select(Key.Password)

  if (!user) {
    return next(new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, 401))
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, 401))
  }

  sendTokenResponse(user, 200, res)
})

//@desc   Get Log out User
//@route GET /api/v0.1/auth/logout
//@access Private
const logout = asyncHandler(async (req, res, next) => {
  res.cookie(Key.Token, Key.None, {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: RESPONSE.success.LOGOUT,
    data: {},
  })
})

//@desc   Get current logged in user
//@route  GET /account
//@access PRIVATE
const myAccount = asyncHandler(async (req: any, res, next) => {
  const user = (await User.findById(req.user.id)) || null

  res.status(200).json({
    success: true,
    message: RESPONSE.success[200],
    data: user,
  })
})

//@desc   Update user details
//@route  PUT /update
//@access PRIVATE
const updateAccount = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.body.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    message: RESPONSE.success.UPDATED,
    data: user,
  })
})

//@desc   Update Password
//@route  PUT /update-password
//@access PRIVATE
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.user.id).select(Key.Password)

  //check current password
  if (!(await user?.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(RESPONSE.error.INVALID_CREDENTIAL, 401))
  }

  if (user) {
    user.password = req.body.password
  }
  await user?.save()

  sendTokenResponse(user, 200, res)
})

//@desc   Forgot Password
//@route  POST /forgot-password
//@access PUBLIC
const forgotPassword = asyncHandler(async (req, res, next) => {
  const userEmail = req.body.email
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(userEmail), 404))
  }
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // TODO: refax the hard coded url to path-dir
  const resetUrl = `${req.protocol}://${req.get('host')}${
    PathDir.RESET_URL
  }/${resetToken}`

  const message = RESPONSE.error.RESET_MESSAGE(resetUrl)
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

      return next(new ErrorResponse(RESPONSE.error.FAILED_EMAIL, 500))
    }
  }

  res.status(200).json({
    success: true,
    message: RESPONSE.success.EMAIL_SENT,
    data: user,
  })
})

//@desc   Reset Password
//@method PUT /reset-password/:resetToken
//@access PUBLIC
const resetPassword = asyncHandler(async (req, res, next) => {
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

  sendTokenResponse(user, 200, res)
})

const sendTokenResponse = (user: any, statusCode: number, res: any) => {
  const token = user.getSignedJwtToken()
  const options = {
    expires: new Date(Date.now() + thirtyDays),
    httpOnly: true,
    secure: true, // Add the 'secure' property with a value of true
  }

  if (GLOBAL.ENV === Key.Production) {
    options.secure = true
  }
  res.status(statusCode).cookie(Key.Token, token, options).json({
    success: true,
    token,
  })
}

const authController = {
  register,
  login,
  logout,
  myAccount,
  updateAccount,
  updatePassword,
  forgotPassword,
  resetPassword,
}
export default authController
