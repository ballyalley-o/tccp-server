import type { Request, Response, NextFunction } from 'express'
import { asyncHandler }                         from '@middleware'
import { ErrorResponse }                        from '@util'
import { RESPONSE }                             from '@constant'
import { Code, Key }                           from '@constant/enum'

/**
 * Role-based authorization for content management
 * Enforces role-specific access rules for courses, quizzes, lectures, etc.
 */

type AuthCheckFn = (req: any) => Promise<boolean>

/**
 * Check if user is course instructor
 */
const isInstructor = asyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { courseId } = req.params

    if (!courseId) {
      return next(new ErrorResponse('Course ID required', (res.statusCode = Code.BAD_REQUEST)))
    }

    const { Course } = await import('@model')
    const course = await Course.findById(courseId)

    if (!course) {
      return next(new ErrorResponse('Course not found', (res.statusCode = Code.NOT_FOUND)))
    }

    // Check if user is the course instructor or is admin
    const userRoleName = typeof req.user.role === 'string' ? req.user.role : req.user.role?.name

    if (course.instructor?.toString() !== req.user._id.toString() && userRoleName !== Key.Admin) {
      return next(
        new ErrorResponse(
          'Not authorized to access this course content',
          (res.statusCode = Code.FORBIDDEN)
        )
      )
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
      return next(new ErrorResponse('Course ID required', (res.statusCode = Code.BAD_REQUEST)))
    }

    const { Enrollment } = await import('@model')
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
      status: { $in: ['enrolled', 'in_progress', 'completed'] }
    })

    if (!enrollment) {
      return next(
        new ErrorResponse(
          'You are not enrolled in this course',
          (res.statusCode = Code.FORBIDDEN)
        )
      )
    }

    req.enrollment = enrollment
    next()
  }
)

/**
 * Content access control based on role
 * - Admin: can access all content
 * - Trainer: can access their own course content
 * - User: can access only enrolled course content
 */
const contentAccess = asyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const { courseId } = req.params
    const userRole = req.user.role

    if (!courseId) {
      return next(new ErrorResponse('Course ID required', (res.statusCode = Code.BAD_REQUEST)))
    }

    // Admin has access to everything
    const userRoleName = typeof req.user.role === 'string' ? req.user.role : req.user.role?.name

    if (userRoleName === Key.Admin) {
      return next()
    }

    // Trainer can only access their own courses
    if (userRoleName === Key.Trainer) {
      const { Course } = await import('@model')
      const course = await Course.findById(courseId)

      if (!course) {
        return next(new ErrorResponse('Course not found', (res.statusCode = Code.NOT_FOUND)))
      }

      if (course.instructor?.toString() !== req.user._id.toString()) {
        return next(
          new ErrorResponse(
            'Not authorized to access this course',
            (res.statusCode = Code.FORBIDDEN)
          )
        )
      }

      req.course = course
      return next()
    }

    // Regular users (learners) can only access enrolled courses
    if (userRoleName === 'user' || userRoleName === 'student') {
      const { Enrollment } = await import('@model')
      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
        status: { $in: ['enrolled', 'in_progress', 'completed'] }
      })

      if (!enrollment) {
        return next(
          new ErrorResponse(
            'You are not enrolled in this course',
            (res.statusCode = Code.FORBIDDEN)
          )
        )
      }

      req.enrollment = enrollment
      return next()
    }

    next(new ErrorResponse('Unauthorized', (res.statusCode = Code.FORBIDDEN)))
  }
)

export { isInstructor, isEnrolled, contentAccess }
