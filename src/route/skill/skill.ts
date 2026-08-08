import { Router }             from 'express'
import { SkillController }    from '@controller/skill'
import { Skill }              from '@model'
import { advancedResult }     from '@middleware'
import { protect, authorizeAction } from '@route/guard'
import { PathDir }            from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, advancedResult(Skill, [
      {
        path  : 'category',
        select: '_id name labelKey'
      }
    ]), SkillController.getSkills)
router.get(PathDir.ID, SkillController.getSkill)
router.post(PathDir.ROOT, protect, authorizeAction('create:skill'), SkillController.createSkill)
router.put(PathDir.ID, protect, authorizeAction('update:skill'), SkillController.updateSkill)
router.delete(PathDir.ID, protect, authorizeAction('delete:skill'), SkillController.deleteSkill)

export default router
