import goodlog from 'good-logs'
import { Request, Response, NextFunction } from 'express'
import { use, LogRequest } from '@decorator'
import { Enrollment, Bootcamp, Course } from '@model'
import { Key, Code } from '@constant/enum'
import { RESPONSE } from '@constant'
import { ErrorResponse } from '@util'

/**
 * Enrollment Controller
 * @path {baseUrl}/api/{apiVer}/enrollment
 */
class EnrollmentController {
  //@desc     Get ALL enrollment
  //@route    GET /enrollment
  //@access   PRIVATE
  @use(LogRequest)
  public static async getEnrollments(req: Request, res: Response, _next: NextFunction) {
    const userId = req.user?.id
    if (userId) {
        const enrollments = await Enrollment.find({ user: userId }).lean()
      res.status(Code.OK).json({
        success: true,
        count  : enrollments.length,
        data   : enrollments
      })
    } else {
      res.status(Code.OK).json(res.advanceResult)
    }
  }

    //@desc     Get single enrollment by id
    //@route    GET /enrollment/:enrollmentId
    //@access   PRIVATE
  @use(LogRequest)
  public static async getEnrollment(req: Request, res: Response, next: NextFunction) {
    const enrollmentId = req.params.id

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate({
        path  : Key.BootcampVirtual,
        select: 'bootcamp course status progress'
      })
      .lean()

    if (!enrollment) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_ENROLLMENT(enrollmentId), (res.statusCode = Code.NOT_FOUND)))
    }

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success[200],
      data   : enrollment
    })
  }

  //@desc     Get single course by course id
  //@route    GET /enrollment/:enrollmentId
  //@access   PRIVATE
  @use(LogRequest)
  public static async getEnrollmentByCourseId(req: Request, res: Response, next: NextFunction) {
    const courseId = req.params.courseId
    const course   = await Course.findById(courseId)
      .populate({
        path  : Key.BootcampVirtual,
        select: 'bootcamp course status progress'
      })
      .lean()

    if (!course) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(courseId), (res.statusCode = Code.NOT_FOUND)))
    }

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success[200],
      data   : course
    })
  }

  //@desc   Add a course
  //@route  POST /bootcamp/:bootcampId/course
  //a@ccess PRIVATE
  @use(LogRequest)
  public static async createEnrollment(req: any, res: Response, next: NextFunction) {
    const bootcampId        = req.body.bootcamp
    const courseId          = req.body.course
    const userId            = req.user.id
    const userRole          = req.user.role
    const selectedStartDate = new Date(req.body.startDate)

    const bootcamp = await Bootcamp.findById(bootcampId).select('user').lean()
    const course   = await Course.findById(courseId).lean()

    if (!course) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(courseId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (!bootcamp) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (userRole !== 'user') {
        return next(new ErrorResponse(RESPONSE.error.NOT_STUDENT(userId), (res.statusCode = Code.UNAUTHORIZED)))
    }

    if (!req.body.startDate || Number.isNaN(selectedStartDate.getTime())) {
        return next(new ErrorResponse(RESPONSE.error.INVALID_START_DATE, (res.statusCode = Code.BAD_REQUEST)))
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedStartDate < today) {
        return next(new ErrorResponse(RESPONSE.error.INVALID_START_DATE_PAST, (res.statusCode = Code.BAD_REQUEST)))
    }

    try {
      const enrollment = await Enrollment.create({
        user          : userId,
        course        : course._id,
        bootcamp      : course.bootcamp,
        status        : 'enrolled',
        startDate     : selectedStartDate,
        lastAccessedAt: new Date()
      })

      res.status(Code.CREATED).json({
        success: true,
        data   : enrollment
      })
    } catch (error: any) {
      goodlog.error(error?.message || error)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_CREATE,
        error
      })
    }
  }

  //@desc     Update an enrollment
  //@route    PUT /enrollment/:id
  //@access   PRIVATE
  @use(LogRequest)
  public static async updateEnrollment(req: any, res: Response, next: NextFunction) {
    const enrollmentId     = req.params.id
    const userId           = req.user.id
    const userRole         = req.user.role
    let   enrollmentStatus = req.body.status

    const enrollment = await Enrollment.findById(enrollmentId).select('user').lean()

    if (!enrollment) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_ENROLLMENT(enrollmentId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (enrollment.user.toString() !== userId && userRole !== Key.Admin) {
      return next(new ErrorResponse(RESPONSE.error[401], (res.statusCode = Code.UNAUTHORIZED)))
    }

    let   startDate = req.body.startDate
    const today     = new Date()
    today.setHours(0, 0 , 0, 0)

    if (req.body.status && enrollmentStatus === 'enrolled' && req.body.startDate > today) {
        enrollmentStatus = 'in_progress'
        startDate        = today
    }

    try {
      const updatedEnrollment = await Enrollment.findByIdAndUpdate(enrollmentId, { status: enrollmentStatus, startDate,...req.body}, {
        new          : true,
        runValidators: true
      })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.UPDATED,
        data   : updatedEnrollment
      })
    } catch (error: any) {
      goodlog.error(error?.message || error)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_UPDATE,
        error
      })
    }
  }
  //@desc     Delete an enrollment
  //@route    DELETE /enrollment/:id
  //@access   PRIVATE
  @use(LogRequest)
  public static async deleteEnrollment(req: any, res: Response, next: NextFunction) {
    const enrollmentId = req.params.id
    const userId       = req.user.id
    const userRole     = req.user.role

    const enrollment = await Enrollment.findById(enrollmentId).select('user').lean()

    if (!enrollment) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_ENROLLMENT(enrollmentId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (enrollment.user.toString() !== userId && userRole !== Key.Admin) {
      return next(new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, enrollmentId), (res.statusCode = Code.UNAUTHORIZED)))
    }

    try {
      await Enrollment.deleteOne({ _id: enrollmentId })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.DELETED,
        data   : {}
      })
    } catch (error: any) {
      goodlog.error(error?.message || error)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_DELETE,
        error
      })
    }
  }
}

export default EnrollmentController
