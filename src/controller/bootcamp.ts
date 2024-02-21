import { Bootcamp } from '@model'
import { asyncHandler } from '@middleware'
import { IResponseExtended } from '@interface'
import { RESPONSE } from '@constant'
import { ErrorResponse } from '@util'
import { geocoder } from '@config/server'
import { Key } from '@constant/enum'

let bootcampId: string

//@desc     Get ALL bootcamps
//@route    GET /api/{apiVer}/bootcamps
//@access   Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json((res as IResponseExtended).advancedResult)
})

//@desc     Get single bootcamp
//@route    GET /api/{apiVer}/bootcamp/:id
//@access   Public
const getBootcamp = asyncHandler(async (req, res, next) => {
  bootcampId = req.params.id
  const bootcamp = await Bootcamp.findById(bootcampId).populate(
    'user',
    'firstname email'
  )

  if (!bootcamp) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), 404)
    )
  }
  res.status(200).json({ success: true, data: bootcamp })
})

//@desc     Create NEW bootcamp
//@route    POST /api/{apiVer}/bootcamps
//@access   PRIVATE
const createBootcamp = asyncHandler(async (req: any, res, next) => {
  req.body.user = req.user.id

  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

  //if user is not an admin, they are only allowed to add one bootcamp
  if (publishedBootcamp && req.user.role !== Key.Admin) {
    return next(
      new ErrorResponse(
        RESPONSE.error.BOOTCAMP_ALREADY_PUBLISHED(req.user.id),
        400
      )
    )
  }

  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({
    success: true,
    data: bootcamp,
  })
})

//@desc     UPDATE bootcamp
//@route    PUT /api/{apiVer}/bootcamps/:id
//@access   PRIVATE
const updateBootcamp = asyncHandler(async (req: any, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(req.params.id), 404)
    )
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== Key.Admin) {
    return next(new ErrorResponse(RESPONSE.error[401], 401))
  }

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: bootcamp })
})

//@desc     DELETE bootcamp
//@route    DELETE /api/{apiVer}/bootcamps/:id
//@access   PRIVATE
const deleteBootcamp = asyncHandler(async (req: any, res, next) => {
  bootcampId = req.params.id
  const bootcamp = await Bootcamp.findById(bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), 404)
    )
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== Key.Admin) {
    return next(new ErrorResponse(RESPONSE.error[401], 401))
  }

  await Bootcamp.deleteOne({ _id: bootcampId })

  res.status(200).json({ success: true, data: {} })
})

//@desc     Get bootcamps within a radius
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   PRIVATE
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  const radius = Number(distance) / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})

const bootcampController = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
}
export default bootcampController
