import { Router } from 'express'
import { EnrollmentController } from '@controller'
import { advancedResult } from '@middleware'
import { Enrollment } from '@model'
import { PathDir } from '@route/dir'
import { protect, authorize } from '@route/guard'

const router = Router({ mergeParams: true })

router
  .route(PathDir.ROOT)
  .get(
    advancedResult(Enrollment, {
      select: 'user bootcamp course'
    }),
    EnrollmentController.getEnrollments
  )
  .post(protect, authorize('user', 'admin'), EnrollmentController.createEnrollment)

router
  .route(PathDir.ID)
  .get(EnrollmentController.getEnrollment)
  .put(protect, authorize('user', 'admin'), EnrollmentController.updateEnrollment)
  .delete(protect, authorize('user', 'admin'), EnrollmentController.deleteEnrollment)

/**
 * @path - {baseUrl}/api/v0.1/enrollment
 */
export default router
