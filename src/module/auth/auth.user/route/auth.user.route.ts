import { Router }                       from 'express'
import { PathDir }                      from '@config/dir.config'
import { AuthUser, AuthUserController } from '@module/auth'
import { advancedResult }               from '@common/middleware'
import { authorizeAction }              from '@common/security/guard'
import { protect }                      from '@common/security/protect'

const router = Router({ mergeParams: true })

router.get(PathDir.ROOT, protect, authorizeAction('manage:user'), advancedResult(AuthUser, 'email'), AuthUserController.getUsers)
router.get(PathDir.ID, protect, authorizeAction('manage:user'), AuthUserController.getUser)
router.post(PathDir.ROOT, protect, authorizeAction('create:user'), AuthUserController.createUser)
router.put(PathDir.ID, protect, authorizeAction('update:user'), AuthUserController.updateUser)
router.delete(PathDir.ID, protect, authorizeAction('delete:user'), AuthUserController.deleteUser)

router.put(PathDir.UPLOAD_AVATAR, protect, AuthUserController.uploadUserAvatar)

/**
 * @path - {baseUrl}/api/{apiVer}/auth/user/...
 */
export default router
