import { Router }                   from 'express'
import { PathDir }                  from '@config/dir.config'
import { authorizeAction }          from '@common/security/guard'
import { protect }                  from '@common/security/protect'

import AdminSystemController        from '@module/admin/admin.system/controller/admin.system.controller'

const router = Router({ mergeParams: true })

router.get(PathDir.INFO, protect, authorizeAction('manage:any'), AdminSystemController.getInfo)
router.get(PathDir.HEALTH, protect, authorizeAction('manage:any'), AdminSystemController.getHealth)

/**
 * @path - {baseUrl}/api/{apiVer}/admin/system/...
 */
export default router
