import { Router } from 'express'
import { advancedResult, protect } from '@middleware'
import { UserController } from '@controller'
import { PathParam } from '@constant/enum'
import { User } from '@model'

const router = Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v0.1/auth/user
 */
router.get(PathParam.F_SLASH, advancedResult(User, 'email'), UserController.getUsers)
router.get(PathParam.ID, UserController.getUser)
router.post(PathParam.F_SLASH, UserController.createUser)
router.put(PathParam.ID, UserController.updateUser)
router.delete(PathParam.ID, UserController.deleteUser)

router.put(PathParam.UPLOAD_AVATAR, protect, UserController.uploadUserAvatar)

const userRoute = router
export default userRoute
