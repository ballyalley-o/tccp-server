import { Router } from 'express'
import { advancedResult } from '@middleware'
import { UserController } from '@controller'
import { PathParam } from '@constant/enum'
import { User } from '@model'

const router = Router({ mergeParams: true })

/**
 * @path - {baseUrl}/api/v0.1/auth/user
 */
router.get(
  PathParam.ORIGIN_PARAM,
  advancedResult(User),
  UserController.getUsers
)

router.get(PathParam.ID_PARAM, UserController.getUser)
router.post(PathParam.ORIGIN_PARAM, UserController.createUser)
router.put(PathParam.ID_PARAM, UserController.updateUser)
router.delete(PathParam.ID_PARAM, UserController.deleteUser)

const userRoute = router
export default userRoute
