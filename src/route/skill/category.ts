import { Router }                  from 'express'
import { SkillCategoryController } from '@controller/skill'
import { protect, authorizeAction }      from '@route/guard'
import { PathDir }                 from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, SkillCategoryController.getSkillCategories)
router.get(PathDir.ID, SkillCategoryController.getSkillCategory)
router.post(PathDir.ROOT, protect, authorizeAction('create:category'), SkillCategoryController.createSkillCategory)
router.put(PathDir.ID, protect, authorizeAction('update:category'), SkillCategoryController.updateSkillCategory)
router.delete(PathDir.ID, protect, authorizeAction('delete:category'), SkillCategoryController.deleteSkillCategory)

export default router
