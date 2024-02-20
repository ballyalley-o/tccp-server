import 'reflect-metadata'
import { Request, Response, NextFunction } from 'express'
import { asyncHandler } from '@middleware'
import { IResponseExtended } from '@interface'
import { IExpressController } from '@interface/middleware'
import { RESPONSE } from '@constant'
import { User } from '@model'

export class UserController {
  //@desc     Get all users
  //@route    GET /api/{apiVer}/auth/users
  //@access   Private/Admin
  // @use(LogRequest)
  public static getUsers: IExpressController = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      res.status(200).json((res as IResponseExtended).advancedResult)
    }
  )

  //@desc     Get a user
  //@route    GET /api/{apiVer}/auth/users/:userId
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
