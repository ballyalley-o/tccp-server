import { Router }                  from 'express'
import { SkillCategoryController } from '@controller/skill'
import { protect, authorize }      from '@route/guard'
import { PathDir }                 from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, SkillCategoryController.getSkillCategories)
router.get(PathDir.ID, SkillCategoryController.getSkillCategory)
router.post(PathDir.ROOT, protect, authorize('trainer', 'admin'), SkillCategoryController.createSkillCategory)
router.put(PathDir.ID, protect, authorize('trainer', 'admin'), SkillCategoryController.updateSkillCategory)
router.delete(PathDir.ID, protect, authorize('trainer', 'admin'), SkillCategoryController.deleteSkillCategory)

export default router
