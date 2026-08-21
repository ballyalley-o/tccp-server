import { Router }                       from 'express'
import { PathDir }                      from '@config/dir.config'
import { AuthRole, AuthRoleController } from '@module/auth'
import { advancedResult }               from '@common/middleware'
import { authorizeAction }              from '@common/security/guard'
import { protect }                      from '@common/security/protect'

const router = Router({ mergeParams: true })

router.get(
  PathDir.ROOT,
  advancedResult(AuthRole, '', {
    select: ['_id', 'name', 'label', 'actions', 'createdAt', 'updatedAt'],
    sort  : ['name', 'label', 'createdAt', 'updatedAt']
  }),
  AuthRoleController.getRoles
)
router.get(PathDir.ID, AuthRoleController.getRole)
router.post(PathDir.ROOT, protect, authorizeAction('create:role'), AuthRoleController.createRole)
router.put(PathDir.ID, protect, authorizeAction('update:role'), AuthRoleController.updateRole)
router.delete(PathDir.ID, protect, authorizeAction('delete:role'), AuthRoleController.deleteRole)

/**
 * @path - {baseUrl}/api/{apiVer}/auth/role/...
 */
export default router
