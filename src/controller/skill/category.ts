import type { Request, Response, NextFunction } from 'express'
import { use, LogRequest }                      from '@decorator'
import { SkillCategory }                        from '@model'
import { Code, Key }                            from '@constant/enum'
import { RESPONSE }                             from '@constant'
import { ErrorResponse }                        from '@util'

class SkillCategoryController {
  @use(LogRequest)
  public static async getSkillCategories(_req: Request, res: Response) {
    const categories = await SkillCategory.find().sort({ order: 1, name: 1 }).lean()
    res.status(Code.OK).json({ success: true, count: categories.length, data: categories })
  }

  @use(LogRequest)
  public static async getSkillCategory(req: Request, res: Response, next: NextFunction) {
    const category = await SkillCategory.findById(req.params.id).lean()
    if (!category) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    res.status(Code.OK).json({ success: true, data: category })
  }

  @use(LogRequest)
  public static async createSkillCategory(req: Request, res: Response) {
    const { name, labelKey, description, order } = req.body
    const creatorId = (req as any).user?.id
    const skillCategory = await SkillCategory.create({ name, labelKey, description, order, createdBy: creatorId, updatedBy: creatorId })
    res.status(Code.CREATED).json({ success: true, data: skillCategory })
  }

  @use(LogRequest)
  public static async updateSkillCategory(req: Request, res: Response, next: NextFunction) {
    const updates = req.body
    const category = await SkillCategory.findByIdAndUpdate(req.params.id, { ...updates, updatedBy: (req as any).user?.id }, {
      new: true,
      runValidators: true
    }).lean()
    if (!category) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    res.status(Code.OK).json({ success: true, data: category })
  }

  @use(LogRequest)
  public static async deleteSkillCategory(req: Request, res: Response, next: NextFunction) {
    const category = await SkillCategory.findById(req.params.id)
    if (!category) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    await category.deleteOne()
    res.status(Code.OK).json({ success: true, message: RESPONSE.success.DELETED })
  }
}

export default SkillCategoryController
