import { Router } from 'express'
import { userController } from '@controller'
import { PathParam } from '@constant/enum'

const router = Router()

/**
 * @path - baseUrl/api/v0.1/user
 */
router.get(PathParam.ORIGIN_PARAM, userController.getUsers)
router.get(PathParam.ID_PARAM, userController.getUser)
router.post(PathParam.ORIGIN_PARAM, userController.createUser)
router.put(PathParam.ID_PARAM, userController.updateUser)
router.delete(PathParam.ID_PARAM, userController.deleteUser)

const studentRoute = router
export default studentRoute
