import GLOBAL                                   from '@config/global'
import geocoder                                 from '@config/geocoder'
import { Bootcamp }                             from '@model'
import type { Request, Response, NextFunction } from 'express'
import { use, LogRequest }                      from '@decorator'
import { Key, NumKey, Code }                    from '@constant/enum'
import { hasAction }                            from '@route/guard'
import { RESPONSE }                             from '@constant'
import { ErrorResponse, DataResponse }          from '@util'

/**
 * Bootcamp Controller
 * @path {baseUrl}/api/{apiVer}/bootcamp
 */
class BootcampController {
  private static shouldIncludeAverageCost(req: Request): boolean {
    const select = req.query.select

    if (!select || typeof select !== 'string') {
      return true
    }

    return select.split(',').map((field) => field.trim()).includes('averageCost')
  }

  private static calculateAverageCostFromCourses(courses: unknown): number | undefined {
    if (!Array.isArray(courses)) {
      return undefined
    }

    const tuitions = courses
      .map((course) => Number((course as { tuition?: number }).tuition))
      .filter(Number.isFinite)

    if (!tuitions.length) {
      return undefined
    }

    const averageCost = tuitions.reduce((total, tuition) => total + tuition, 0) / tuitions.length

    return Math.ceil(averageCost / 10) * 10
  }

  private static withAverageCost<T extends { averageCost?: number, course?: unknown }>(bootcamp: T): T & { averageCost: number } {
    const calculatedAverageCost = BootcampController.calculateAverageCostFromCourses(bootcamp.course)

    return {
      ...bootcamp,
      averageCost: calculatedAverageCost ?? bootcamp.averageCost ?? 0
    }
  }

  //@desc     Get ALL bootcamps
  //@route    GET /bootcamp
  //@access   PUBLIC
  @use(LogRequest)
  public static async getBootcamps(req: Request, res: Response, _next: NextFunction) {
    try {
      if (BootcampController.shouldIncludeAverageCost(req)) {
        res.advanceResult.data = res.advanceResult.data.map(BootcampController.withAverageCost)
      }

      res.status(Code.OK).json(res.advanceResult)
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_FIND,
        error
      })
    }
  }

  //@desc     Get single bootcamp
  //@route    GET /bootcamp/:id
  //@access   PUBLIC
  @use(LogRequest)
  public static async getBootcamp(req: Request, res: Response, next: NextFunction) {
    const bootcampSlug = req.params.slug
    const bootcampId   = req.params.id

    const bootcamp = await Bootcamp.findOne({ slug: bootcampSlug })
      .populate({ path: 'course', select: 'title description tuition minimumSkill' })
      .lean()

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    try {
      res.status(Code.OK).json({ success: true, data: BootcampController.withAverageCost(bootcamp) })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId),
        error
      })
    }
  }

  //@desc     Create NEW bootcamp
  //@route    POST /bootcamp
  //@access   PRIVATE
  @use(LogRequest)
  public static async createBootcamp(req: Request, res: Response, next: NextFunction) {
    const userId   = req.user.id
    const publishedBootcamp = await Bootcamp.findOne({ user: userId })

    if (publishedBootcamp && !hasAction(req, 'manage:any')) {
      return next(new ErrorResponse(RESPONSE.error.BOOTCAMP_ALREADY_PUBLISHED(userId), (res.statusCode = Code.BAD_REQUEST)))
    }

    try {
      // set creator metadata
      req.body.createdBy = req.user?.id
      req.body.updatedBy = req.user?.id
      const bootcamp = await Bootcamp.create(req.body)

      res.status(Code.CREATED).json({
        success: true,
        data   : bootcamp
      })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_CREATE,
        error
      })
    }
  }

  //@desc     UPDATE bootcamp
  //@route    PUT /api/{apiVer}/bootcamps/:id
  //@access   PRIVATE
  @use(LogRequest)
  public static async updateBootcamp(req: Request, res: Response, next: NextFunction) {
    const bootcampId = req.params.id
    const userId     = req.user.id

    const bootcamp = await Bootcamp.findById(bootcampId).select('user').lean()

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (bootcamp.user.toString() !== userId && !hasAction(req, 'manage:any')) {
      return next(new ErrorResponse(RESPONSE.error[401], (res.statusCode = Code.UNAUTHORIZED)))
    }

    try {
      const updatedBootcamp = await Bootcamp.findByIdAndUpdate(bootcampId, { ...req.body, updatedBy: req.user?.id }, {
        new          : true,
        runValidators: true
      })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.UPDATED,
        data   : updatedBootcamp
      })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_UPDATE,
        error
      })
    }
  }

  //@desc     DELETE bootcamp
  //@route    DELETE /api/{apiVer}/bootcamp/:id
  //@access   PRIVATE
  @use(LogRequest)
  public static async deleteBootcamp(req: Request, res: Response, next: NextFunction) {
    const bootcampId = req.params.id
    const userId     = req.user.id

    const bootcamp = await Bootcamp.findById(bootcampId).select('user').lean()

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (bootcamp.user.toString() !== userId && !hasAction(req, 'manage:any')) {
      return next(new ErrorResponse(RESPONSE.error[401], (res.statusCode = Code.UNAUTHORIZED)))
    }

    try {
      await Bootcamp.deleteOne({ _id: bootcampId })

      res.status(Code.OK).json({ success: true, message: RESPONSE.success.DELETED, data: {} })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_DELETE,
        error
      })
    }
  }

  //@desc     Get bootcamps within a radius
  //@route    GET /bootcamp/radius/:zipcode/:distance
  //@access   PRIVATE
  @use(LogRequest)
  public static async getBootcampsInRadius(req: Request, res: Response, _next: NextFunction) {
    const { zipcode, distance } = req.params

    const loc    = await geocoder.geocode(zipcode)
    const lat    = loc[0].latitude
    const lng    = loc[0].longitude
    const radius = Number(distance) / NumKey.EarthRadius

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    }).lean()

    res.status(Code.ACCEPTED).json({
      success: true,
      count  : bootcamps.length,
      data   : bootcamps.map(BootcampController.withAverageCost)
    })
  }

  //@desc     Create Bootcamp Feedback
  //@route    GET /bootcamp/:id/feedback
  //@access   PRIVATE
  @use(LogRequest)
  public static async createBootcampFeedback(req: Request, res: Response, next: NextFunction) {
    const bootcampId = req.params.id
    const userId     = req.user.id

    try {
      const bootcamp = await Bootcamp.findById(bootcampId)
      const { title, body, rating } = req.body

      if (bootcamp) {
        if (bootcamp.feedback) {
          const feedbacked = bootcamp.feedback.find((f: any) => f.user.toString() === userId)

          if (feedbacked && !hasAction(req, 'manage:any')) {
            return next(new ErrorResponse(RESPONSE.error.ONE_FEEDBACK, (res.statusCode = Code.BAD_REQUEST)))
          }
        }

        const feedback = { title, body, rating, user: userId as any }

        bootcamp.feedback.push(feedback as any)
        bootcamp.totalFeedback = bootcamp.feedback.length
        bootcamp.rating        = bootcamp.feedback.reduce((acc: number, rev: any) => acc + rev.rating, 0) / bootcamp.feedback.length

        await bootcamp.save()

        res.status(Code.CREATED).json({
          success: true,
          message: RESPONSE.success[201],
          data   : bootcamp
        })
      }
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_CREATE,
        error
      })
    }
  }

  //@desc     Get top Bootcamps
  //@route    GET /bootcamp/top
  //@access   PUBLIC
  @use(LogRequest)
  public static async getTopBootcamps(_req: Request, res: Response, next: NextFunction) {
    try {
      const bootcamps = await Bootcamp.find({}).sort({ rating: -1 }).limit(5).lean()

      if (!bootcamps) {
        return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_TOP_BOOTCAMPS, (res.statusCode = Code.NOT_FOUND)))
      }

      res.status(Code.ACCEPTED).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps.map(BootcampController.withAverageCost)
      })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_FIND,
        error
      })
    }
  }

  //@desc     Upload photo for bootcamp
  //@route    PUT /bootcamp/:id/photo
  //@access   PRIVATE
  @use(LogRequest)
  public static async uploadBootcampPhoto(req: any, res: Response, next: NextFunction) {
    const bootcampId = req.params.id
    const photo      = req.files.photo

    const bootcamp = await Bootcamp.findById(bootcampId)

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (!req.files) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, (res.statusCode = Code.BAD_REQUEST)))
    }

    if (!photo.mimetype.startsWith(Key.Image)) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, (res.statusCode = Code.BAD_REQUEST)))
    }

    if (photo.size > GLOBAL.MAX_FILE_UPLOAD) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_FILESIZE(NumKey.ONE_MB), (res.statusCode = Code.BAD_REQUEST)))
    }

    photo.name = GLOBAL.PHOTO_FILENAME(bootcamp._id, photo.name)
    GLOBAL.PHOTO_UPLOAD_MV(photo, bootcamp, async (error: any) => {
      if (error) {
        return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, (res.statusCode = Code.INTERNAL_SERVER_ERROR)))
      }

      try {
        await Bootcamp.findByIdAndUpdate(bootcampId, { photo: photo.name })

        const response = DataResponse.success({ photo: photo.name, bootcampName: bootcamp.name }, bootcampId)

        res.status(Code.OK).json({
          success: true,
          message: RESPONSE.success.PHOTO_UPLOADED,
          response
        })
      } catch (error: any) {
        res.status(Code.BAD_REQUEST).json({
          success: false,
          message: error?.message || RESPONSE.error.FAILED_UPLOAD,
          error
        })
      }
    })
  }

  //@desc     Upload badge for bootcamp owner
  //@route    PUT /bootcamp/:id/badge
  //@access   PRIVATE
  @use(LogRequest)
  public static async uploadBootcampBadge(req: any, res: Response, next: NextFunction) {
    const bootcampId = req.params.id
    const badge      = req.files.badge

    const bootcamp = await Bootcamp.findById(bootcampId)

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (!req.files) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, (res.statusCode = Code.BAD_REQUEST)))
    }

    if (!badge.mimetype.startsWith(Key.Image)) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, (res.statusCode = Code.BAD_REQUEST)))
    }

    if (badge.size > GLOBAL.MAX_FILE_UPLOAD) {
      return next(new ErrorResponse(RESPONSE.error.FAILED_FILESIZE(NumKey.ONE_MB), (res.statusCode = Code.BAD_REQUEST)))
    }

    badge.name = GLOBAL.BADGE_FILENAME(bootcamp._id, badge.name)
    GLOBAL.BADGE_UPLOAD_MV(badge, bootcamp, async (error: any) => {
      if (error) {
        return next(new ErrorResponse(RESPONSE.error.FAILED_UPLOAD, (res.statusCode = Code.INTERNAL_SERVER_ERROR)))
      }

      try {
        await Bootcamp.findByIdAndUpdate(bootcampId, { badge: badge.name })

        const response = DataResponse.success({ photo: badge.name, bootcampName: bootcamp.name }, bootcampId)

        res.status(Code.OK).json({
          success: true,
          message: RESPONSE.success.BADGE_UPLOADED,
          response
        })
      } catch (error: any) {
        res.status(Code.BAD_REQUEST).json({
          success: false,
          message: error?.message || RESPONSE.error.FAILED_UPLOAD,
          error
        })
      }
    })
  }
}

export default BootcampController
