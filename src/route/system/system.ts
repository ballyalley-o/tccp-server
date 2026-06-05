import { Router } from 'express'
import { SystemController } from '@controller/system'
import { PathDir } from '@route/dir'
import { protect, authorize } from '@route/guard';

const router = Router({ mergeParams: true })

router.get(PathDir.INFO, protect, authorize('admin'), SystemController.getInfo)
router.get(PathDir.HEALTH, protect, authorize('admin'), SystemController.getHealth)

/**
 * @path - {baseUrl}/api/{API_VERSION}/system
 */
export default router