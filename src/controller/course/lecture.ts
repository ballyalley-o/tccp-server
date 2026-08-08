import type { Request, Response, NextFunction } from 'express'
import { use, LogRequest }                      from '@decorator'
import { CourseLecture, CourseModule, Course }  from '@model'
import { Code }                                 from '@constant/enum'
import { RESPONSE }                             from '@constant'
import { ErrorResponse }                        from '@util'

class CourseLectureController {
  @use(LogRequest)
  public static async getCourseLectures(req: Request, res: Response) {
    const filter: any = {}
    if (req.query.course) {
      filter.course = req.query.course
    }
    if (req.query.module) {
      filter.module = req.query.module
    }

    const lectures = await CourseLecture.find(filter).sort({ order: 1, title: 1 }).lean()
    res.status(Code.OK).json({ success: true, count: lectures.length, data: lectures })
  }

  @use(LogRequest)
  public static async getCourseLecture(req: Request, res: Response, next: NextFunction) {
    const lecture = await CourseLecture.findById(req.params.id).lean()
    if (!lecture) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    res.status(Code.OK).json({ success: true, data: lecture })
  }

  @use(LogRequest)
  public static async createCourseLecture(req: Request, res: Response, next: NextFunction) {
    const { course, module, title, labelKey, description, content, resources, durationMinutes, order } = req.body

    if (!course || !module) {
      return next(new ErrorResponse('Course and module are required', (res.statusCode = Code.BAD_REQUEST)))
    }

    const courseExists = await Course.findById(course).lean()
    const moduleExists = await CourseModule.findById(module).lean()
    if (!courseExists || !moduleExists) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(course || module), (res.statusCode = Code.NOT_FOUND)))
    }

    const creatorId = (req as any).user?.id
    const lecture = await CourseLecture.create({
      course,
      module,
      title,
      labelKey,
      description,
      content,
      resources,
      durationMinutes,
      order,
      createdBy: creatorId,
      updatedBy: creatorId
    })
    res.status(Code.CREATED).json({ success: true, data: lecture })
  }

  @use(LogRequest)
  public static async updateCourseLecture(req: Request, res: Response, next: NextFunction) {
    const updates = req.body

    if (updates.course) {
      const courseExists = await Course.findById(updates.course).lean()
      if (!courseExists) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(updates.course), (res.statusCode = Code.NOT_FOUND)))
      }
    }
    if (updates.module) {
      const moduleExists = await CourseModule.findById(updates.module).lean()
      if (!moduleExists) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(updates.module), (res.statusCode = Code.NOT_FOUND)))
      }
    }

    const lecture = await CourseLecture.findByIdAndUpdate(req.params.id, { ...updates, updatedBy: (req as any).user?.id }, {
      new: true,
      runValidators: true
    }).lean()
    if (!lecture) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }

    res.status(Code.OK).json({ success: true, data: lecture })
  }

  @use(LogRequest)
  public static async deleteCourseLecture(req: Request, res: Response, next: NextFunction) {
    const lecture = await CourseLecture.findById(req.params.id)
    if (!lecture) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    await lecture.deleteOne()
    res.status(Code.OK).json({ success: true, message: RESPONSE.success.DELETED })
  }
}

export default CourseLectureController
