import 'reflect-metadata'
import { Request, Response, NextFunction } from 'express'
import goodlog from 'good-logs'
import { IResponseExtended } from '@interface'
import { Key, Code, NumKey } from '@constant/enum'
import { RESPONSE } from '@constant'
import { GLOBAL } from '@config'
import { ErrorResponse, DataResponse } from '@util'
import { User } from '@model'
import { use, LogRequest } from '@decorator'

/**
 * User Controller
 * @path {baseUrl}/api/{apiVer}/auth/user
 */
export class UserController {
  private static _userId: string

  /**
   *  setUserId - Set request id  parameters
   *
   * @param req - Request
   * @returns void
   */
  static setUserId(req: any) {
    this._userId = req.user.id
  }
  //@desc     Get all users
  //@route    GET /
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async getUsers(_req: Request, res: Response, _next: NextFunction) {
    res.status(Code.OK).json((res as IResponseExtended).advancedResult)
  }

  //@desc     Get a user
  //@route    GET /:id
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async getUser(req: Request, res: Response, _next: NextFunction) {
    const user = await User.findById(req.params.id)

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success[200],
      data: user
    })
  }

  //@desc     Create a user
  //@route    POST /
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async createUser(req: Request, res: Response, next: NextFunction) {
    const user = await User.create(req.body)
    const { email, username } = req.body
    const emailExist = await User.findOne({ email })
    const usernameExist = await User.findOne({ username })

    if (emailExist) {
      res.status(Code.FORBIDDEN).json({ message: RESPONSE.error.ALREADY_EXISTS(email) })
      return next(new ErrorResponse(RESPONSE.error.ALREADY_EXISTS(email), Code.FORBIDDEN))
    }

    if (usernameExist) {
      res.status(Code.FORBIDDEN).json({ message: RESPONSE.error.ALREADY_EXISTS(email) })
      return next(new ErrorResponse(RESPONSE.error.ALREADY_EXISTS(username), Code.FORBIDDEN))
    }

    res.status(Code.CREATED).json({
      success: true,
      message: RESPONSE.success[201],
      data: user
    })
  }

  //@desc     Update a user
  //@route    PUT /:id
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async updateUser(req: Request, res: Response, next: NextFunction) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!user) {
      res.status(Code.NOT_FOUND).json({ message: RESPONSE.error.NOT_FOUND })
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), Code.NOT_FOUND))
    }

    if (user.email !== req.body.email) {
      const emailExist = await User.findOne({ email: req.body.email })
      if (emailExist) {
        res.status(Code.FORBIDDEN).json({ message: RESPONSE.error.ALREADY_EXISTS(req.body.email) })
        return next(new ErrorResponse(RESPONSE.error.ALREADY_EXISTS(req.body.email), Code.FORBIDDEN))
      }
    }

    if (user.username !== req.body.username) {
      const usernameExist = await User.findOne({ username: req.body.username })
      if (usernameExist) {
        res.status(Code.FORBIDDEN).json({ message: RESPONSE.error.ALREADY_EXISTS(req.body.username) })
        return next(new ErrorResponse(RESPONSE.error.ALREADY_EXISTS(req.body.username), Code.FORBIDDEN))
      }
    }

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success.UPDATED,
      data: user
    })
  }

  //@desc     Delete a user
  //@route    POST /:id
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async deleteUser(req: Request, res: Response, next: NextFunction) {
    await User.findByIdAndDelete(req.params.id)

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success.DELETED,
      data: {}
    })
  }

  //@desc     Upload avatar for user
  //@route    PUT /:id/avatar
  //@access   PRIVATE
  @use(LogRequest)
  public static async uploadUserAvatar(req: any, res: Response, next: NextFunction) {
    UserController.setUserId(req)
    const avatar = req.files.avatar
    const user = await User.findById(UserController._userId)

    if (!user) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(UserController._userId), Code.NOT_FOUND))
    }

    if (!req.files) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, Code.BAD_REQUEST))
    }

    if (!avatar.mimetype.startsWith(Key.Image)) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD_AVATAR, Code.BAD_REQUEST))
    }

    if (avatar.size > GLOBAL.MAX_AVATAR_UPLOAD) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_FILESIZE(NumKey.FIVE_HUNDRED_KB), Code.BAD_REQUEST))
    }

    avatar.name = GLOBAL.AVATAR_FILENAME(user._id, avatar.name)
    GLOBAL.AVATAR_UPLOAD_MV(avatar, user, async (error: any) => {
      goodlog.error(error?.message)
      if (error) {
        return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, Code.INTERNAL_SERVER_ERROR))
      }

      await User.findByIdAndUpdate(UserController._userId, {
        avatar: avatar.name
      })

      const response = DataResponse.success(
        {
          photo: avatar.name,
          user: user.firstname
        },
        UserController._userId
      )

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.AVATAR_UPLOADED,
        response
      })
    })
  }
}
