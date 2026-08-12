import { Router }                   from 'express'
import { Role }                     from '@model'
import { advancedResult }           from '@middleware'
import { RoleController }           from '@controller/auth'
import { PathDir }                  from '@route/dir'
import { protect, authorizeAction } from '@route/guard'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, advancedResult(Role, ''), RoleController.getRoles)
router.get(PathDir.ID, RoleController.getRole)
router.post(PathDir.ROOT, protect, authorizeAction('create:role'), RoleController.createRole)
router.put(PathDir.ID, protect, authorizeAction('update:role'), RoleController.updateRole)
router.delete(PathDir.ID, protect, authorizeAction('delete:role'), RoleController.deleteRole)

/**
 * @path - {baseUrl}/api/{appVer}/auth/role
 */
export default router
