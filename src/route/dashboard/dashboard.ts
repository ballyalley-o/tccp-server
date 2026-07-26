import { Router } from 'express'
import { PathDir } from '@route/dir'
import DashboardController from '@controller/dashboard'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, DashboardController.getDashboard)

export default router
