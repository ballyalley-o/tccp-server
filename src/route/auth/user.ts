import { Router }                   from 'express'
import { UserController }           from '@controller'
import { User }                     from '@model'
import { advancedResult }           from '@middleware'
import { PathDir }                  from '@route/dir'
import { protect, authorizeAction } from '@route/guard'

const router = Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v0.1/auth/user
 */
router.get(PathDir.ROOT, protect, authorizeAction('manage:user'), advancedResult(User, 'email'), UserController.getUsers)
router.get(PathDir.ID, protect, authorizeAction('manage:user'), UserController.getUser)
router.post(PathDir.ROOT, protect, authorizeAction('create:user'), UserController.createUser)
router.put(PathDir.ID, protect, authorizeAction('update:user'), UserController.updateUser)
router.delete(PathDir.ID, protect, authorizeAction('delete:user'), UserController.deleteUser)

router.put(PathDir.UPLOAD_AVATAR, protect, UserController.uploadUserAvatar)

/**
 * @path - {baseUrl}/api/{appVer}/auth/user
 */
export default router
