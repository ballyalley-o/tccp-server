import 'reflect-metadata'
import type { Request, Response, NextFunction } from 'express'
import bcrypt                                   from 'bcryptjs'
import goodlog                                  from 'good-logs'
import GLOBAL                                   from '@config/global.config'
import { AuthUser }                             from '@module/auth/auth.user'
import { AuthRole }                             from '@module/auth/auth.role'
import { use, LogRequest }                      from '@common/decorator'
import { AUTH_KEY, RESPONSE }                   from '@common/constant'
import { Code, NumKey }                         from '@common/constant/enum'
import { cache }                                from '@common/util/cache'
import { ErrorResponse, DataResponse }          from '@common/util'

/**
 * AuthUser Controller
 * @path {baseUrl}/api/{apiVer}/auth/user
 */
class AuthUserController {
  //@desc     Get all users
  //@route    GET /
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async getUsers(_req: Request, res: Response, _next: NextFunction) {
    try {
      res.status(Code.OK).json(res.advanceResult)
    } catch (error: any) {
      goodlog.error(error?.message || error)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_FIND,
        error
      })
    }
  }

  //@desc     Get a user
  //@route    GET /:id
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async getUser(req: Request, res: Response, _next: NextFunction) {
    try {
      const user = await AuthUser.findById(req.params.id)

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success[200],
        data: user
      })
    } catch (error: any) {
      goodlog.error(error?.message)
      res.status(Code.NOT_FOUND).json({
        success: false,
        message: error?.message || RESPONSE.error.NOT_FOUND,
        error
      })
    }
  }

  //@desc     Create a user
  //@route    POST /
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const createdBy = (req as any).user?.id
      const userData  = { ...req.body, createdBy, updatedBy: createdBy }

      const { email, username, role } = userData
      const emailExist                = await AuthUser.findOne({ email })

      if (emailExist) {
        const message = RESPONSE.error.ALREADY_EXISTS(email)
        res.status(Code.FORBIDDEN).json({ message })
        return next(new ErrorResponse(message, (res.statusCode = Code.FORBIDDEN)))
      }

      const usernameExist = await AuthUser.findOne({ username })

      if (usernameExist) {
        const message = RESPONSE.error.ALREADY_EXISTS(username)
        res.status(Code.FORBIDDEN).json({ message })
        return next(new ErrorResponse(message, (res.statusCode = Code.FORBIDDEN)))
      }

      if (role) {
       let roleName = role
       try {
         const roleDoc = await AuthRole.findById(role)

         if (roleDoc) roleName = roleDoc.name
       } catch (e) {
         // ignore - fall back to provided value
       }

       if ((roleName as string) === 'admin' && !req.body.organization) {
        const message = RESPONSE.error.ORG_REQUIRED
        res.status(Code.BAD_REQUEST).json({ message })
        return next(new ErrorResponse(message, (res.statusCode = Code.BAD_REQUEST)))
       }
      }

      const createdUser                          = await AuthUser.create(userData)
      const { password: _password, ...userResp } = createdUser.toObject()

      res.status(Code.CREATED).json({
        success: true,
        message: RESPONSE.success[201],
        data   : userResp
      })
    } catch (error: any) {
      goodlog.error(error?.message)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_CREATE,
        error
      })
    }
  }

  //@desc     Update a user
  //@route    PUT /
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthUser.findByIdAndUpdate(req.params.id, { ...req.body, updatedBy: (req as any).user?.id }, {
        new: true,
        runValidators: true
      })

      if (!user) {
        res.status(Code.NOT_FOUND).json({ message: RESPONSE.error.NOT_FOUND })
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
      }

      if (user.email !== req.body.email) {
        const emailExist = await AuthUser.findOne({ email: req.body.email })
        if (emailExist) {
          res.status(Code.FORBIDDEN).json({ message: RESPONSE.error.ALREADY_EXISTS(req.body.email) })
          return next(new ErrorResponse(RESPONSE.error.ALREADY_EXISTS(req.body.email), (res.statusCode = Code.FORBIDDEN)))
        }
      }

      if (user.username !== req.body.username) {
        const usernameExist = await AuthUser.findOne({ username: req.body.username })
        if (usernameExist) {
          res.status(Code.FORBIDDEN).json({ message: RESPONSE.error.ALREADY_EXISTS(req.body.username) })
          return next(new ErrorResponse(RESPONSE.error.ALREADY_EXISTS(req.body.username), (res.statusCode = Code.FORBIDDEN)))
        }
      }

      if (req.body.role) {
        let roleName = req.body.role
        try {
          const roleDoc = await AuthRole.findById(req.body.role)

          if (roleDoc) roleName = roleDoc.name
        } catch (e) {
          // ignore
        }

        if ((roleName as string) === 'admin' && !req.body.organization) {
          res.status(Code.BAD_REQUEST).json({ message: RESPONSE.error.ORG_REQUIRED })
          return next(new ErrorResponse(RESPONSE.error.ORG_REQUIRED, (res.statusCode = Code.BAD_REQUEST)))
        }
      }

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.UPDATED,
        data: user
      })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_UPDATE,
        error
      })
    }
  }

  //@desc     Delete a user
  //@route    POST /:id
  //@access   PRIVATE/Admin
  @use(LogRequest)
  public static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const user   = await AuthUser.findById(userId).select('+password')

      if (!user) {
        res.status(Code.NOT_FOUND).json({ message: RESPONSE.error.NOT_FOUND })
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(userId), (res.statusCode = Code.NOT_FOUND)))
      }

      if (user.status === 'pending_deletion') {
        return next(new ErrorResponse(RESPONSE.error.ACCOUNT_SCHEDULED_DELETE, (res.statusCode = Code.BAD_REQUEST)))
      }

      const passwordValid = await bcrypt.compare(req.body.password, user.password)

      if (!passwordValid) {
        return next(new ErrorResponse(RESPONSE.error.INVALID_PASSWORD, (res.statusCode = Code.UNAUTHORIZED)))
      }

      const now        = new Date()
      const deleteDate = new Date(now)
      deleteDate.setDate(deleteDate.getDate() + 30)

      user.status             = 'pending_deletion'
      user.deletedAt          = now
      user.deleteScheduledAt  = deleteDate
      user.tokenVersion      += 1

      await user.save()

      await AuthUser.findByIdAndDelete(user._id)

      res.clearCookie(AUTH_KEY.TOKEN, {
        httpOnly: true,
        secure  : process.env.NODE_ENV === 'production'
      })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.DELETED,
        data   : {
          deleteScheduledAt: deleteDate
        }
      })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_DELETE,
        error
      })
    }
  }

  //@desc     Archive my account
  //@route    DELETE /users/me
  //@access   PRIVATE
  public static async archiveMyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const user   = await AuthUser.findById(userId)

      if (!user) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(userId), Code.NOT_FOUND))
      }

      user.status     = 'archived'
      user.archivedAt = new Date()
      user.archivedBy = userId

      user.tokenVersion += 1

      await user.save()

      cache.delete(`user:${userId}`)
      res.clearCookie(AUTH_KEY.TOKEN, {
        httpOnly: true,
        secure  : process.env.NODE_ENV === 'production'
      })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.DELETED_ACCOUNT,
      })
    } catch (error: any) {
      goodlog.error(error?.message)

      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_DELETE_ACCOUNT,
      })
    }
  }

  //@desc     Upload avatar for user
  //@route    PUT /:id/avatar
  //@access   PRIVATE
  @use(LogRequest)
  public static async uploadUserAvatar(req: any, res: Response, next: NextFunction) {
    const userId = req.user.id
    const avatar = req.files.avatar
    const user   = await AuthUser.findById(userId)

    if (!user) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(userId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (!req.files) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, (res.statusCode = Code.BAD_REQUEST)))
    }

    if (!avatar.mimetype.startsWith('image')) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD_AVATAR, (res.statusCode = Code.BAD_REQUEST)))
    }

    if (avatar.size > GLOBAL.MAX_AVATAR_UPLOAD) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_FILESIZE(NumKey.FIVE_HUNDRED_KB), (res.statusCode = Code.BAD_REQUEST)))
    }

    avatar.name = GLOBAL.AVATAR_FILENAME(user._id, avatar.name)
    GLOBAL.AVATAR_UPLOAD_MV(avatar, user, async (error: any) => {
      goodlog.error(error?.message)
      if (error) {
        return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, (res.statusCode = Code.INTERNAL_SERVER_ERROR)))
      }
      try {
        await AuthUser.findByIdAndUpdate(userId, {
          avatar: avatar.name
        })

        const response = DataResponse.success(
          {
            photo: avatar.name,
            user : user.firstname
          },
          userId
        )

        res.status(Code.OK).json({
          success: true,
          message: RESPONSE.success.AVATAR_UPLOADED,
          response
        })
      } catch (error: any) {
        goodlog.error(error?.message || error)
        res.status(Code.BAD_REQUEST).json({
          success: false,
          message: error?.message || RESPONSE.error.FAILED_UPLOAD,
          error
        })
      }
    })
  }
}

export default AuthUserController
