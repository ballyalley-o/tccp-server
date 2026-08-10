import type { Response, NextFunction } from 'express'
import { asyncHandler }                from '@middleware'
import { Enrollment, Course }          from '@model'
import { RESPONSE }                    from '@constant'
import { Code, Key }                   from '@constant/enum'
import { ErrorResponse }               from '@util'

/**
 * Role-based authorization for content management
 * Enforces role-specific access rules for courses, quizzes, lectures, etc.
 */
type AuthCheckFn = (req: any) => Promise<boolean>

/**
 * Check if user is course trainer
 */
const isInstructor = asyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { courseId } = req.params

    if (!courseId) {
      return next(new ErrorResponse(RESPONSE.error.IS_REQUIRED('course id'), (res.statusCode = Code.BAD_REQUEST)))
    }

    const course     = await Course.findById(courseId)

    if (!course) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(courseId), (res.statusCode = Code.NOT_FOUND)))
    }

    const userRoleName = typeof req.user.role === 'string' ? req.user.role : req.user.role?.name

    if (course.trainer?.toString() !== req.user._id.toString() && userRoleName !== Key.Admin) {
      return next(new ErrorResponse(RESPONSE.error[403], (res.statusCode = Code.FORBIDDEN)))
    }

    req.course = course
    next()
  }
)

/**
 * Check if user is enrolled in course
 */
const isEnrolled = asyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { courseId } = req.params

    if (!courseId) {
      return next(new ErrorResponse(RESPONSE.error.IS_REQUIRED('course id'), (res.statusCode = Code.BAD_REQUEST)))
    }

    const enrollment     = await Enrollment.findOne({
      user  : req.user._id,
      course: courseId,
      status: { $in: ['enrolled', 'in_progress', 'completed'] }
    })

    if (!enrollment) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_ENROLLED_COURSE, (res.statusCode = Code.FORBIDDEN))
      )
    }

    req.enrollment = enrollment
    next()
  }
)

/**
 * Content access control based on role
 * - Admin  : can access all content
 * - Trainer: can access their own course content
 * - User   : can access only enrolled course content
 */
const contentAccess = asyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { courseId } = req.params
    const userRole     = req.user.role

    if (!courseId) {
      return next(new ErrorResponse(RESPONSE.error.IS_REQUIRED('course id'), (res.statusCode = Code.BAD_REQUEST)))
    }

    const userRoleName = typeof req.user.role === 'string' ? req.user.role : req.user.role?.name
    if (userRoleName === Key.Admin) {
      return next()
    }

    if (userRoleName === Key.Trainer) {

      const course     = await Course.findById(courseId)

      if (!course) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(courseId), (res.statusCode = Code.NOT_FOUND)))
      }

      if (course.trainer?.toString() !== req.user._id.toString()) {
        return next(
          new ErrorResponse(RESPONSE.error[403], (res.statusCode = Code.FORBIDDEN))
        )
      }

      req.course = course
      return next()
    }

    // Regular users (learners) can only access enrolled courses
    if (userRoleName === 'user' || userRoleName === 'student') {
      const enrollment     = await Enrollment.findOne({
        user  : req.user._id,
        course: courseId,
        status: { $in: ['enrolled', 'in_progress', 'completed'] }
      })

      if (!enrollment) {
        return next(
          new ErrorResponse(RESPONSE.error.NOT_ENROLLED_COURSE, (res.statusCode = Code.FORBIDDEN))
        )
      }

      req.enrollment = enrollment
      return next()
    }

    next(new ErrorResponse(RESPONSE.error[403], (res.statusCode = Code.FORBIDDEN)))
  }
)

export { isInstructor, isEnrolled, contentAccess }
