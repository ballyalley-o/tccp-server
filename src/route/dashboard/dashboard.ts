import { Router }              from 'express'
import { DashboardController } from '@controller/dashboard'
import { protect }             from '@route/guard'
import { PathDir }             from '@route/dir'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, DashboardController.getDashboard)
router.post(PathDir.EVENT, protect, DashboardController.recordLearningEvent)

/**
 * @path - {baseUrl}/api/{apiVer}/dashboard
 */
export default router
