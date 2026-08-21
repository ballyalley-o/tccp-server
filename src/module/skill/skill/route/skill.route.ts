import { Router }                   from 'express'
import { MODULE }                   from '@config/module.config'
import { PathDir }                  from '@config/dir.config'
import { Skill, SkillController }   from '@module/skill'
import { advancedResult }           from '@common/middleware'
import { authorizeAction }          from '@common/security/guard'
import { protect }                  from '@common/security/protect'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, advancedResult(Skill,
      {
        path  : MODULE.Skill.submodule.SkillCategory.name,
        select: '_id name labelKey'
      },
      {
        select : ['_id', 'name', 'labelKey', 'description', 'category', 'order'],
        sort   : ['name', 'labelKey', 'order', 'createdAt', 'updatedAt'],
        include: {
          category: {
            path  : MODULE.Skill.submodule.SkillCategory.name,
            select: '_id name labelKey order'
          }
        }
      }
    ), SkillController.getSkills)
router.get(PathDir.ID, SkillController.getSkill)
router.post(PathDir.ROOT, protect, authorizeAction('create:skill'), SkillController.createSkill)
router.put(PathDir.ID, protect, authorizeAction('update:skill'), SkillController.updateSkill)
router.delete(PathDir.ID, protect, authorizeAction('delete:skill'), SkillController.deleteSkill)

/**
 * @path - {baseUrl}/api/{apiVer}/skill/...
 */
export default router
