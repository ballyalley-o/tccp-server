import goodlog from 'good-logs'
import { Request, Response, NextFunction } from 'express'
import { IUserRequest } from '@interface/middleware'
import { use, LogRequest } from '@decorator'
import { Course, Bootcamp } from '@model'
import { Key, Code } from '@constant/enum'
import { RESPONSE } from '@constant'
import { ErrorResponse } from '@util'

/**
 * Course Controller
 * @path {baseUrl}/api/{apiVer}/course
 */
class CourseController {
  //@desc     Get ALL courses
  //@route    GET /course
  //@route    GET /bootcamp/:bootcampId/course
  //@access   PUBLIC
  @use(LogRequest)
  public static async getCourses(req: Request, res: Response, _next: NextFunction) {
    const bootcampId =  req.params.bootcampId

    if (bootcampId) {
      const course = await Course.find({ bootcamp: bootcampId })

      res.status(Code.OK).json({
        success: true,
        count  : course.length,
        data   : course
      })
    } else {
      res.status(Code.OK).json(res.advanceResult)
    }
  }

  //@desc     Get single course
  //@route    GET /course/:id
  //@access   PUBLIC
  @use(LogRequest)
  public static async getCourse(req: Request, res: Response, next: NextFunction) {
    const courseId = req.params.id

    const course = await Course.findById(courseId).populate({
      path  : Key.BootcampVirtual,
      select: Key.CourseSelect
    }).lean()

    if (!course) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(courseId), (res.statusCode = Code.NOT_FOUND)))
    }
    try {
      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success[200],
        data   : course
      })
    } catch (error: any) {
      goodlog.error(error?.message || error)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.NOT_FOUND_COURSE(courseId),
        error
      })
    }
  }

  //@desc   Add a course
  //@route  POST /bootcamp/:bootcampId/course
  //a@ccess PRIVATE
  @use(LogRequest)
  public static async addCourse(req: any, res: Response, next: NextFunction) {
    const bootcampId = req.params.bootcampId
    const userId     = req.user.id
    const userRole   = req.user.role

    const bootcamp = await Bootcamp.findById(bootcampId)

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (bootcamp.user.toString() !== userId && userRole !== Key.Admin) {
      return next(new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, bootcampId), (res.statusCode = Code.UNAUTHORIZED)))
    }

    try {
      const course = await Course.create(req.body)

      res.status(Code.CREATED).json({
        success: true,
        data   : course
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

  //@desc     Update a course
  //@route    PUT /courses/:id
  //@access   PRIVATE
  @use(LogRequest)
  public static async updateCourse(req: any, res: Response, next: NextFunction) {
    const courseId   = req.params.id
    const userId     = req.user.id
    const userRole   = req.user.role

    let course = await Course.findById(courseId)

    if (!course) {
      return next(new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, courseId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (course.user.toString() !== userId && userRole !== Key.Admin) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, courseId), (res.statusCode = Code.UNAUTHORIZED))
      )
    }

    try {
      course = await Course.findByIdAndUpdate(courseId, req.body, {
        new          : true,
        runValidators: true
      })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.UPDATED,
        data   : course
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
  //@desc     Delete a course
  //@route    DELETE /course/:id
  //@access   PRIVATE
  @use(LogRequest)
  public static async deleteCourse(req: any, res: Response, next: NextFunction) {
    const courseId = req.params.id
    const userId   = req.user.id
    const userRole = req.user.role

    const course   = await Course.findById(courseId)

    if (!course) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(courseId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (course.user.toString() !== userId && userRole !== Key.Admin) {
      return next(new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, courseId), (res.statusCode = Code.UNAUTHORIZED)))
    }

    try {
      await Course.deleteOne({ _id: courseId })

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

export default CourseController
