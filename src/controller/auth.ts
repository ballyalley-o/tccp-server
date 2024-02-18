import crypto from 'crypto'
import { asyncHandler } from '@middleware'
import { ErrorResponse } from '@util'
import { sendEmail } from '@util'
import { User } from '@model'
import { RESPONSE } from '@constant'
import { Key } from '@constant/enum'
import { thirtyDays } from '@constant'
import { GLOBAL } from '@config'

//@desc   Register user
//@method POST /api/v1/auth/register
//@access Public
const register = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    username,
    role,
    avatar,
    cohort,
    location,
  } = req.body

  //creat user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    username,
    role,
    avatar,
    cohort,
    location,
  })

  sendTokenResponse(user, 200, res)
})

//@desc   Login user
//@method POST /api/v1/auth/login
//@access Public
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
//@method GET /api/v0.1/auth/logout
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
//@method GET /api/v1/auth/me
//@access Private
const myAccount = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body

  res.status(200).json({
    success: true,
    message: RESPONSE.success[200],
    data: req.body,
  })
})

//@desc   Update user details
//@method PUT /api/v1/auth/update_details
//@access Private
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

//Update Password
//PUT /api/v1/auth/update_password
//Private
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

//Forgot Password
//POST/api/v1/auth/forgot_password
//Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const userEmail = req.body.email
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(userEmail), 404))
  }
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  //Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v0.1/auth/reset_password/${resetToken}`

  const message = RESPONSE.error.RESET_MESSAGE(resetUrl)
  try {
    await sendEmail({
      email: user.email,
      subject: RESPONSE.error.RESET_SUBJECT,
      message,
    })

    res.status(200).json({
      success: true,
      data: 'Email sent',
    })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({
      validateBeforeSave: false,
    })

    return next(new ErrorResponse('Email could not be sent', 500))
  }

  res.status(200).json({
    success: true,
    message: RESPONSE.success.EMAIL_SENT,
    data: user,
  })
})

//@desc   Reset Password
//@method PUT /api/v1/auth/resetpassword/:resettoken
//@access Public
const resetPassword = asyncHandler(async (req, res, next) => {
  //get hashed token
  let resetPasswordToken = crypto
    .createHash(Key.CryptoHash)
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new ErrorResponse(RESPONSE.error.INVALID_TOKEN, 400))
  }

  //set new password
  user.password = req.body.password
  resetPasswordToken = ''
  // resetPasswordExpire =
  await user.save()

  sendTokenResponse(user, 200, res)
})

//get token from model, create cookie and send response
const sendTokenResponse = (user: any, statusCode: number, res: any) => {
  //Create Token
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

export {
  register,
  login,
  logout,
  myAccount,
  updateAccount,
  updatePassword,
  forgotPassword,
  resetPassword,
}
