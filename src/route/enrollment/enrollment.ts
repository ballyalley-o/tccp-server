import { Router } from 'express'
import { EnrollmentController } from '@controller'
import { advancedResult } from '@middleware'
import { Enrollment } from '@model'
import { PathDir } from '@route/dir'
import { protect, authorizeAction } from '@route/guard'

const router = Router({ mergeParams: true })

router
  .route(PathDir.ROOT)
  .get(advancedResult(Enrollment, [
            {
                path  : 'user',
                select: '_id firstname email'
            },
            {
                path  : 'bootcamp',
                select: '_id name email',
            },
            {
                path  : 'course',
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
 * @path - {baseUrl}/api/v0.1/enrollment
 */
export default router
