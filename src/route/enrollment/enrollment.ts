import { Router }                   from 'express'
import { EnrollmentController }     from '@controller'
import { MODULE }                   from '@config/module.config'
import { advancedResult }           from '@middleware'
import { Enrollment }               from '@model'
import { PathDir }                  from '@route/dir'
import { protect, authorizeAction } from '@route/guard'

const router = Router({ mergeParams: true })

router
  .route(PathDir.ROOT)
  .get(advancedResult(Enrollment, [
            {
                path  : MODULE.Auth.submodule.User.name,
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
