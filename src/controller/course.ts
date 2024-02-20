import { ErrorResponse } from '@util'
import { asyncHandler } from '@middleware'
import { Course, Bootcamp } from '@model'
import { IResponseExtended } from '@interface'
import { Key } from '@constant/enum'
import { RESPONSE } from '@constant'

let courseId: string
let userId: string

//@desc     Get ALL courses
//@route    GET /api/[apiVer]/courses
//@route    GET /api/v1/bootcamps/:bootcampId/courses
//@access   Public
const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId })

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } else {
    res.status(200).json((res as IResponseExtended).advancedResult)
  }
})

//@desc     Get single course
//@route    GET /api/v1/courses/:id
//@access   Public
const getCourse = asyncHandler(async (req, res, next) => {
  courseId = req.params.id
  const course = await Course.findById(courseId).populate({
    path: Key.BootcampVirtual,
    select: Key.CourseSelect,
  })

  if (!course) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(courseId), 404)
    )
  }
  res.status(200).json({
    success: true,
    data: course,
  })
})

//Add a course
//Route POST /api/v1/bootcamps/:bootcampId/courses
//access Private
const addCourse = asyncHandler(async (req: any, res, next) => {
  const bootcampId = req.params.bootcampId
  const userId = req.user.id
  req.body.bootcamp = req.params.bootcampId
  req.body.user = userId

  const bootcamp = await Bootcamp.findById(bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), 404)
    )
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== Key.Admin) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_OWNER(req.user.id, bootcampId), 401)
    )
  }

  const course = await Course.create(req.body)

  res.status(201).json({
    success: true,
    data: course,
  })
})

//@desc     Update a course
//@route    PUT /api/v1/courses/:id
//@access    Private
const updateCourse = asyncHandler(async (req: any, res, next) => {
  courseId = req.params._id
  userId = req.user.id
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, courseId), 404)
    )
  }

  //verification if the user is the course owner
  if (course.user.toString() !== req.user.id && req.user.role !== Key.Admin) {
    return next(
      new ErrorResponse(
        RESPONSE.error.NOT_OWNER(req.user.id, req.params.id),
        401
      )
    )
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: course,
  })
})

//@desc     Delete a course
//@route    DELETE /api/v1/courses/:id
//@access   PRIVATE
const deleteCourse = asyncHandler(async (req: any, res, next) => {
  const course = await Course.findById(req.params.id)
  courseId = req.params.id
  userId = req.user.id

  if (!course) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_COURSE(req.params.id), 404)
    )
  }

  if (course.user.toString() !== req.user.id && req.user.role !== Key.Admin) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, courseId), 401)
    )
  }

  await Course.deleteOne({ _id: courseId })

  res.status(200).json({
    success: true,
    data: {},
  })
})

const courseController = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
}
export default courseController
