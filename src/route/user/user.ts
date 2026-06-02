import { Router } from 'express'
import { advancedResult, protect } from '@middleware'
import { UserController } from '@controller'
import * as PathParam from '@route/dir'
import { User } from '@model'

const router = Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v0.1/auth/user
 */
router.get(PathParam.ROOT, advancedResult(User, 'email'), UserController.getUsers)
router.get(PathParam.ID, UserController.getUser)
router.post(PathParam.ROOT, UserController.createUser)
router.put(PathParam.ID, UserController.updateUser)
router.delete(PathParam.ID, UserController.deleteUser)

router.put(PathParam.PathDir.UPLOAD_AVATAR, protect, UserController.uploadUserAvatar)

export default router