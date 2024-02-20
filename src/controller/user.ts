import 'reflect-metadata'
import { Request, Response, NextFunction } from 'express'
import { asyncHandler } from '@middleware'
import { IResponseExtended } from '@interface'
import { IExpressController } from '@interface/middleware'
import { RESPONSE } from '@constant'
import { User } from '@model'
import { use, LogRequest, controller, get } from '@decorator'

interface IUserController {
  getUsers: IExpressController
  getUser: IExpressController
  createUser: IExpressController
  updateUser: IExpressController
  deleteUser: IExpressController
}

export class UserController {
  //@desc     Get all users
  //@route    GET /api/v0.1/auth/users
  //@access   Private/Admin
  // @use(LogRequest)
  public static getUsers: IExpressController = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      res.status(200).json((res as IResponseExtended).advancedResult)
    }
  )

  //@desc     Get a user
  //@route    GET /api/v0.1/auth/users/:userId
  //@access   Private/Admin
  // @use(LogRequest)
  public static getUser: IExpressController = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const user = await User.findById(req.params.id)

      res.status(200).json({
        success: true,
        message: RESPONSE.success[200],
        data: user,
      })
    }
  )

  // @use(LogRequest)
  public static createUser: IExpressController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.create(req.body)

      res.status(201).json({
        success: true,
        message: RESPONSE.success[201],
        data: user,
      })
    }
  )

  // @use(LogRequest)
  public static updateUser: IExpressController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })

      res.status(200).json({
        success: true,
        message: RESPONSE.success.UPDATED,
        data: user,
      })
    }
  )

  // @use(LogRequest)
  public static deleteUser: IExpressController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await User.findByIdAndDelete(req.params.id)

      res.status(200).json({
        success: true,
        message: RESPONSE.success.DELETED,
        data: {},
      })
    }
  )
}
//   //@desc     Create a new user
//   //@route    POST /api/v0.1/auth/users
//   //@access   Private/Admin
//   createUser(req: Request, res: Response, next: NextFunction) {
//     const user = User.create(req.body)

//     res.status(201).json({
//       success: true,
//       message: RESPONSE.success[201],
//       data: user,
//     })
//   }
// }
// const getUsers = asyncHandler(async (req, res, next) => {
//   res.status(200).json((res as IResponseExtended).advancedResult)
// })

// //@desc     Update a user
// //@route    PUT/api/v0.1/auth/users/:id
// //@access   Private/Admin
// const updateUser = asyncHandler(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   })

//   res.status(200).json({
//     success: true,
//     message: RESPONSE.success.UPDATED,
//     data: user,
//   })
// })

//@desc   Delete a user
//@route  PUT/api/v0.1/auth/users/:id
//@access Private/Admin
// const deleteUser = asyncHandler(async (req, res, next) => {
//   await User.findByIdAndDelete(req.params.id)

//   res.status(200).json({
//     success: true,
//     message: RESPONSE.success.DELETED,
//     data: {},
//   })
// })

// const userController = {
//   getUser,
//   createUser,
//   updateUser,
//   deleteUser,
// }
// export { UserController }
