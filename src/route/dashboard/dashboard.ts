import { Router } from 'express'
import { PathDir } from '@route/dir'
import DashboardController from '@controller/dashboard'
import { protect } from '@route/guard'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, DashboardController.getDashboard)
router.post(PathDir.EVENT, protect, DashboardController.recordLearningEvent)

export default router
