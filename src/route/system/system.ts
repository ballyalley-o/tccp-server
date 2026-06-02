import { Router } from 'express'
import { SystemController } from '@controller/system'
import { PathDir } from '@route/dir'
import { pathBuilder } from '@util'

const router = Router({ mergeParams: true })

router.get(PathDir.INFO, SystemController.getInfo)
router.get(PathDir.HEALTH, SystemController.getHealth)

/**
 * @path - {baseUrl}/api/{API_VERSION}/system
 */
export default router