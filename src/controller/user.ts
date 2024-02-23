import 'reflect-metadata'
import { Request, Response, NextFunction } from 'express'
import { IResponseExtended } from '@interface'
import { RESPONSE } from '@constant'
import { User } from '@model'
import { Code } from '@constant/enum'
import { use, LogRequest } from '@decorator'

export class UserController {
  //@desc     Get all users
  //@route    GET /api/{apiVer}/auth/users
  //@access   Private/Admin
  @use(LogRequest)
  public static async getUsers(
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    res.status(Code.OK).json((res as IResponseExtended).advancedResult)
  }

  //@desc     Get a user
  //@route    GET /api/{apiVer}/auth/users/:userId
  //@access   Private/Admin
  @use(LogRequest)
  public static async getUser(
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const user = await User.findById(req.params.id)

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success[200],
      data: user,
    })
  }

  //@desc     Create a user
  //@route    POST /api/{apiVer}/auth/user
  //@access   Private/Admin
  @use(LogRequest)
  public static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await User.create(req.body)

    res.status(Code.CREATED).json({
      success: true,
      message: RESPONSE.success[201],
      data: user,
    })
  }

  //@desc     Update a user
  //@route    PUT /api/{apiVer}/auth/user/:id
  //@access   Private/Admin
  @use(LogRequest)
  public static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success.UPDATED,
      data: user,
    })
  }

  //@desc     Delete a user
  //@route    POST /api/{apiVer}/auth/user/:id
  //@access   Private/Admin
  @use(LogRequest)
  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await User.findByIdAndDelete(req.params.id)

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success.DELETED,
      data: {},
    })
  }
}
