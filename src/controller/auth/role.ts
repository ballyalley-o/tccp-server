import type { Request, Response, NextFunction } from 'express'
import { use, LogRequest }                      from '@decorator'
import { Role }                                 from '@model'
import { Code }                                 from '@constant/enum'
import { RESPONSE }                             from '@constant'
import { ErrorResponse }                        from '@util'

class RoleController {
  @use(LogRequest)
  public static async getRoles(req: Request, res: Response) {
    res.status(Code.OK).json(res.advanceResult)
  }

  @use(LogRequest)
  public static async getRole(req: Request, res: Response, next: NextFunction) {
    const role = await Role.findById(req.params.id).lean()
    if (!role) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    res.status(Code.OK).json({ success: true, data: role })
  }

  @use(LogRequest)
  public static async createRole(req: Request, res: Response, next: NextFunction) {
    const { name, label, actions } = req.body


    const role = await Role.create({ name, label, actions })
    res.status(Code.CREATED).json({ success: true, data: role })
  }

  @use(LogRequest)
  public static async updateRole(req: Request, res: Response, next: NextFunction) {
    const updates = req.body

    const role = await Role.findByIdAndUpdate(req.params.id, updates, {
      new          : true,
      runValidators: true
    })
      .lean()

    if (!role) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }

    res.status(Code.OK).json({ success: true, data: role })
  }

  @use(LogRequest)
  public static async deleteRole(req: Request, res: Response, next: NextFunction) {
    const role = await Role.findById(req.params.id)
    if (!role) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    await role.deleteOne()
    res.status(Code.OK).json({ success: true, message: RESPONSE.success.DELETED })
  }
}

export default RoleController
