import { Application }    from 'express'
import { PathDir }        from '@route/dir'

import skillRoute         from './skill'
import skillCategoryRoute from './category'

const linkSkillRoute = (app: Application) => {
  app.use(PathDir.SKILL_CATEGORY, skillCategoryRoute)
  app.use(PathDir.SKILL, skillRoute)
}

/**
 * @path - {baseUrl}/api/{apiVer}/skill
 */
export { linkSkillRoute }
