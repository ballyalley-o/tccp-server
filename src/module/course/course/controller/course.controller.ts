import { isValidObjectId } from 'mongoose'
import goodlog                                  from 'good-logs'
import type { Request, Response, NextFunction } from 'express'
import { use, LogRequest }                      from '@common/decorator'
import { hasAction }                            from '@common/security/guard'
import { RESPONSE }                             from '@common/constant'
import { Code }                                 from '@common/constant/enum'
import { ErrorResponse }                        from '@common/util'

import Bootcamp                                 from '@module/bootcamp/bootcamp/model/Bootcamp'
import Course                                   from '@module/course/course/model/Course'

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
    const bootcampId = req.params.bootcampId

    if (bootcampId) {
      const courses = await Course.find({ bootcamp: bootcampId }).lean()

      res.status(Code.OK).json({
        success: true,
        count  : courses.length,
        data   : courses
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
      path  : 'bootcamp',
      select: 'name description'
    }).lean()

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
  public static async addCourse(req: any, res: Response, next: NextFunction) {
    const bootcampId = req.params.bootcampId
    const userId     = req.user.id
    const bootcamp   = await Bootcamp.findById(bootcampId).select('user').lean()

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (bootcamp.user.toString() !== userId && !hasAction(req, 'manage:any')) {
      return next(new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, bootcampId), (res.statusCode = Code.UNAUTHORIZED)))
    }

    try {
      req.body.bootcamp = bootcampId
      req.body.user     = userId
        // creator metadata
      req.body.createdBy = userId
      req.body.updatedBy = userId

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
    const courseId = req.params.id
    const userId   = req.user.id
    if (!isValidObjectId(courseId)) {
      return next(new ErrorResponse('Invalid course ID', (res.statusCode = Code.BAD_REQUEST)))
    }
    const course   = await Course.findById(courseId).select('user bootcamp').lean()

    if (!course) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(courseId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (String(course.user || '') !== userId && !hasAction(req, 'manage:any')) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, courseId), (res.statusCode = Code.UNAUTHORIZED))
      )
    }

    if (req.body.bootcamp !== undefined) {
      if (!isValidObjectId(req.body.bootcamp)) {
        return next(new ErrorResponse('A valid bootcamp ID is required', (res.statusCode = Code.BAD_REQUEST)))
      }
      const targetBootcamp = await Bootcamp.findById(req.body.bootcamp).select('_id').lean()
      if (!targetBootcamp) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(req.body.bootcamp), (res.statusCode = Code.NOT_FOUND)))
      }
    }

    try {
      const previousBootcamp = course.bootcamp
      const updatedCourse = await Course.findByIdAndUpdate(courseId, { ...req.body, updatedBy: userId }, {
        new          : true,
        runValidators: true
      })

      if (updatedCourse) {
        await (Course as any).getAverageCost(updatedCourse.bootcamp)
        if (previousBootcamp && String(previousBootcamp) !== String(updatedCourse.bootcamp)) {
          await (Course as any).getAverageCost(previousBootcamp)
        }
      }

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.UPDATED,
        data   : updatedCourse
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
    const course   = await Course.findById(courseId).select('user bootcamp').lean()

    if (!course) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(courseId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (course.user.toString() !== userId && !hasAction(req, 'manage:any')) {
      return next(new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, courseId), (res.statusCode = Code.UNAUTHORIZED)))
    }

    try {
      await Course.deleteOne({ _id: courseId })
      await (Course as any).getAverageCost(course.bootcamp)

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
