import { Router } from 'express'
import { advancedResult } from '@middleware'
import { UserController } from '@controller'
import { PathDir } from '@route/dir'
import { protect } from '@route/guard'
import { User } from '@model'

const router = Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v0.1/auth/user
 */
router.get(PathDir.ROOT, advancedResult(User, 'email'), UserController.getUsers)
router.get(PathDir.ID, UserController.getUser)
router.post(PathDir.ROOT, UserController.createUser)
router.put(PathDir.ID, UserController.updateUser)
router.delete(PathDir.ID, UserController.deleteUser)

router.put(PathDir.UPLOAD_AVATAR, protect, UserController.uploadUserAvatar)

export default router