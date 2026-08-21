import { Router }              from 'express'
import { DashboardController } from '@module/dashboard'
import { protect }             from '@common/security/protect'
import { PathDir }             from '@config/dir.config'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, DashboardController.getDashboard)
router.post(PathDir.EVENT, protect, DashboardController.recordLearningEvent)

/**
 * @path - {baseUrl}/api/{apiVer}/dashboard/...
 */
export default router
