import { Router }                       from 'express'
import { PathDir }                      from '@config/dir.config'
import { MODULE }                       from '@config/module.config'
import { AuthUser, AuthUserController } from '@module/auth'
import { advancedResult }               from '@common/middleware'
import { authorizeAction }              from '@common/security/guard'
import { protect }                      from '@common/security/protect'

const router = Router({ mergeParams: true })

router.get(
  PathDir.ROOT,
  protect,
  authorizeAction('manage:user'),
  advancedResult(AuthUser, '', {
    select : ['_id', 'firstname', 'lastname', 'email', 'organization', 'username', 'role', 'avatar', 'location', 'status', 'createdAt', 'updatedAt'],
    sort   : ['firstname', 'lastname', 'email', 'username', 'status', 'createdAt', 'updatedAt'],
    include: {
      role: {
        path  : MODULE.Auth.submodule.AuthRole.name,
        select: '_id name label actions'
      }
    }
  }),
  AuthUserController.getUsers
)
router.get(PathDir.ID, protect, authorizeAction('manage:user'), AuthUserController.getUser)
router.post(PathDir.ROOT, protect, authorizeAction('create:user'), AuthUserController.createUser)
router.put(PathDir.ID, protect, authorizeAction('update:user'), AuthUserController.updateUser)
router.delete(PathDir.ID, protect, authorizeAction('delete:user'), AuthUserController.deleteUser)

router.put(PathDir.UPLOAD_AVATAR, protect, AuthUserController.uploadUserAvatar)

/**
 * @path - {baseUrl}/api/{apiVer}/auth/user/...
 */
export default router
