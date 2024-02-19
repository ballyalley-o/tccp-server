import { ErrorResponse } from '@util'
import { asyncHandler } from '@middleware'
import { Feedback, Bootcamp } from '@model'
import { IResponseExtended } from '@interface'
import { RESPONSE } from '@constant'
import { Key } from '@constant/enum'

let feedbackId: string
let bootcampId: string
let userId: string

//@desc     Get ALL Feedbacks
//@route    GET /api/{apiVer}/feedbacks
//@route    GET /api/{apiVer}/bootcamps/:bootcampId/feedback
//@access   PUBLIC
const getFeedbacks = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const feedbacks = await Feedback.find({ bootcamp: req.params.bootcampId })

    res.status(200).json({
      success: true,
      message: RESPONSE.success[200],
      count: feedbacks.length,
      data: feedbacks,
    })
  } else {
    res.status(200).json((res as IResponseExtended).advancedResult)
  }
})

//@desc     Get a Feedback
//@route    GET /api/{apiVer}/feedbacks/:id
//@access   PUBLIC
const getFeedback = asyncHandler(async (req, res, next) => {
  feedbackId = req.params.id
  const feedback = await Feedback.findById(feedbackId).populate({
    path: Key.BootcampVirtual,
    select: Key.DefaultSelect,
  })

  if (!feedback) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(feedbackId), 404)
    )
  }

  res.status(200).json({
    success: true,
    message: RESPONSE.success[200],
    data: feedback,
  })
})

//@desc     Add feedback
//@route    POST/api/{apiVer}/bootcamps/:bootcampId/feedbacks
//@access   PUBLIC
const addFeedback = asyncHandler(async (req: any, res, next) => {
  bootcampId = req.params.bootcampId
  userId = req.user.id

  req.body.bootcamp = bootcampId
  req.body.user = userId

  const bootcamp = await Bootcamp.findById(bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), 404)
    )
  }

  const feedback = await Feedback.create(req.body)

  res.status(201).json({
    success: true,
    message: RESPONSE.success[201],
    data: feedback,
  })
})

//@desc     Update feedback
//@route    PUT /api/v1/feedbacks/:id
//@access   PUBLIC
const updateFeedback = asyncHandler(async (req: any, res, next) => {
  feedbackId = req.params.id
  userId = req.user.id

  let feedback = await Feedback.findById(req.params.id)

  if (!feedback) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(feedbackId), 404)
    )
  }

  if (feedback.user.toString() !== userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, feedbackId), 401)
    )
  }

  feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    message: RESPONSE.success.UPDATED,
    data: feedback,
  })
})

//@desc     Delete feedback
//@route    DELETE /api/v1/feedbacks/:id
//@access    PUBLIC
const deleteFeedback = asyncHandler(async (req: any, res, next) => {
  feedbackId = req.params.id
  userId = req.user.id

  const feedback = await Feedback.findById(feedbackId)

  if (!feedback) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(feedbackId), 404)
    )
  }

  //verification if the feedback belongs to the user/admin
  if (feedback.user.toString() !== userId && req.user.role !== Key.Admin) {
    return next(
      new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, feedbackId), 401)
    )
  }

  await Feedback.deleteOne({ _id: feedbackId })

  res.status(200).json({
    success: true,
    message: RESPONSE.success.DELETED,
    data: {},
  })
})

const feedbackController = {
  addFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbacks,
  getFeedback,
}

export default feedbackController
