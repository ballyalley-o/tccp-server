import { Router } from 'express'
import { SystemController } from '@controller/system'
import { PathParam } from '@constant/enum'

const router = Router({ mergeParams: true })

router.get(PathParam.INFO, SystemController.getInfo)
router.get(PathParam.HEALTH, SystemController.getHealth)

/**
 * @path - {baseUrl}/api/{API_VERSION}/system
 */
export default router
