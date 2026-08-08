import { Router }             from 'express'
import { protect, authorize } from '@route/guard'
import { SkillController }    from '@controller/skill'
import { PathDir }            from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, SkillController.getSkills)
router.get(PathDir.ID, SkillController.getSkill)
router.post(PathDir.ROOT, protect, authorize('trainer', 'admin'), SkillController.createSkill)
router.put(PathDir.ID, protect, authorize('trainer', 'admin'), SkillController.updateSkill)
router.delete(PathDir.ID, protect, authorize('trainer', 'admin'), SkillController.deleteSkill)

/**
 * @path - {baseUrl}/api/{appVer}/auth
 */
export default router
