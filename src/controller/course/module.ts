import type { Request, Response, NextFunction } from 'express'
import { use, LogRequest }                      from '@decorator'
import { CourseModule, Course }                 from '@model'
import { Code }                                 from '@constant/enum'
import { RESPONSE }                             from '@constant'
import { ErrorResponse }                        from '@util'

class CourseModuleController {
  @use(LogRequest)
  public static async getCourseModules(req: Request, res: Response) {
    const filter: any = {}
    if (req.query.course) {
      filter.course = req.query.course
    }

    const modules = await CourseModule.find(filter).sort({ order: 1, title: 1 }).lean()
    res.status(Code.OK).json({ success: true, count: modules.length, data: modules })
  }

  @use(LogRequest)
  public static async getCourseModule(req: Request, res: Response, next: NextFunction) {
    const module = await CourseModule.findById(req.params.id).lean()
    if (!module) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    res.status(Code.OK).json({ success: true, data: module })
  }

  @use(LogRequest)
  public static async createCourseModule(req: Request, res: Response, next: NextFunction) {
    const { course, title, labelKey, description, order } = req.body

    if (!course) {
      return next(new ErrorResponse('Course is required', (res.statusCode = Code.BAD_REQUEST)))
    }

    const courseExists = await Course.findById(course).lean()
    if (!courseExists) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(course), (res.statusCode = Code.NOT_FOUND)))
    }

    // attach creator metadata
    const creatorId = (req as any).user?.id
    const module = await CourseModule.create({ course, title, labelKey, description, order, createdBy: creatorId, updatedBy: creatorId })
    res.status(Code.CREATED).json({ success: true, data: module })
  }

  @use(LogRequest)
  public static async updateCourseModule(req: Request, res: Response, next: NextFunction) {
    const updates = req.body
    if (updates.course) {
      const courseExists = await Course.findById(updates.course).lean()
      if (!courseExists) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(updates.course), (res.statusCode = Code.NOT_FOUND)))
      }
    }

    const updated = await CourseModule.findByIdAndUpdate(req.params.id, { ...updates, updatedBy: (req as any).user?.id }, {
      new: true,
      runValidators: true
    }).lean()
    const module = updated
    if (!module) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    res.status(Code.OK).json({ success: true, data: module })
  }

  @use(LogRequest)
  public static async deleteCourseModule(req: Request, res: Response, next: NextFunction) {
    const module = await CourseModule.findById(req.params.id)
    if (!module) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    await module.deleteOne()
    res.status(Code.OK).json({ success: true, message: RESPONSE.success.DELETED })
  }
}

export default CourseModuleController
