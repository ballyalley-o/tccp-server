import { Router }         from 'express'
import { AuthController } from '@controller/auth'
import { PathDir }        from '@route/dir'
import { protect }        from '@route/guard'

const router = Router()

router.post(PathDir.REGISTER, AuthController.register)
router.post(PathDir.LOG_IN, AuthController.login)
router.post(PathDir.LOG_OUT, AuthController.logout)
router.get(PathDir.ACCOUNT, protect, AuthController.myAccount)
router.put(PathDir.ACCOUNT_UPDATE, protect, AuthController.updateAccount)
router.put(PathDir.UPDATE_PASSWORD, protect, AuthController.updatePassword)
router.post(PathDir.FORGOT_PASSWORD, AuthController.forgotPassword)
router.put(PathDir.RESET_PASSWORD, AuthController.resetPassword)

/**
 * @path - {baseUrl}/api/{appVer}/auth
 */
export default router