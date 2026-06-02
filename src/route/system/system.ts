import { Router } from 'express'
import { SystemController } from '@controller/system'
import { PathDir } from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.SYSTEM_INFO, SystemController.getInfo)
router.get(PathDir.SYSTEM_HEALTH, SystemController.getHealth)

/**
 * @path - {baseUrl}/api/{API_VERSION}/system
 */
export default router
