import { Router } from 'express'
import { SystemController } from '@controller/system'
import { PathDir } from '@route/dir'
import { protect, authorizeAction } from '@route/guard';

const router = Router({ mergeParams: true })

router.get(PathDir.INFO, protect, authorizeAction('manage:any'), SystemController.getInfo)
router.get(PathDir.HEALTH, protect, authorizeAction('manage:any'), SystemController.getHealth)

/**
 * @path - {baseUrl}/api/{apiVer}/system
 */
export default router