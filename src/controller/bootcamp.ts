import { Bootcamp } from '@model'
import { Request, Response, NextFunction } from 'express'
import { geocoder } from '@config/server'
import { IResponseExtended } from '@interface'
import { Key, NumKey, Code } from '@constant/enum'
import { RESPONSE } from '@constant'
import { ErrorResponse } from '@util'
import { use, LogRequest } from '@decorator'

/**
 * Bootcamp Controller
 * @path {baseUrl}/api/{apiVer}/bootcamp
 */
class BootcampController {
  private static _bootcampId: string
  private static _userId: string
  private static _userRole: string

  /**
   *  setRequest - Set request parameters
   *
   * @param req - Request
   * @returns void
   */
  static setRequest(req: Request) {
    this._bootcampId = req.params.id
  }
  static setUserId(req: any) {
    this._userId = req.user.id
    this._userRole = req.user.role
  }
  //@desc     Get ALL bootcamps
  //@route    GET /bootcamp
  //@access   PUBLIC
  @use(LogRequest)
  public static async getBootcamps(
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    res.status(Code.OK).json((res as IResponseExtended).advancedResult)
  }

  //@desc     Get single bootcamp
  //@route    GET /bootcamp/:id
  //@access   PUBLIC
  @use(LogRequest)
  public static async getBootcamp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    BootcampController.setRequest(req)

    const bootcamp = await Bootcamp.findById(
      BootcampController._bootcampId
    ).populate(Key.UserVirtual, Key.BootcampPopulate)

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          RESPONSE.error.NOT_FOUND_BOOTCAMP(BootcampController._bootcampId),
          Code.NOT_FOUND
        )
      )
    }
    res.status(Code.OK).json({ success: true, data: bootcamp })
  }

  //@desc     Create NEW bootcamp
  //@route    POST /bootcamp
  //@access   PRIVATE
  @use(LogRequest)
  public static async createBootcamp(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    // this._userId = req.user.id
    BootcampController.setUserId(req)

    req.body.user = BootcampController._userId

    const publishedBootcamp = await Bootcamp.findOne({
      user: BootcampController._userId,
    })

    if (publishedBootcamp && BootcampController._userRole !== Key.Admin) {
      return next(
        new ErrorResponse(
          RESPONSE.error.BOOTCAMP_ALREADY_PUBLISHED(BootcampController._userId),
          Code.BAD_REQUEST
        )
      )
    }

    const bootcamp = await Bootcamp.create(req.body)

    res.status(Code.CREATED).json({
      success: true,
      data: bootcamp,
    })
  }

  //@desc     UPDATE bootcamp
  //@route    PUT /api/{apiVer}/bootcamps/:id
  //@access   PRIVATE
  @use(LogRequest)
  public static async updateBootcamp(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    BootcampController.setRequest(req)
    BootcampController.setUserId(req)

    let bootcamp = await Bootcamp.findById(BootcampController._bootcampId)

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          RESPONSE.error.NOT_FOUND_BOOTCAMP(BootcampController._bootcampId),
          Code.NOT_FOUND
        )
      )
    }

    if (
      bootcamp.user.toString() !== BootcampController._userRole &&
      BootcampController._userRole !== Key.Admin
    ) {
      return next(new ErrorResponse(RESPONSE.error[401], Code.UNAUTHORIZED))
    }

    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(Code.OK).json({ success: true, data: bootcamp })
  }

  //@desc     DELETE bootcamp
  //@route    DELETE /api/{apiVer}/bootcamps/:id
  //@access   PRIVATE
  @use(LogRequest)
  public static async deleteBootcamp(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    BootcampController.setRequest(req)
    BootcampController.setUserId(req)

    const bootcamp = await Bootcamp.findById(BootcampController._bootcampId)

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          RESPONSE.error.NOT_FOUND_BOOTCAMP(BootcampController._bootcampId),
          Code.NOT_FOUND
        )
      )
    }

    if (
      bootcamp.user.toString() !== BootcampController._userId &&
      BootcampController._userRole !== Key.Admin
    ) {
      return next(new ErrorResponse(RESPONSE.error[401], Code.UNAUTHORIZED))
    }

    await Bootcamp.deleteOne({ _id: BootcampController._bootcampId })

    res.status(Code.OK).json({ success: true, data: {} })
  }

  //@desc     Get bootcamps within a radius
  //@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
  //@access   PRIVATE
  @use(LogRequest)
  public static async getBootcampsInRadius(
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const { zipcode, distance } = req.params

    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    const radius = Number(distance) / NumKey.EarthRadius

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    })

    res.status(Code.ACCEPTED).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    })
  }
}

export default BootcampController
