import { Router }     from 'express'
import { PathDir }    from '@config/dir.config'
import { protect }    from '@common/security/protect'

import AuthController from '@module/auth/auth/controller/auth.controller'

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
 * @path - {baseUrl}/api/{appVer}/auth/...
 */
export default router
