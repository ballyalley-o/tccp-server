import { Request, Response, NextFunction } from 'express'
import { IResponseExtended } from '@interface'
import { IUserRequest } from '@interface/middleware'
import { Feedback, Bootcamp } from '@model'
import { ErrorResponse } from '@util'
import { Key, Code } from '@constant/enum'
import { RESPONSE } from '@constant'
import { LogRequest, use } from '@decorator'

/**
 * Feedback Controller
 * @path {baseUrl}/api/{apiVer}/feedback
 *
 */
class FeedbackController {
  private static _feedbackId: string
  private static _bootcampId: string
  private static _userId: string
  private static _userRole: string

  /**
   * setRequest - Set request parameters
   *
   * @param req - Request
   * @returns void
   */
  static setRequest(req: Request) {
    this._feedbackId = req.params.id
    this._bootcampId = req.params.bootcampId
  }

  static setUserId(req: IUserRequest) {
    this._userId = req.user.id
    this._userRole = req.user.role
  }

  //@desc     Get ALL Feedbacks
  //@route    GET /feedback
  //@route    GET /bootcamp/:bootcampId/feedback
  //@access   PUBLIC
  public static async getFeedbacks(req: Request, res: Response, next: NextFunction) {
    if (req.params.bootcampId) {
      const feedbacks = await Feedback.find({ bootcamp: req.params.bootcampId })

      res.status(Code.OK).json({
        success: true,
        message: RESPONSE.success[200],
        count: feedbacks.length,
        data: feedbacks,
      })
    } else {
      res.status(Code.OK).json((res as IResponseExtended).advancedResult)
    }
  }

  //@desc     Get a Feedback
  //@route    GET /feedback/:id
  //@access   PUBLIC
  @use(LogRequest)
  public static async getFeedback(req: Request, res: Response, next: NextFunction) {
    FeedbackController.setRequest(req)

    const feedback = await Feedback.findById(FeedbackController._feedbackId).populate({
      path: Key.BootcampVirtual,
      select: Key.DefaultSelect,
    })

    if (!feedback) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(FeedbackController._feedbackId), Code.NOT_FOUND))
    }

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success[200],
      data: feedback,
    })
  }

  //@desc     Add feedback
  //@route    POST  /bootcamp/:bootcampId/feedback
  //@access   PUBLIC
  @use(LogRequest)
  public static async addFeedback(req: any, res: Response, next: NextFunction) {
    FeedbackController.setRequest(req)
    FeedbackController.setUserId(req)

    req.body.bootcamp = FeedbackController._bootcampId
    req.body.user = FeedbackController._userId

    const bootcamp = await Bootcamp.findById(FeedbackController._bootcampId)

    if (!bootcamp) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_BOOTCAMP(FeedbackController._bootcampId), Code.NOT_FOUND))
    }

    const feedback = await Feedback.create(req.body)

    res.status(Code.CREATED).json({
      success: true,
      message: RESPONSE.success[201],
      data: feedback,
    })
  }

  //@desc     Update feedback
  //@route    PUT /feedback/:id
  //@access   PUBLIC
  @use(LogRequest)
  public static async updateFeedback(req: any, res: Response, next: NextFunction) {
    FeedbackController.setRequest(req)
    FeedbackController.setUserId(req)

    let feedback = await Feedback.findById(FeedbackController._feedbackId)

    if (!feedback) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(FeedbackController._feedbackId), Code.NOT_FOUND))
    }

    if (feedback.user.toString() !== FeedbackController._userId && FeedbackController._userRole !== Key.Admin) {
      return next(new ErrorResponse(RESPONSE.error.NOT_OWNER(FeedbackController._userId, FeedbackController._feedbackId), Code.UNAUTHORIZED))
    }

    feedback = await Feedback.findByIdAndUpdate(FeedbackController._feedbackId, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success.UPDATED,
      data: feedback,
    })
  }

  //@desc      Delete feedback
  //@route     DELETE /feedback/:id
  //@access    PUBLIC
  @use(LogRequest)
  public static async deleteFeedback(req: any, res: Response, next: NextFunction) {
    FeedbackController.setRequest(req)
    FeedbackController.setUserId(req)

    const feedback = await Feedback.findById(FeedbackController._feedbackId)

    if (!feedback) {
      return next(new ErrorResponse(RESPONSE.error.NOT_FOUND_FEEDBACK(FeedbackController._feedbackId), Code.NOT_FOUND))
    }

    if (feedback.user.toString() !== FeedbackController._userId && FeedbackController._userRole !== Key.Admin) {
      return next(new ErrorResponse(RESPONSE.error.NOT_OWNER(FeedbackController._userId, FeedbackController._feedbackId), Code.UNAUTHORIZED))
    }

    await Feedback.deleteOne({ _id: FeedbackController._feedbackId })

    res.status(Code.OK).json({
      success: true,
      message: RESPONSE.success.DELETED,
      data: {},
    })
  }
}

export default FeedbackController
