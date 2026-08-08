import { Router } from 'express'
import { protect, authorizeAction } from '@route/guard'
import { SkillController } from '@controller/skill'
import { PathDir } from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, SkillController.getSkills)
router.get(PathDir.ID, SkillController.getSkill)
router.post(PathDir.ROOT, protect, authorizeAction('create:skill'), SkillController.createSkill)
router.put(PathDir.ID, protect, authorizeAction('update:skill'), SkillController.updateSkill)
router.delete(PathDir.ID, protect, authorizeAction('delete:skill'), SkillController.deleteSkill)

export default router
