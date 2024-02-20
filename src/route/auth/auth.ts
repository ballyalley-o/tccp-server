import { Router } from 'express'
import { authController } from '@controller'
import { protect } from '@middleware'
import { PathParam } from '@constant/enum'

const router = Router()

/**
 * @path - {baseUrl}/api/v0.1/auth
 */
router.post(PathParam.REGISTER, authController.register)
router.post(PathParam.LOG_IN, authController.login)
router.get(PathParam.LOG_OUT, authController.logout)
router.get(PathParam.ACCOUNT, protect, authController.myAccount)
router.put(PathParam.UPDATE, protect, authController.updateAccount)
router.put(PathParam.UPDATE_PASSWORD, protect, authController.updatePassword)
router.post(PathParam.FORGOT_PASSWORD, authController.forgotPassword)
router.put(PathParam.RESET_PASSWORD, authController.resetPassword)

const authRoute = router
export default authRoute
