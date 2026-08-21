import { Application }    from 'express'
import { PathDir }        from '@config/dir.config'

import { SkillRoute }         from '@module/skill/skill'
import { SkillCategoryRoute } from '@module/skill/skill.category'

const registerSkillRoute = (app: Application) => {
  app.use(PathDir.SKILL_CATEGORY, SkillCategoryRoute)
  app.use(PathDir.SKILL, SkillRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/skill
 */
export { registerSkillRoute }
