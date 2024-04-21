import goodlog from 'good-logs'
import { Request, Response, NextFunction } from 'express'
import { IResponseExtended } from '@interface'
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
  private static _bootcampId: string
  private static _courseId: string
  private static _userId: string
  private static _userRole: string

  /**
   * setRequest - Set request parameters
   *
   * @param req - Request
   * @returns void
   */
  static setRequest(req: Request) {
    this._bootcampId = req.params.bootcampId
    this._courseId = req.params.id
  }
  static setUserId(req: IUserRequest) {
    this._userId = req.user.id
    this._userRole = req.user.role
  }

  //@desc     Get ALL courses
  //@route    GET /course
  //@route    GET /bootcamp/:bootcampId/course
  //@access   PUBLIC
  @use(LogRequest)
  public static async getCourses(req: Request, res: Response, _next: NextFunction) {
    CourseController.setRequest(req)

    if (CourseController._bootcampId) {
      const course = await Course.find({
        bootcamp: CourseController._bootcampId
      })

      res.status(Code.OK).json({
        success: true,
        count: course.length,
        data: course
      })
    } else {
      res.status(Code.OK).json((res as IResponseExtended).advancedResult)
    }
  }

  //@desc     Get single course
  //@route    GET /course/:id
  //@access   PUBLIC
  @use(LogRequest)
  public static async getCourse(req: Request, res: Response, next: NextFunction) {
    CourseController.setRequest(req)

    const course = await Course.findById(CourseController._courseId).populate({
      path: Key.BootcampVirtual,
      select: Key.CourseSelect
    })

    if (!course) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(CourseController._courseId), (res.statusCode = Code.NOT_FOUND)))
    }
    try {
      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success[200],
        data: course
      })
    } catch (error: any) {
      goodlog.error(error?.message || error)
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.NOT_FOUND_COURSE(CourseController._courseId),
        error
      })
    }
  }

  //@desc   Add a course
  //@route  POST /bootcamp/:bootcampId/course
  //a@ccess PRIVATE
  @use(LogRequest)
  public static async addCourse(req: any, res: Response, next: NextFunction) {
    CourseController.setRequest(req)
    CourseController.setUserId(req)

    req.body.bootcamp = CourseController._bootcampId
    req.body.user = CourseController._userId

    const bootcamp = await Bootcamp.findById(CourseController._bootcampId)

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(CourseController._bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (bootcamp.user.toString() !== CourseController._userId && CourseController._userRole !== Key.Admin) {
      return next(new ErrorResponse(RESPONSE.error.NOT_OWNER(req.user.id, CourseController._bootcampId), (res.statusCode = Code.UNAUTHORIZED)))
    }

    try {
      const course = await Course.create(req.body)

      res.status(Code.CREATED).json({
        success: true,
        data: course
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
    CourseController.setRequest(req)
    CourseController.setUserId(req)

    let course = await Course.findById(CourseController._courseId)

    if (!course) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_OWNER(CourseController._userId, CourseController._courseId), (res.statusCode = Code.NOT_FOUND))
      )
    }

    if (course.user.toString() !== CourseController._userId && CourseController._userRole !== Key.Admin) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_OWNER(CourseController._userId, CourseController._courseId), (res.statusCode = Code.UNAUTHORIZED))
      )
    }

    try {
      course = await Course.findByIdAndUpdate(CourseController._courseId, req.body, {
        new: true,
        runValidators: true
      })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.UPDATED,
        data: course
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
    CourseController.setRequest(req)
    CourseController.setUserId(req)

    const course = await Course.findById(CourseController._courseId)

    if (!course) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(CourseController._courseId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (course.user.toString() !== CourseController._userId && CourseController._userRole !== Key.Admin) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_OWNER(CourseController._userId, CourseController._courseId), (res.statusCode = Code.UNAUTHORIZED))
      )
    }

    try {
      await Course.deleteOne({ _id: CourseController._courseId })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.DELETED,
        data: {}
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
