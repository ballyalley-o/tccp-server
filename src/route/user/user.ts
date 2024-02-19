import { Router } from 'express'
import { advancedResult } from '@middleware'
import { userController } from '@controller'
import { PathParam } from '@constant/enum'
import { User } from '@model'

const router = Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v0.1/auth/user
 */
router.get(
  PathParam.ORIGIN_PARAM,
  advancedResult(User),
  userController.getUsers
)
router.get(PathParam.ID_PARAM, userController.getUser)
router.post(PathParam.ORIGIN_PARAM, userController.createUser)
router.put(PathParam.ID_PARAM, userController.updateUser)
router.delete(PathParam.ID_PARAM, userController.deleteUser)

const userRoute = router
export default userRoute
