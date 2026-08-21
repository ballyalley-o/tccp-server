import { Router }                           from 'express'
import { MODULE }                           from '@config/module.config'
import { PathDir }                          from '@config/dir.config'
import { Enrollment, EnrollmentController } from '@module/enrollment'
import { advancedResult }                   from '@common/middleware'
import { authorizeAction }                  from '@common/security/guard'
import { protect }                          from '@common/security/protect'

const router = Router({ mergeParams: true })

router
  .route(PathDir.ROOT)
  .get(advancedResult(Enrollment, [
            {
                path  : MODULE.Auth.submodule.AuthUser.name,
                select: '_id firstname email'
            },
            {
                path  : MODULE.Bootcamp.name,
                select: '_id name email',
            },
            {
                path  : MODULE.Course.name,
                select: '_id title duration'
            }
        ]), EnrollmentController.getEnrollments)
  .post(protect, authorizeAction('create:enrollment'), EnrollmentController.createEnrollment)

router
  .route(PathDir.ID)
  .get(EnrollmentController.getEnrollment)
  .put(protect, authorizeAction('update:enrollment'), EnrollmentController.updateEnrollment)
  .delete(protect, authorizeAction('delete:enrollment'), EnrollmentController.deleteEnrollment)

/**
 * @path - {baseUrl}/api/{apiVer}/enrollment/...
 */
export default router
