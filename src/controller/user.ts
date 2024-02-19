import { asyncHandler } from '@middleware'
import { IResponseExtended } from '@interface'
import { RESPONSE } from '@constant'
import { User } from '@model'

//@desc     Get all users
//@route    GET /api/v0.1/auth/users
//@access   Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json((res as IResponseExtended).advancedResults)
})

//@desc     Get a user
//@route    GET /api/v0.1/auth/users/:userId
//@access   Private/Admin
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  res.status(200).json({
    success: true,
    message: RESPONSE.success[200],
    data: user,
  })
})

//@desc     Create a new user
//@route    POST /api/v0.1/auth/users
//@access   Private/Admin
const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  res.status(201).json({
    success: true,
    message: RESPONSE.success[201],
    data: user,
  })
})

//@desc     Update a user
//@route    PUT/api/v0.1/auth/users/:id
//@access   Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    message: RESPONSE.success.UPDATED,
    data: user,
  })
})

//@desc   Delete a user
//@route  PUT/api/v0.1/auth/users/:id
//@access Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    message: RESPONSE.success.DELETED,
    data: {},
  })
})

const userController = { getUsers, getUser, createUser, updateUser, deleteUser }
export default userController
