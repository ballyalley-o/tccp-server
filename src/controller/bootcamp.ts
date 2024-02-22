import { Bootcamp } from '@model'
import { Request, Response, NextFunction } from 'express'
import { asyncHandler } from '@middleware'
import { IExpressController } from '@interface/middleware'
import { IResponseExtended } from '@interface'
import { geocoder } from '@config/server'
import { Key, Code } from '@constant/enum'
import { RESPONSE } from '@constant'
import { ErrorResponse } from '@util'

class BootcampController {
  //@desc     Get ALL bootcamps
  //@route    GET /api/{apiVer}/bootcamps
  //@access   Public
  public static getBootcamps: IExpressController = asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction) => {
      res.status(Code.OK).json((res as IResponseExtended).advancedResult)
    }
  )

  //@desc     Get single bootcamp
  //@route    GET /api/{apiVer}/bootcamp/:id
  //@access   Public
  public static getBootcamp: IExpressController = asyncHandler(
    async (req, res, next) => {
      // this._bootcampId = req.params.id

      const bootcamp = await Bootcamp.findById(req.params.id).populate(
        Key.UserVirtual,
        Key.BootcampPopulate
      )

      if (!bootcamp) {
        return next(
          new ErrorResponse(
            RESPONSE.error.NOT_FOUND_BOOTCAMP(req.params.id),
            Code.NOT_FOUND
          )
        )
      }
      res.status(Code.OK).json({ success: true, data: bootcamp })
    }
  )

  //@desc     Create NEW bootcamp
  //@route    POST /api/{apiVer}/bootcamps
  //@access   PRIVATE
  public static createBootcamp: IExpressController = asyncHandler(
    async (req: any, res, next) => {
      // this._userId = req.user.id
      req.body.user = req.user.id

      const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

      if (publishedBootcamp && req.user.role !== Key.Admin) {
        return next(
          new ErrorResponse(
            RESPONSE.error.BOOTCAMP_ALREADY_PUBLISHED(req.user.id),
            Code.BAD_REQUEST
          )
        )
      }

      const bootcamp = await Bootcamp.create(req.body)

      res.status(201).json({
        success: true,
        data: bootcamp,
      })
    }
  )

  //@desc     UPDATE bootcamp
  //@route    PUT /api/{apiVer}/bootcamps/:id
  //@access   PRIVATE
  public static updateBootcamp: IExpressController = asyncHandler(
    async (req: any, res, next) => {
      // this._bootcampId = req.params.id
      // this._userId = req.user.id

      let bootcamp = await Bootcamp.findById(req.params.id)

      if (!bootcamp) {
        return next(
          new ErrorResponse(
            RESPONSE.error.NOT_FOUND_BOOTCAMP(req.params.id),
            Code.NOT_FOUND
          )
        )
      }

      if (
        bootcamp.user.toString() !== req.user.id &&
        req.user.role !== Key.Admin
      ) {
        return next(new ErrorResponse(RESPONSE.error[401], Code.UNAUTHORIZED))
      }

      bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })

      res.status(Code.OK).json({ success: true, data: bootcamp })
    }
  )

  //@desc     DELETE bootcamp
  //@route    DELETE /api/{apiVer}/bootcamps/:id
  //@access   PRIVATE
  public static deleteBootcamp: IExpressController = asyncHandler(
    async (req: any, res, next) => {
      // this._bootcampId = req.params.id
      // this._userId = req.user.id
      const bootcamp = await Bootcamp.findById(req.params.id)

      if (!bootcamp) {
        return next(
          new ErrorResponse(
            RESPONSE.error.NOT_FOUND_BOOTCAMP(req.params.id),
            Code.NOT_FOUND
          )
        )
      }

      if (
        bootcamp.user.toString() !== req.user.id &&
        req.user.role !== Key.Admin
      ) {
        return next(new ErrorResponse(RESPONSE.error[401], Code.UNAUTHORIZED))
      }

      await Bootcamp.deleteOne({ _id: req.params.id })

      res.status(200).json({ success: true, data: {} })
    }
  )

  //@desc     Get bootcamps within a radius
  //@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
  //@access   PRIVATE
  public static getBootcampsInRadius: IExpressController = asyncHandler(
    async (req, res, _next) => {
      const { zipcode, distance } = req.params

      const loc = await geocoder.geocode(zipcode)
      const lat = loc[0].latitude
      const lng = loc[0].longitude

      const radius = Number(distance) / 3963

      const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
      })

      res.status(202).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
      })
    }
  )
}

export default BootcampController
