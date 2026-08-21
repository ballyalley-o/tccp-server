import type { Request, Response, NextFunction } from 'express'
import { MODULE }                               from '@config/module.config'
import { Feedback }                             from '@module/feedback'
import { Bootcamp }                             from '@module/bootcamp/bootcamp'
import { LogRequest, use }                      from '@common/decorator'
import { hasAction }                            from '@common/security/guard'
import { RESPONSE }                             from '@common/constant'
import { Code }                                 from '@common/constant/enum'
import { ErrorResponse }                        from '@common/util'

/**
 * Feedback Controller
 * @path {baseUrl}/api/{apiVer}/feedback
 *
 */
class FeedbackController {

  //@desc     Get ALL Feedbacks
  //@route    GET /feedback
  //@route    GET /bootcamp/:bootcampId/feedback
  //@access   PUBLIC
  public static async getFeedbacks(req: Request, res: Response, _next: NextFunction) {
    if (req.params.bootcampId) {
      try {
        const feedbacks = await Feedback.find({ bootcamp: req.params.bootcampId })
          .populate({
            path  : MODULE.Bootcamp.name,
            select: 'name description'
          })
          .populate({
            path  : MODULE.Auth.submodule.AuthUser.name,
            select: 'firstname email role avatar'
          })
          .lean()

        res.status(Code.OK).json({
          success: true,
          message: RESPONSE.success[200],
          count  : feedbacks.length,
          data   : feedbacks
        })
      } catch (error: any) {
        res.status(Code.BAD_REQUEST).json({
          success: false,
          message: error?.message || RESPONSE.error.FAILED_FIND,
          error
        })
      }
    } else {
      try {
        res.status(Code.OK).json(res.advanceResult)
      } catch (error: any) {
        res.status(Code.BAD_REQUEST).json({
          success: false,
          message: error?.message || RESPONSE.error.FAILED_FIND,
          error
        })
      }
    }
  }

  //@desc     Get a Feedback
  //@route    GET /feedback/:id
  //@access   PUBLIC
  @use(LogRequest)
  public static async getFeedback(req: Request, res: Response, next: NextFunction) {
    const feedbackId = req.params.id

    const feedback = await Feedback.findById(feedbackId)
    .populate({
      path  : MODULE.Bootcamp.name,
      select: 'name description'
    })
    .lean()

    if (!feedback) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(feedbackId), (res.statusCode = Code.NOT_FOUND)))
    }

    try {
      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success[200],
        data   : feedback
      })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.NOT_FOUND_FEEDBACK(feedbackId),
        error
      })
    }
  }

  //@desc     Add feedback
  //@route    POST  /bootcamp/:bootcampId/feedback
  //@access   PUBLIC
  @use(LogRequest)
  public static async addFeedback(req: Request, res: Response, next: NextFunction) {
    const bootcampId = req.params.bootcampId
    const userId     = req.user.id
    const bootcamp   = await Bootcamp.findById(bootcampId)
    // const feedbackUser = await Feedback.find({ user: FeedbackController._userId })

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(bootcampId), (res.statusCode = Code.NOT_FOUND)))
    }

    try {
      // attach bootcamp and user and metadata
      req.body.bootcamp  = bootcampId
      req.body.user      = userId
      req.body.createdBy = userId
      req.body.updatedBy = userId

      const feedback = await Feedback.create(req.body)

      res.status(Code.CREATED).json({
        success: true,
        message: RESPONSE.success[201],
        data   : feedback
      })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_UPLOAD,
        error
      })
    }
  }

  //@desc     Update feedback
  //@route    PUT /feedback/:id
  //@access   PUBLIC
  @use(LogRequest)
  public static async updateFeedback(req: Request, res: Response, next: NextFunction) {
    const feedbackId = req.params.id
    const userId     = req.user.id

    let   feedback   = await Feedback.findById(feedbackId)

    if (!feedback) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(feedbackId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (feedback.user.toString() !== userId && !hasAction(req, 'manage:any')) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, feedbackId), (res.statusCode = Code.UNAUTHORIZED))
      )
    }

    try {
      feedback = await Feedback.findByIdAndUpdate(feedbackId, { ...req.body, updatedBy: req.user?.id }, {
        new          : true,
        runValidators: true
      })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.UPDATED,
        data   : feedback
      })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_UPDATE,
        error
      })
    }
  }

  //@desc      Delete feedback
  //@route     DELETE /feedback/:id
  //@access    PUBLIC
  @use(LogRequest)
  public static async deleteFeedback(req: Request, res: Response, next: NextFunction) {
    const feedbackId = req.params.id
    const userId     = req.user.id
    const feedback   = await Feedback.findById(feedbackId)

    if (!feedback) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(feedbackId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (feedback.user.toString() !== userId && !hasAction(req, 'manage:any')) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, feedbackId), (res.statusCode = Code.UNAUTHORIZED))
      )
    }

    try {
      await Feedback.deleteOne({ _id: feedbackId })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success.DELETED,
        data   : {}
      })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_DELETE,
        error
      })
    }
  }
}

export default FeedbackController
