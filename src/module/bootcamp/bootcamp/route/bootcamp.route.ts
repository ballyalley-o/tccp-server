import express                          from 'express'
import { MODULE }                       from '@config/module.config'
import { PathDir }                      from '@config/dir.config'
import { Bootcamp, BootcampController } from '@module/bootcamp'
import { CourseRoute }                  from '@module/course'
import { FeedbackRoute }                from '@module/feedback'
import { advancedResult }               from '@common/middleware'
import { authorizeAction }              from '@common/security/guard'
import { protect }                      from '@common/security/protect'

const router = express.Router()

router.use(PathDir.REDIR_COURSE, CourseRoute)
router.use(PathDir.REDIR_FEEDBACK, FeedbackRoute)

router.route(PathDir.GET_DISTANCE).get(BootcampController.getBootcampsInRadius)
router
  .route(PathDir.ROOT)
  .get(
    advancedResult(Bootcamp, [
      {
        path  : MODULE.Auth.submodule.AuthUser.name,
        select: 'firstname email role'
      },
      {
        path  : MODULE.Course.name,
        select: 'title duration tuition'
      },
      {
        path  : MODULE.Feedback.name,
        select: 'title rating user'
      }
    ], {
      select : ['_id', 'name', 'slug', 'description', 'website', 'phone', 'email', 'location', 'duration', 'careers', 'averageCost', 'photo', 'badge', 'housing', 'jobAssistance', 'jobGuarantee', 'acceptGi', 'rating', 'createdAt', 'updatedAt'],
      sort   : ['name', 'duration', 'averageCost', 'rating', 'createdAt', 'updatedAt'],
      include: {
        user: {
          path  : MODULE.Auth.submodule.AuthUser.name,
          select: '_id firstname email role'
        },
        course: {
          path  : MODULE.Course.name,
          select: '_id title duration tuition'
        },
        feedback: {
          path  : MODULE.Feedback.name,
          select: '_id title rating user'
        }
      }
    }),
    BootcampController.getBootcamps
  )
  .post(protect, authorizeAction('create:bootcamp'), BootcampController.createBootcamp)
router.route(PathDir.CREATE).post(protect, authorizeAction('create:bootcamp'), BootcampController.createBootcamp)

router.get(PathDir.TOP, BootcampController.getTopBootcamps)
router
  .route(PathDir.SLUG)
  .get(BootcampController.getBootcamp)
  .put(protect, authorizeAction('update:bootcamp'), BootcampController.updateBootcamp)
  .delete(protect, authorizeAction('delete:bootcamp'), BootcampController.deleteBootcamp)

router.put(PathDir.UPLOAD_PHOTO, protect, authorizeAction('update:bootcamp'), BootcampController.uploadBootcampPhoto)
router.put(PathDir.UPLOAD_BADGE, protect, authorizeAction('update:bootcamp'), BootcampController.uploadBootcampBadge)


/**
 * @path - {baseUrl}/api/{apiVer}/bootcamp/...
 */
export default router
