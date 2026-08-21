import type { Request, Response, NextFunction } from 'express'
import { Skill, SkillCategory }                 from '@module/skill'
import { use, LogRequest }                      from '@common/decorator'
import { RESPONSE }                             from '@common/constant'
import { Code }                                 from '@common/constant/enum'
import { ErrorResponse }                        from '@common/util'

class SkillController {
  @use(LogRequest)
  public static async getSkills(req: Request, res: Response) {
    const filter: any = {}
    if (req.query.category) {
      filter.category = req.query.category
    }

    res.status(Code.OK).json(res.advanceResult)
  }

  @use(LogRequest)
  public static async getSkill(req: Request, res: Response, next: NextFunction) {
    const skill = await Skill.findById(req.params.id).populate('category').lean()
    if (!skill) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    res.status(Code.OK).json({ success: true, data: skill })
  }

  @use(LogRequest)
  public static async createSkill(req: Request, res: Response, next: NextFunction) {
    const { name, labelKey, description, category, order } = req.body

    if (!category) {
      return next(new ErrorResponse(RESPONSE.error.IS_REQUIRED('category'), (res.statusCode = Code.BAD_REQUEST)))
    }

    const categoryExists = await SkillCategory.findById(category).lean()
    if (!categoryExists) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(category), (res.statusCode = Code.NOT_FOUND)))
    }

    const creatorId = (req as any).user?.id
    const skill = await Skill.create({ name, labelKey, description, category, order, createdBy: creatorId, updatedBy: creatorId })
    res.status(Code.CREATED).json({ success: true, data: skill })
  }

  @use(LogRequest)
  public static async updateSkill(req: Request, res: Response, next: NextFunction) {
    const updates = req.body
    if (updates.category) {
      const categoryExists = await SkillCategory.findById(updates.category).lean()
      if (!categoryExists) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(updates.category), (res.statusCode = Code.NOT_FOUND)))
      }
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, { ...updates, updatedBy: (req as any).user?.id }, {
      new          : true,
      runValidators: true
    })
      .populate('category')
      .lean()

    if (!skill) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }

    res.status(Code.OK).json({ success: true, data: skill })
  }

  @use(LogRequest)
  public static async deleteSkill(req: Request, res: Response, next: NextFunction) {
    const skill = await Skill.findById(req.params.id)
    if (!skill) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND(req.params.id), (res.statusCode = Code.NOT_FOUND)))
    }
    await skill.deleteOne()
    res.status(Code.OK).json({ success: true, message: RESPONSE.success.DELETED })
  }
}

export default SkillController
