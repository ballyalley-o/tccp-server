import { Router } from 'express'
import { advancedResult } from '@middleware'
import { UserController } from '@controller'
import { PathParam } from '@constant/enum'
import { User } from '@model'

const router = Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v0.1/auth/user
 */
router.get(PathParam.ORIGIN, advancedResult(User), UserController.getUsers)
router.get(PathParam.ID, UserController.getUser)
router.post(PathParam.ORIGIN, UserController.createUser)
router.put(PathParam.ID, UserController.updateUser)
router.delete(PathParam.ID, UserController.deleteUser)

const userRoute = router
export default userRoute
