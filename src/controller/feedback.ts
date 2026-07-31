import type { Request, Response, NextFunction } from 'express'
import { Feedback, Bootcamp }                   from '@model'
import { ErrorResponse }                        from '@util'
import { Key, Code }                            from '@constant/enum'
import { RESPONSE }                             from '@constant'
import { LogRequest, use }                      from '@decorator'

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
            path  : Key.BootcampVirtual,
            select: Key.DefaultSelect
          })
          .populate({
            path  : Key.UserVirtual,
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
      path  : Key.BootcampVirtual,
      select: Key.DefaultSelect
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
    const userRole   = req.user.role

    let   feedback   = await Feedback.findById(feedbackId)

    if (!feedback) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(feedbackId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (feedback.user.toString() !== userId && userRole !== Key.Admin) {
      return next(
        new ErrorResponse(RESPONSE.error.NOT_OWNER(userId, feedbackId), (res.statusCode = Code.UNAUTHORIZED))
      )
    }

    try {
      feedback = await Feedback.findByIdAndUpdate(feedbackId, req.body, {
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
    const userRole   = req.user.role
    const feedback   = await Feedback.findById(feedbackId)

    if (!feedback) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(feedbackId), (res.statusCode = Code.NOT_FOUND)))
    }

    if (feedback.user.toString() !== userId && userRole !== Key.Admin) {
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
