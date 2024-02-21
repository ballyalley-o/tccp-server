import { Router } from 'express'
import { AuthController } from '@controller'
import { protect } from '@middleware'
import { PathParam } from '@constant/enum'

const router = Router()

/**
 * @path - {baseUrl}/api/v0.1/auth
 */
router.post(PathParam.REGISTER, AuthController.register)
router.post(PathParam.LOG_IN, AuthController.login)
router.get(PathParam.LOG_OUT, AuthController.logout)
router.get(PathParam.ACCOUNT, protect, AuthController.myAccount)
router.put(PathParam.UPDATE, protect, AuthController.updateAccount)
router.put(PathParam.UPDATE_PASSWORD, protect, AuthController.updatePassword)
router.post(PathParam.FORGOT_PASSWORD, AuthController.forgotPassword)
router.put(PathParam.RESET_URL, AuthController.resetPassword)

const authRoute = router
export default authRoute
